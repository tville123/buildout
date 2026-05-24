import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { C, WALL_NAMES } from '../theme';
import s from '../styles';
import type { Wall } from '../types';

interface Props {
  wall: Wall;
  index: number;
  onUpdate: (field: 'width' | 'height', value: string) => void;
  onRemove: () => void;
  onToggleOpening: (type: 'door' | 'window') => void;
  onUpdateOpening: (field: 'doorW' | 'doorH' | 'windowW' | 'windowH', value: string) => void;
}

export default function WallCard({ wall, index, onUpdate, onRemove, onToggleOpening, onUpdateOpening }: Props) {
  const raw = wall.width && wall.height ? wall.width * wall.height : null;
  const dW = parseFloat(wall.doorW) || 3;
  const dH = parseFloat(wall.doorH) || 7;
  const wW = parseFloat(wall.windowW) || 3;
  const wH = parseFloat(wall.windowH) || 4;
  const deduct = (wall.hasDoor ? dW * dH : 0) + (wall.hasWindow ? wW * wH : 0);
  const net = raw !== null ? Math.max(raw - deduct, 0) : null;
  return (
    <View style={s.wallCard}>
      <View style={s.wallCardHeader}>
        <Text style={s.wallName}>{WALL_NAMES[index] ?? `Wall ${index + 1}`}</Text>
        <TouchableOpacity onPress={onRemove} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.wallDel}>✕</Text>
        </TouchableOpacity>
      </View>
      <View style={s.wallFields}>
        <View style={s.wallField}>
          <Text style={s.wallFieldLabel}>Width (ft)</Text>
          <TextInput
            style={s.wallFieldInput}
            value={wall.widthText}
            onChangeText={v => onUpdate('width', v)}
            placeholder="12"
            placeholderTextColor={C.textDim}
            keyboardType="decimal-pad"
          />
        </View>
        <View style={s.wallField}>
          <Text style={s.wallFieldLabel}>Height (ft)</Text>
          <TextInput
            style={s.wallFieldInput}
            value={wall.heightText}
            onChangeText={v => onUpdate('height', v)}
            placeholder="9"
            placeholderTextColor={C.textDim}
            keyboardType="decimal-pad"
          />
        </View>
        <Text style={s.wallSqftBadge}>
          {net !== null ? `${net.toFixed(1)} sq ft` : '— sq ft'}
        </Text>
      </View>
      <View style={s.wallOpenings}>
        <TouchableOpacity
          style={[s.openingPill, wall.hasDoor && s.openingPillOn]}
          onPress={() => onToggleOpening('door')}
        >
          <Text style={[s.openingPillText, wall.hasDoor && s.openingPillTextOn]}>{`🚪 Door −${(dW * dH).toFixed(0)} sqft`}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.openingPill, wall.hasWindow && s.openingPillOn]}
          onPress={() => onToggleOpening('window')}
        >
          <Text style={[s.openingPillText, wall.hasWindow && s.openingPillTextOn]}>{`🪟 Window −${(wW * wH).toFixed(0)} sqft`}</Text>
        </TouchableOpacity>
      </View>
      {(wall.hasDoor || wall.hasWindow) && (
        <View style={s.wallOpeningDims}>
          {wall.hasDoor && (
            <View style={s.wallOpeningDimGroup}>
              <Text style={s.wallFieldLabel}>Door W × H</Text>
              <View style={s.wallOpeningDimInputs}>
                <TextInput style={[s.wallFieldInput, s.wallOpeningDimInput]} value={wall.doorW} onChangeText={v => onUpdateOpening('doorW', v)} placeholder="3" placeholderTextColor={C.textDim} keyboardType="decimal-pad" />
                <Text style={s.wallOpeningDimSep}>×</Text>
                <TextInput style={[s.wallFieldInput, s.wallOpeningDimInput]} value={wall.doorH} onChangeText={v => onUpdateOpening('doorH', v)} placeholder="7" placeholderTextColor={C.textDim} keyboardType="decimal-pad" />
                <Text style={s.wallOpeningDimUnit}>ft</Text>
              </View>
            </View>
          )}
          {wall.hasWindow && (
            <View style={s.wallOpeningDimGroup}>
              <Text style={s.wallFieldLabel}>Win W × H</Text>
              <View style={s.wallOpeningDimInputs}>
                <TextInput style={[s.wallFieldInput, s.wallOpeningDimInput]} value={wall.windowW} onChangeText={v => onUpdateOpening('windowW', v)} placeholder="3" placeholderTextColor={C.textDim} keyboardType="decimal-pad" />
                <Text style={s.wallOpeningDimSep}>×</Text>
                <TextInput style={[s.wallFieldInput, s.wallOpeningDimInput]} value={wall.windowH} onChangeText={v => onUpdateOpening('windowH', v)} placeholder="4" placeholderTextColor={C.textDim} keyboardType="decimal-pad" />
                <Text style={s.wallOpeningDimUnit}>ft</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
