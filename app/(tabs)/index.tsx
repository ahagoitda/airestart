import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import type { StorySession, UserProfile } from '@/types';
import { loadProfile, loadSession } from '@/lib/story-engine';
import { getPreset } from '@/lib/presets';
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

  const startNew = () => router.push('/onboarding');
  const resume = () => router.push('/play');

  const canResume = session && session.status === 'in_progress';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>回</Text>
        <Text style={styles.title}>Regressor</Text>
        <Text style={styles.tagline}>
          {profile
            ? `${profile.name}님, 두 번째 인생이 기다립니다.`
            : '인생을 다시 산다면, 어디서부터?'}
        </Text>
      </View>

      <View style={styles.actions}>
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
  logo: { fontSize: 72, color: colors.gold, fontWeight: '300' },
  title: { ...typography.title, fontSize: 32, marginTop: spacing.md },
  tagline: { ...typography.subtitle, marginTop: spacing.sm, textAlign: 'center' },
  actions: { gap: spacing.sm, marginBottom: spacing.lg },
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
