import { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import type { Choice, StorySession } from '@/types';
import {
  applyChoice,
  getCurrentNode,
  loadSession,
  regress,
  FREE_REGRESSION_LIMIT,
} from '@/lib/story-engine';
import { getPreset, personalize } from '@/lib/presets';
import TypewriterText from '@/components/TypewriterText';
import ChoiceButton from '@/components/ChoiceButton';
import SceneTransition from '@/components/SceneTransition';
import LoadingIndicator from '@/components/LoadingIndicator';
import EpisodeIndicator from '@/components/EpisodeIndicator';
import { colors, spacing } from '@/lib/theme';

export default function PlayScreen() {
  const [session, setSession] = useState<StorySession | null>(null);
  const [loading, setLoading] = useState(true);
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    void loadSession().then((s) => {
      if (!s) {
        router.replace('/onboarding');
        return;
      }
      setSession(s);
      setLoading(false);
    });
  }, []);

  if (loading || !session) {
    return <LoadingIndicator message="회귀 좌표를 계산하는 중..." />;
  }

  const preset = getPreset(session.presetId);
  const node = getCurrentNode(session);
  const content = personalize(node.content, session.profile.name);

  const onChoice = async (choice: Choice) => {
    if (choice.isPremium && !session.isPremium) {
      Alert.alert(
        '🔒 프리미엄 선택지',
        '모험 선택지는 프리미엄(월 ₩5,900) 전용입니다.\nAI가 당신만의 전개를 실시간으로 생성합니다.',
        [{ text: '확인' }],
      );
      return;
    }
    setTypingDone(false);
    const updated = await applyChoice(session, choice);
    setSession(updated);
  };

  const onRegress = async () => {
    try {
      setTypingDone(false);
      const updated = await regress(session);
      setSession(updated);
    } catch {
      Alert.alert(
        '회귀 한도 도달',
        `무료 플랜은 회귀 루프 ${FREE_REGRESSION_LIMIT}회까지 가능합니다.\n프리미엄에서 무제한 회귀를 열어보세요.`,
        [{ text: '확인', onPress: () => router.replace('/(tabs)') }],
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={12}>
          <Text style={styles.headerBack}>‹ 홈</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          [에피소드 {node.episodeNumber}] {node.title}
        </Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <SceneTransition sceneKey={node.id}>
          <TypewriterText
            key={node.id}
            text={content}
            onComplete={() => setTypingDone(true)}
          />
        </SceneTransition>

        {typingDone && !node.isEnding && (
          <View style={styles.choices}>
            {node.choices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                isPremiumUser={session.isPremium}
                onPress={(c) => void onChoice(c)}
              />
            ))}
          </View>
        )}

        {typingDone && node.isEnding && (
          <View style={styles.choices}>
            <Pressable style={styles.regressButton} onPress={() => void onRegress()}>
              <Text style={styles.regressText}>⟲ 다시 회귀하기</Text>
              <Text style={styles.regressSub}>
                {session.regressionCount + 1}회차 종료 — 다른 선택, 다른 운명
              </Text>
            </Pressable>
            <Pressable
              style={styles.homeButton}
              onPress={() => router.replace('/(tabs)')}
            >
              <Text style={styles.homeText}>홈으로</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <EpisodeIndicator current={node.episodeNumber} total={preset.totalEpisodes} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  headerBack: { color: colors.textMuted, fontSize: 16 },
  headerTitle: { color: colors.gold, fontSize: 15, fontWeight: '600', flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  choices: { marginTop: spacing.xl },
  regressButton: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  regressText: { color: '#0A0A0A', fontSize: 17, fontWeight: '700' },
  regressSub: { color: 'rgba(0,0,0,0.55)', fontSize: 12 },
  homeButton: {
    marginTop: spacing.sm,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  homeText: { color: colors.textMuted, fontSize: 15 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
});
