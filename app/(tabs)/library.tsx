import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { loadArchive, type ArchiveEntry } from '@/lib/story-engine';
import { colors, spacing, typography } from '@/lib/theme';

export default function LibraryScreen() {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void loadArchive().then((list) => {
        if (active) setEntries(list);
      });
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
        ListEmptyComponent={
          <Text style={styles.empty}>
            아직 끝난 회차가 없습니다.{'\n'}첫 회귀를 완주해 보세요.
          </Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
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
  empty: {
    ...typography.subtitle,
    textAlign: 'center',
    marginTop: '40%',
    lineHeight: 24,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardTitle: { color: colors.text, fontSize: 16, fontWeight: '600' },
  cardMeta: { color: colors.textFaint, fontSize: 12 },
  cardChoices: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
});
