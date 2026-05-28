import { useState } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';

import { C } from '../theme';
import { calcCarpet, type CarpetResult } from '../utils/calculator';
import s from '../styles';
import SectionLabel from '../components/SectionLabel';
import InputBlock from '../components/InputBlock';
import ResultCard from '../components/ResultCard';
import ShoppingList from '../components/ShoppingList';
import AddToQuoteCTA from '../components/AddToQuoteCTA';
import type { CalcScreenProps } from './CalculatorScreen';

export default function CarpetScreen({ onAddToQuote }: CalcScreenProps) {
  const [roomL, setRoomL] = useState('');
  const [roomW, setRoomW] = useState('');
  const [pricePerSqYard, setPricePerSqYard] = useState('');

  const result = ((): CarpetResult | null => {
    const l = parseFloat(roomL) || 0;
    const w = parseFloat(roomW) || 0;
    const psy = parseFloat(pricePerSqYard) || 0;
    if (!l || !w) return null;
    return calcCarpet({ roomL: l, roomW: w, pricePerSqYard: psy || null });
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
          <SectionLabel text="02 — Price Per Sq Yard (optional)" />
          <View style={{ maxWidth: 180 }}>
            <InputBlock label="Price" value={pricePerSqYard} onChangeText={setPricePerSqYard} placeholder="18" unit="USD/yd²" />
          </View>
        </View>

        {result ? <>
          <ResultCard
            tag="Square Yards Needed"
            mainValue={result.sqYardsWithWaste.toFixed(1)}
            unit="sq yards"
            breakdownItems={[
              { value: result.roomSqFt.toFixed(0), label: 'Sq Ft' },
              { value: result.sqYards.toFixed(1), label: 'Sq Yards' },
              ...(result.totalCost !== null ? [{ value: `$${result.totalCost.toFixed(0)}`, label: 'Est. Cost' }] : []),
            ]}
          />
          <ShoppingList
            items={[
              {
                name: 'Carpet',
                sub: `${result.roomSqFt.toFixed(0)} sq ft (${result.sqYards.toFixed(1)} yd²) · 10% waste`,
                qty: `${result.sqYardsWithWaste.toFixed(1)} yd²`,
              },
            ]}
          />
          {onAddToQuote && (
            <AddToQuoteCTA
              onPress={() => onAddToQuote({
                source: 'Carpet Calc',
                items: [{ description: `Carpet — ${result.sqYardsWithWaste.toFixed(1)} yd²`, quantity: Math.ceil(result.sqYardsWithWaste), unitPrice: parseFloat(pricePerSqYard) || 18, source: 'Carpet Calc' }],
              })}
            />
          )}
          <View style={s.tipBar}>
            <Text style={s.tipText}><Text style={s.tipStrong}>Pro tip: </Text>Carpet is sold in 12-ft-wide rolls. For rooms wider than 12 ft, you'll need a seam — factor extra for pattern matching.</Text>
          </View>
        </> : <View style={s.noResult}>
          <Text style={s.noResultIcon}>🏠</Text>
          <Text style={s.noResultText}>Enter your room dimensions to calculate square yardage.</Text>
        </View>}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
