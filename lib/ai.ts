import type { Episode, StorySession } from '@/types';
import { getCurrentScene } from '@/lib/story-engine';
import { personalize } from '@/lib/presets';

// AI 실시간 생성 (프리미엄 전용).
// API 키는 클라이언트에 두지 않고 Vercel Edge Function 프록시를 경유한다.
// 프록시 측 파이프라인: RAG 검색(pgvector) → 컨텍스트 조립 → LLM 호출 → 일관성 검증.

const API_URL = process.env.EXPO_PUBLIC_API_URL;

/** 직전 장면에서 서버로 보낼 발췌 길이 — 장면 연속성(장소·시간·인물) 유지용 */
const EXCERPT_LENGTH = 700;

export interface GenerateRequest {
  sessionId: string;
  profile: StorySession['profile'];
  currentEpisode: number;
  summary: string;
  lastChoice: string | null;
  /** 직전 장면 끝부분 발췌 — 다음 화가 자연스럽게 이어지도록 */
  lastSceneExcerpt: string | null;
}

export function isAiAvailable(): boolean {
  return Boolean(API_URL);
}

export async function generateEpisode(session: StorySession): Promise<Episode> {
  if (!API_URL) {
    throw new Error('AI 프록시 서버가 설정되지 않았습니다 (EXPO_PUBLIC_API_URL).');
  }
  const lastChoice = session.history.at(-1)?.choiceText ?? null;
  const scene = getCurrentScene(session);
  const lastSceneExcerpt = scene
    ? personalize(scene.content, session.profile.name).slice(-EXCERPT_LENGTH)
    : null;
  const body: GenerateRequest = {
    sessionId: session.id,
    profile: session.profile,
    currentEpisode: session.currentEpisode + 1,
    summary: session.summary,
    lastChoice,
    lastSceneExcerpt,
  };
  const res = await fetch(`${API_URL}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`에피소드 생성 실패 (${res.status})`);
  }
  return (await res.json()) as Episode;
}
