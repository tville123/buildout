import { useState } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';

import { C } from '../theme';
import { calcLVP, type LVPResult } from '../utils/calculator';
import s from '../styles';
import SectionLabel from '../components/SectionLabel';
import InputBlock from '../components/InputBlock';
import ResultCard from '../components/ResultCard';
import ShoppingList from '../components/ShoppingList';
import AddToQuoteCTA from '../components/AddToQuoteCTA';
import type { CalcScreenProps } from './CalculatorScreen';

export default function LVPScreen({ onAddToQuote }: CalcScreenProps) {
  const [roomL, setRoomL] = useState('');
  const [roomW, setRoomW] = useState('');
  const [sqftPerBox, setSqftPerBox] = useState('');
  const [pricePerBox, setPricePerBox] = useState('');

  const result = ((): LVPResult | null => {
    const l = parseFloat(roomL) || 0;
    const w = parseFloat(roomW) || 0;
    const spb = parseFloat(sqftPerBox) || 0;
    const ppb = parseFloat(pricePerBox) || 0;
    if (!l || !w || !spb) return null;
    return calcLVP({ roomL: l, roomW: w, sqftPerBox: spb, pricePerBox: ppb || null });
  })();

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.section}>
          <SectionLabel text="01 — Room Size" />
          <View style={s.grid2}>
            <InputBlock label="Length" value={roomL} onChangeText={setRoomL} placeholder="12" unit="ft" />
            <InputBlock label="Width" value={roomW} onChangeText={setRoomW} placeholder="10" unit="ft" />
          </View>
        </View>

        <View style={s.section}>
          <SectionLabel text="02 — Box Coverage" />
          <View style={{ maxWidth: 180 }}>
            <InputBlock label="Sq Ft Per Box" value={sqftPerBox} onChangeText={setSqftPerBox} placeholder="20" unit="sq ft" />
          </View>
        </View>

        <View style={s.section}>
          <SectionLabel text="03 — Price Per Box (optional)" />
          <View style={{ maxWidth: 180 }}>
            <InputBlock label="Price" value={pricePerBox} onChangeText={setPricePerBox} placeholder="48" unit="USD" />
          </View>
        </View>

        {result ? <>
          <ResultCard
            tag="Boxes Needed"
            mainValue={String(result.boxesNeeded)}
            unit="boxes"
            breakdownItems={[
              { value: result.roomArea.toFixed(0), label: 'Sq Ft' },
              { value: result.areaWithWaste.toFixed(0), label: 'With Waste' },
              ...(result.totalCost !== null ? [{ value: `$${result.totalCost.toFixed(0)}`, label: 'Est. Cost' }] : []),
            ]}
          />
          <ShoppingList
            items={[
              {
                name: 'LVP Flooring',
                sub: `${result.areaWithWaste.toFixed(0)} sq ft needed · 10% waste included`,
                qty: `${result.boxesNeeded} box${result.boxesNeeded !== 1 ? 'es' : ''}`,
              },
            ]}
          />
          {onAddToQuote && (
            <AddToQuoteCTA
              onPress={() => onAddToQuote({
                source: 'LVP Calc',
                items: [{ description: `LVP flooring — ${result.areaWithWaste.toFixed(0)} sq ft`, quantity: result.boxesNeeded, unitPrice: parseFloat(pricePerBox) || 48, source: 'LVP Calc' }],
              })}
            />
          )}
          <View style={s.tipBar}>
            <Text style={s.tipText}><Text style={s.tipStrong}>Pro tip: </Text>Buy all boxes from the same dye lot. Store planks in the room 48 hrs before install to acclimate.</Text>
          </View>
        </> : <View style={s.noResult}>
          <Text style={s.noResultIcon}>🪵</Text>
          <Text style={s.noResultText}>Enter your room size and the sq ft coverage per box to get started.</Text>
        </View>}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
