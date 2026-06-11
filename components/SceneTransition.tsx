import { useEffect, useRef } from 'react';
import { Animated, type ViewStyle } from 'react-native';

interface Props {
  /** 값이 바뀔 때마다 페이드 전환을 다시 재생한다 (장면 키) */
  sceneKey: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

/** 장면이 바뀔 때 페이드 인 + 살짝 위로 떠오르는 전환 효과 */
export default function SceneTransition({ sceneKey, children, style }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    opacity.setValue(0);
    translateY.setValue(12);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start();
  }, [sceneKey, opacity, translateY]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
