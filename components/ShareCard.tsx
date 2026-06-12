import { forwardRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { Scene, StorySession } from '@/types';
import { getPreset } from '@/lib/presets';
import { ScenarioCover } from '@/components/illustrations';
import { colors, spacing } from '@/lib/theme';

// 엔딩 공유 카드 — react-native-view-shot으로 캡처해 SNS로 내보낸다.
// 카드 자체가 마케팅 채널이므로 무료 유저에게도 제공.

export const SHARE_CARD_WIDTH = 320;

interface Props {
  session: StorySession;
  scene: Scene;
}

const ShareCard = forwardRef<View, Props>(function ShareCard({ session, scene }, ref) {
  const preset = getPreset(session.presetId);
  const badge =
    scene.endingType === 'bad'
      ? '■ 배드 엔딩'
      : scene.endingType === 'true'
        ? '✦ 진 엔딩'
        : '● 엔딩';
  const badgeColor =
    scene.endingType === 'bad'
      ? colors.danger
      : scene.endingType === 'true'
        ? colors.gold
        : colors.textMuted;
  const path = session.history.map((h) => h.choiceText);

  return (
    <View ref={ref} style={styles.card} collapsable={false}>
      <View style={styles.header}>
        <Text style={styles.logo}>回</Text>
        <Text style={styles.appName}>REGRESSOR</Text>
      </View>

      <View style={styles.coverWrap}>
        <ScenarioCover presetId={session.presetId} mode={session.mode} size={120} />
      </View>

      <Text style={[styles.badge, { color: badgeColor }]}>{badge}</Text>
      <Text style={styles.endingTitle}>{scene.title}</Text>
      <Text style={styles.meta}>
        《{session.mode === 'ai' ? 'AI 회귀록' : preset.title}》 ·{' '}
        {session.profile.name}의 {session.regressionCount + 1}회차
      </Text>

      {path.length > 0 && (
        <View style={styles.pathBox}>
          <Text style={styles.pathLabel}>이 회차의 갈림길</Text>
          {path.slice(0, 4).map((text, i) => (
            <Text key={i} style={styles.pathItem} numberOfLines={1}>
              {i + 1}. {text}
            </Text>
          ))}
          {path.length > 4 && (
            <Text style={styles.pathItem}>… 그리고 {path.length - 4}개의 선택</Text>
          )}
        </View>
      )}

      <Text style={styles.footer}>당신의 인생을 다시 산다면 — Regressor</Text>
    </View>
  );
});

export default ShareCard;

const styles = StyleSheet.create({
  card: {
    width: SHARE_CARD_WIDTH,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.goldDim,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: { color: colors.gold, fontSize: 18 },
  appName: { color: colors.textMuted, fontSize: 12, letterSpacing: 4 },
  coverWrap: { marginVertical: spacing.md },
  badge: { fontSize: 13, fontWeight: '700' },
  endingTitle: { color: colors.text, fontSize: 22, fontWeight: '700' },
  meta: { color: colors.textMuted, fontSize: 13, marginBottom: spacing.sm },
  pathBox: {
    alignSelf: 'stretch',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: spacing.md,
    gap: 4,
    marginBottom: spacing.sm,
  },
  pathLabel: { color: colors.gold, fontSize: 11, fontWeight: '700', marginBottom: 2 },
  pathItem: { color: colors.textMuted, fontSize: 12, lineHeight: 18 },
  footer: { color: colors.textFaint, fontSize: 11, marginTop: spacing.xs },
});
