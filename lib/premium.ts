// 프리미엄 구독 (월 ₩5,900)
//
// 실제 결제는 RevenueCat으로 처리한다 (네이티브 SDK — dev build 필요).
// 이 모듈이 결제 SDK와 앱 사이의 유일한 접점이므로, RevenueCat 연동 시
// purchasePremium/restorePurchases 내부만 교체하면 된다.
// Expo Go·개발 환경에서는 모의 결제로 동작해 프리미엄 플로우 전체를 테스트할 수 있다.

import type { StorySession, UserProfile } from '@/types';
import {
  AI_TOTAL_EPISODES,
  loadProfile,
  loadSession,
  persistSession,
  saveProfile,
} from '@/lib/story-engine';

export const PREMIUM_PRICE_LABEL = '월 ₩5,900';

export interface PurchaseResult {
  success: boolean;
  profile: UserProfile | null;
}

/** 프리미엄 구독 구매. TODO: RevenueCat Purchases.purchasePackage로 교체 */
export async function purchasePremium(): Promise<PurchaseResult> {
  const profile = await loadProfile();
  if (!profile) return { success: false, profile: null };
  const updated = await setPremium(profile, true);
  return { success: true, profile: updated };
}

/** 구독 해지(개발용). 실제로는 스토어 구독 관리에서 처리된다. */
export async function cancelPremium(): Promise<PurchaseResult> {
  const profile = await loadProfile();
  if (!profile) return { success: false, profile: null };
  const updated = await setPremium(profile, false);
  return { success: true, profile: updated };
}

/** 구매 복원. TODO: RevenueCat Purchases.restorePurchases로 교체 */
export async function restorePurchases(): Promise<PurchaseResult> {
  const profile = await loadProfile();
  return { success: false, profile };
}

async function setPremium(
  profile: UserProfile,
  isPremium: boolean,
): Promise<UserProfile> {
  const updated: UserProfile = { ...profile, isPremium };
  await saveProfile(updated);
  // 진행 중인 세션에도 즉시 반영 (프리셋 진행은 유지, 프리미엄 선택지만 해금)
  const session = await loadSession();
  if (session && session.status === 'in_progress') {
    const patched: StorySession = {
      ...session,
      profile: updated,
      isPremium,
      totalEpisodes:
        isPremium && session.mode === 'ai'
          ? Math.max(session.totalEpisodes, AI_TOTAL_EPISODES)
          : session.totalEpisodes,
    };
    await persistSession(patched);
  }
  return updated;
}
