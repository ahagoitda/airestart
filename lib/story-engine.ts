import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Choice,
  ChoiceRecord,
  Episode,
  MemoryGrant,
  Scene,
  StorySession,
  UserProfile,
} from '@/types';
import { getPreset, pickPreset, presetScenarios } from '@/lib/presets';
import { syncSession } from '@/lib/supabase';

const PROFILE_KEY = 'regressor:profile';
const SESSION_KEY = 'regressor:session';
const ARCHIVE_KEY = 'regressor:archive';
const MEMORIES_KEY = 'regressor:memories';
const ENDINGS_KEY = 'regressor:endings';

/** 무료 유저가 사용할 수 있는 회귀 루프 횟수 */
export const FREE_REGRESSION_LIMIT = 1;

/** 프리미엄(AI 생성) 모드의 회차당 에피소드 수 */
export const AI_TOTAL_EPISODES = 10;

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// ---------- 프로필 ----------

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function loadProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  if (!raw) return null;
  const profile = JSON.parse(raw) as UserProfile;
  // 구버전 저장 데이터 마이그레이션
  profile.style ??= 'kr_webnovel';
  return profile;
}

// ---------- 세션 ----------

export async function startSession(profile: UserProfile): Promise<StorySession> {
  const preset = pickPreset(profile);
  const now = new Date().toISOString();
  const session: StorySession = {
    id: makeId(),
    profile,
    mode: profile.isPremium ? 'ai' : 'preset',
    presetId: preset.id,
    currentNodeId: preset.startNodeId,
    currentEpisode: 1,
    totalEpisodes: profile.isPremium ? AI_TOTAL_EPISODES : preset.totalEpisodes,
    aiEpisodes: [],
    history: [],
    summary: '',
    isPremium: profile.isPremium,
    regressionCount: 0,
    goodRegressCount: 0,
    status: 'in_progress',
    createdAt: now,
    updatedAt: now,
  };
  await persist(session);
  return session;
}

export async function loadSession(): Promise<StorySession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  const session = JSON.parse(raw) as StorySession;
  // 구버전 저장 데이터 마이그레이션
  session.mode ??= 'preset';
  session.aiEpisodes ??= [];
  session.totalEpisodes ??= getPreset(session.presetId).totalEpisodes;
  session.profile.style ??= 'kr_webnovel';
  session.goodRegressCount ??= session.regressionCount;
  return session;
}

export async function persistSession(session: StorySession): Promise<void> {
  await persist(session);
}

async function persist(session: StorySession): Promise<void> {
  session.updatedAt = new Date().toISOString();
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Supabase가 설정돼 있으면 백그라운드 동기화 (실패해도 로컬 플레이는 계속)
  syncSession(session);
}

/** 현재 표시할 장면 — 프리셋 노드 또는 마지막 AI 에피소드 */
export function getCurrentScene(session: StorySession): Scene | null {
  if (session.mode === 'ai') {
    const episode = session.aiEpisodes.at(-1);
    if (!episode) return null; // 아직 생성 전 — 호출 측에서 generateEpisode
    return {
      ...episode,
      id: `ai-${episode.episodeNumber}`,
      isEnding: episode.episodeNumber >= session.totalEpisodes,
    };
  }
  const preset = getPreset(session.presetId);
  const node = preset.nodes[session.currentNodeId] ?? preset.nodes[preset.startNodeId];
  return node;
}

function makeRecord(scene: Scene, choice: Choice): ChoiceRecord {
  return {
    nodeId: scene.id,
    choiceId: choice.id,
    choiceText: choice.text,
    episodeNumber: scene.episodeNumber,
  };
}

/** 프리셋 모드: 선택지를 적용하고 다음 노드로 진행 */
export async function applyPresetChoice(
  session: StorySession,
  choice: Choice,
): Promise<StorySession> {
  if (choice.isPremium && !session.isPremium) {
    throw new Error('프리미엄 전용 선택지입니다.');
  }
  if (choice.requiresMemoryId) {
    const memories = await loadMemories(session.presetId);
    if (!memories.some((m) => m.id === choice.requiresMemoryId)) {
      throw new Error('이 갈림길의 기억이 아직 없습니다.');
    }
  }
  const scene = getCurrentScene(session);
  if (!scene) throw new Error('현재 장면이 없습니다.');
  const nextNodeId = choice.nextNodeId;
  if (!nextNodeId) {
    throw new Error('다음 장면이 없는 선택지입니다.');
  }
  const preset = getPreset(session.presetId);
  const nextNode = preset.nodes[nextNodeId];
  const history = [...session.history, makeRecord(scene, choice)];
  const updated: StorySession = {
    ...session,
    currentNodeId: nextNodeId,
    currentEpisode: nextNode?.episodeNumber ?? session.currentEpisode,
    history,
    summary: buildSummary(history),
    status: nextNode?.isEnding ? 'completed' : 'in_progress',
  };
  if (nextNode?.isEnding) {
    // 엔딩 도감 기록 + 배드엔딩이 남기는 회귀의 기억 계승
    await recordEnding(session.presetId, nextNode.id);
    if (nextNode.grantsMemory) {
      await grantMemory(session.presetId, nextNode.grantsMemory);
    }
  }
  await persist(updated);
  return updated;
}

/**
 * AI 모드: 선택을 기록하고 새로 생성된 에피소드를 덧붙인다.
 * choice가 null이면 첫 에피소드(선택 없이 시작).
 * 프리셋 진행 중 프리미엄(모험) 선택지를 고르면 이 함수로 AI 모드로 전환된다.
 */
export async function applyAiEpisode(
  session: StorySession,
  choice: Choice | null,
  episode: Episode,
): Promise<StorySession> {
  const scene = getCurrentScene(session);
  const history =
    choice && scene ? [...session.history, makeRecord(scene, choice)] : session.history;
  const totalEpisodes = Math.max(session.totalEpisodes, AI_TOTAL_EPISODES);
  const updated: StorySession = {
    ...session,
    mode: 'ai',
    totalEpisodes,
    aiEpisodes: [...session.aiEpisodes, episode],
    currentEpisode: episode.episodeNumber,
    history,
    summary: buildSummary(history),
    status: episode.episodeNumber >= totalEpisodes ? 'completed' : 'in_progress',
  };
  await persist(updated);
  return updated;
}

/**
 * 회귀 루프: 엔딩 후 1화로 되돌아간다. 선택 기록은 초기화, 회귀 횟수는 누적.
 * 배드엔딩 후 회귀(만회 기회)는 무료 한도에 계산하지 않는다.
 */
export async function regress(session: StorySession): Promise<StorySession> {
  const scene = getCurrentScene(session);
  const isBadEnding = scene?.endingType === 'bad';
  if (
    !session.isPremium &&
    !isBadEnding &&
    session.goodRegressCount >= FREE_REGRESSION_LIMIT
  ) {
    throw new Error('무료 회귀 횟수를 모두 사용했습니다.');
  }
  await archiveSession(session);
  const preset = getPreset(session.presetId);
  const updated: StorySession = {
    ...session,
    mode: session.isPremium ? 'ai' : 'preset',
    currentNodeId: preset.startNodeId,
    currentEpisode: 1,
    totalEpisodes: session.isPremium ? AI_TOTAL_EPISODES : preset.totalEpisodes,
    aiEpisodes: [],
    history: [],
    summary: '',
    regressionCount: session.regressionCount + 1,
    goodRegressCount: session.goodRegressCount + (isBadEnding ? 0 : 1),
    status: 'in_progress',
  };
  await persist(updated);
  return updated;
}

export async function endSession(session: StorySession): Promise<void> {
  await archiveSession(session);
  await AsyncStorage.removeItem(SESSION_KEY);
}

// ---------- 회귀의 기억 (회차를 넘어 계승) ----------

export async function loadMemories(presetId: string): Promise<MemoryGrant[]> {
  const raw = await AsyncStorage.getItem(MEMORIES_KEY);
  const all = raw ? (JSON.parse(raw) as Record<string, MemoryGrant[]>) : {};
  return all[presetId] ?? [];
}

async function grantMemory(presetId: string, grant: MemoryGrant): Promise<void> {
  const raw = await AsyncStorage.getItem(MEMORIES_KEY);
  const all = raw ? (JSON.parse(raw) as Record<string, MemoryGrant[]>) : {};
  const list = all[presetId] ?? [];
  if (list.some((m) => m.id === grant.id)) return;
  all[presetId] = [...list, grant];
  await AsyncStorage.setItem(MEMORIES_KEY, JSON.stringify(all));
}

// ---------- 엔딩 도감 ----------

export interface EndingProgress {
  presetId: string;
  title: string;
  collected: number;
  total: number;
  /** 수집한 엔딩의 노드 id 목록 */
  seen: string[];
}

export async function loadEndingCollection(): Promise<EndingProgress[]> {
  const raw = await AsyncStorage.getItem(ENDINGS_KEY);
  const all = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
  return presetScenarios.map((preset) => {
    const endingIds = Object.values(preset.nodes)
      .filter((n) => n.isEnding)
      .map((n) => n.id);
    const seen = (all[preset.id] ?? []).filter((id) => endingIds.includes(id));
    return {
      presetId: preset.id,
      title: preset.title,
      collected: seen.length,
      total: endingIds.length,
      seen,
    };
  });
}

async function recordEnding(presetId: string, nodeId: string): Promise<void> {
  const raw = await AsyncStorage.getItem(ENDINGS_KEY);
  const all = raw ? (JSON.parse(raw) as Record<string, string[]>) : {};
  const list = all[presetId] ?? [];
  if (list.includes(nodeId)) return;
  all[presetId] = [...list, nodeId];
  await AsyncStorage.setItem(ENDINGS_KEY, JSON.stringify(all));
}

// ---------- 라이브러리 (과거 플레이 기록) ----------

export interface ArchiveEntry {
  id: string;
  title: string;
  presetId: string;
  mode: StorySession['mode'];
  endedAt: string;
  episodeReached: number;
  regressionCount: number;
  choices: string[];
  status: StorySession['status'];
}

export async function loadArchive(): Promise<ArchiveEntry[]> {
  const raw = await AsyncStorage.getItem(ARCHIVE_KEY);
  return raw ? (JSON.parse(raw) as ArchiveEntry[]) : [];
}

async function archiveSession(session: StorySession): Promise<void> {
  const preset = getPreset(session.presetId);
  const title = session.mode === 'ai' ? 'AI 회귀록' : preset.title;
  const entry: ArchiveEntry = {
    id: `${session.id}-${session.regressionCount}`,
    title: `${title} (${session.regressionCount + 1}회차)`,
    presetId: session.presetId,
    mode: session.mode,
    endedAt: new Date().toISOString(),
    episodeReached: session.currentEpisode,
    regressionCount: session.regressionCount,
    choices: session.history.map((h) => h.choiceText),
    status: session.status,
  };
  const archive = await loadArchive();
  await AsyncStorage.setItem(ARCHIVE_KEY, JSON.stringify([entry, ...archive]));
}

// ---------- 요약 (AI 컨텍스트 관리용 기초 버전) ----------

function buildSummary(history: ChoiceRecord[]): string {
  return history
    .map((h) => `${h.episodeNumber}화에서 "${h.choiceText}"를 선택했다.`)
    .join(' ');
}

export async function resetAll(): Promise<void> {
  await AsyncStorage.multiRemove([
    PROFILE_KEY,
    SESSION_KEY,
    ARCHIVE_KEY,
    MEMORIES_KEY,
    ENDINGS_KEY,
  ]);
}
