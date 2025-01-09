// App.tsx
import { PortalHost } from '@rn-primitives/portal';
import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FullWindowOverlay } from "react-native-screens";
import '~/global.css';
import { DeviceIdProvider } from './src/contexts/DeviceIdContext';
import { PORTAL_HOST_NAME } from './src/lib/constants';
import AppNavigator from './src/navigation/AppNavigator';

// Platform-spezifisches Overlay
const WindowOverlay = Platform.OS === "ios" ? FullWindowOverlay : React.Fragment;

export default function App() {
  return (
    <SafeAreaProvider>
      <DeviceIdProvider>
        <AppNavigator />
        <WindowOverlay>
          <PortalHost name={PORTAL_HOST_NAME} />
        </WindowOverlay>
      </DeviceIdProvider>
    </SafeAreaProvider>
  );
}
