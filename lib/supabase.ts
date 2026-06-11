import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StorySession } from '@/types';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const anonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// 환경변수가 없으면 null — MVP는 로컬(AsyncStorage)만으로도 동작한다.
export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;

/** 익명 로그인. 이미 세션이 있으면 그대로 사용한다. */
export async function ensureAnonymousAuth(): Promise<string | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  if (data.session) return data.session.user.id;
  const { data: anon, error } = await supabase.auth.signInAnonymously();
  if (error) {
    console.warn('익명 로그인 실패:', error.message);
    return null;
  }
  return anon.user?.id ?? null;
}

/** 스토리 세션을 서버에 동기화 (fire-and-forget, 실패해도 로컬 플레이 지속) */
export function syncSession(session: StorySession): void {
  if (!supabase) return;
  void supabase
    .from('story_sessions')
    .upsert({
      id: session.id,
      profile: session.profile,
      current_episode: session.currentEpisode,
      summary: session.summary,
      is_premium: session.isPremium,
      status: session.status,
      updated_at: session.updatedAt,
    })
    .then(({ error }) => {
      if (error) console.warn('세션 동기화 실패:', error.message);
    });
}
