// 다크 테마 (검정 + 회색 + 금색 accent)

export const colors = {
  background: '#0A0A0A',
  surface: '#161616',
  surfaceRaised: '#1F1F1F',
  border: '#2A2A2A',
  text: '#E8E8E8',
  textMuted: '#9A9A9A',
  textFaint: '#5C5C5C',
  gold: '#D4AF37',
  goldDim: '#8A7223',
  danger: '#C0463E',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const typography = {
  title: { fontSize: 24, fontWeight: '700' as const, color: colors.text },
  subtitle: { fontSize: 16, color: colors.textMuted },
  body: { fontSize: 17, lineHeight: 28, color: colors.text },
  caption: { fontSize: 13, color: colors.textFaint },
} as const;
