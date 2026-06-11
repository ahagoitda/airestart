import { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import type { Choice, StorySession } from '@/types';
import {
  applyAiEpisode,
  applyPresetChoice,
  getCurrentScene,
  loadSession,
  regress,
  FREE_REGRESSION_LIMIT,
} from '@/lib/story-engine';
import { generateEpisode, isAiAvailable } from '@/lib/ai';
import { personalize } from '@/lib/presets';
import { shareStory } from '@/lib/export';
import TypewriterText from '@/components/TypewriterText';
import ChoiceButton from '@/components/ChoiceButton';
import SceneTransition from '@/components/SceneTransition';
import LoadingIndicator from '@/components/LoadingIndicator';
import EpisodeIndicator from '@/components/EpisodeIndicator';
import AdBanner from '@/components/AdBanner';
import { ScenarioCover } from '@/components/illustrations';
import { colors, spacing } from '@/lib/theme';

export default function PlayScreen() {
  const [session, setSession] = useState<StorySession | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [typingDone, setTypingDone] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const sceneIdRef = useRef<string | null>(null);

  useEffect(() => {
    void (async () => {
      const s = await loadSession();
      if (!s) {
        router.replace('/onboarding');
        return;
      }
      // AI 모드 첫 진입: 1화를 생성한다
      if (s.mode === 'ai' && s.aiEpisodes.length === 0 && s.status === 'in_progress') {
        setSession(s);
        setLoading(false);
        await generateNext(s, null);
        return;
      }
      setSession(s);
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generateNext(current: StorySession, choice: Choice | null) {
    if (!isAiAvailable()) {
      Alert.alert(
        'AI 서버 미설정',
        'EXPO_PUBLIC_API_URL이 설정되지 않아 AI 생성을 사용할 수 없습니다.',
        [{ text: '확인', onPress: () => router.replace('/(tabs)') }],
      );
      return;
    }
    setGenerating(true);
    try {
      const episode = await generateEpisode(current);
      const updated = await applyAiEpisode(current, choice, episode);
      setTypingDone(false);
      setSession(updated);
    } catch (e) {
      Alert.alert(
        '생성 실패',
        e instanceof Error ? e.message : '에피소드 생성 중 오류가 발생했습니다.',
        [{ text: '확인' }],
      );
    } finally {
      setGenerating(false);
    }
  }

  if (loading || !session) {
    return <LoadingIndicator message="회귀 좌표를 계산하는 중..." />;
  }

  if (generating) {
    return <LoadingIndicator message="운명을 다시 쓰는 중..." />;
  }

  const scene = getCurrentScene(session);
  if (!scene) {
    // AI 모드인데 에피소드가 아직 없음 (생성 실패 후) — 재시도 제공
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.retryWrap}>
          <Text style={styles.retryText}>이야기를 불러오지 못했습니다.</Text>
          <Pressable
            style={styles.regressButton}
            onPress={() => void generateNext(session, null)}
          >
            <Text style={styles.regressText}>다시 시도</Text>
          </Pressable>
          <Pressable style={styles.homeButton} onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.homeText}>홈으로</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const content = personalize(scene.content, session.profile.name);

  // 새 장면 진입 시 맨 위로
  if (sceneIdRef.current !== scene.id) {
    sceneIdRef.current = scene.id;
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ y: 0, animated: false }));
  }

  const onChoice = async (choice: Choice) => {
    if (choice.isPremium && !session.isPremium) {
      Alert.alert(
        '🔒 프리미엄 선택지',
        '모험 선택지는 프리미엄(월 ₩5,900) 전용입니다.\nAI가 당신만의 전개를 실시간으로 생성합니다.',
        [
          { text: '닫기', style: 'cancel' },
          { text: '구독 보러가기', onPress: () => router.replace('/(tabs)/settings') },
        ],
      );
      return;
    }
    // AI 모드이거나, 프리셋의 모험(프리미엄) 선택지 → AI 생성으로 진행
    if (session.mode === 'ai' || !choice.nextNodeId) {
      await generateNext(session, choice);
      return;
    }
    setTypingDone(false);
    const updated = await applyPresetChoice(session, choice);
    setSession(updated);
  };

  const onRegress = async () => {
    try {
      setTypingDone(false);
      const updated = await regress(session);
      setSession(updated);
      if (updated.mode === 'ai') {
        await generateNext(updated, null);
      }
    } catch {
      Alert.alert(
        '회귀 한도 도달',
        `무료 플랜은 회귀 루프 ${FREE_REGRESSION_LIMIT}회까지 가능합니다.\n프리미엄에서 무제한 회귀를 열어보세요.`,
        [{ text: '확인', onPress: () => router.replace('/(tabs)') }],
      );
    }
  };

  const onExport = async () => {
    if (!session.isPremium) {
      Alert.alert('🔒 프리미엄 기능', '소설 내보내기는 프리미엄 전용입니다.');
      return;
    }
    try {
      await shareStory(session);
    } catch {
      // 사용자가 공유 시트를 닫은 경우 등 — 무시
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={12}>
          <Text style={styles.headerBack}>‹ 홈</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          [에피소드 {scene.episodeNumber}] {scene.title}
        </Text>
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        onContentSizeChange={() => {
          // 선택지가 나타나면 보이도록 끝까지 스크롤
          if (typingDone) scrollRef.current?.scrollToEnd({ animated: true });
        }}
      >
        <SceneTransition sceneKey={scene.id}>
          <TypewriterText
            key={scene.id}
            text={content}
            onComplete={() => setTypingDone(true)}
            onProgress={() => scrollRef.current?.scrollToEnd({ animated: false })}
          />
        </SceneTransition>

        {typingDone && !scene.isEnding && (
          <View style={styles.choices}>
            {scene.choices.map((choice) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                isPremiumUser={session.isPremium}
                onPress={(c) => void onChoice(c)}
              />
            ))}
          </View>
        )}

        {typingDone && scene.isEnding && (
          <View style={styles.choices}>
            <View style={styles.endingArt}>
              <ScenarioCover
                presetId={session.presetId}
                mode={session.mode}
                size={96}
              />
            </View>
            <Pressable style={styles.regressButton} onPress={() => void onRegress()}>
              <Text style={styles.regressText}>⟲ 다시 회귀하기</Text>
              <Text style={styles.regressSub}>
                {session.regressionCount + 1}회차 종료 — 다른 선택, 다른 운명
              </Text>
            </Pressable>
            <Pressable style={styles.exportButton} onPress={() => void onExport()}>
              <Text style={styles.exportText}>
                소설로 내보내기{session.isPremium ? '' : '  🔒'}
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
        <EpisodeIndicator current={scene.episodeNumber} total={session.totalEpisodes} />
      </View>
      <AdBanner visible={!session.isPremium} />
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
  endingArt: { alignItems: 'center', marginBottom: spacing.lg },
  regressButton: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  regressText: { color: '#0A0A0A', fontSize: 17, fontWeight: '700' },
  regressSub: { color: 'rgba(0,0,0,0.55)', fontSize: 12 },
  exportButton: {
    marginTop: spacing.sm,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.goldDim,
  },
  exportText: { color: colors.gold, fontSize: 15, fontWeight: '600' },
  homeButton: {
    marginTop: spacing.sm,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  homeText: { color: colors.textMuted, fontSize: 15 },
  retryWrap: {
    flex: 1,
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.sm,
  },
  retryText: {
    color: colors.textMuted,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
});
