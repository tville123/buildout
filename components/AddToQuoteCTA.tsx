import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';

interface AddToQuoteCTAProps {
  onPress: () => void;
  label?: string;
}

export default function AddToQuoteCTA({ onPress, label = 'Add to Quote' }: AddToQuoteCTAProps) {
  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.left}>
        <Text style={styles.eyebrow}>From this estimate</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.icon}>
        <Ionicons name="add-outline" size={22} color={C.yellow} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginHorizontal: 24,
    marginTop: 10,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.yellow,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    gap: 3,
  },
  eyebrow: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 9.6,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: C.textDim,
  },
  label: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 14,
    color: C.yellow,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(245,200,66,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
