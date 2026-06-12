# Regressor API (Vercel Edge Functions)

AI 에피소드 생성 프록시. OpenAI API 키를 클라이언트에 노출하지 않기 위해 모든 LLM 호출은 이 서버를 경유한다.

## 배포

```bash
cd server
npx vercel deploy --prod
```

Vercel 프로젝트 환경변수에 설정:

| 변수 | 설명 |
|---|---|
| `OPENAI_API_KEY` | OpenAI API 키 (필수) |
| `ANTHROPIC_API_KEY` | Claude Haiku(claude-haiku-4-5) 일관성 검증 패스 — 미설정 시 검증 생략 |
| `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | RAG(pgvector) 검색용 (예정) |

배포 후 앱의 `.env`에 `EXPO_PUBLIC_API_URL=https://<배포주소>/api` 를 넣는다.

## 엔드포인트

### `POST /api/generate`

요청:

```json
{
  "sessionId": "uuid",
  "profile": { "name": "회귀자", "persona": "office_worker", "regret": "first_love", "returnEra": "high_school" },
  "currentEpisode": 4,
  "summary": "1화에서 ...를 선택했다.",
  "lastChoice": "앞자리의 박서연에게 말을 건다"
}
```

응답: `Episode` JSON — `{ episodeNumber, title, content, choices[3] }` (세 번째 선택지는 `isPremium: true`)

## 로드맵

- [x] pgvector RAG 검색 (`story_events` 임베딩 → 관련 사건 주입)
- [x] Claude Haiku 일관성 검증 패스 (모순 발견 시 피드백 재생성 1회)
- [ ] 중요 분기에서 GPT-4o로 승격
- [ ] 스트리밍 응답 (SSE)
