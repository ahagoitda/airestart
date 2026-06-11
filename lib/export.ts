// 소설 내보내기 (프리미엄 전용) — 플레이한 회차를 한 편의 텍스트로 엮는다.

import { Share } from 'react-native';
import type { Choice, Episode, PresetNode, StorySession } from '@/types';
import { getPreset, personalize } from '@/lib/presets';

/** 세션의 진행 경로를 따라가며 전체 스토리 텍스트를 조립 */
export function buildStoryText(session: StorySession): string {
  const name = session.profile.name;
  const parts: string[] = [];

  if (session.mode === 'ai') {
    parts.push(`《AI 회귀록》 — ${name}의 ${session.regressionCount + 1}회차\n`);
    for (const ep of session.aiEpisodes) {
      parts.push(formatEpisode(ep));
    }
  } else {
    const preset = getPreset(session.presetId);
    parts.push(`《${preset.title}》 — ${name}의 ${session.regressionCount + 1}회차\n`);
    // 선택 기록을 따라 시작 노드부터 경로 재구성
    let nodeId: string | undefined = preset.startNodeId;
    for (const record of session.history) {
      const node: PresetNode | undefined = nodeId ? preset.nodes[nodeId] : undefined;
      if (!node) break;
      parts.push(formatEpisode(node, name));
      parts.push(`▶ 선택: ${record.choiceText}\n`);
      const chosen: Choice | undefined = node.choices.find(
        (c) => c.id === record.choiceId,
      );
      nodeId = chosen?.nextNodeId;
    }
    // 마지막(현재) 노드 — 선택 기록 이후 도달한 장면
    const lastNode = nodeId ? preset.nodes[nodeId] : undefined;
    if (lastNode) parts.push(formatEpisode(lastNode, name));
  }

  parts.push('— Regressor(回)에서 생성된 회귀록입니다.');
  return parts.join('\n');
}

function formatEpisode(ep: Episode, name?: string): string {
  const content = name ? personalize(ep.content, name) : ep.content;
  return `[${ep.episodeNumber}화] ${ep.title}\n\n${content}\n`;
}

/** OS 공유 시트로 소설 내보내기 */
export async function shareStory(session: StorySession): Promise<void> {
  await Share.share({ message: buildStoryText(session) });
}
