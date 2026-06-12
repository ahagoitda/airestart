// 선택지 통계 — 같은 갈림길에서 다른 회귀자들이 무엇을 골랐는지.
// Supabase 미설정 시 로컬 집계로 폴백 (혼자만의 분포지만 UI는 동일하게 동작).

import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

const LOCAL_STATS_KEY = 'regressor:choice-stats';

type LocalStats = Record<string, number>; // `${presetId}/${nodeId}/${choiceId}` -> picks

async function loadLocal(): Promise<LocalStats> {
  const raw = await AsyncStorage.getItem(LOCAL_STATS_KEY);
  return raw ? (JSON.parse(raw) as LocalStats) : {};
}

/** 선택 1회 기록 (fire-and-forget) */
export function recordChoicePick(
  presetId: string,
  nodeId: string,
  choiceId: string,
): void {
  if (supabase) {
    void supabase
      .rpc('record_choice', { p_preset: presetId, p_node: nodeId, p_choice: choiceId })
      .then(({ error }) => {
        if (error) console.warn('선택 통계 기록 실패:', error.message);
      });
    return;
  }
  void (async () => {
    const stats = await loadLocal();
    const key = `${presetId}/${nodeId}/${choiceId}`;
    stats[key] = (stats[key] ?? 0) + 1;
    await AsyncStorage.setItem(LOCAL_STATS_KEY, JSON.stringify(stats));
  })();
}

/**
 * 해당 갈림길에서 이 선택을 고른 비율(0~100)을 반환.
 * 표본이 없으면 null — UI는 표시를 생략한다.
 */
export async function getChoicePercent(
  presetId: string,
  nodeId: string,
  choiceId: string,
): Promise<number | null> {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('choice_stats')
        .select('choice_id, picks')
        .eq('preset_id', presetId)
        .eq('node_id', nodeId);
      if (error || !data?.length) return null;
      const total = data.reduce((n, r) => n + Number(r.picks), 0);
      const mine = Number(data.find((r) => r.choice_id === choiceId)?.picks ?? 0);
      return total > 0 ? Math.round((mine / total) * 100) : null;
    }
    const stats = await loadLocal();
    const prefix = `${presetId}/${nodeId}/`;
    const entries = Object.entries(stats).filter(([k]) => k.startsWith(prefix));
    const total = entries.reduce((n, [, v]) => n + v, 0);
    const mine = stats[`${prefix}${choiceId}`] ?? 0;
    return total > 0 ? Math.round((mine / total) * 100) : null;
  } catch {
    return null;
  }
}
