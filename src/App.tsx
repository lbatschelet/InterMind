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

const log = createLogger("App");

// Reduzierte Logging-Ebene in Produktion/Testversion
const isVerboseLogging = __DEV__;

// Configure how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    // Check the notification type to determine whether to show an alert
    const data = notification.request.content.data || {};
    const isFutureNotification = data.notificationType === 'future';
    
    if (isVerboseLogging) {
      log.debug('Handling incoming notification visibility', { 
        notificationType: data.notificationType,
        isFutureNotification,
      });
    }
    
    // Only show immediate notifications as alerts when the app is in foreground
    // Future notifications (for slot scheduling) should be handled silently
    return {
      shouldShowAlert: !isFutureNotification, // Only show alert for non-future notifications
      shouldPlaySound: !isFutureNotification,
      shouldSetBadge: !isFutureNotification,
    };
  },
});

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
 * - Configuring notifications
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
  
  useEffect(() => {
    // Set up app state change listener
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Initialize app only once at startup across all component instances
    if (!globalInitStatus.isInitialized && !globalInitStatus.isInitializing) {
      initApp();
    }
    
    // Clean up on unmount
    return () => {
      subscription.remove();
    };
  }, []);
  
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
      
      // Only check active slot if we've been in background for at least 30 seconds
      // This prevents rapid re-checking when quickly switching between apps
      if (timeSinceLastForeground > 30000 && globalInitStatus.isInitialized) {
        // Check if we should show a survey notification when coming to foreground
        await slotCoordinator.sendNotificationIfSlotActive();
      }
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
      
      // Führen wir erst die Initialisierung der Berechtigungen durch
      await initNotifications();
      
      // Initialisiere das Slot-System (nur einmal beim Start)
      log.info('Initializing slot coordinator (one-time initialization)');
      await slotCoordinator.initialize();
      
      log.info('App initialized successfully');
      
      // Nach einer kurzen Verzögerung die Initialisierungsphase beenden
      setTimeout(() => {
        globalInitStatus.isInitialized = true;
        globalInitStatus.isInitializing = false;
        setIsAppInitialized(true);
        log.info("Initialization phase completed, notification handling activated");
      }, 2000); // Reduziert auf 2 Sekunden
    } catch (error) {
      log.error('Error during app initialization', error);
      globalInitStatus.isInitializing = false;
      globalInitStatus.isInitialized = false;
    }
  };
  
  /**
   * Set up notification handling and permissions
   */
  const initNotifications = async () => {
    try {
      // Jetzt können wir direkt auf den notificationScheduler zugreifen
      const hasPermission = await slotCoordinator.notificationScheduler.requestPermissions();
      
      if (!hasPermission) {
        log.warn('Notification permissions not granted');
      } else {
        log.info('Notification permissions granted');
      }
      
      // Check for existing scheduled notifications - but don't reschedule here
      // Let the SlotCoordinator.initialize handle scheduling
      const currentSlot = await slotCoordinator.getCurrentSlot();
      if (currentSlot && isVerboseLogging) {
        log.info('Found existing slot', { 
          start: currentSlot.start.toLocaleString(),
          end: currentSlot.end.toLocaleString()
        });
      }
    } catch (error) {
      log.error('Error initializing notifications', error);
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
    const notificationType = data?.notificationType;
    
    if (isVerboseLogging) {
      log.debug('Notification received', { 
        type: data?.type, 
        notificationType,
        id: notification.request?.identifier?.substring(0, 8)
      });
    }
    
    // Ignore notifications during initialization phase
    if (!globalInitStatus.isInitialized) {
      log.info('Ignoring notification during initialization phase');
      return;
    }
    
    try {
      // Ignore future notifications - they are just scheduling triggers
      if (notificationType === 'future') {
        if (isVerboseLogging) {
          log.info('Ignoring future notification trigger');
        }
        return;
      }
      
      // Process immediate notification or reminder for active slot
      if (notificationType === 'immediate' || data?.type === 'reminder') {
        // Check if survey is available
        const isAvailable = await slotCoordinator.isSurveyAvailable();
        log.info(`Current survey availability status: ${isAvailable}`);
        
        if (isAvailable) {
          // If already available, just refresh UI
          log.info('Survey is available, UI should refresh');
        } else {
          // Make survey available with active slot
          await slotCoordinator.makeSurveyAvailableIfSlotActive();
        }
      }
    } catch (error) {
      log.error('Error handling notification:', error);
    }
  };

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
