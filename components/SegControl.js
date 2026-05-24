import { View, Text, TouchableOpacity } from 'react-native';
import s from '../styles';

export default function SegControl({ options, active, onSelect }) {
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
