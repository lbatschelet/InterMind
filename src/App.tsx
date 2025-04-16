// App.tsx
import { PortalHost } from '@rn-primitives/portal';
import 'expo-dev-client';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FullWindowOverlay } from "react-native-screens";
import '~/styles/global.css';
import { LanguageProvider } from './contexts/LanguageContext';
import { PORTAL_HOST_NAME } from './lib/constants';
import AppNavigator from './navigation/AppNavigator';

// Platform-spezifisches Overlay
const WindowOverlay = Platform.OS === "ios" ? FullWindowOverlay : React.Fragment;

export default function App() {
  return (
    <LanguageProvider>
      <SafeAreaProvider>
        <AppNavigator />
        <WindowOverlay>
          <PortalHost name={PORTAL_HOST_NAME} />
        </WindowOverlay>
      </SafeAreaProvider>
    </LanguageProvider>
  );
}
