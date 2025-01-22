// App.tsx
import { PortalHost } from '@rn-primitives/portal';
import React from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FullWindowOverlay } from "react-native-screens";
import '~/styles/global.css';
import { setDebugMode } from './config/debug';
import { DeviceIdProvider } from './contexts/DeviceIdContext';
import { PORTAL_HOST_NAME } from './lib/constants';
import AppNavigator from './navigation/AppNavigator';

// Debug-Mode nur in Development aktivieren
if (__DEV__) {
    setDebugMode({
        session: false,     // Session/RLS Debug
        database: false,    // Datenbank-Operationen
        services: false,    // Service-Aufrufe
        ui: false         // UI-Updates (standardmäßig aus, da sehr verbose)
    });
}

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
