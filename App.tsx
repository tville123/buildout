import { View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
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

import { C } from './theme';
import PaintScreen from './screens/PaintScreen';
import TileScreen from './screens/TileScreen';
import GroutScreen from './screens/GroutScreen';
import LVPScreen from './screens/LVPScreen';
import CarpetScreen from './screens/CarpetScreen';
import StairsScreen from './screens/StairsScreen';
import DrywallScreen from './screens/DrywallScreen';

type RootTabParamList = {
  Paint: undefined;
  Tile: undefined;
  Grout: undefined;
  LVP: undefined;
  Carpet: undefined;
  Stairs: undefined;
  Drywall: undefined;
};

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const Tab = createBottomTabNavigator<RootTabParamList>();

const TAB_ICON: Record<keyof RootTabParamList, IoniconsName> = {
  Paint: 'brush-outline',
  Tile: 'grid-outline',
  Grout: 'apps-outline',
  LVP: 'layers-outline',
  Carpet: 'albums-outline',
  Stairs: 'trending-up',
  Drywall: 'hammer-outline',
};

export default function App() {
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
    IBMPlexSans_300Light,
    IBMPlexSans_400Regular,
    IBMPlexSans_500Medium,
    IBMPlexMono_400Regular,
    IBMPlexMono_500Medium,
  });

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: C.bg }} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={TAB_ICON[route.name]} size={size} color={color} />
            ),
            tabBarActiveTintColor: C.yellow,
            tabBarInactiveTintColor: C.textDim,
            tabBarStyle: { backgroundColor: C.surface, borderTopColor: C.border },
            tabBarLabelStyle: { fontFamily: 'IBMPlexSans_400Regular', fontSize: 10 },
            headerShown: false,
          })}
        >
          <Tab.Screen name="Paint" component={PaintScreen} />
          <Tab.Screen name="Tile" component={TileScreen} />
          <Tab.Screen name="Grout" component={GroutScreen} />
          <Tab.Screen name="LVP" component={LVPScreen} />
          <Tab.Screen name="Carpet" component={CarpetScreen} />
          <Tab.Screen name="Stairs" component={StairsScreen} />
          <Tab.Screen name="Drywall" component={DrywallScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </View>
  );
}
