import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/lib/theme';
import { ensureAnonymousAuth } from '@/lib/supabase';

export default function RootLayout() {
  useEffect(() => {
    // Supabase가 설정된 경우 익명 로그인 (미설정 시 no-op)
    void ensureAnonymousAuth();
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="play" />
      </Stack>
    </>
  );
}
