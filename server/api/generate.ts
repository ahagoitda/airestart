// POST /api/generate — AI 에피소드 생성 프록시 (Vercel Edge Function)
//
// 파이프라인 (빌드 스펙):
//   1. RAG 검색: pgvector에서 관련 이전 이벤트 조회 (현재는 기초 버전 — summary 기반)
//   2. 컨텍스트 조립: 캐릭터 시트 + 요약 + RAG 결과
//   3. LLM 호출 (gpt-4o-mini, structured output)
//
// API 키는 이 서버의 환경변수에만 존재한다. 클라이언트에 절대 노출 금지.

import {
  buildSystemPrompt,
  episodeJsonSchema,
  type GenerateRequest,
} from '../lib/prompt.js';

export const config = { runtime: 'edge' };

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o-mini';

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function isValidRequest(body: unknown): body is GenerateRequest {
  if (typeof body !== 'object' || body === null) return false;
  const b = body as Record<string, unknown>;
  const p = b.profile as Record<string, unknown> | undefined;
  return (
    typeof b.sessionId === 'string' &&
    typeof b.currentEpisode === 'number' &&
    b.currentEpisode >= 1 &&
    b.currentEpisode <= 50 &&
    typeof b.summary === 'string' &&
    (b.lastChoice === null || typeof b.lastChoice === 'string') &&
    typeof p === 'object' &&
    p !== null &&
    typeof p.name === 'string' &&
    typeof p.persona === 'string' &&
    typeof p.regret === 'string' &&
    typeof p.returnEra === 'string'
  );
}

// RAG 기초 버전: 아직 pgvector 검색 없이 빈 컨텍스트를 반환한다.
// TODO(7~8주차): story_events 임베딩 → match_story_events RPC로 상위 k개 조회
async function searchRelatedEvents(_req: GenerateRequest): Promise<string> {
  return '';
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'POST만 지원합니다.' }, 405);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return json({ error: '서버에 OPENAI_API_KEY가 설정되지 않았습니다.' }, 500);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: '잘못된 JSON 본문입니다.' }, 400);
  }
  if (!isValidRequest(body)) {
    return json({ error: '요청 형식이 올바르지 않습니다.' }, 400);
  }

  const ragResults = await searchRelatedEvents(body);
  const systemPrompt = buildSystemPrompt(body, ragResults);

  const res = await fetch(OPENAI_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `${body.currentEpisode}화를 작성해주세요.`,
        },
      ],
      response_format: { type: 'json_schema', json_schema: episodeJsonSchema },
      temperature: 0.9,
      max_tokens: 1500,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error('OpenAI 호출 실패:', res.status, detail);
    return json({ error: '에피소드 생성에 실패했습니다.' }, 502);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    return json({ error: 'AI 응답이 비어 있습니다.' }, 502);
  }

  try {
    const episode = JSON.parse(content);
    return json(episode);
  } catch {
    return json({ error: 'AI 응답 파싱에 실패했습니다.' }, 502);
  }
}
