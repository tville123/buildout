import { createNavigationContainerRef } from '@react-navigation/native';

export type RootStackParamList = {
  Main: undefined;
  Settings: undefined;
};

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateToSettings() {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Settings');
  }
}
