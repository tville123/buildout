import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import { Animated, StyleSheet, Text, View, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C } from '../theme';

interface ToastContextValue {
  showToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [opacity] = useState(() => new Animated.Value(0));
  const [translateY] = useState(() => new Animated.Value(12));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 12, duration: 180, useNativeDriver: true }),
    ]).start(() => setMessage(null));
  }, [opacity, translateY]);

  const showToast = useCallback((msg: string) => {
    if (timer.current) clearTimeout(timer.current);
    setMessage(msg);
    opacity.setValue(0);
    translateY.setValue(12);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
    timer.current = setTimeout(hide, 1800);
  }, [opacity, translateY, hide]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {message !== null && (
        <Animated.View
          pointerEvents="none"
          style={[styles.wrap, { opacity, transform: [{ translateY }] }]}
        >
          <View style={styles.pill}>
            <Ionicons name="checkmark-circle-outline" size={16} color={C.yellow} />
            <Text style={styles.text}>{message}</Text>
          </View>
        </Animated.View>
      )}
    </ToastContext.Provider>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 96,   // above tab bar + safe area on most devices
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  text: {
    fontFamily: 'IBMPlexSans_500Medium',
    fontSize: 12.5,
    color: C.text,
  },
});
