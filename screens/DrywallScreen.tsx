import { useState } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';

import { C } from '../theme';
import { calcDrywall, type DrywallResult } from '../utils/calculator';
import s from '../styles';
import SectionLabel from '../components/SectionLabel';
import InputBlock from '../components/InputBlock';
import ResultCard from '../components/ResultCard';
import ShoppingList from '../components/ShoppingList';
import TopBar from '../components/TopBar';

export default function DrywallScreen() {
  const [roomL, setRoomL] = useState('');
  const [roomW, setRoomW] = useState('');
  const [roomH, setRoomH] = useState('');
  const [doorCount, setDoorCount] = useState('0');
  const [windowCount, setWindowCount] = useState('0');

  const result = ((): DrywallResult | null => {
    const l = parseFloat(roomL) || 0;
    const w = parseFloat(roomW) || 0;
    const h = parseFloat(roomH) || 0;
    if (!l || !w || !h) return null;
    return calcDrywall({
      roomL: l, roomW: w, roomH: h,
      doorCount: parseInt(doorCount) || 0,
      windowCount: parseInt(windowCount) || 0,
    });
  })();

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TopBar tag="Drywall" />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.section}>
          <SectionLabel text="01 — Room Dimensions" />
          <View style={s.grid3}>
            <InputBlock label="Length" value={roomL} onChangeText={setRoomL} placeholder="12" unit="ft" />
            <InputBlock label="Width" value={roomW} onChangeText={setRoomW} placeholder="10" unit="ft" />
            <InputBlock label="Height" value={roomH} onChangeText={setRoomH} placeholder="9" unit="ft" />
          </View>
        </View>

        <View style={s.section}>
          <SectionLabel text="02 — Openings" />
          <View style={s.grid2}>
            <InputBlock label="Doors" value={doorCount} onChangeText={setDoorCount} placeholder="1" unit="doors" />
            <InputBlock label="Windows" value={windowCount} onChangeText={setWindowCount} placeholder="2" unit="windows" />
          </View>
        </View>

        {result ? <>
          <ResultCard
            tag="Drywall Sheets Needed"
            mainValue={String(result.sheetsNeeded)}
            unit="sheets (4×8)"
            breakdownItems={[
              { value: result.wallArea.toFixed(0), label: 'Sq Ft' },
              { value: String(result.compoundBuckets), label: 'Compound' },
              { value: String(result.tapeRolls), label: 'Tape Rolls' },
            ]}
          />
          <ShoppingList
            items={[
              {
                name: 'Drywall Sheets (4×8)',
                sub: `${result.wallArea.toFixed(0)} sq ft wall area · 10% waste`,
                qty: `${result.sheetsNeeded} sheet${result.sheetsNeeded !== 1 ? 's' : ''}`,
              },
              {
                name: 'Joint Compound',
                sub: '~1 bucket per 500 sq ft',
                qty: `${result.compoundBuckets} bucket${result.compoundBuckets !== 1 ? 's' : ''}`,
              },
              {
                name: 'Drywall Tape',
                sub: '~1 roll per 500 sq ft',
                qty: `${result.tapeRolls} roll${result.tapeRolls !== 1 ? 's' : ''}`,
              },
              {
                name: 'Drywall Screws',
                sub: '~1 lb per 500 sq ft',
                qty: `${result.screwPounds} lb${result.screwPounds !== 1 ? 's' : ''}`,
              },
            ]}
          />
          <View style={s.tipBar}>
            <Text style={s.tipText}><Text style={s.tipStrong}>Pro tip: </Text>Hang sheets perpendicular to studs and stagger seams. Butt joints (short edges) are harder to finish — minimize them.</Text>
          </View>
        </> : <View style={s.noResult}>
          <Text style={s.noResultIcon}>🧱</Text>
          <Text style={s.noResultText}>Enter your room dimensions to calculate drywall materials.</Text>
        </View>}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
