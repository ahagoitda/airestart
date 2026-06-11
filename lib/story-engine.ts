import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  Choice,
  ChoiceRecord,
  PresetNode,
  StorySession,
  UserProfile,
} from '@/types';
import { DEFAULT_PRESET_ID, getPreset } from '@/lib/presets';
import { syncSession } from '@/lib/supabase';

const PROFILE_KEY = 'regressor:profile';
const SESSION_KEY = 'regressor:session';
const ARCHIVE_KEY = 'regressor:archive';

/** 무료 유저가 사용할 수 있는 회귀 루프 횟수 */
export const FREE_REGRESSION_LIMIT = 1;

function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

// ---------- 프로필 ----------

export async function saveProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

export async function loadProfile(): Promise<UserProfile | null> {
  const raw = await AsyncStorage.getItem(PROFILE_KEY);
  return raw ? (JSON.parse(raw) as UserProfile) : null;
}

// ---------- 세션 ----------

export async function startSession(profile: UserProfile): Promise<StorySession> {
  const preset = getPreset(DEFAULT_PRESET_ID);
  const now = new Date().toISOString();
  const session: StorySession = {
    id: makeId(),
    profile,
    presetId: preset.id,
    currentNodeId: preset.startNodeId,
    currentEpisode: 1,
    history: [],
    summary: '',
    isPremium: profile.isPremium,
    regressionCount: 0,
    status: 'in_progress',
    createdAt: now,
    updatedAt: now,
  };
  await persist(session);
  return session;
}

export async function loadSession(): Promise<StorySession | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as StorySession) : null;
}

async function persist(session: StorySession): Promise<void> {
  session.updatedAt = new Date().toISOString();
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  // Supabase가 설정돼 있으면 백그라운드 동기화 (실패해도 로컬 플레이는 계속)
  syncSession(session);
}

export function getCurrentNode(session: StorySession): PresetNode {
  const preset = getPreset(session.presetId);
  return preset.nodes[session.currentNodeId] ?? preset.nodes[preset.startNodeId];
}

/** 선택지를 적용하고 다음 노드로 진행한 세션을 반환 */
export async function applyChoice(
  session: StorySession,
  choice: Choice,
): Promise<StorySession> {
  if (choice.isPremium && !session.isPremium) {
    throw new Error('프리미엄 전용 선택지입니다.');
  }
  const node = getCurrentNode(session);
  const record: ChoiceRecord = {
    nodeId: node.id,
    choiceId: choice.id,
    choiceText: choice.text,
    episodeNumber: node.episodeNumber,
  };
  const nextNodeId = choice.nextNodeId;
  if (!nextNodeId) {
    throw new Error('다음 장면이 없는 선택지입니다.');
  }
  const preset = getPreset(session.presetId);
  const nextNode = preset.nodes[nextNodeId];
  const updated: StorySession = {
    ...session,
    currentNodeId: nextNodeId,
    currentEpisode: nextNode?.episodeNumber ?? session.currentEpisode,
    history: [...session.history, record],
    summary: buildSummary([...session.history, record]),
    status: nextNode?.isEnding ? 'completed' : 'in_progress',
  };
  await persist(updated);
  return updated;
}

/** 회귀 루프: 엔딩 후 1화로 되돌아간다. 선택 기록은 초기화, 회귀 횟수는 누적. */
export async function regress(session: StorySession): Promise<StorySession> {
  if (!session.isPremium && session.regressionCount >= FREE_REGRESSION_LIMIT) {
    throw new Error('무료 회귀 횟수를 모두 사용했습니다.');
  }
  await archiveSession(session);
  const preset = getPreset(session.presetId);
  const updated: StorySession = {
    ...session,
    currentNodeId: preset.startNodeId,
    currentEpisode: 1,
    history: [],
    summary: '',
    regressionCount: session.regressionCount + 1,
    status: 'in_progress',
  };
  await persist(updated);
  return updated;
}

export async function endSession(session: StorySession): Promise<void> {
  await archiveSession(session);
  await AsyncStorage.removeItem(SESSION_KEY);
}

// ---------- 라이브러리 (과거 플레이 기록) ----------

export interface ArchiveEntry {
  id: string;
  title: string;
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
  const entry: ArchiveEntry = {
    id: `${session.id}-${session.regressionCount}`,
    title: `${preset.title} (${session.regressionCount + 1}회차)`,
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
  await AsyncStorage.multiRemove([PROFILE_KEY, SESSION_KEY, ARCHIVE_KEY]);
}
