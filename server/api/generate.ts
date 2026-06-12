// POST /api/generate — AI 에피소드 생성 프록시 (Vercel Edge Function)
//
// 파이프라인 (빌드 스펙):
//   1. RAG 검색: pgvector에서 관련 이전 이벤트 조회
//   2. 컨텍스트 조립: 캐릭터 시트 + 요약 + RAG 결과 + 직전 장면 발췌
//   3. LLM 호출 (gpt-4o-mini, structured output)
//   4. Claude Haiku 일관성 검증 → 모순 발견 시 피드백과 함께 1회 재생성
//
// API 키는 이 서버의 환경변수에만 존재한다. 클라이언트에 절대 노출 금지.

import {
  buildSystemPrompt,
  episodeJsonSchema,
  type GenerateRequest,
} from '../lib/prompt.js';
import { saveStoryEvent, searchRelatedEvents } from '../lib/rag.js';
import { checkConsistency, isConsistencyCheckEnabled } from '../lib/consistency.js';
import { tryConsumeGeneration } from '../lib/limits.js';

export const config = { runtime: 'edge' };

// LLM 제공자는 OpenAI 호환 API면 무엇이든 가능 — env로 교체한다.
// 예) Groq 무료 티어: OPENAI_BASE_URL=https://api.groq.com/openai/v1, OPENAI_MODEL=llama-3.3-70b-versatile
//     로컬 Ollama:    OPENAI_BASE_URL=http://localhost:11434/v1,      OPENAI_MODEL=qwen2.5:14b
//     기본값:         OpenAI gpt-4o-mini
const BASE_URL = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1';
const MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

interface GeneratedEpisode {
  episodeNumber: number;
  title: string;
  content: string;
}

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
    (b.lastSceneExcerpt == null || typeof b.lastSceneExcerpt === 'string') &&
    typeof p === 'object' &&
    p !== null &&
    typeof p.name === 'string' &&
    typeof p.persona === 'string' &&
    typeof p.regret === 'string' &&
    typeof p.returnEra === 'string'
  );
}

/** OpenAI 호환 API 호출 → 에피소드 JSON. 실패 시 null. */
async function generateOnce(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
): Promise<GeneratedEpisode | null> {
  // json_schema를 지원하지 않는 호환 제공자(Groq/Ollama 일부)는 json_object로 폴백
  for (const strict of [true, false]) {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
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
            content: strict
              ? userMessage
              : `${userMessage}\n\n반드시 다음 형태의 JSON만 출력: {"episodeNumber": number, "title": string, "content": string, "choices": [{"id": string, "text": string, "isPremium": boolean} x3, 마지막만 isPremium true]}`,
          },
        ],
        response_format: strict
          ? { type: 'json_schema', json_schema: episodeJsonSchema }
          : { type: 'json_object' },
        temperature: 0.9,
        // 본문 700~1,200자 + 선택지 3개가 잘리지 않도록 여유 확보
        max_tokens: 3000,
      }),
    });
    if (res.status === 400 && strict) {
      // 제공자가 json_schema 미지원 → json_object로 재시도
      continue;
    }
    if (!res.ok) {
      console.error('LLM 호출 실패:', res.status, await res.text());
      return null;
    }
    const data = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;
    try {
      return JSON.parse(content) as GeneratedEpisode;
    } catch {
      return null;
    }
  }
  return null;
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

  // 폭주 방지: 일일 전체 생성 한도 (과금 하드 캡)
  if (!(await tryConsumeGeneration())) {
    return json(
      { error: '오늘의 AI 생성 한도에 도달했습니다. 내일 다시 시도해 주세요.' },
      429,
    );
  }

  // RAG: 마지막 선택과 관련된 이전 사건 검색 (Supabase 미설정 시 빈 컨텍스트)
  const ragQuery = body.lastChoice ?? body.summary;
  const ragResults = await searchRelatedEvents(body.sessionId, ragQuery, apiKey).catch(
    () => '',
  );
  const systemPrompt = buildSystemPrompt(body, ragResults);
  const userMessage = `${body.currentEpisode}화를 작성해주세요.`;

  let episode = await generateOnce(apiKey, systemPrompt, userMessage);
  if (!episode) {
    return json({ error: '에피소드 생성에 실패했습니다.' }, 502);
  }

  // 일관성 검증 (Claude Haiku) — 모순 발견 시 피드백을 주고 1회 재생성
  if (isConsistencyCheckEnabled()) {
    const check = await checkConsistency(body, episode);
    if (!check.consistent && check.problems.length > 0) {
      console.warn('일관성 문제 발견, 재생성:', check.problems);
      const retryMessage = `${userMessage}

[검수 피드백 — 이전 초고에서 발견된 모순. 반드시 수정해서 다시 쓸 것]
${check.problems.map((p) => `- ${p}`).join('\n')}`;
      const retried = await generateOnce(apiKey, systemPrompt, retryMessage);
      if (retried) episode = retried;
    }
  }

  // 생성된 에피소드를 RAG 사건으로 저장 — 실패해도 응답은 정상 반환
  await saveStoryEvent(
    body.sessionId,
    episode.episodeNumber,
    `${episode.title}: ${episode.content}`,
    apiKey,
  ).catch((e) => console.error('사건 저장 실패:', e));

  return json(episode);
}
