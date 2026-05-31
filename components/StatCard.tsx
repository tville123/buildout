import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';

interface Props {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  num: number | string;
  label: string;
  sub: string;
  onPress: () => void;
}

export default function StatCard({ icon, color, num, label, sub, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.top}>
        <Ionicons name={icon} size={13} color={color} />
      </View>
      <Text style={[styles.num, { color }]}>{num}</Text>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.sub}>{sub}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 13,
    paddingBottom: 12,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  num: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 30,
    lineHeight: 30,
    letterSpacing: 1,
  },
  label: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 9.2,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    color: C.textMid,
    marginTop: 5,
  },
  sub: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9.5,
    color: C.textDim,
    marginTop: 3,
  },
});
