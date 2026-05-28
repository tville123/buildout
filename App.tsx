import { useEffect, useState, type ComponentProps } from 'react';
import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';
import {
  useFonts,
  BebasNeue_400Regular,
} from '@expo-google-fonts/bebas-neue';
import {
  IBMPlexSans_300Light,
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
} from '@expo-google-fonts/ibm-plex-sans';
import {
  IBMPlexMono_400Regular,
  IBMPlexMono_500Medium,
} from '@expo-google-fonts/ibm-plex-mono';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { C } from './theme';
import { PaidProvider } from './context/PaidContext';
import { QuoteProvider, useQuote } from './context/QuoteContext';
import { navigationRef, type RootStackParamList } from './navigationRef';
import type { ToolName } from './types';

import CalculatorScreen from './screens/CalculatorScreen';
import QuoteHistoryScreen from './screens/QuoteHistoryScreen';
import QuoteBuilderScreen from './screens/QuoteBuilderScreen';
import PDFPreviewScreen from './screens/PDFPreviewScreen';
import SettingsScreen from './screens/SettingsScreen';
import OnboardingScreen from './screens/OnboardingScreen';

// ── Nav param lists ──────────────────────────────────────────────────────────

export type CalculateStackParamList = {
  Calculator: { tool?: ToolName };
};

export type QuoteStackParamList = {
  QuoteHistory: undefined;
  QuoteBuilder: { quoteId: string };
  PDFPreview: { quoteId: string };
};

type MainTabParamList = {
  Calculate: NavigatorScreenParams<CalculateStackParamList>;
  Quote: NavigatorScreenParams<QuoteStackParamList>;
};

// ── Navigators ───────────────────────────────────────────────────────────────

const RootStack = createNativeStackNavigator<RootStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();
const CalcStack = createNativeStackNavigator<CalculateStackParamList>();
const QuoteStack = createNativeStackNavigator<QuoteStackParamList>();

function CalculateNavigator() {
  return (
    <CalcStack.Navigator screenOptions={{ headerShown: false }}>
      <CalcStack.Screen name="Calculator" component={CalculatorScreen} initialParams={{ tool: 'Paint' }} />
    </CalcStack.Navigator>
  );
}

function QuoteNavigator() {
  return (
    <QuoteStack.Navigator screenOptions={{ headerShown: false }}>
      <QuoteStack.Screen name="QuoteHistory" component={QuoteHistoryScreen} />
      <QuoteStack.Screen name="QuoteBuilder" component={QuoteBuilderScreen} />
      <QuoteStack.Screen name="PDFPreview" component={PDFPreviewScreen} />
    </QuoteStack.Navigator>
  );
}

function MainTabs() {
  const { quotes } = useQuote();
  const quoteCount = quotes.length;

  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: C.yellow,
        tabBarInactiveTintColor: C.textDim,
        tabBarStyle: { backgroundColor: C.surface, borderTopColor: C.border },
        tabBarLabelStyle: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 10 },
        tabBarIcon: ({ color, size }) => {
          const icon: ComponentProps<typeof Ionicons>['name'] = route.name === 'Calculate'
            ? 'calculator-outline'
            : 'document-text-outline';
          return <Ionicons name={icon} size={size} color={color} />;
        },
        tabBarBadge: route.name === 'Quote' && quoteCount > 0 ? quoteCount : undefined,
        tabBarBadgeStyle: { backgroundColor: C.yellow, color: '#000', fontFamily: 'IBMPlexSans_500Medium', fontSize: 10 },
      })}
    >
      <MainTab.Screen name="Calculate" component={CalculateNavigator} />
      <MainTab.Screen name="Quote" component={QuoteNavigator} />
    </MainTab.Navigator>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    IBMPlexSans_300Light,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('buildout.hasOnboarded').then(v => {
      setHasOnboarded(v === 'true');
    });
  }, []);

  if (!fontsLoaded || hasOnboarded === null) {
    return <View style={{ flex: 1, backgroundColor: C.bg }} />;
  }

  if (!hasOnboarded) {
    return (
      <PaidProvider>
        <OnboardingScreen
          onDone={() => {
            AsyncStorage.setItem('buildout.hasOnboarded', 'true');
            setHasOnboarded(true);
          }}
        />
      </PaidProvider>
    );
  }

  return (
    <PaidProvider>
      <QuoteProvider>
        <View style={{ flex: 1, backgroundColor: C.bg }}>
          <StatusBar barStyle="light-content" backgroundColor={C.bg} />
          <NavigationContainer ref={navigationRef}>
            <RootStack.Navigator screenOptions={{ headerShown: false }}>
              <RootStack.Screen name="Main" component={MainTabs} />
              <RootStack.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ presentation: 'modal' }}
              />
            </RootStack.Navigator>
          </NavigationContainer>
        </View>
      </QuoteProvider>
    </PaidProvider>
  );
}
