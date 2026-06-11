# Regressor (回)

인생 회귀 시뮬레이션 게임 — 선택지로 인생을 입력하면 회귀물 시나리오가 펼쳐지는 텍스트 인터랙티브 게임 MVP.

## 스택

- **앱**: Expo (React Native + Expo Router), TypeScript, StyleSheet 다크 테마
- **백엔드**: Supabase (익명 인증, DB, pgvector) — 미설정 시 로컬(AsyncStorage)만으로 동작
- **AI**: OpenAI GPT-4o-mini (Vercel Edge Function 프록시 경유, 프리미엄 전용)

## 실행

```bash
npm install
cp .env.example .env   # 값 채우기 (선택 — 없어도 프리셋 플레이 가능)
npm start
```

타입 체크: `npm run typecheck`

## 특징

- 온보딩 5단계 전부 선택지 (이름만 입력) — 페르소나·후회·회귀 시대·**문체** 선택
- 문체 카테고리: 한국 웹소설식(카카오페이지) / 노벨피아식(사이다) / 라노벨식 / 미국 히어로식(마블) — AI 생성 작풍에 반영
- 무료: 프리셋 시나리오 3종(분기 포함 3화) / 프리미엄: AI 실시간 생성 10화+, 소설 내보내기, 회귀 무제한
- 다크+골드 테마, 벡터 일러스트(react-native-svg), 타이핑 연출 + 자동 스크롤

## 구조

```
app/            화면 (Expo Router)
  (tabs)/       홈 · 라이브러리 · 설정
  onboarding    인생 입력 (선택지 4단계)
  play          메인 플레이 (타이핑 애니메이션 + 선택지)
components/     TypewriterText, ChoiceButton, SceneTransition 등
lib/            story-engine(진행/저장), presets(무료 시나리오), supabase, ai, theme
types/          공용 타입
supabase/       DB 스키마 (schema.sql)
```

## 무료 vs 프리미엄

| | 무료 | 프리미엄 (월 ₩5,900) |
|---|---|---|
| 스토리 | 프리셋 3화 | AI 실시간 생성 무제한 |
| 선택지 | 2개 | 3개 (모험 선택지 해금) |
| 회귀 루프 | 1회 | 무제한 |

## 보안

`.env`는 절대 커밋하지 않는다. OpenAI/Anthropic 키는 클라이언트가 아닌 Vercel 프록시에만 둔다. Supabase는 anon key만 사용하고 RLS로 접근을 제한한다.
