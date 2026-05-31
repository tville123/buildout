import { View, Text, TouchableOpacity } from 'react-native';
import s from '../styles';

interface SegControlOption<T> {
  value: T;
  label: string;
  badge?: number;
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
      {options.map(opt => {
        const isActive = active === opt.value;
        return (
          <TouchableOpacity
            key={String(opt.value)}
            style={[s.segBtn, isActive && s.segBtnActive]}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.8}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Text style={[s.segBtnText, isActive && s.segBtnTextActive]}>
                {opt.label}
              </Text>
              {opt.badge !== undefined && (
                <Text style={[s.segBtnText, isActive && s.segBtnTextActive, { fontSize: 10.5, opacity: 0.7 }]}>
                  {opt.badge}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
