import { useState } from 'react';
import { View, Text, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';

import { C } from '../theme';
import { calcTile, type TileResult } from '../utils/calculator';
import s from '../styles';
import SectionLabel from '../components/SectionLabel';
import InputBlock from '../components/InputBlock';
import ResultCard from '../components/ResultCard';
import ShoppingList from '../components/ShoppingList';

export default function TileScreen() {
  const [roomL, setRoomL] = useState('');
  const [roomW, setRoomW] = useState('');
  const [tileW, setTileW] = useState('');
  const [tileH, setTileH] = useState('');
  const [tilesPerBox, setTilesPerBox] = useState('');

  const result = ((): TileResult | null => {
    const l = parseFloat(roomL) || 0;
    const w = parseFloat(roomW) || 0;
    const tw = parseFloat(tileW) || 0;
    const th = parseFloat(tileH) || 0;
    const tpb = parseFloat(tilesPerBox) || 0;
    if (!l || !w || !tw || !th || !tpb) return null;
    return calcTile({ roomL: l, roomW: w, tileW: tw, tileH: th, tilesPerBox: tpb });
  })();

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: C.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={s.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.header}>
          <Text style={s.headerTag}>Tile Calculator</Text>
          <Text style={s.headerTitle}>Tile<Text style={{ color: C.yellow }}>.</Text></Text>
          <Text style={s.headerSub}>Get the exact number of tiles and boxes — with waste built in.</Text>
        </View>

        <View style={s.section}>
          <SectionLabel text="01 — Room Size" />
          <View style={s.grid2}>
            <InputBlock label="Length" value={roomL} onChangeText={setRoomL} placeholder="12" unit="ft" />
            <InputBlock label="Width" value={roomW} onChangeText={setRoomW} placeholder="10" unit="ft" />
          </View>
        </View>

        <View style={s.section}>
          <SectionLabel text="02 — Tile Size" />
          <View style={s.grid2}>
            <InputBlock label="Tile Width" value={tileW} onChangeText={setTileW} placeholder="12" unit="in" />
            <InputBlock label="Tile Height" value={tileH} onChangeText={setTileH} placeholder="12" unit="in" />
          </View>
        </View>

        <View style={s.section}>
          <SectionLabel text="03 — Box Coverage" />
          <View style={{ maxWidth: 180 }}>
            <InputBlock label="Tiles Per Box" value={tilesPerBox} onChangeText={setTilesPerBox} placeholder="10" unit="tiles" />
          </View>
        </View>

        {result ? <>
          <ResultCard
            tag="Boxes Needed"
            mainValue={String(result.boxesNeeded)}
            unit="boxes"
            breakdownItems={[
              { value: result.roomArea.toFixed(0), label: 'Sq Ft' },
              { value: String(result.tilesNeeded), label: 'Tiles' },
              { value: String(result.tilesWithWaste), label: 'With Waste' },
            ]}
          />
          <ShoppingList
            items={[
              {
                name: 'Floor Tile',
                sub: `${result.roomArea.toFixed(0)} sq ft room · 10% waste included`,
                qty: `${result.boxesNeeded} box${result.boxesNeeded !== 1 ? 'es' : ''}`,
              },
            ]}
          />
          <View style={s.tipBar}>
            <Text style={s.tipText}><Text style={s.tipStrong}>Pro tip: </Text>Always buy 10% extra — tile dye lots vary between batches and replacements may not match.</Text>
          </View>
        </> : <View style={s.noResult}>
          <Text style={s.noResultIcon}>🗂</Text>
          <Text style={s.noResultText}>Enter your room size, tile dimensions, and tiles per box to get started.</Text>
        </View>}

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
