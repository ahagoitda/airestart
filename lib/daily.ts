// 오늘의 회귀 — 날짜 시드로 매일 다른 시나리오 × 문체 조합을 제안한다.
// 80문체 × 3시나리오 = 240가지 조합이 돌아가며 등장한다.

import { presetScenarios } from '@/lib/presets';
import { ALL_STYLES, type StyleOption } from '@/lib/styles';
import type { PresetScenario } from '@/types';

export interface DailyChallenge {
  dateKey: string;
  preset: PresetScenario;
  style: StyleOption;
}

/** 간단한 정수 해시 (날짜 문자열 → 시드) */
function hash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (h * 33 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getDailyChallenge(date = new Date()): DailyChallenge {
  const dateKey = date.toISOString().slice(0, 10);
  const seed = hash(dateKey);
  const preset = presetScenarios[seed % presetScenarios.length];
  const style = ALL_STYLES[Math.floor(seed / 7) % ALL_STYLES.length];
  return { dateKey, preset, style };
}
