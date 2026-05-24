import { View, Text, TouchableOpacity } from 'react-native';
import s from '../styles';

interface SegControlOption<T> {
  value: T;
  label: string;
}

interface SegControlProps<T extends string | number> {
  options: SegControlOption<T>[];
  active: T;
  onSelect: (value: T) => void;
}

export default function SegControl<T extends string | number>({
  options,
  active,
  onSelect,
}: SegControlProps<T>) {
  return (
    <View style={s.segControl}>
      {options.map(opt => (
        <TouchableOpacity
          key={String(opt.value)}
          style={[s.segBtn, active === opt.value && s.segBtnActive]}
          onPress={() => onSelect(opt.value)}
          activeOpacity={0.8}
        >
          <Text style={[s.segBtnText, active === opt.value && s.segBtnTextActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
