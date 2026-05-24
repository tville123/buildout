import { View, Text } from 'react-native';
import s from '../styles';

interface Props {
  tag: string;
  mainValue: string;
  unit: string;
  breakdownItems: Array<{ value: string; label: string }>;
}

export default function ResultCard({ tag, mainValue, unit, breakdownItems }: Props) {
  return (
    <View style={s.resultCard}>
      <Text style={s.resultTag}>{tag}</Text>
      <Text style={s.resultMain}>{mainValue} <Text style={s.resultUnit}>{unit}</Text></Text>
      <View style={s.resultDivider} />
      <View style={s.resultBreakdown}>
        {breakdownItems.map((item, i) => (
          <View key={i}>
            <Text style={s.breakdownVal}>{item.value}</Text>
            <Text style={s.breakdownLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
