import { Text } from 'react-native';
import s from '../styles';

interface Props {
  text: string;
}

export default function SectionLabel({ text }: Props) {
  return <Text style={s.sectionLabel}>{text}</Text>;
}
