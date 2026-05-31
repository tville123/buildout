import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { C } from '../theme';
import type { Client } from '../types';
import { money0 } from '../utils/format';
import Avatar from './Avatar';

interface Props {
  client: Client;
  lastJob: string;
  billed: number;
  jobCount: number;
  onPress: () => void;
}

export default function ClientCard({ client, lastJob, billed, jobCount, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <Avatar initials={client.initials} size={42} />
      <View style={styles.mid}>
        <Text style={styles.name} numberOfLines={1}>{client.name}</Text>
        <Text style={styles.last} numberOfLines={1}>{lastJob || 'No jobs yet'}</Text>
      </View>
      <View style={styles.right}>
        <Text style={styles.billed}>{money0(billed)}</Text>
        <Text style={styles.jobs}>{jobCount} job{jobCount === 1 ? '' : 's'}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', gap: 13, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 13, paddingHorizontal: 14, marginBottom: 8 },
  mid: { flex: 1, minWidth: 0 },
  name: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 14.5, color: C.text },
  last: { fontFamily: 'IBMPlexSans_300Light', fontSize: 11.5, color: C.textMid, marginTop: 2 },
  right: { alignItems: 'flex-end', gap: 4 },
  billed: { fontFamily: 'IBMPlexMono_500Medium', fontSize: 13.5, color: C.yellow },
  jobs: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 9, letterSpacing: 0.6, textTransform: 'uppercase', color: C.textDim },
});
