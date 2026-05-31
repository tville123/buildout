// MOCK — replace View/mock content with BannerAd from react-native-google-mobile-ads
// when wiring AdMob. Keep the usePaid() gate and the outer container styles.
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { C } from '../theme';
import { usePaid } from '../context/PaidContext';

const MOCK_ADS = [
  {
    eyebrow: 'HOME DEPOT PRO',
    headline: 'Pro Xtra Members Save More',
    sub: 'Earn points on every job supply run.',
    cta: 'Join Free',
    accent: '#f96302',
  },
  {
    eyebrow: 'LOWES FOR PROS',
    headline: 'Volume Pricing on Tile & LVP',
    sub: 'Bulk discounts, net-30 accounts.',
    cta: 'Learn More',
    accent: '#004990',
  },
  {
    eyebrow: 'SHERWIN-WILLIAMS',
    headline: '30% Off Paints This Weekend',
    sub: 'Contractor pricing in-store & online.',
    cta: 'Shop Now',
    accent: '#c8102e',
  },
];

// Pick a stable mock ad (rotate daily in dev, always first in prod mock)
const ad = __DEV__ ? MOCK_ADS[new Date().getDate() % MOCK_ADS.length] : MOCK_ADS[0];

export default function AdBanner() {
  const isPaid = usePaid();
  if (isPaid) return null;

  return (
    <View style={styles.wrapper}>
      <View style={styles.adLabel}>
        <Text style={styles.adLabelText}>AD</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.left}>
          <Text style={styles.eyebrow}>{ad.eyebrow}</Text>
          <Text style={styles.headline} numberOfLines={1}>{ad.headline}</Text>
          <Text style={styles.sub} numberOfLines={1}>{ad.sub}</Text>
        </View>

        <TouchableOpacity
          style={[styles.cta, { backgroundColor: ad.accent }]}
          activeOpacity={0.8}
          onPress={() => { /* no-op in mock */ }}
        >
          <Text style={styles.ctaText}>{ad.cta}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: '#111',
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  adLabel: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: C.border,
    borderRadius: 2,
    paddingHorizontal: 3,
    paddingVertical: 1,
  },
  adLabelText: {
    color: C.textMid,
    fontSize: 8,
    fontFamily: 'IBMPlexSans_400Regular',
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingTop: 6,
  },
  left: {
    flex: 1,
    gap: 1,
  },
  eyebrow: {
    color: C.textMid,
    fontSize: 8,
    fontFamily: 'IBMPlexSans_700Bold',
    letterSpacing: 1,
  },
  headline: {
    color: C.text,
    fontSize: 13,
    fontFamily: 'IBMPlexSans_700Bold',
  },
  sub: {
    color: C.textMid,
    fontSize: 11,
    fontFamily: 'IBMPlexSans_400Regular',
  },
  cta: {
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    minWidth: 76,
    alignItems: 'center',
  },
  ctaText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'IBMPlexSans_700Bold',
  },
});
