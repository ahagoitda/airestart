// Regressor 핵심 타입 정의

export type PersonaType =
  | 'office_worker'
  | 'college_student'
  | 'job_seeker'
  | 'bullied_student'
  | 'freelancer'
  | 'tired_worker';

export type RegretType =
  | 'first_love'
  | 'family'
  | 'betrayal'
  | 'gave_up_dream'
  | 'one_more_chance';

export type ReturnEra = 'middle_school' | 'high_school' | 'college' | 'early_career';

export interface UserProfile {
  id: string;
  persona: PersonaType;
  regret: RegretType;
  returnEra: ReturnEra;
  name: string;
  isPremium: boolean;
}

export interface Choice {
  id: string;
  text: string;
  /** 선택 시 이동할 다음 노드 (프리셋 전용) */
  nextNodeId?: string;
  isPremium: boolean;
}

export interface Episode {
  episodeNumber: number;
  title: string;
  content: string;
  choices: Choice[];
}

/** 프리셋 시나리오의 한 장면. AI 생성 에피소드와 동일한 형태에 분기 정보가 붙는다. */
export interface PresetNode extends Episode {
  id: string;
  isEnding: boolean;
}

export interface PresetScenario {
  id: string;
  title: string;
  description: string;
  totalEpisodes: number;
  startNodeId: string;
  nodes: Record<string, PresetNode>;
}

export interface ChoiceRecord {
  nodeId: string;
  choiceId: string;
  choiceText: string;
  episodeNumber: number;
}

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';

/** 'preset': 하드코딩 시나리오 진행 / 'ai': 실시간 생성 (프리미엄) */
export type SessionMode = 'preset' | 'ai';

/** 현재 화면에 표시할 장면 — 프리셋 노드와 AI 에피소드의 공통 형태 */
export interface Scene extends Episode {
  id: string;
  isEnding: boolean;
}

export interface StorySession {
  id: string;
  profile: UserProfile;
  mode: SessionMode;
  presetId: string;
  currentNodeId: string;
  currentEpisode: number;
  totalEpisodes: number;
  /** AI 모드에서 생성된 에피소드들 */
  aiEpisodes: Episode[];
  history: ChoiceRecord[];
  /** 지금까지의 요약 (AI 컨텍스트 관리용) */
  summary: string;
  /** AI 실시간 생성 여부 (프리미엄) */
  isPremium: boolean;
  /** 회귀(다시 시작) 횟수 */
  regressionCount: number;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}
