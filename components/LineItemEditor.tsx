import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import type { LineItem } from '../types';
import { formatMoney } from '../utils/format';
import { uuid } from '../utils/uuid';
import LineItemSheet from './LineItemSheet';

interface Props {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

// Shared ledger editor — add / edit / remove line items. Per-row editing reuses
// the existing LineItemSheet bottom sheet.
export default function LineItemEditor({ items, onChange }: Props) {
  const [editing, setEditing] = useState<LineItem | undefined>(undefined);
  const [showSheet, setShowSheet] = useState(false);

  const openNew = () => { setEditing(undefined); setShowSheet(true); };
  const openEdit = (item: LineItem) => { setEditing(item); setShowSheet(true); };

  const handleSave = (data: Omit<LineItem, 'id'>) => {
    setShowSheet(false);
    onChange(editing
      ? items.map(i => i.id === editing.id ? { ...data, id: editing.id } : i)
      : [...items, { ...data, id: uuid() }]);
  };

  const handleDelete = (id: string) => onChange(items.filter(i => i.id !== id));

  return (
    <View>
      {items.map(item => {
        const total = item.quantity * item.unitPrice;
        return (
          <View key={item.id} style={styles.row}>
            <TouchableOpacity style={styles.rowMain} onPress={() => openEdit(item)} activeOpacity={0.7}>
              <View style={styles.rowTop}>
                <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
                <Text style={styles.total}>{formatMoney(total)}</Text>
              </View>
              <View style={styles.rowBottom}>
                <Text style={styles.qty}>{item.quantity} × {formatMoney(item.unitPrice)}</Text>
                {item.source ? (
                  <View style={styles.srcPill}><Text style={styles.srcText}>{item.source} →</Text></View>
                ) : null}
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.del} onPress={() => handleDelete(item.id)} activeOpacity={0.7}>
              <Ionicons name="close" size={15} color={C.textDim} />
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity style={styles.addBtn} onPress={openNew} activeOpacity={0.7}>
        <Ionicons name="add" size={16} color={C.textMid} />
        <Text style={styles.addText}>Add line item</Text>
      </TouchableOpacity>

      <LineItemSheet
        visible={showSheet}
        item={editing}
        onClose={() => setShowSheet(false)}
        onSave={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
  },
  rowMain: {
    flex: 1,
    padding: 14,
    gap: 6,
  },
  rowTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  desc: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 13.5, color: C.text, flex: 1 },
  total: { fontFamily: 'IBMPlexMono_500Medium', fontSize: 13.5, color: C.yellow },
  rowBottom: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  qty: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 11, color: C.textDim },
  srcPill: {
    backgroundColor: 'rgba(245,200,66,0.08)',
    borderWidth: 1, borderColor: 'rgba(245,200,66,0.15)',
    borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2,
  },
  srcText: { fontFamily: 'IBMPlexMono_400Regular', fontSize: 9, color: C.yellow, letterSpacing: 0.5 },
  del: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: C.border,
  },
  addBtn: {
    borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, borderRadius: 10,
    paddingVertical: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
  },
  addText: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 13, color: C.textMid },
});
