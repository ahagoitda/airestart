import { Pressable, StyleSheet, Text } from 'react-native';
import type { Choice } from '@/types';
import { colors, spacing } from '@/lib/theme';

/** 회귀 계승 선택지의 상태 — locked: 기억 없음(내용 숨김), unlocked: 기억으로 열림 */
export type MemoryState = 'locked' | 'unlocked' | null;

interface Props {
  choice: Choice;
  /** 사용자가 프리미엄인지 — 아니면 프리미엄 선택지는 잠금 표시 */
  isPremiumUser: boolean;
  memoryState?: MemoryState;
  onPress: (choice: Choice) => void;
  disabled?: boolean;
}

export default function ChoiceButton({
  choice,
  isPremiumUser,
  memoryState = null,
  onPress,
  disabled,
}: Props) {
  const premiumLocked = choice.isPremium && !isPremiumUser;

  if (memoryState === 'locked') {
    // 아직 얻지 못한 기억 — 내용을 숨겨 다음 회차의 동기를 만든다
    return (
      <Pressable
        style={[styles.button, styles.memoryLocked]}
        onPress={() => onPress(choice)}
        disabled={disabled}
        accessibilityRole="button"
      >
        <Text style={styles.memoryLockedArrow}>⟲</Text>
        <Text style={styles.memoryLockedText}>
          ??? — 이 갈림길의 기억이 아직 없다
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        premiumLocked && styles.locked,
        memoryState === 'unlocked' && styles.memoryUnlocked,
        pressed && !premiumLocked && styles.pressed,
      ]}
      onPress={() => onPress(choice)}
      disabled={disabled}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.arrow,
          premiumLocked && styles.lockedText,
          memoryState === 'unlocked' && styles.memoryArrow,
        ]}
      >
        {memoryState === 'unlocked' ? '✦' : '→'}
      </Text>
      <Text
        style={[
          styles.text,
          premiumLocked && styles.lockedText,
          memoryState === 'unlocked' && styles.memoryText,
        ]}
      >
        {memoryState === 'unlocked' && '[회귀의 기억] '}
        {choice.text}
        {premiumLocked && '  🔒 프리미엄'}
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
  memoryLocked: {
    borderStyle: 'dashed',
    borderColor: colors.textFaint,
    opacity: 0.8,
  },
  memoryUnlocked: {
    borderColor: colors.gold,
    backgroundColor: colors.surfaceRaised,
  },
  arrow: { color: colors.gold, fontSize: 16 },
  memoryArrow: { color: colors.gold, fontSize: 16 },
  memoryLockedArrow: { color: colors.textFaint, fontSize: 16 },
  text: { color: colors.text, fontSize: 16, flex: 1, lineHeight: 22 },
  lockedText: { color: colors.textMuted },
  memoryText: { color: colors.gold },
  memoryLockedText: { color: colors.textFaint, fontSize: 15, flex: 1, lineHeight: 22 },
});
