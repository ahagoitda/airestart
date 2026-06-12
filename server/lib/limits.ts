// AI 생성 폭주 방지 — 일일 전체 생성 한도.
// 버그·어뷰징으로 인한 예상 밖 과금을 하드 캡으로 차단한다.
// Supabase 미설정 시에는 카운터를 둘 곳이 없어 제한 없이 통과한다
// (배포 환경에서는 반드시 Supabase + DAILY_GENERATION_LIMIT 설정 권장).

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** 일일 전체 생성 한도 (기본 500화 ≈ gpt-4o-mini 기준 약 $2/일 상한) */
const DAILY_LIMIT = Number(process.env.DAILY_GENERATION_LIMIT ?? 500);

/** 오늘 생성 한도 내인지 확인하며 카운트를 1 올린다 */
export async function tryConsumeGeneration(): Promise<boolean> {
  if (!SUPABASE_URL || !SERVICE_KEY) return true;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/bump_generation_usage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      body: JSON.stringify({ p_limit: DAILY_LIMIT }),
    });
    if (!res.ok) {
      console.warn('사용량 카운터 실패 (통과 처리):', res.status);
      return true;
    }
    return (await res.json()) === true;
  } catch (e) {
    console.warn('사용량 카운터 오류 (통과 처리):', e);
    return true;
  }
}
