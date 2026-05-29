import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Platform, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { QuoteStackParamList } from '../App';
import { useQuote } from '../context/QuoteContext';
import { usePaid, usePaidActions } from '../context/PaidContext';
import { navigateToSettings } from '../navigationRef';
import TopBar from '../components/TopBar';
import SectionLabel from '../components/SectionLabel';
import LineItemSheet from '../components/LineItemSheet';
import PaywallSheet from '../components/PaywallSheet';
import { C } from '../theme';
import type { LineItem } from '../types';
import { uuid } from '../utils/uuid';
import { formatMoney as money } from '../utils/format';

type Props = NativeStackScreenProps<QuoteStackParamList, 'QuoteBuilder'>;

export default function QuoteBuilderScreen({ navigation, route }: Props) {
  const { quoteId } = route.params;
  const { getQuote, updateQuote } = useQuote();
  const isPaid = usePaid();
  const { purchase } = usePaidActions();

  // Always read fresh from context — this picks up AddToQuote additions automatically
  const quote = getQuote(quoteId);

  const [clientName, setClientName] = useState(quote?.clientName ?? '');
  const [jobDesc, setJobDesc] = useState(quote?.jobDescription ?? '');
  const [taxRate, setTaxRate] = useState(String(quote?.taxRate ?? 8.25));
  const [editingItem, setEditingItem] = useState<LineItem | undefined>(undefined);
  const [showLineSheet, setShowLineSheet] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Line items come directly from context (updated by AddToQuote from calc screens)
  const lineItems = quote?.lineItems ?? [];

  const saveFields = () => {
    updateQuote(quoteId, {
      clientName,
      jobDescription: jobDesc,
      taxRate: parseFloat(taxRate) || 8.25,
    });
  };

  const openNewItem = () => {
    setEditingItem(undefined);
    setShowLineSheet(true);
  };

  const openEditItem = (item: LineItem) => {
    setEditingItem(item);
    setShowLineSheet(true);
  };

  const handleSaveItem = (data: Omit<LineItem, 'id'>) => {
    setShowLineSheet(false);
    const newItems = editingItem
      ? lineItems.map(i => i.id === editingItem.id ? { ...data, id: editingItem.id } : i)
      : [...lineItems, { ...data, id: uuid() }];
    updateQuote(quoteId, { lineItems: newItems });
  };

  const handleExport = () => {
    saveFields();
    if (isPaid) {
      navigation.push('PDFPreview', { quoteId });
    } else {
      setShowPaywall(true);
    }
  };

  const subtotal = lineItems.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
  const taxNum = parseFloat(taxRate) || 0;
  const tax = subtotal * (taxNum / 100);
  const grand = subtotal + tax;

  if (!quote) {
    return (
      <View style={styles.container}>
        <TopBar tag="Quote" onBack={() => navigation.goBack()} actions={[]} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TopBar
        tag={clientName || 'New Quote'}
        onBack={() => { saveFields(); navigation.goBack(); }}
        actions={['share', 'more']}
        onActionPress={(action) => {
          if (action === 'settings') navigateToSettings();
        }}
      />

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={styles.meta}>
          <TextInput
            style={styles.clientInput}
            value={clientName}
            onChangeText={setClientName}
            onBlur={saveFields}
            placeholder="Client name"
            placeholderTextColor={C.textDim}
          />
          <TextInput
            style={styles.jobInput}
            value={jobDesc}
            onChangeText={setJobDesc}
            onBlur={saveFields}
            placeholder="Job description"
            placeholderTextColor={C.textDim}
          />
        </View>

        <View style={styles.section}>
          <SectionLabel text="01 — Line Items" />
          {lineItems.map(item => {
            const itemTotal = item.quantity * item.unitPrice;
            return (
              <TouchableOpacity key={item.id} style={styles.lineItem} onPress={() => openEditItem(item)} activeOpacity={0.7}>
                <View style={styles.liRow1}>
                  <Text style={styles.liDesc} numberOfLines={1}>{item.description}</Text>
                  <Text style={styles.liTotal}>{money(itemTotal)}</Text>
                </View>
                <View style={styles.liRow2}>
                  <Text style={styles.liQtyPrice}>{item.quantity} × {money(item.unitPrice)}</Text>
                  {item.source ? (
                    <View style={styles.liSrcPill}>
                      <Text style={styles.liSrcText}>{item.source} →</Text>
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity style={styles.addItemBtn} onPress={openNewItem} activeOpacity={0.7}>
            <Text style={styles.addItemPlus}>+</Text>
            <Text style={styles.addItemText}>Add line item</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <SectionLabel text="02 — Tax + Total" />
          <View style={styles.totals}>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal</Text>
              <Text style={styles.totalsVal}>{money(subtotal)}</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Tax</Text>
              <View style={styles.taxRow}>
                <TextInput
                  style={styles.taxInput}
                  value={taxRate}
                  onChangeText={setTaxRate}
                  onBlur={saveFields}
                  keyboardType="decimal-pad"
                />
                <Text style={styles.taxPct}>%</Text>
                <Text style={[styles.totalsVal, { marginLeft: 12 }]}>{money(tax)}</Text>
              </View>
            </View>
            <View style={[styles.totalsRow, styles.totalsGrand]}>
              <Text style={[styles.totalsLabel, { color: C.yellow, letterSpacing: 1.2 }]}>Total</Text>
              <Text style={styles.totalsGrandVal}>{money(grand)}</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      <TouchableOpacity
        style={[styles.exportBtn, !isPaid && styles.exportBtnLocked]}
        onPress={handleExport}
        activeOpacity={0.85}
      >
        <View style={styles.exportLeft}>
          <Text style={[styles.exportEyebrow, !isPaid && styles.exportEyebrowLocked]}>{isPaid ? 'Generate' : 'Pro feature'}</Text>
          <Text style={[styles.exportLabel, !isPaid && styles.exportLabelLocked]}>{isPaid ? 'Export PDF & Send' : 'Export PDF — unlock'}</Text>
        </View>
        <Ionicons
          name={isPaid ? 'share-outline' : 'lock-closed-outline'}
          size={20}
          color={isPaid ? '#000' : C.textMid}
        />
      </TouchableOpacity>

      <LineItemSheet
        visible={showLineSheet}
        item={editingItem}
        onClose={() => setShowLineSheet(false)}
        onSave={handleSaveItem}
      />
      <PaywallSheet
        visible={showPaywall}
        onUnlock={async () => {
          const success = await purchase();
          if (success) {
            setShowPaywall(false);
            navigation.push('PDFPreview', { quoteId });
          }
        }}
        onSkip={() => setShowPaywall(false)}
      />
    </KeyboardAvoidingView>
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
  scrollContent: {
    paddingBottom: 60,
  },
  meta: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 4,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 4,
  },
  clientInput: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 20,
    color: C.text,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 8,
    padding: 0,
  },
  jobInput: {
    fontFamily: 'IBMPlexSans_300Light',
    fontSize: 13,
    color: C.text,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingBottom: 10,
    padding: 0,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 22,
  },
  lineItem: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    gap: 6,
  },
  liRow1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  liDesc: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 13.5,
    color: C.text,
    flex: 1,
  },
  liTotal: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 13.5,
    color: C.yellow,
  },
  liRow2: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  liQtyPrice: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 11,
    color: C.textDim,
  },
  liSrcPill: {
    backgroundColor: 'rgba(245,200,66,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.15)',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  liSrcText: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 9,
    color: C.yellow,
    letterSpacing: 0.5,
  },
  addItemBtn: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: C.border,
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  addItemPlus: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 16,
    color: C.textMid,
  },
  addItemText: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 13,
    color: C.textMid,
  },
  totals: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  totalsLabel: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 12,
    color: C.textMid,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  totalsVal: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 13,
    color: C.text,
  },
  taxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taxInput: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 13,
    color: C.text,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    padding: 0,
    minWidth: 36,
    textAlign: 'right',
  },
  taxPct: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    color: C.textDim,
    marginLeft: 2,
  },
  totalsGrand: {
    borderBottomWidth: 0,
    paddingVertical: 16,
  },
  totalsGrandVal: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 36,
    color: C.yellow,
    letterSpacing: 1,
  },
  exportBtn: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.yellow,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exportBtnLocked: {
    backgroundColor: C.surface,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  exportLeft: {
    gap: 2,
  },
  exportEyebrow: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 9.6,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: 'rgba(0,0,0,0.5)',
  },
  exportEyebrowLocked: {
    color: C.textDim,
  },
  exportLabel: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 15,
    color: '#000',
  },
  exportLabelLocked: {
    color: C.textMid,
  },
});
