// 벡터 일러스트 — 다크+골드 라인아트. 시나리오별 커버와 홈 엠블럼.

import { View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Polyline,
  Rect,
  Stop,
} from 'react-native-svg';
import { colors } from '@/lib/theme';

const GOLD = colors.gold;
const GOLD_DIM = colors.goldDim;
const FAINT = '#3A3A3A';

function GoldGradient({ id }: { id: string }) {
  return (
    <LinearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <Stop offset="0" stopColor={GOLD} stopOpacity="0.9" />
      <Stop offset="1" stopColor={GOLD_DIM} stopOpacity="0.5" />
    </LinearGradient>
  );
}

/** 홈 엠블럼 — 回 모티브: 겹쳐진 사각 회로와 시곗바늘 */
export function HeroEmblem({ size = 140 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <GoldGradient id="hero" />
      </Defs>
      <Rect x="10" y="10" width="80" height="80" rx="10" stroke="url(#hero)" strokeWidth="2" fill="none" />
      <Rect x="26" y="26" width="48" height="48" rx="6" stroke={GOLD_DIM} strokeWidth="1.5" fill="none" />
      {/* 회귀의 나선 */}
      <Path
        d="M50 50 m0 -16 a16 16 0 1 1 -11.3 4.7 M50 50 m0 -9 a9 9 0 1 0 6.4 2.6"
        stroke={GOLD}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      {/* 시곗바늘 — 거꾸로 도는 시간 */}
      <Line x1="50" y1="50" x2="50" y2="38" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
      <Line x1="50" y1="50" x2="41" y2="55" stroke={GOLD} strokeWidth="2" strokeLinecap="round" />
      <Circle cx="50" cy="50" r="2.2" fill={GOLD} />
      {/* 모서리 별 */}
      <Circle cx="18" cy="18" r="1.4" fill={GOLD_DIM} />
      <Circle cx="82" cy="82" r="1.4" fill={GOLD_DIM} />
    </Svg>
  );
}

/** 시나리오 1 '두 번째 인생' — 노을 지는 교실 창과 책상 */
function CoverFirstLove({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <GoldGradient id="c1" />
      </Defs>
      <Rect x="8" y="8" width="84" height="84" rx="8" fill={colors.surfaceRaised} />
      {/* 창문 */}
      <Rect x="22" y="18" width="56" height="40" rx="3" stroke="url(#c1)" strokeWidth="2" fill="none" />
      <Line x1="50" y1="18" x2="50" y2="58" stroke={GOLD_DIM} strokeWidth="1.5" />
      <Line x1="22" y1="38" x2="78" y2="38" stroke={GOLD_DIM} strokeWidth="1.5" />
      {/* 창밖의 해 */}
      <Circle cx="63" cy="30" r="6" stroke={GOLD} strokeWidth="1.6" fill="none" />
      <Line x1="63" y1="20.5" x2="63" y2="23" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
      <Line x1="71" y1="30" x2="73.5" y2="30" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
      {/* 책상 두 개 — 앞자리와 내 자리 */}
      <Rect x="26" y="68" width="20" height="3" rx="1.5" fill={GOLD} />
      <Line x1="29" y1="71" x2="29" y2="82" stroke={GOLD_DIM} strokeWidth="2" strokeLinecap="round" />
      <Line x1="43" y1="71" x2="43" y2="82" stroke={GOLD_DIM} strokeWidth="2" strokeLinecap="round" />
      <Rect x="54" y="68" width="20" height="3" rx="1.5" fill={GOLD_DIM} />
      <Line x1="57" y1="71" x2="57" y2="82" stroke={FAINT} strokeWidth="2" strokeLinecap="round" />
      <Line x1="71" y1="71" x2="71" y2="82" stroke={FAINT} strokeWidth="2" strokeLinecap="round" />
    </Svg>
  );
}

/** 시나리오 2 '재도전' — 갈림길과 별 */
function CoverRetry({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <GoldGradient id="c2" />
      </Defs>
      <Rect x="8" y="8" width="84" height="84" rx="8" fill={colors.surfaceRaised} />
      {/* 두 갈래 길 */}
      <Path d="M50 86 C50 70 38 62 30 44 C26 35 25 28 26 22" stroke={FAINT} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <Path d="M50 86 C50 68 60 60 68 42 C72 33 73 27 72 21" stroke="url(#c2)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* 길 위의 점선 */}
      <Path d="M50 80 C50 70 56 64 61 52" stroke={GOLD} strokeWidth="1" fill="none" strokeDasharray="2 4" />
      {/* 빛나는 별 — 선택한 길의 끝 */}
      <G>
        <Line x1="72" y1="12" x2="72" y2="22" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
        <Line x1="67" y1="17" x2="77" y2="17" stroke={GOLD} strokeWidth="1.6" strokeLinecap="round" />
        <Circle cx="72" cy="17" r="2" fill={GOLD} />
      </G>
      <Circle cx="26" cy="18" r="1.5" fill={FAINT} />
    </Svg>
  );
}

/** 시나리오 3 '되갚는 시간' — 펼친 수첩과 떠오르는 빛 */
function CoverPayback({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <GoldGradient id="c3" />
      </Defs>
      <Rect x="8" y="8" width="84" height="84" rx="8" fill={colors.surfaceRaised} />
      {/* 펼친 수첩 */}
      <Path d="M22 70 C32 64 44 64 50 68 C56 64 68 64 78 70 L78 38 C68 32 56 32 50 36 C44 32 32 32 22 38 Z" stroke="url(#c3)" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <Line x1="50" y1="36" x2="50" y2="68" stroke={GOLD_DIM} strokeWidth="1.5" />
      {/* 기록된 줄들 */}
      <Line x1="28" y1="44" x2="44" y2="41" stroke={GOLD_DIM} strokeWidth="1.2" strokeLinecap="round" />
      <Line x1="28" y1="51" x2="44" y2="48" stroke={GOLD_DIM} strokeWidth="1.2" strokeLinecap="round" />
      <Line x1="28" y1="58" x2="40" y2="55.7" stroke={GOLD_DIM} strokeWidth="1.2" strokeLinecap="round" />
      <Polyline points="56,46 59,50 66,40" stroke={GOLD} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {/* 떠오르는 빛 */}
      <Circle cx="50" cy="22" r="4" stroke={GOLD} strokeWidth="1.6" fill="none" />
      <Line x1="50" y1="14" x2="50" y2="16" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
      <Line x1="58" y1="22" x2="60" y2="22" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
      <Line x1="40" y1="22" x2="42" y2="22" stroke={GOLD} strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  );
}

/** AI 회귀록 — 무한 나선 */
function CoverAi({ size }: { size: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <GoldGradient id="c4" />
      </Defs>
      <Rect x="8" y="8" width="84" height="84" rx="8" fill={colors.surfaceRaised} />
      <Path
        d="M50 50 m0 -28 a28 28 0 1 1 -19.8 8.2 M50 50 m0 -18 a18 18 0 1 0 12.7 5.3 M50 50 m0 -8 a8 8 0 1 1 -5.7 2.3"
        stroke="url(#c4)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx="50" cy="50" r="2" fill={GOLD} />
    </Svg>
  );
}

/** 프리셋/모드별 커버 일러스트 */
export function ScenarioCover({
  presetId,
  mode = 'preset',
  size = 72,
}: {
  presetId: string;
  mode?: 'preset' | 'ai';
  size?: number;
}) {
  let art: React.ReactNode;
  if (mode === 'ai') art = <CoverAi size={size} />;
  else if (presetId === 'preset-jobseeker-retry') art = <CoverRetry size={size} />;
  else if (presetId === 'preset-bullied-payback') art = <CoverPayback size={size} />;
  else art = <CoverFirstLove size={size} />;
  return <View style={{ width: size, height: size }}>{art}</View>;
}
