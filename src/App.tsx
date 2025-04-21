// App.tsx
import 'react-native-gesture-handler';
import 'expo-dev-client';
import React, { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FullWindowOverlay } from "react-native-screens";
import '~/styles/global.css';
import AppNavigator from './navigation/AppNavigator';
import { LanguageProvider } from './contexts/LanguageContext';
import { PORTAL_HOST_NAME } from './lib/constants';
import { PortalHost } from '@rn-primitives/portal';
import * as Notifications from 'expo-notifications';
import { createLogger } from './utils/logger';
import { slotCoordinator } from './services/slots';
import { setupNotifications } from './services/slots/NotificationScheduler';
import * as SplashScreen from 'expo-splash-screen';
import { LoadingScreen } from './components/screens';

// Splash-Screen wird manuell gehalten bis die App bereit ist
SplashScreen.preventAutoHideAsync().catch(() => {
  /* Falls preventAutoHideAsync fehlschlägt, ignorieren wir den Fehler */
});

const log = createLogger("App");

// Reduzierte Logging-Ebene in Produktion/Testversion
const isVerboseLogging = __DEV__;

// Stelle sicher, dass das Benachrichtigungssystem korrekt initialisiert ist
// Diese Funktion wird bereits im NotificationScheduler.ts aufgerufen, aber
// wir rufen sie hier explizit auf, um sicherzustellen, dass sie ausgeführt wird
setupNotifications();

// Einmalig gespeicherte Referenz auf den Initialisierungszustand
// Wird app-global gespeichert, damit die Komponente neu-mounting nicht zum erneuten Initialisieren führt
const globalInitStatus = {
  isInitialized: false,
  isInitializing: false,
  lastForegroundTime: Date.now(),
};

// Platform-spezifisches Overlay
const WindowOverlay = Platform.OS === "ios" ? FullWindowOverlay : React.Fragment;

/**
 * Root Application Component
 * 
 * Responsibilities:
 * - Setting up global providers (language, navigation)
 * - Initializing core services
 * 
 * This component serves as the entry point for the app.
 * 
 * @returns The root application component tree
 */
export default function App() {
  // Track app state changes (foreground/background)
  const appState = useRef(AppState.currentState);
  
  // References to notification listeners for cleanup
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  
  // Lokaler State, der den globalen Status spiegelt (für re-renders)
  const [isAppInitialized, setIsAppInitialized] = useState(globalInitStatus.isInitialized);
  // State für die Steuerung der Anzeige des Loading-Screens und Splash-Screens
  const [appIsReady, setAppIsReady] = useState(false);
  
  useEffect(() => {
    // Set up app state change listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Initialize app only once at startup across all component instances
    if (!globalInitStatus.isInitialized && !globalInitStatus.isInitializing) {
      initApp();
    } else if (globalInitStatus.isInitialized) {
      // App ist bereits initialisiert, verstecke Splash-Screen sofort
      setAppIsReady(true);
      SplashScreen.hideAsync().catch(log.error);
    }
    
    // Clean up on unmount
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Effekt zum Ausblenden des Splash-Screens, wenn die App bereit ist
  useEffect(() => {
    if (appIsReady) {
      SplashScreen.hideAsync().catch(log.error);
    }
  }, [appIsReady]);
  
  /**
   * Handles app state changes (foreground/background/inactive)
   * 
   * @param nextAppState The new app state
   */
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    // If coming back to foreground
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      const now = Date.now();
      const timeSinceLastForeground = now - globalInitStatus.lastForegroundTime;
      globalInitStatus.lastForegroundTime = now;
      
      if (isVerboseLogging) {
        log.info('App has come to the foreground', {
          timeSinceLastForegroundMs: timeSinceLastForeground
        });
      } else {
        log.info('App has come to the foreground');
      }
      
      // Slot-Status wird automatisch aktualisiert, wenn die App in den Vordergrund kommt
      // Es sind keine sofortigen Benachrichtigungen erforderlich
    }
    
    appState.current = nextAppState;
  };
  
  /**
   * Initialize app services and configuration
   */
  const initApp = async () => {
    try {
      // Markieren wir den Beginn der Initialisierungsphase
      globalInitStatus.isInitializing = true;
      
      log.info('Starting app initialization...');
      
      // Initialisiere das Slot-System (nur einmal beim Start)
      log.info('Initializing slot coordinator (one-time initialization)');
      await slotCoordinator.initialize();
      
      log.info('App initialized successfully');
      
      // Die App sofort als bereit markieren oder Verzögerung hinzufügen
      setTimeout(() => {
        globalInitStatus.isInitialized = true;
        globalInitStatus.isInitializing = false;
        setIsAppInitialized(true);
        setAppIsReady(true);
        log.info("Initialization phase completed");
      }, 500); // Kurze Verzögerung für Übergang
    } catch (error) {
      log.error('Error during app initialization', error);
      globalInitStatus.isInitializing = false;
      globalInitStatus.isInitialized = false;
      // Trotz Fehler die App anzeigen, damit der Benutzer nicht blockiert wird
      setAppIsReady(true);
    }
  };
  
  useEffect(() => {
    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener(
      notification => {
        if (isVerboseLogging) {
          log.info('Notification received in foreground');
        }
        handleNotificationReceived(notification);
      }
    );

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      response => {
        // Handle user interaction with the notification
        log.info('User tapped on notification', {
          actionIdentifier: response.actionIdentifier
        });
        handleNotificationReceived(response.notification);
      }
    );

    // Clean up listeners on unmount
    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  /**
   * Handles received notifications
   * 
   * @param notification The notification content
   */
  const handleNotificationReceived = async (notification: Notifications.Notification) => {
    // Log notification but in a more compact format to reduce console noise
    const data = notification.request?.content?.data;
    const type = data?.type;
    
    if (isVerboseLogging) {
      log.debug('Notification received', { 
        type,
        id: notification.request?.identifier?.substring(0, 8)
      });
    }
    
    // Ignore notifications during initialization phase
    if (!globalInitStatus.isInitialized) {
      log.info('Ignoring notification during initialization phase');
      return;
    }
    
    try {
      // Check slot status on notification tap
      const isAvailable = await slotCoordinator.isSurveyAvailable();
      log.info(`Survey availability status: ${isAvailable ? 'Available' : 'Not available'}`);
    } catch (error) {
      log.error('Error handling notification:', error);
    }
  };

  // Wenn die App noch nicht bereit ist, zeige den Splash-Screen
  if (!appIsReady) {
    // Hier wird nichts gerendert, da wir den nativen Splash Screen verwenden,
    // bis die App vollständig initialisiert ist
    return null;
  }

  return (
    <LanguageProvider>
      <SafeAreaProvider>
        <AppNavigator />
        {Platform.OS === 'ios' ? (
          <WindowOverlay>
            <PortalHost name={PORTAL_HOST_NAME} />
          </WindowOverlay>
        ) : (
          <PortalHost name={PORTAL_HOST_NAME} />
        )}
      </SafeAreaProvider>
    </LanguageProvider>
  );
}
