import { Text } from 'react-native';
import s from '../styles';

export default function SectionLabel({ text }) {
  return <Text style={s.sectionLabel}>{text}</Text>;
}
