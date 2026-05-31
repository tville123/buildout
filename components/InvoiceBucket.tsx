import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import { money0 } from '../utils/format';

interface Props {
  title: string;
  color: string;
  count: number;
  sum: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function InvoiceBucket({ title, color, count, sum, defaultOpen = true, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={styles.bucket}>
      <TouchableOpacity style={styles.head} onPress={() => setOpen(o => !o)} activeOpacity={0.7}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>{count}</Text>
        <Text style={[styles.sum, { color }]}>{money0(sum)}</Text>
        <Ionicons name="chevron-forward" size={14} color={C.textDim} style={open ? styles.chevOpen : undefined} />
      </TouchableOpacity>
      {open && count > 0 && <View>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  bucket: { marginHorizontal: 24, marginTop: 14 },
  head: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 6, paddingBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  title: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 11, letterSpacing: 1.9, textTransform: 'uppercase', color: C.text },
  count: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 10, color: C.textDim },
  sum: { fontFamily: 'IBMPlexMono_500Medium', fontSize: 12, marginLeft: 'auto', marginRight: 4 },
  chevOpen: { transform: [{ rotate: '90deg' }] },
});
