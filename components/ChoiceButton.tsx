import { Pressable, StyleSheet, Text } from 'react-native';
import type { Choice } from '@/types';
import { colors, spacing } from '@/lib/theme';

interface Props {
  choice: Choice;
  /** 사용자가 프리미엄인지 — 아니면 프리미엄 선택지는 잠금 표시 */
  isPremiumUser: boolean;
  onPress: (choice: Choice) => void;
  disabled?: boolean;
}

export default function ChoiceButton({ choice, isPremiumUser, onPress, disabled }: Props) {
  const locked = choice.isPremium && !isPremiumUser;
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        locked && styles.locked,
        pressed && !locked && styles.pressed,
      ]}
      onPress={() => onPress(choice)}
      disabled={disabled}
      accessibilityRole="button"
    >
      <Text style={[styles.arrow, locked && styles.lockedText]}>→</Text>
      <Text style={[styles.text, locked && styles.lockedText]}>
        {choice.text}
        {locked && '  🔒 프리미엄'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  pressed: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.gold,
  },
  locked: {
    opacity: 0.7,
    borderColor: colors.goldDim,
    borderStyle: 'dashed',
  },
  arrow: { color: colors.gold, fontSize: 16 },
  text: { color: colors.text, fontSize: 16, flex: 1, lineHeight: 22 },
  lockedText: { color: colors.textMuted },
});
