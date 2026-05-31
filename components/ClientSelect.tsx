import { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, ScrollView,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';
import { useWorkspace } from '../context/WorkspaceContext';
import Avatar from './Avatar';

interface Props {
  value: string | null;
  onChange: (clientId: string) => void;
}

// Client picker with an inline "add new client" form. Selecting or creating a
// client returns its id via onChange.
export default function ClientSelect({ value, onChange }: Props) {
  const { clients, getClient, createClient } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const selected = getClient(value);

  const reset = () => { setAdding(false); setName(''); setPhone(''); setEmail(''); };
  const close = () => { setOpen(false); reset(); };

  const pick = (id: string) => { onChange(id); close(); };

  const handleCreate = () => {
    if (!name.trim()) return;
    const c = createClient({ name: name.trim(), phone: phone.trim(), email: email.trim() });
    pick(c.id);
  };

  return (
    <>
      <TouchableOpacity style={styles.field} onPress={() => setOpen(true)} activeOpacity={0.7}>
        <Text style={[styles.fieldText, !selected && styles.placeholder]}>
          {selected ? selected.name : 'Select client'}
        </Text>
        <Ionicons name="chevron-down" size={16} color={C.textMid} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="slide" onRequestClose={close}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={close} />
          <View style={styles.sheet}>
            <View style={styles.handle} />
            <View style={styles.head}>
              <Text style={styles.title}>{adding ? 'New Client' : 'Select Client'}</Text>
              <TouchableOpacity onPress={close} activeOpacity={0.7}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {adding ? (
              <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
                <Field label="Name" value={name} onChangeText={setName} placeholder="Client name" autoFocus />
                <Field label="Phone" value={phone} onChangeText={setPhone} placeholder="(555) 555-0123" keyboardType="phone-pad" />
                <Field label="Email" value={email} onChangeText={setEmail} placeholder="name@email.com" keyboardType="email-address" />
                <TouchableOpacity
                  style={[styles.createBtn, !name.trim() && styles.createBtnDisabled]}
                  onPress={handleCreate}
                  disabled={!name.trim()}
                  activeOpacity={0.85}
                >
                  <Text style={styles.createText}>Create & Select</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : (
              <ScrollView contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
                {clients.map(c => (
                  <TouchableOpacity key={c.id} style={styles.clientRow} onPress={() => pick(c.id)} activeOpacity={0.7}>
                    <Avatar initials={c.initials} size={34} />
                    <Text style={styles.clientName} numberOfLines={1}>{c.name}</Text>
                    {c.id === value && <Ionicons name="checkmark" size={18} color={C.yellow} />}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.addRow} onPress={() => setAdding(true)} activeOpacity={0.7}>
                  <Ionicons name="add" size={16} color={C.textMid} />
                  <Text style={styles.addText}>New client</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

function Field({ label, ...rest }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={styles.inputBlock}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor={C.textDim} {...rest} />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    borderRadius: 10, paddingHorizontal: 12, paddingVertical: 13,
  },
  fieldText: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 14, color: C.text },
  placeholder: { color: C.textDim },
  scrim: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: {
    backgroundColor: C.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    borderTopWidth: 1, borderColor: C.border, maxHeight: '75%',
  },
  handle: { width: 36, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  head: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.border,
  },
  title: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 14, color: C.text },
  cancel: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 13, color: C.textMid },
  list: { padding: 16, gap: 8 },
  clientRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 12,
  },
  clientName: { flex: 1, fontFamily: 'IBMPlexSans_500Medium', fontSize: 14, color: C.text },
  addRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, borderRadius: 10, paddingVertical: 14,
  },
  addText: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 13, color: C.textMid },
  body: { padding: 20, gap: 12 },
  inputBlock: { backgroundColor: C.bg, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 12, gap: 4 },
  inputLabel: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 9.6, letterSpacing: 1.6, textTransform: 'uppercase', color: C.textDim },
  input: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 14, color: C.text, padding: 0 },
  createBtn: { backgroundColor: C.yellow, borderRadius: 12, paddingVertical: 15, alignItems: 'center', marginTop: 4 },
  createBtnDisabled: { opacity: 0.4 },
  createText: { fontFamily: 'IBMPlexSans_500Medium', fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: '#000' },
});
