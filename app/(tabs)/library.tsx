import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import {
  loadArchive,
  loadEndingCollection,
  type ArchiveEntry,
  type EndingProgress,
} from '@/lib/story-engine';
import { loadAchievements, type Achievement } from '@/lib/achievements';
import { ScenarioCover } from '@/components/illustrations';
import { colors, spacing, typography } from '@/lib/theme';

export default function LibraryScreen() {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);
  const [collection, setCollection] = useState<EndingProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void Promise.all([loadArchive(), loadEndingCollection(), loadAchievements()]).then(
        ([list, endings, badges]) => {
          if (active) {
            setEntries(list);
            setCollection(endings);
            setAchievements(badges);
          }
        },
      );
      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>라이브러리</Text>
      <Text style={styles.subtitle}>지나간 회차들의 기록</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <>
            <View style={styles.dexSection}>
            <Text style={styles.dexTitle}>엔딩 도감</Text>
            {collection.map((p) => (
              <View key={p.presetId} style={styles.dexRow}>
                <ScenarioCover presetId={p.presetId} size={40} />
                <View style={styles.dexBody}>
                  <Text style={styles.dexName}>{p.title}</Text>
                  <View style={styles.dexTrack}>
                    <View
                      style={[
                        styles.dexFill,
                        { width: `${(p.collected / Math.max(p.total, 1)) * 100}%` },
                      ]}
                    />
                  </View>
                </View>
                <Text
                  style={[
                    styles.dexCount,
                    p.collected === p.total && styles.dexCountDone,
                  ]}
                >
                  {p.collected}/{p.total}
                </Text>
              </View>
            ))}
            </View>
            <View style={styles.badgeSection}>
              <Text style={styles.dexTitle}>
                업적 {achievements.filter((a) => a.unlocked).length}/
                {achievements.length}
              </Text>
              <View style={styles.badgeWrap}>
                {achievements.map((a) => (
                  <View
                    key={a.id}
                    style={[styles.badge, a.unlocked && styles.badgeUnlocked]}
                  >
                    <Text
                      style={[
                        styles.badgeText,
                        a.unlocked && styles.badgeTextUnlocked,
                      ]}
                    >
                      {a.unlocked ? '✦ ' : '○ '}
                      {a.title}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>
            아직 끝난 회차가 없습니다.{'\n'}첫 회귀를 완주해 보세요.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ScenarioCover
              presetId={item.presetId ?? ''}
              mode={item.mode ?? 'preset'}
              size={56}
            />
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>
                {item.episodeReached}화 도달 ·{' '}
                {new Date(item.endedAt).toLocaleDateString('ko-KR')}
              </Text>
              {item.choices.length > 0 && (
                <Text style={styles.cardChoices} numberOfLines={2}>
                  선택: {item.choices.join(' → ')}
                </Text>
              )}
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: typography.title,
  subtitle: { ...typography.subtitle, marginBottom: spacing.md },
  list: { gap: spacing.sm, paddingBottom: spacing.xl },
  dexSection: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.goldDim,
    borderRadius: 10,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  dexTitle: { color: colors.gold, fontSize: 14, fontWeight: '700' },
  dexRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  dexBody: { flex: 1, gap: 4 },
  dexName: { color: colors.text, fontSize: 14 },
  dexTrack: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  dexFill: { height: '100%', backgroundColor: colors.gold },
  dexCount: { color: colors.textMuted, fontSize: 13 },
  dexCountDone: { color: colors.gold, fontWeight: '700' },
  badgeSection: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  badgeWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  badge: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeUnlocked: { borderColor: colors.goldDim, backgroundColor: colors.surfaceRaised },
  badgeText: { color: colors.textFaint, fontSize: 12 },
  badgeTextUnlocked: { color: colors.gold },
  empty: {
    ...typography.subtitle,
    textAlign: 'center',
    marginTop: '20%',
    lineHeight: 24,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    gap: spacing.md,
  },
  cardBody: { flex: 1, gap: spacing.xs },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  cardMeta: { color: colors.textFaint, fontSize: 12 },
  cardChoices: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
});
