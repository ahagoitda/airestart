// 캐릭터·서사 일관성 검증 (빌드 스펙: Claude Haiku 검증 패스)
// 생성된 에피소드가 요약·직전 장면과 모순되지 않는지 빠르게 점검한다.
// ANTHROPIC_API_KEY 미설정 시 검증을 건너뛴다 (생성 자체는 항상 동작).

import Anthropic from '@anthropic-ai/sdk';
import type { GenerateRequest } from './prompt.js';

const MODEL = 'claude-haiku-4-5';

export interface ConsistencyResult {
  consistent: boolean;
  /** 발견된 모순 — 재생성 프롬프트에 피드백으로 주입된다 */
  problems: string[];
}

export function isConsistencyCheckEnabled(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const RESULT_SCHEMA = {
  type: 'json_schema',
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['consistent', 'problems'],
    properties: {
      consistent: {
        type: 'boolean',
        description: '심각한 모순이 없으면 true',
      },
      problems: {
        type: 'array',
        items: { type: 'string' },
        description: '발견된 모순 목록 (한국어, 각 1문장). consistent가 true면 빈 배열',
      },
    },
  },
} as const;

/**
 * 에피소드 일관성 검증. 검증 불가(키 없음/오류) 시에는 통과로 처리해
 * 사용자 경험을 막지 않는다.
 */
export async function checkConsistency(
  req: GenerateRequest,
  episode: { title: string; content: string },
): Promise<ConsistencyResult> {
  if (!isConsistencyCheckEnabled()) {
    return { consistent: true, problems: [] };
  }
  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      output_config: { format: RESULT_SCHEMA },
      messages: [
        {
          role: 'user',
          content: `당신은 웹소설 연재의 일관성 검수자입니다. 새로 쓰인 에피소드가 지금까지의 이야기와 모순되는지만 검사하세요.

[지금까지의 요약]
${req.summary || '(첫 에피소드)'}

[직전 장면 끝부분]
${req.lastSceneExcerpt || '(없음)'}

[사용자의 직전 선택]
${req.lastChoice ?? '(없음)'}

[새 에피소드 ${req.currentEpisode}화 "${episode.title}"]
${episode.content}

다음 항목만 검사하세요 (문체·재미는 평가 대상이 아님):
1. 인물의 이름·관계·성격이 이전과 모순되는가
2. 직전 선택의 결과가 무시되었는가
3. 장소·시간이 설명 없이 점프했는가
4. 이미 확정된 사실(요약 속 사건)과 충돌하는가

심각한 모순만 problems에 적으세요. 사소한 표현 차이는 통과시키세요.`,
        },
      ],
    });
    if (response.stop_reason === 'refusal') {
      return { consistent: true, problems: [] };
    }
    const text = response.content.find((b) => b.type === 'text')?.text;
    if (!text) return { consistent: true, problems: [] };
    const parsed = JSON.parse(text) as ConsistencyResult;
    return {
      consistent: parsed.consistent,
      problems: Array.isArray(parsed.problems) ? parsed.problems.slice(0, 5) : [],
    };
  } catch (e) {
    console.warn('일관성 검증 실패 (통과 처리):', e);
    return { consistent: true, problems: [] };
  }
}
