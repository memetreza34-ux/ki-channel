export const ASTRA_COLORS = {
  background: '#F7F7F5',
  surface: '#FFFFFF',
  ink: '#1A1A2E',
  purple: '#6E45C9',
  lavender: '#B98CFF',
  muted: '#6F7282',
  line: '#D8D9E2',
  risk: '#D84A4A',
  positive: '#2E8B57',
  softPurple: '#EFE7FF',
  softRisk: '#FCE8E8',
  softPositive: '#E6F4EC',
} as const;

export const ASTRA_FONT_STACK = 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif';

export const ASTRA_LAYOUT = {
  edge: 104,
  contentWidth: 1712,
  titleMax: 1220,
  proofRadius: 32,
  cardRadius: 26,
} as const;

export const accentColor = (accent?: 'PURPLE' | 'RISK' | 'POSITIVE' | 'NEUTRAL') => {
  if (accent === 'RISK') return ASTRA_COLORS.risk;
  if (accent === 'POSITIVE') return ASTRA_COLORS.positive;
  if (accent === 'NEUTRAL') return ASTRA_COLORS.muted;
  return ASTRA_COLORS.purple;
};
