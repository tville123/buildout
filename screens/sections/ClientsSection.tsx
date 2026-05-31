import { useMemo, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { QuoteStackParamList } from '../../App';
import { useWorkspace } from '../../context/WorkspaceContext';
import { C } from '../../theme';
import ClientCard from '../../components/ClientCard';

type Nav = NativeStackNavigationProp<QuoteStackParamList, 'Workspace'>;

export default function ClientsSection({ navigation }: { navigation: Nav }) {
  const { clients, clientTotals } = useWorkspace();
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);

  // Pre-compute all totals once when clients/quotes/invoices change to avoid O(n²) per render.
  const totalsMap = useMemo(
    () => new Map(clients.map(c => [c.id, clientTotals(c.id)])),
     
    [clients, clientTotals]);

  const sorted = [...clients].sort((a, b) => a.name.localeCompare(b.name));
  const shown = query.trim()
    ? sorted.filter(c => c.name.toLowerCase().includes(query.trim().toLowerCase()))
    : sorted;

  return (
    <View style={{ flex: 1 }}>
      <View style={[styles.search, focused && styles.searchFocused]}>
        <Ionicons name="search-outline" size={16} color={C.textDim} />
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search clients"
          placeholderTextColor={C.textDim}
        />
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.newBtn} onPress={() => navigation.push('AddClient')} activeOpacity={0.7}>
          <Ionicons name="add" size={16} color={C.textMid} />
          <Text style={styles.newBtnText}>Add Client</Text>
        </TouchableOpacity>

        {shown.length > 0 ? shown.map(c => {
          const t = totalsMap.get(c.id)!;
          const lastJob = t.quotes[0]?.job ?? t.invoices[0]?.job ?? '';
          return (
            <ClientCard
              key={c.id}
              client={c}
              lastJob={lastJob}
              billed={t.invoiced}
              jobCount={t.jobCount}
              onPress={() => navigation.push('ClientDetail', { clientId: c.id })}
            />
          );
        }) : (
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={26} color={C.textDim} />
            <Text style={styles.emptyText}>
              {query.trim() ? 'No clients match that search.' : 'Add your first client to track jobs and billing.'}
            </Text>
          </View>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 9, marginHorizontal: 24, marginTop: 16, marginBottom: 6, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 13, paddingVertical: 11 },
  searchFocused: { borderColor: C.yellow },
  searchInput: { flex: 1, fontFamily: 'IBMPlexSans_400Regular', fontSize: 13.5, color: C.text, padding: 0 },
  list: { paddingHorizontal: 24, paddingTop: 10 },
  newBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, borderRadius: 10, paddingVertical: 14, marginBottom: 8 },
  newBtnText: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 13, color: C.textMid },
  empty: { marginTop: 40, alignItems: 'center', gap: 14, padding: 40, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, borderRadius: 14 },
  emptyText: { fontFamily: 'IBMPlexSans_300Light', fontSize: 12.5, color: C.textDim, textAlign: 'center', lineHeight: 19 },
});
