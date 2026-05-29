import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Alert } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

// Paste your RevenueCat iOS public SDK key here before building
const RC_IOS_KEY = 'test_OxkqPCeCGVyCcKwAixsJVvwpJgR';
const ENTITLEMENT = 'pro';

interface PaidContextValue {
  isPaid: boolean;
  purchase: () => Promise<boolean>;
  restore: () => Promise<void>;
  isLoading: boolean;
}

const PaidContext = createContext<PaidContextValue>({
  isPaid: false,
  purchase: async () => false,
  restore: async () => {},
  isLoading: false,
});

export function usePaid(): boolean {
  return useContext(PaidContext).isPaid;
}

export function usePaidActions() {
  const { purchase, restore, isLoading } = useContext(PaidContext);
  return { purchase, restore, isLoading };
}

export function PaidProvider({ children }: { children: ReactNode }) {
  const [isPaid, setIsPaid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const refreshStatus = async () => {
    try {
      const info = await Purchases.getCustomerInfo();
      setIsPaid(info.entitlements.active[ENTITLEMENT] !== undefined);
    } catch { /* ignore — device may not be online at startup */ }
  };

  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    Purchases.configure({ apiKey: RC_IOS_KEY });
    refreshStatus();
  }, []);

  const purchase = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const offerings = await Purchases.getOfferings();
      const pkg =
        offerings.current?.availablePackages.find(p => p.packageType === 'LIFETIME') ??
        offerings.current?.availablePackages[0];
      if (!pkg) throw new Error('No packages available. Please try again later.');
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      const active = customerInfo.entitlements.active[ENTITLEMENT] !== undefined;
      setIsPaid(active);
      return active;
    } catch (e) {
      const err = e as { userCancelled?: boolean; message?: string };
      if (!err.userCancelled) {
        Alert.alert('Purchase failed', err.message ?? 'Something went wrong. Please try again.');
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const restore = async () => {
    setIsLoading(true);
    try {
      const info = await Purchases.restorePurchases();
      const active = info.entitlements.active[ENTITLEMENT] !== undefined;
      setIsPaid(active);
      Alert.alert(
        active ? 'Purchase restored' : 'Nothing to restore',
        active
          ? 'Buildout Pro is active.'
          : 'No previous purchase found for this Apple ID.',
      );
    } catch (e) {
      const err = e as { message?: string };
      Alert.alert('Restore failed', err.message ?? 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaidContext.Provider value={{ isPaid, purchase, restore, isLoading }}>
      {children}
    </PaidContext.Provider>
  );
}
