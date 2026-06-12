// 업적 — 아카이브와 엔딩 도감에서 계산된다 (별도 저장 없음).
// 수집 목표가 회귀 루프를 도는 이유가 된다.

import { loadArchive, loadEndingCollection } from '@/lib/story-engine';
import { getPreset } from '@/lib/presets';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
}

export async function loadAchievements(): Promise<Achievement[]> {
  const [archive, collection] = await Promise.all([
    loadArchive(),
    loadEndingCollection(),
  ]);

  const totalRuns = archive.length;
  const totalEndings = collection.reduce((n, p) => n + p.collected, 0);
  const allEndings = collection.reduce((n, p) => n + p.total, 0);

  const endingTypeOf = (presetId: string, nodeId: string) =>
    getPreset(presetId).nodes[nodeId]?.endingType;
  const badCount = collection.reduce(
    (n, p) => n + p.seen.filter((id) => endingTypeOf(p.presetId, id) === 'bad').length,
    0,
  );
  const trueCount = collection.reduce(
    (n, p) => n + p.seen.filter((id) => endingTypeOf(p.presetId, id) === 'true').length,
    0,
  );
  const completedDex = collection.filter((p) => p.total > 0 && p.collected === p.total);

  return [
    {
      id: 'first-regress',
      title: '첫 회귀',
      description: '첫 번째 회차를 끝까지 플레이했다',
      unlocked: totalRuns >= 1,
    },
    {
      id: 'regress-5',
      title: '회귀 적응자',
      description: '5회차를 완주했다',
      unlocked: totalRuns >= 5,
    },
    {
      id: 'regress-10',
      title: '회귀 중독',
      description: '10회차를 완주했다',
      unlocked: totalRuns >= 10,
    },
    {
      id: 'regress-30',
      title: '시간의 죄수',
      description: '30회차를 완주했다',
      unlocked: totalRuns >= 30,
    },
    {
      id: 'first-bad',
      title: '실패는 기억이 된다',
      description: '첫 배드 엔딩에 도달했다',
      unlocked: badCount >= 1,
    },
    {
      id: 'bad-collector',
      title: '고통의 수집가',
      description: '배드 엔딩 5종을 수집했다',
      unlocked: badCount >= 5,
    },
    {
      id: 'first-true',
      title: '운명을 비튼 자',
      description: '진 엔딩에 도달했다',
      unlocked: trueCount >= 1,
    },
    {
      id: 'all-true',
      title: '완전한 회귀자',
      description: '모든 시나리오의 진 엔딩에 도달했다',
      unlocked: trueCount >= collection.length && collection.length > 0,
    },
    {
      id: 'dex-one',
      title: '도감의 첫 페이지',
      description: '한 시나리오의 엔딩을 전부 수집했다',
      unlocked: completedDex.length >= 1,
    },
    {
      id: 'dex-all',
      title: '모든 갈림길의 끝',
      description: `모든 엔딩을 수집했다 (${totalEndings}/${allEndings})`,
      unlocked: allEndings > 0 && totalEndings >= allEndings,
    },
  ];
}
