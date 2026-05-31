import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import { money0, relDate } from '../utils/format';
import type { ActivityItem } from '../utils/workspace';

interface Props {
  item: ActivityItem;
  clientName: string;
  isLast: boolean;
  onPress: () => void;
}

export default function ActivityRow({ item, clientName, isLast, onPress }: Props) {
  return (
    <TouchableOpacity style={[styles.row, isLast && styles.rowLast]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.ico}>
        <Ionicons
          name={item.kind === 'invoice' ? 'receipt-outline' : 'document-text-outline'}
          size={15}
          color={C.textMid}
        />
      </View>
      <View style={styles.mid}>
        <Text style={styles.client} numberOfLines={1}>{clientName}</Text>
        <Text style={styles.job} numberOfLines={1}>{item.job || 'No description'}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.amt}>{money0(item.amount)}</Text>
        <Text style={styles.date}>{relDate(item.ts)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  ico: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mid: {
    flex: 1,
    minWidth: 0,
  },
  client: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 13.5,
    color: C.text,
  },
  job: {
    fontFamily: 'IBMPlexSans_300Light',
    fontSize: 11,
    color: C.textMid,
    marginTop: 1,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amt: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 13.5,
    color: C.yellow,
  },
  date: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    letterSpacing: 0.4,
    color: C.textDim,
  },
});
