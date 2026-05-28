import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';

const STEPS = [
  {
    eyebrow: '01 — Two halves',
    title: 'Calculate. Quote',
    body: 'Switch between seven material calculators on the left, and your in-progress quotes on the right. Every estimate, one app.',
    icon: 'calculator-outline' as const,
  },
  {
    eyebrow: '02 — Numbers do the work',
    title: 'Type, get exact',
    body: 'Enter your dimensions; Buildout returns the gallons, sheets, boxes or yards you need — with 10% waste already baked in.',
    icon: 'keypad-outline' as const,
  },
  {
    eyebrow: '03 — Send it',
    title: 'Tap "Add to Quote"',
    body: 'Push any result straight into a quote — line item, units, price. Then export a clean PDF to the homeowner. $2.99 to unlock once. No subscription.',
    icon: 'document-text-outline' as const,
  },
];

interface OnboardingScreenProps {
  onDone: () => void;
}

export default function OnboardingScreen({ onDone }: OnboardingScreenProps) {
  const [step, setStep] = useState(0);
  const cur = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.stepCount}>{String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}</Text>
        <TouchableOpacity onPress={onDone} activeOpacity={0.7}>
          <Text style={styles.skip}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconBlock}>
          <Ionicons name={cur.icon} size={34} color={C.yellow} />
        </View>

        <Text style={styles.eyebrow}>{cur.eyebrow}</Text>
        <Text style={styles.title}>
          {cur.title}<Text style={{ color: C.yellow }}>.</Text>
        </Text>
        <Text style={styles.body}>{cur.body}</Text>

        <View style={{ flex: 1 }} />

        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
          ))}
        </View>

        <TouchableOpacity
          style={styles.cta}
          onPress={() => isLast ? onDone() : setStep(step + 1)}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>{isLast ? 'Start using Buildout' : 'Next'}</Text>
          <Ionicons name="arrow-forward-outline" size={18} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  stepCount: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 10,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: C.textDim,
  },
  skip: {
    fontFamily: 'IBMPlexSans_400Regular',
    fontSize: 13,
    color: C.textMid,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingBottom: 20,
  },
  iconBlock: {
    width: 64,
    height: 64,
    borderRadius: 12,
    backgroundColor: 'rgba(245,200,66,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245,200,66,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 28,
  },
  eyebrow: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 10,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    color: C.yellow,
    marginBottom: 10,
  },
  title: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 64,
    color: C.text,
    letterSpacing: 1,
    lineHeight: 64,
    marginBottom: 20,
  },
  body: {
    fontFamily: 'IBMPlexSans_300Light',
    fontSize: 15,
    color: C.textMid,
    lineHeight: 24,
    maxWidth: 320,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.border,
  },
  dotActive: {
    width: 24,
    borderRadius: 3,
    backgroundColor: C.yellow,
  },
  cta: {
    backgroundColor: C.yellow,
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 14,
    color: '#000',
    letterSpacing: 0.3,
  },
});
