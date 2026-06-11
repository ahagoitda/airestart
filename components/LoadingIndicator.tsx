import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/lib/theme';

interface Props {
  message?: string;
}

/** AI 생성 대기 등 로딩 상태 표시 */
export default function LoadingIndicator({ message = '운명을 다시 쓰는 중...' }: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.gold} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
  },
  message: { color: colors.textMuted, fontSize: 15 },
});
