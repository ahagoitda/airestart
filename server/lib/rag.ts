// RAG — story_events(pgvector)에서 관련 이전 사건을 검색/저장한다.
// SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY 미설정 시 조용히 비활성화된다.
// (service_role 키는 이 서버에만 존재한다 — 클라이언트 노출 절대 금지)

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_EMBEDDINGS_URL = 'https://api.openai.com/v1/embeddings';
const EMBEDDING_MODEL = 'text-embedding-3-small'; // 1536차원

export function isRagEnabled(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

async function embed(text: string, apiKey: string): Promise<number[] | null> {
  const res = await fetch(OPENAI_EMBEDDINGS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model: EMBEDDING_MODEL, input: text.slice(0, 4000) }),
  });
  if (!res.ok) {
    console.error('임베딩 실패:', res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as { data: { embedding: number[] }[] };
  return data.data?.[0]?.embedding ?? null;
}

interface MatchedEvent {
  description: string;
  episode: number;
  similarity: number;
}

/** 마지막 선택과 관련된 이전 사건들을 검색해 프롬프트 주입용 텍스트로 반환 */
export async function searchRelatedEvents(
  sessionId: string,
  query: string,
  openaiKey: string,
): Promise<string> {
  if (!isRagEnabled() || !query.trim()) return '';
  const embedding = await embed(query, openaiKey);
  if (!embedding) return '';

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/match_story_events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_KEY!,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
    body: JSON.stringify({
      p_session_id: sessionId,
      query_embedding: embedding,
      match_count: 5,
    }),
  });
  if (!res.ok) {
    console.error('RAG 검색 실패:', res.status, await res.text());
    return '';
  }
  const events = (await res.json()) as MatchedEvent[];
  return events
    .map((e) => `- (${e.episode}화) ${e.description}`)
    .join('\n');
}

/** 생성된 에피소드를 사건으로 저장 (다음 화 생성 시 검색 대상이 된다) */
export async function saveStoryEvent(
  sessionId: string,
  episode: number,
  description: string,
  openaiKey: string,
): Promise<void> {
  if (!isRagEnabled()) return;
  const embedding = await embed(description, openaiKey);

  const res = await fetch(`${SUPABASE_URL}/rest/v1/story_events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SERVICE_KEY!,
      Authorization: `Bearer ${SERVICE_KEY}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      session_id: sessionId,
      episode,
      event_type: 'choice',
      description: description.slice(0, 2000),
      embedding,
    }),
  });
  if (!res.ok) {
    console.error('사건 저장 실패:', res.status, await res.text());
  }
}
