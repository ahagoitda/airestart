import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import type { PersonaType, RegretType, ReturnEra, UserProfile } from '@/types';
import { saveProfile, startSession } from '@/lib/story-engine';
import { colors, spacing, typography } from '@/lib/theme';

// 온보딩: 타이핑 없이 선택지로 30초 완료. 이름만 직접 입력(기본값 제공).

const PERSONAS: { value: PersonaType; label: string }[] = [
  { value: 'office_worker', label: '평범한 회사원 (30대)' },
  { value: 'college_student', label: '열정 넘치는 대학생 (20대)' },
  { value: 'job_seeker', label: '인생 2회차를 꿈꾸는 취준생' },
  { value: 'bullied_student', label: '모두에게 무시당했던 고등학생' },
  { value: 'freelancer', label: '슬럼프에 빠진 프리랜서' },
  { value: 'tired_worker', label: '반복되는 일상에 지친 직장인' },
];

const REGRETS: { value: RegretType; label: string }[] = [
  { value: 'first_love', label: '첫사랑에게 마음을 전하지 못한 것' },
  { value: 'family', label: '가족에게 못난 모습만 보여드린 것' },
  { value: 'betrayal', label: '친구의 배신을 눈치채지 못한 것' },
  { value: 'gave_up_dream', label: '꿈을 포기하고 현실에 타협한 것' },
  { value: 'one_more_chance', label: '한 번만 더 기회가 있다면...' },
];

const ERAS: { value: ReturnEra; label: string }[] = [
  { value: 'middle_school', label: '중학교 시절' },
  { value: 'high_school', label: '고등학교 시절' },
  { value: 'college', label: '대학교 입학 전' },
  { value: 'early_career', label: '첫 직장 입사 전' },
];

const STEPS = ['당신은 어떤 사람인가요?', '당신의 가장 큰 후회는?', '돌아가고 싶은 때는?', '당신의 이름은?'];

function OptionRow({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.option, selected && styles.optionSelected]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? '●' : '○'}
      </Text>
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState<PersonaType>('office_worker');
  const [regret, setRegret] = useState<RegretType>('first_love');
  const [era, setEra] = useState<ReturnEra>('high_school');
  const [name, setName] = useState('');
  const [starting, setStarting] = useState(false);

  const isLast = step === STEPS.length - 1;

  const next = async () => {
    if (!isLast) {
      setStep(step + 1);
      return;
    }
    if (starting) return;
    setStarting(true);
    const profile: UserProfile = {
      id: `local-${Date.now()}`,
      persona,
      regret,
      returnEra: era,
      name: name.trim() || '회귀자',
      isPremium: false,
    };
    await saveProfile(profile);
    await startSession(profile);
    router.replace('/play');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.progress}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i <= step && styles.dotActive]} />
          ))}
        </View>

        <Text style={styles.question}>{STEPS[step]}</Text>

        <View style={styles.options}>
          {step === 0 &&
            PERSONAS.map((p) => (
              <OptionRow
                key={p.value}
                label={p.label}
                selected={persona === p.value}
                onPress={() => setPersona(p.value)}
              />
            ))}
          {step === 1 &&
            REGRETS.map((r) => (
              <OptionRow
                key={r.value}
                label={r.label}
                selected={regret === r.value}
                onPress={() => setRegret(r.value)}
              />
            ))}
          {step === 2 &&
            ERAS.map((e) => (
              <OptionRow
                key={e.value}
                label={e.label}
                selected={era === e.value}
                onPress={() => setEra(e.value)}
              />
            ))}
          {step === 3 && (
            <>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="회귀자"
                placeholderTextColor={colors.textFaint}
                maxLength={10}
                autoFocus
              />
              <Text style={styles.hint}>비워두면 '회귀자'로 불립니다</Text>
            </>
          )}
        </View>

        <View style={styles.footer}>
          {step > 0 && (
            <Pressable style={styles.backButton} onPress={() => setStep(step - 1)}>
              <Text style={styles.backText}>이전</Text>
            </Pressable>
          )}
          <Pressable
            style={[styles.nextButton, starting && { opacity: 0.6 }]}
            onPress={() => void next()}
            disabled={starting}
          >
            <Text style={styles.nextText}>{isLast ? '회귀 시작하기' : '다음'}</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1, padding: spacing.lg },
  progress: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  dot: { width: 28, height: 3, borderRadius: 2, backgroundColor: colors.border },
  dotActive: { backgroundColor: colors.gold },
  question: { ...typography.title, marginBottom: spacing.lg },
  options: { flex: 1, gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: spacing.md,
  },
  optionSelected: { borderColor: colors.gold, backgroundColor: colors.surfaceRaised },
  radio: { color: colors.textFaint, fontSize: 14 },
  radioSelected: { color: colors.gold },
  optionText: { color: colors.textMuted, fontSize: 16, flex: 1 },
  optionTextSelected: { color: colors.text },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.gold,
    borderRadius: 10,
    padding: spacing.md,
    color: colors.text,
    fontSize: 18,
  },
  hint: { ...typography.caption, marginTop: spacing.xs },
  footer: { flexDirection: 'row', gap: spacing.sm, paddingTop: spacing.md },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  backText: { color: colors.textMuted, fontSize: 16 },
  nextButton: {
    flex: 1,
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  nextText: { color: '#0A0A0A', fontSize: 17, fontWeight: '700' },
});
