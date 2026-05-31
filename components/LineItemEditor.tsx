import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import type { LineItem } from '../types';
import { money0 } from '../utils/format';
import { uuid } from '../utils/uuid';

interface Props {
  items: LineItem[];
  onChange: (items: LineItem[]) => void;
}

type RawRow = { desc: string; qty: string; price: string };

function initRaw(it: LineItem): RawRow {
  return {
    desc: it.description,
    qty: it.quantity === 0 ? '' : String(it.quantity),
    price: it.unitPrice === 0 ? '' : String(it.unitPrice),
  };
}

export default function LineItemEditor({ items, onChange }: Props) {
  const [raw, setRaw] = useState<Record<string, RawRow>>(() =>
    Object.fromEntries(items.map(it => [it.id, initRaw(it)]))
  );

  const getRaw = (id: string): RawRow =>
    raw[id] ?? { desc: '', qty: '', price: '' };

  const setField = (id: string, field: keyof RawRow, val: string) =>
    setRaw(prev => ({ ...prev, [id]: { ...(prev[id] ?? { desc: '', qty: '', price: '' }), [field]: val } }));

  const commit = (id: string) => {
    const r = getRaw(id);
    onChange(items.map(it =>
      it.id !== id ? it : {
        ...it,
        description: r.desc,
        quantity: parseFloat(r.qty) || 0,
        unitPrice: parseFloat(r.price) || 0,
      }
    ));
  };

  const add = () => {
    const id = uuid();
    setRaw(prev => ({ ...prev, [id]: { desc: '', qty: '1', price: '' } }));
    onChange([...items, { id, description: '', quantity: 1, unitPrice: 0 }]);
  };

  const remove = (id: string) => {
    setRaw(prev => { const next = { ...prev }; delete next[id]; return next; });
    onChange(items.filter(it => it.id !== id));
  };

  return (
    <View>
      {items.length > 0 && (
        <View style={styles.header}>
          <Text style={[styles.hCell, { flex: 1 }]}>Description</Text>
          <Text style={[styles.hCell, styles.hRight, { width: 44 }]}>Qty</Text>
          <Text style={[styles.hCell, styles.hRight, { width: 62 }]}>Unit</Text>
          <Text style={[styles.hCell, styles.hRight, { width: 56 }]}>Total</Text>
          <View style={{ width: 32 }} />
        </View>
      )}

      {items.map(item => {
        const r = getRaw(item.id);
        const lineTotal = (parseFloat(r.qty) || 0) * (parseFloat(r.price) || 0);
        return (
          <View key={item.id} style={styles.row}>
            <TextInput
              style={[styles.cell, styles.descInput]}
              value={r.desc}
              onChangeText={v => setField(item.id, 'desc', v)}
              onEndEditing={() => commit(item.id)}
              placeholder="Item or labor"
              placeholderTextColor={C.textDim}
              returnKeyType="next"
            />
            <TextInput
              style={[styles.cell, styles.monoInput, { width: 44 }]}
              value={r.qty}
              onChangeText={v => setField(item.id, 'qty', v)}
              onEndEditing={() => commit(item.id)}
              placeholder="1"
              placeholderTextColor={C.textDim}
              keyboardType="decimal-pad"
              textAlign="right"
            />
            <TextInput
              style={[styles.cell, styles.monoInput, { width: 62 }]}
              value={r.price}
              onChangeText={v => setField(item.id, 'price', v)}
              onEndEditing={() => commit(item.id)}
              placeholder="0"
              placeholderTextColor={C.textDim}
              keyboardType="decimal-pad"
              textAlign="right"
            />
            <Text style={[styles.cell, styles.totalCell, { width: 56 }]}>
              {money0(lineTotal)}
            </Text>
            <TouchableOpacity style={styles.del} onPress={() => remove(item.id)} activeOpacity={0.7}>
              <Ionicons name="close" size={14} color={C.textDim} />
            </TouchableOpacity>
          </View>
        );
      })}

      <TouchableOpacity style={styles.addBtn} onPress={add} activeOpacity={0.7}>
        <Ionicons name="add" size={16} color={C.textMid} />
        <Text style={styles.addText}>Add line item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 6,
    gap: 4,
  },
  hCell: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: C.textDim,
  },
  hRight: {
    textAlign: 'right',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
    marginBottom: 6,
  },
  cell: {
    color: C.text,
    padding: 0,
  },
  descInput: {
    flex: 1,
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 13,
  },
  monoInput: {
    fontFamily: 'IBMPlexMono_400Regular',
    fontSize: 12,
    color: C.text,
  },
  totalCell: {
    fontFamily: 'IBMPlexMono_500Medium',
    fontSize: 12,
    color: C.yellow,
    textAlign: 'right',
  },
  del: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: C.border,
    borderRadius: 10,
    paddingVertical: 14,
  },
  addText: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 13,
    color: C.textMid,
  },
});
