import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import type { QuoteStackParamList } from '../App';
import { useQuote } from '../context/QuoteContext';
import { navigateToSettings } from '../navigationRef';
import TopBar from '../components/TopBar';
import QuoteCard from '../components/QuoteCard';
import { C } from '../theme';

type Props = NativeStackScreenProps<QuoteStackParamList, 'QuoteHistory'>;

export default function QuoteHistoryScreen({ navigation }: Props) {
  const { quotes, createQuote } = useQuote();

  const handleNew = () => {
    const q = createQuote();
    navigation.push('QuoteBuilder', { quoteId: q.id });
  };

  const handleOpen = (id: string) => {
    navigation.push('QuoteBuilder', { quoteId: id });
  };

  return (
    <View style={styles.container}>
      <TopBar
        tag="Quote · History"
        actions={['settings', 'more']}
        onActionPress={(action) => {
          if (action === 'settings') navigateToSettings();
        }}
      />
      <ScrollView style={styles.scroll} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {quotes.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🗂</Text>
            <Text style={styles.emptyText}>No quotes yet.{'\n'}Tap + to start one.</Text>
          </View>
        ) : (
          quotes.map(q => (
            <QuoteCard key={q.id} quote={q} onPress={() => handleOpen(q.id)} />
          ))
        )}
        <View style={{ height: 100 }} />
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={handleNew} activeOpacity={0.8}>
        <Ionicons name="add-outline" size={28} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flex: 1,
  },
  list: {
    padding: 16,
    gap: 10,
  },
  empty: {
    marginTop: 80,
    alignItems: 'center',
    gap: 12,
  },
  emptyIcon: {
    fontSize: 40,
    opacity: 0.3,
  },
  emptyText: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 14,
    color: C.textDim,
    textAlign: 'center',
    lineHeight: 22,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
