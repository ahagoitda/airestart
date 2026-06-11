import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { typography } from '@/lib/theme';

interface Props {
  text: string;
  /** 틱당 출력 간격(ms) */
  speed?: number;
  onComplete?: () => void;
  /** 글자가 출력될 때마다 호출 (자동 스크롤용) */
  onProgress?: () => void;
}

/**
 * 한 글자씩 출력되는 타이핑 애니메이션 텍스트. 탭하면 전체를 즉시 표시한다.
 * 긴 본문도 12초 안에 끝나도록 틱당 글자 수를 본문 길이에 맞춰 늘린다.
 */
export default function TypewriterText({
  text,
  speed = 24,
  onComplete,
  onProgress,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const done = visibleCount >= text.length;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const onProgressRef = useRef(onProgress);
  onProgressRef.current = onProgress;

  useEffect(() => {
    setVisibleCount(0);
    // 본문 전체가 최대 ~12초 안에 출력되도록 틱당 글자 수 조절
    const maxTicks = 12000 / speed;
    const step = Math.max(1, Math.ceil(text.length / maxTicks));
    const timer = setInterval(() => {
      setVisibleCount((count) => {
        if (count >= text.length) {
          clearInterval(timer);
          return count;
        }
        return Math.min(count + step, text.length);
      });
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  useEffect(() => {
    if (visibleCount > 0 && !done) onProgressRef.current?.();
  }, [visibleCount, done]);

  useEffect(() => {
    if (done) onCompleteRef.current?.();
  }, [done]);

  const skip = () => setVisibleCount(text.length);

  return (
    <Pressable onPress={skip} disabled={done}>
      <Text style={styles.text}>
        {text.slice(0, visibleCount)}
        {!done && <Text style={styles.cursor}>▌</Text>}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: typography.body,
  cursor: { opacity: 0.6 },
});
