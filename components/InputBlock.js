import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { C } from '../theme';
import s from '../styles';

export default function InputBlock({ label, value, onChangeText, placeholder, unit }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[s.inputBlock, focused && s.inputBlockFocused]}>
      <Text style={s.inputLabel}>{label}</Text>
      <TextInput
        style={s.inputField}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={C.textDim}
        keyboardType="decimal-pad"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {unit ? <Text style={s.inputUnit}>{unit}</Text> : null}
    </View>
  );
}
