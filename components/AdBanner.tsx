import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/lib/theme';

// 무료 유저용 광고 배너 자리.
// 실제 광고는 Google AdMob(react-native-google-mobile-ads) — 네이티브 SDK라
// dev build에서 연동한다. 이 컴포넌트가 교체 지점이다.

export default function AdBanner({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <View style={styles.banner}>
      <Text style={styles.label}>AD</Text>
      <Text style={styles.text}>프리미엄으로 광고 없이 즐기세요</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  label: {
    color: colors.textFaint,
    fontSize: 10,
    borderWidth: 1,
    borderColor: colors.textFaint,
    borderRadius: 3,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  text: { color: colors.textMuted, fontSize: 12 },
});
