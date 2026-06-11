import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { typography } from '@/lib/theme';

interface Props {
  text: string;
  /** 글자당 출력 간격(ms) */
  speed?: number;
  onComplete?: () => void;
}

/** 한 글자씩 출력되는 타이핑 애니메이션 텍스트. 탭하면 전체를 즉시 표시한다. */
export default function TypewriterText({ text, speed = 35, onComplete }: Props) {
  const [visibleCount, setVisibleCount] = useState(0);
  const done = visibleCount >= text.length;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setVisibleCount(0);
    const timer = setInterval(() => {
      setVisibleCount((count) => {
        if (count >= text.length) {
          clearInterval(timer);
          return count;
        }
        return count + 1;
      });
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

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
