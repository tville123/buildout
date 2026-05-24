import { View, Text, TouchableOpacity } from 'react-native';
import s from '../styles';

interface Props {
  label: string;
  sub?: string;
  active: boolean;
  onPress: () => void;
}

export default function ToggleChip({ label, sub, active, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[s.toggleChip, active && s.toggleChipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[s.chipCheck, active && s.chipCheckActive]}>
        {active ? <Text style={s.chipCheckMark}>✓</Text> : null}
      </View>
      <View>
        <Text style={[s.chipLabel, active && s.chipLabelActive]}>{label}</Text>
        {sub ? <Text style={s.chipSub}>{sub}</Text> : null}
      </View>
    </TouchableOpacity>
  );
}
