import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';

interface Props {
  title: string;
  sub: string;
  onPress: () => void;
}

export default function QuickCreateCard({ title, sub, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.ico}>
        <Ionicons name="add" size={17} color={C.yellow} />
      </View>
      <View style={styles.txt}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>{sub}</Text>
      </View>
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
    paddingVertical: 16,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  ico: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: 'rgba(245,200,66,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    flex: 1,
  },
  title: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 13,
    color: C.text,
  },
  sub: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9.2,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: C.textDim,
    marginTop: 2,
  },
});
