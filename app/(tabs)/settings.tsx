import { useCallback, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import type { UserProfile } from '@/types';
import { loadProfile, resetAll } from '@/lib/story-engine';
import { colors, spacing, typography } from '@/lib/theme';

export default function SettingsScreen() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      void loadProfile().then((p) => {
        if (active) setProfile(p);
      });
      return () => {
        active = false;
      };
    }, []),
  );

  const confirmReset = () => {
    Alert.alert('데이터 초기화', '프로필과 모든 회차 기록이 삭제됩니다.', [
      { text: '취소', style: 'cancel' },
      {
        text: '초기화',
        style: 'destructive',
        onPress: () => {
          void resetAll().then(() => setProfile(null));
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>설정</Text>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>프로필</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            {profile ? profile.name : '아직 회귀하지 않았습니다'}
          </Text>
          <Text style={styles.cardMeta}>
            {profile?.isPremium ? '프리미엄 회귀자 ✦' : '무료 플랜'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>구독</Text>
        <View style={styles.card}>
          <Text style={styles.cardText}>프리미엄 — 월 ₩5,900</Text>
          <Text style={styles.cardMeta}>
            AI 실시간 생성 · 10화+ · 모험 선택지 · 광고 제거 · 회귀 무제한
          </Text>
          <Pressable
            style={styles.premiumButton}
            onPress={() =>
              Alert.alert('준비 중', '인앱 결제(RevenueCat)는 7~8주차에 연동됩니다.')
            }
          >
            <Text style={styles.premiumButtonText}>구독하기</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>데이터</Text>
        <Pressable style={[styles.card, styles.dangerCard]} onPress={confirmReset}>
          <Text style={styles.dangerText}>모든 데이터 초기화</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  title: { ...typography.title, marginBottom: spacing.lg },
  section: { marginBottom: spacing.lg },
  sectionLabel: {
    color: colors.textFaint,
    fontSize: 13,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardText: { color: colors.text, fontSize: 16, fontWeight: '600' },
  cardMeta: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  premiumButton: {
    backgroundColor: colors.gold,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  premiumButtonText: { color: '#0A0A0A', fontWeight: '700', fontSize: 15 },
  dangerCard: { borderColor: colors.danger },
  dangerText: { color: colors.danger, fontSize: 15, fontWeight: '600' },
});
