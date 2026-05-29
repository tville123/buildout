import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';

interface PaywallSheetProps {
  visible: boolean;
  onUnlock: () => Promise<void>;
  onSkip: () => void;
}

export default function PaywallSheet({ visible, onUnlock, onSkip }: PaywallSheetProps) {
  const [buying, setBuying] = useState(false);

  const handleUnlock = async () => {
    setBuying(true);
    try {
      await onUnlock();
    } finally {
      setBuying(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onSkip}>
      <TouchableOpacity style={styles.scrim} activeOpacity={1} onPress={buying ? undefined : onSkip} />
      <View style={styles.sheet}>
        <View style={styles.handle} />
        <View style={styles.mark}>
          <Ionicons name="lock-closed-outline" size={28} color={C.textMid} />
        </View>
        <Text style={styles.eyebrow}>Buildout Pro</Text>
        <Text style={styles.title}>Quote like a pro<Text style={{ color: C.yellow }}>.</Text></Text>
        <Text style={styles.body}>
          One-time purchase. No subscription, no account, no nonsense — just unlock the tools and keep using the app.
        </Text>
        <View style={styles.features}>
          {[
            'Export quotes as branded PDF',
            'Remove banner ads, everywhere',
            'Unlimited saved quotes',
          ].map(feat => (
            <View key={feat} style={styles.feat}>
              <View style={styles.featCheck}>
                <Ionicons name="checkmark" size={12} color="#000" />
              </View>
              <Text style={styles.featText}>{feat}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={[styles.cta, buying && styles.ctaBuying]}
          onPress={buying ? undefined : handleUnlock}
          activeOpacity={0.85}
        >
          {buying ? (
            <ActivityIndicator color="#000" style={{ flex: 1 }} />
          ) : (
            <>
              <View style={styles.ctaLeft}>
                <Text style={styles.ctaEyebrow}>One-time</Text>
                <Text style={styles.ctaLabel}>Unlock Buildout Pro</Text>
              </View>
              <Text style={styles.ctaPrice}>$2.99</Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.skipBtn} onPress={buying ? undefined : onSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Maybe later</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    backgroundColor: C.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: C.border,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  handle: {
    width: 36,
    height: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    marginBottom: 20,
  },
  mark: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: C.bg,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  eyebrow: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 10,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: C.yellow,
    marginBottom: 6,
  },
  title: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 38,
    color: C.text,
    letterSpacing: 1,
    marginBottom: 10,
    textAlign: 'center',
  },
  body: {
    fontFamily: 'IBMPlexSans_300Light',
    fontSize: 13,
    color: C.textMid,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 300,
  },
  features: {
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  feat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  featCheck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.yellow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featText: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 13,
    color: C.text,
  },
  cta: {
    width: '100%',
    backgroundColor: C.yellow,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ctaBuying: {
    opacity: 0.6,
  },
  ctaLeft: {
    gap: 2,
  },
  ctaEyebrow: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 10,
    color: 'rgba(0,0,0,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  ctaLabel: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 15,
    color: '#000',
  },
  ctaPrice: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 28,
    color: '#000',
    letterSpacing: 1,
  },
  skipBtn: {
    paddingVertical: 8,
  },
  skipText: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 13,
    color: C.textMid,
  },
});
