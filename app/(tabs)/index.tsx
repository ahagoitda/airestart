import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import type { StorySession, UserProfile } from '@/types';
import { loadProfile, loadSession, startSession } from '@/lib/story-engine';
import { getPreset } from '@/lib/presets';
import { getDailyChallenge } from '@/lib/daily';
import { HeroEmblem, ScenarioCover } from '@/components/illustrations';
import { colors, spacing, typography } from '@/lib/theme';

export default function HomeScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<StorySession | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void (async () => {
        const [p, s] = await Promise.all([loadProfile(), loadSession()]);
        if (active) {
          setProfile(p);
          setSession(s);
        }
      })();
      return () => {
        active = false;
      };
    }, []),
  );

  const canResume = session && session.status === 'in_progress';

  const startNew = () => {
    if (canResume) {
      // 진행 중인 회차를 덮어쓰기 전에 확인
      Alert.alert('새 회귀 시작', '진행 중인 회차가 있습니다. 새로 시작할까요?', [
        { text: '취소', style: 'cancel' },
        { text: '새로 시작', style: 'destructive', onPress: () => router.push('/onboarding') },
      ]);
      return;
    }
    router.push('/onboarding');
  };
  const resume = () => router.push('/play');

  const daily = getDailyChallenge();
  const startDaily = () => {
    if (!profile) {
      router.push('/onboarding');
      return;
    }
    const begin = () => {
      void startSession(profile, {
        presetId: daily.preset.id,
        style: daily.style.value,
      }).then(() => router.push('/play'));
    };
    if (canResume) {
      Alert.alert(
        '오늘의 회귀',
        '진행 중인 회차를 접고 오늘의 조합으로 시작할까요?',
        [
          { text: '취소', style: 'cancel' },
          { text: '시작', style: 'destructive', onPress: begin },
        ],
      );
      return;
    }
    begin();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <HeroEmblem size={130} />
        <Text style={styles.title}>Regressor</Text>
        <Text style={styles.tagline}>
          {profile
            ? `${profile.name}님, 두 번째 인생이 기다립니다.`
            : '인생을 다시 산다면, 어디서부터?'}
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.dailyCard} onPress={startDaily}>
          <ScenarioCover presetId={daily.preset.id} size={48} />
          <View style={styles.dailyBody}>
            <Text style={styles.dailyLabel}>오늘의 회귀</Text>
            <Text style={styles.dailyTitle}>
              {daily.preset.title} × {daily.style.label}
            </Text>
            <Text style={styles.dailyDesc} numberOfLines={1}>
              {daily.style.description}
            </Text>
          </View>
          <Text style={styles.dailyArrow}>›</Text>
        </Pressable>
        {canResume && session && (
          <Pressable style={[styles.button, styles.primary]} onPress={resume}>
            <Text style={styles.primaryText}>이어하기</Text>
            <Text style={styles.buttonSub}>
              {getPreset(session.presetId).title} · {session.currentEpisode}화
            </Text>
          </Pressable>
        )}
        <Pressable
          style={[styles.button, canResume ? styles.secondary : styles.primary]}
          onPress={startNew}
        >
          <Text style={canResume ? styles.secondaryText : styles.primaryText}>
            새 회귀 시작
          </Text>
          <Text style={canResume ? styles.buttonSubDark : styles.buttonSub}>
            인생을 입력하고 회귀합니다
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'space-between',
  },
  hero: { alignItems: 'center', marginTop: '25%' },
  title: { ...typography.title, fontSize: 32, marginTop: spacing.md },
  tagline: { ...typography.subtitle, marginTop: spacing.sm, textAlign: 'center' },
  actions: { gap: spacing.sm, marginBottom: spacing.lg },
  dailyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.goldDim,
    borderRadius: 12,
    padding: spacing.md,
  },
  dailyBody: { flex: 1, gap: 2 },
  dailyLabel: { color: colors.gold, fontSize: 11, fontWeight: '700' },
  dailyTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  dailyDesc: { color: colors.textFaint, fontSize: 12 },
  dailyArrow: { color: colors.textMuted, fontSize: 24 },
  button: {
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    gap: 4,
  },
  primary: { backgroundColor: colors.gold },
  primaryText: { color: '#0A0A0A', fontSize: 18, fontWeight: '700' },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryText: { color: colors.text, fontSize: 18, fontWeight: '600' },
  buttonSub: { color: 'rgba(0,0,0,0.55)', fontSize: 12 },
  buttonSubDark: { color: colors.textMuted, fontSize: 12 },
});
