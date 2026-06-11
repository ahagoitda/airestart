// 시스템 프롬프트 조립 — 빌드 스펙의 템플릿 그대로 구현

import { DEFAULT_STYLE, STYLE_GUIDES } from './styles.js';

export interface GenerateRequest {
  sessionId: string;
  profile: {
    name: string;
    persona: string;
    regret: string;
    returnEra: string;
    /** 문체 카테고리 — 미지정 시 한국 웹소설식 */
    style?: string;
  };
  currentEpisode: number;
  summary: string;
  lastChoice: string | null;
}

const PERSONA_LABELS: Record<string, string> = {
  office_worker: '평범한 회사원 (30대)',
  college_student: '열정 넘치는 대학생 (20대)',
  job_seeker: '인생 2회차를 꿈꾸는 취준생',
  bullied_student: '모두에게 무시당했던 고등학생',
  freelancer: '슬럼프에 빠진 프리랜서',
  tired_worker: '반복되는 일상에 지친 직장인',
};

const REGRET_LABELS: Record<string, string> = {
  first_love: '첫사랑에게 마음을 전하지 못한 것',
  family: '가족에게 못난 모습만 보여드린 것',
  betrayal: '친구의 배신을 눈치채지 못한 것',
  gave_up_dream: '꿈을 포기하고 현실에 타협한 것',
  one_more_chance: '한 번만 더 기회가 있다면...',
};

const ERA_LABELS: Record<string, string> = {
  middle_school: '중학교 시절',
  high_school: '고등학교 시절',
  college: '대학교 입학 전',
  early_career: '첫 직장 입사 전',
};


export function buildSystemPrompt(req: GenerateRequest, ragResults: string): string {
  const { profile } = req;
  const style = STYLE_GUIDES[profile.style ?? DEFAULT_STYLE] ?? STYLE_GUIDES[DEFAULT_STYLE];
  return `당신은 인생 회귀물(回帰物) 웹소설 작가입니다.
다음 설정으로 이야기를 써주세요:

[캐릭터 정보]
- 이름: ${profile.name}
- 페르소나: ${PERSONA_LABELS[profile.persona] ?? profile.persona}
- 후회: ${REGRET_LABELS[profile.regret] ?? profile.regret}
- 돌아간 시대: ${ERA_LABELS[profile.returnEra] ?? profile.returnEra}

[문체] ${style.label}
${style.guide}

[작가 규칙]
1. 한국 정서에 맞는 대사와 묘사 (단, 문체 가이드가 우선)
2. 전생의 기억을 활용한 전개
3. 선택지마다 다른 결말로 이어질 것
4. 클리셰 과다 사용 금지
5. 매 에피소드 말미에 반드시 3개의 선택지 제시
6. 3개의 선택지는 자유 선택 / 신중 선택 / 모험 선택 구조
7. 선택지 마지막 하나는 프리미엄(🔒) 표시

[분량]
- 본문은 공백 포함 700~1,000자 — 장면 하나를 충분히 그리되 늘어지지 않게
- 클라이맥스 에피소드(분기 합류·최종화 직전)는 1,200자까지 허용

[지금까지의 요약]
${req.summary || '(없음 — 첫 에피소드)'}

[관련된 이전 사건들]
${ragResults || '(없음)'}

[이번 에피소드] ${req.currentEpisode}화
[사용자 선택] ${req.lastChoice ?? '(없음 — 첫 에피소드)'}

위 설정과 분량 기준으로 ${req.currentEpisode}화를 작성하고,
마지막에 선택지 3개를 제시해주세요.`;
}

/** LLM이 반환해야 하는 에피소드 JSON 스키마 (structured output용) */
export const episodeJsonSchema = {
  name: 'episode',
  strict: true,
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['episodeNumber', 'title', 'content', 'choices'],
    properties: {
      episodeNumber: { type: 'integer' },
      title: { type: 'string', description: '에피소드 제목' },
      content: { type: 'string', description: '스토리 본문 (공백 포함 700~1,000자)' },
      choices: {
        type: 'array',
        minItems: 3,
        maxItems: 3,
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'text', 'isPremium'],
          properties: {
            id: { type: 'string' },
            text: { type: 'string', description: '선택지 텍스트' },
            isPremium: {
              type: 'boolean',
              description: '세 번째(모험) 선택지만 true',
            },
          },
        },
      },
    },
  },
} as const;
