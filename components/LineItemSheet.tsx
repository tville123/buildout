import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal,
  TextInput, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { C } from '../theme';
import type { LineItem } from '../types';

interface LineItemSheetProps {
  visible: boolean;
  item?: LineItem;
  onClose: () => void;
  onSave: (item: Omit<LineItem, 'id'>) => void;
}

export default function LineItemSheet({ visible, item, onClose, onSave }: LineItemSheetProps) {
  const [desc, setDesc] = useState('');
  const [qty, setQty] = useState('1');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (visible) {
      setDesc(item?.description ?? '');
      setQty(String(item?.quantity ?? 1));
      setPrice(item ? String(item.unitPrice) : '');
    }
  }, [visible, item]);

  const total = (parseFloat(qty) || 0) * (parseFloat(price) || 0);

  const handleSave = () => {
    if (!desc.trim()) return;
    onSave({
      description: desc.trim(),
      quantity: parseFloat(qty) || 1,
      unitPrice: parseFloat(price) || 0,
      source: item?.source,
    });
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={onClose} />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <View style={styles.titleRow}>
            <Text style={styles.title}>{item ? 'Edit Line Item' : 'New Line Item'}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancel}>Cancel</Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            <View style={styles.inputBlock}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.inputField, styles.inputFieldText]}
                value={desc}
                onChangeText={setDesc}
                placeholder="e.g. Wall paint — Benjamin Moore"
                placeholderTextColor={C.textDim}
              />
            </View>
            <View style={styles.grid2}>
              <View style={[styles.inputBlock, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput
                  style={styles.inputField}
                  value={qty}
                  onChangeText={setQty}
                  keyboardType="decimal-pad"
                  placeholderTextColor={C.textDim}
                />
                <Text style={styles.inputUnit}>units</Text>
              </View>
              <View style={[styles.inputBlock, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Unit Price</Text>
                <TextInput
                  style={styles.inputField}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={C.textDim}
                />
                <Text style={styles.inputUnit}>USD</Text>
              </View>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Line Total</Text>
              <Text style={styles.totalValue}>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
            <Text style={styles.saveBtnText}>Save Line Item</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderColor: C.border,
    maxHeight: '75%',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  title: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 14,
    color: C.text,
  },
  cancel: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 13,
    color: C.textMid,
  },
  body: {
    padding: 20,
    gap: 12,
  },
  grid2: {
    flexDirection: 'row',
    gap: 10,
  },
  inputBlock: {
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 12,
    gap: 4,
  },
  inputLabel: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 9.6,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
    color: C.textDim,
  },
  inputField: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 18,
    color: C.text,
    padding: 0,
    margin: 0,
  },
  inputFieldText: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 14,
  },
  inputUnit: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 10,
    color: C.textDim,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: C.border,
    marginTop: 4,
  },
  totalLabel: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 12,
    color: C.textMid,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  totalValue: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 28,
    color: C.yellow,
    letterSpacing: 1,
  },
  saveBtn: {
    margin: 16,
    backgroundColor: C.yellow,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveBtnText: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 14,
    color: '#000',
    letterSpacing: 0.5,
  },
});
