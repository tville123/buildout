import { View, Text, StyleSheet } from 'react-native';
import { C } from '../theme';

interface Props {
  initials: string;
  size?: number;       // box size (default 42)
  fontSize?: number;   // default size * 0.43
}

export default function Avatar({ initials, size = 42, fontSize }: Props) {
  return (
    <View style={[styles.box, { width: size, height: size, borderRadius: size * 0.26 }]}>
      <Text style={[styles.text, { fontSize: fontSize ?? size * 0.43 }]}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: 'rgba(245,200,66,0.08)',
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'BebasNeue_400Regular',
    letterSpacing: 1,
    color: C.yellow,
  },
});
