import { View, Text, StyleSheet } from 'react-native';
import { STATUS_META } from '../theme';

// hex (#rrggbb) → rgba string at the given alpha
function rgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

interface Props {
  status: string;          // draft | sent | approved | overdue | pending | paid
  size?: number;           // font size override (default 8.8)
}

export default function StatusPill({ status, size = 8.8 }: Props) {
  const meta = STATUS_META[status] || { label: status, color: '#888888' };
  return (
    <View style={[styles.pill, { borderColor: rgba(meta.color, 0.38), backgroundColor: rgba(meta.color, 0.08) }]}>
      <View style={[styles.dot, { backgroundColor: meta.color }]} />
      <Text style={[styles.label, { color: meta.color, fontSize: size }]}>{meta.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  label: {
    fontFamily: 'IBMPlexSans_500Medium',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
});
