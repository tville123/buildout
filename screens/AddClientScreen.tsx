import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { QuoteStackParamList } from '../App';
import { useWorkspace } from '../context/WorkspaceContext';
import { useToast } from '../context/ToastContext';
import { C } from '../theme';
import TopBar from '../components/TopBar';

type Props = NativeStackScreenProps<QuoteStackParamList, 'AddClient'>;

export default function AddClientScreen({ navigation, route }: Props) {
  const { getClient, createClient, updateClient } = useWorkspace();
  const { showToast } = useToast();
  const existing = route.params?.clientId ? getClient(route.params.clientId) : undefined;

  const [name, setName] = useState(existing?.name ?? '');
  const [phone, setPhone] = useState(existing?.phone ?? '');
  const [email, setEmail] = useState(existing?.email ?? '');

  const canSave = name.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    if (existing) {
      updateClient(existing.id, { name: name.trim(), phone: phone.trim(), email: email.trim() });
      showToast('Client updated');
    } else {
      createClient({ name: name.trim(), phone: phone.trim(), email: email.trim() });
      showToast('Client added');
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TopBar tag={existing ? 'Edit Client' : 'Add Client'} onBack={() => navigation.goBack()} actions={[]} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <Field label="Name" value={name} onChangeText={setName} placeholder="Client name" autoFocus />
        <Field label="Phone" value={phone} onChangeText={setPhone} placeholder="(555) 555-0123" keyboardType="phone-pad" />
        <Field label="Email" value={email} onChangeText={setEmail} placeholder="name@email.com" keyboardType="email-address" autoCapitalize="none" />
      </ScrollView>
      <View style={styles.foot}>
        <TouchableOpacity style={[styles.save, !canSave && styles.saveDisabled]} onPress={handleSave} disabled={!canSave} activeOpacity={0.85}>
          <Text style={styles.saveText}>{existing ? 'Save Changes' : 'Add Client'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function Field({ label, ...rest }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.block}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={C.textDim} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 24, gap: 14 },
  block: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 12, gap: 6 },
  label: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 9.6, letterSpacing: 2, textTransform: 'uppercase', color: C.textDim },
  input: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 15, color: C.text, padding: 0 },
  foot: { paddingHorizontal: 24, paddingTop: 14, paddingBottom: 28 },
  save: { backgroundColor: C.yellow, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  saveDisabled: { opacity: 0.4 },
  saveText: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 13, letterSpacing: 1.8, textTransform: 'uppercase', color: '#000' },
});
