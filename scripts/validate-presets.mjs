// 프리셋 시나리오 그래프 무결성 검증
// 실행: node --experimental-strip-types scripts/validate-presets.mjs

import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const { presetScenarios, pickPreset } = await import(path.join(root, 'lib/presets.ts'));

const ENDING_TYPES = new Set(['good', 'bad', 'true']);
let errors = 0;
const err = (msg) => {
  console.error(msg);
  errors++;
};

for (const s of presetScenarios) {
  if (!s.nodes[s.startNodeId]) err(`[${s.id}] startNodeId 없음`);

  // 이 프리셋에서 획득 가능한 기억 id 집합
  const grantedMemories = new Set(
    Object.values(s.nodes)
      .filter((n) => n.grantsMemory)
      .map((n) => n.grantsMemory.id),
  );

  for (const [id, node] of Object.entries(s.nodes)) {
    if (node.id !== id) err(`[${s.id}/${id}] id 불일치`);
    if (!node.content.trim()) err(`[${s.id}/${id}] 본문 비어있음`);

    if (node.isEnding) {
      if (node.choices.length > 0) err(`[${s.id}/${id}] 엔딩에 선택지 존재`);
      if (!ENDING_TYPES.has(node.endingType))
        err(`[${s.id}/${id}] endingType 누락/오류: ${node.endingType}`);
      if (node.grantsMemory && (!node.grantsMemory.id || !node.grantsMemory.label))
        err(`[${s.id}/${id}] grantsMemory 형식 오류`);
      continue;
    }

    if (node.choices.length < 2 || node.choices.length > 4)
      err(`[${s.id}/${id}] 선택지 ${node.choices.length}개 (2~4개여야 함)`);
    const premium = node.choices.filter((c) => c.isPremium);
    if (premium.length !== 1 || !node.choices.at(-1).isPremium)
      err(`[${s.id}/${id}] 마지막 선택지 하나만 프리미엄이어야 함`);
    // 기억 게이트 없이 진행 가능한 무료 선택지 최소 2개
    const free = node.choices.filter((c) => !c.isPremium && !c.requiresMemoryId);
    if (free.length < 2) err(`[${s.id}/${id}] 항상 열려 있는 무료 선택지가 2개 미만`);

    for (const c of node.choices) {
      if (!c.isPremium && (!c.nextNodeId || !s.nodes[c.nextNodeId]))
        err(`[${s.id}/${id}/${c.id}] nextNodeId 깨짐: ${c.nextNodeId}`);
      if (c.requiresMemoryId && !grantedMemories.has(c.requiresMemoryId))
        err(`[${s.id}/${id}/${c.id}] 어떤 엔딩도 주지 않는 기억 요구: ${c.requiresMemoryId}`);
    }
  }

  // 도달 가능성 (기억 보유 가정)
  const reachable = new Set();
  const queue = [s.startNodeId];
  while (queue.length) {
    const id = queue.pop();
    if (reachable.has(id)) continue;
    reachable.add(id);
    for (const c of s.nodes[id]?.choices ?? []) {
      if (c.nextNodeId) queue.push(c.nextNodeId);
    }
  }
  for (const id of Object.keys(s.nodes)) {
    if (!reachable.has(id)) err(`[${s.id}/${id}] 시작점에서 도달 불가`);
  }

  // 배드엔딩이 있으면 그 기억으로 열리는 길이 있어야 의미가 있다
  const requiredMemories = new Set(
    Object.values(s.nodes)
      .flatMap((n) => n.choices)
      .filter((c) => c.requiresMemoryId)
      .map((c) => c.requiresMemoryId),
  );
  for (const m of grantedMemories) {
    if (!requiredMemories.has(m)) err(`[${s.id}] 쓰이지 않는 기억: ${m}`);
  }
}

// 프로필 → 프리셋 매칭
const cases = [
  [{ persona: 'office_worker', regret: 'first_love' }, 'preset-office-first-love'],
  [{ persona: 'job_seeker', regret: 'first_love' }, 'preset-jobseeker-retry'],
  [{ persona: 'tired_worker', regret: 'gave_up_dream' }, 'preset-jobseeker-retry'],
  [{ persona: 'bullied_student', regret: 'family' }, 'preset-bullied-payback'],
  [{ persona: 'freelancer', regret: 'betrayal' }, 'preset-bullied-payback'],
  [{ persona: 'freelancer', regret: 'one_more_chance' }, 'preset-office-first-love'],
];
for (const [profile, expected] of cases) {
  const got = pickPreset(profile).id;
  if (got !== expected)
    err(`pickPreset(${JSON.stringify(profile)}) = ${got}, 기대값 ${expected}`);
}

if (errors === 0) console.log('PRESETS_OK');
else {
  console.error(`오류 ${errors}건`);
  process.exit(1);
}
