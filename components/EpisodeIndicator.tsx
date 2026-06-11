import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/lib/theme';

interface Props {
  current: number;
  total: number;
}

/** 화면 하단의 "에피소드 1/3" 진행 표시 */
export default function EpisodeIndicator({ current, total }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(current / total) * 100}%` }]} />
      </View>
      <Text style={styles.label}>
        에피소드 {current}/{total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs, paddingVertical: spacing.sm },
  track: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: { height: '100%', backgroundColor: colors.gold },
  label: { color: colors.textFaint, fontSize: 12, textAlign: 'center' },
});
