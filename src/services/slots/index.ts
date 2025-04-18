import { SlotManager, DEFAULT_CONFIG } from './SlotManager';
import { SlotStateStore, AsyncStorageSlotStateStore } from './SlotStateStore';
import { NotificationScheduler, ExpoNotificationScheduler } from './NotificationScheduler';
import { SlotCoordinator } from './SlotCoordinator';
import { SurveyEvent, Slot, SlotStatus, SlotMeta, DaySegment } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLogger } from '~/src/utils/logger';

const log = createLogger("SlotSystem");

// Stattdessen definieren wir die Konstante hier, um sie direkt zu referenzieren
// Dies muss exakt dem Wert in SurveyService entsprechen
const SLOT_FIRST_SURVEY_KEY = 'first_survey_checked';

// Storage keys für Debugging/Reset
const SLOT_STORAGE_KEYS = [
  'slot_end_time',
  'slot_status',
  'current_slot_start',
  'current_slot_end',
  'next_notification',
  SLOT_FIRST_SURVEY_KEY
];

// Erstelle standardmäßige Instanzen
const defaultSlotManager = new SlotManager(DEFAULT_CONFIG);
const defaultSlotStore = new AsyncStorageSlotStateStore();
const defaultNotificationScheduler = new ExpoNotificationScheduler();

// Erstelle den SlotCoordinator und exportiere ihn als Singleton
export const slotCoordinator = new SlotCoordinator(
  defaultSlotManager,
  defaultSlotStore,
  defaultNotificationScheduler
);

/**
 * Hilfsfunktion zum Zurücksetzen des Slot-Systems
 * Löscht alle Slot-bezogenen Daten im AsyncStorage und initialisiert das System neu
 */
export async function resetSlotSystem(): Promise<void> {
  try {
    log.info("Resetting entire slot system...");
    
    // Lösche alle Benachrichtigungen
    await slotCoordinator.notificationScheduler.cancelAll();
    
    // Definiere alle bekannten Slot-bezogenen Schlüssel explizit mit Stringliteralen
    // um zirkuläre Abhängigkeiten zu vermeiden
    const keysToDelete = [
      'slot_end_time', 
      'slot_status', 
      'current_slot_start',
      'current_slot_end',
      'next_notification',
      'first_survey_checked'  // Direkt den Schlüssel als String-Literal verwenden
    ];
    
    // Lösche jeden Schlüssel einzeln und prüfe, ob er gültig ist
    for (const key of keysToDelete) {
      if (typeof key === 'string' && key.trim() !== '') {
        try {
          await AsyncStorage.removeItem(key);
          log.debug(`Deleted storage key: ${key}`);
          
          // Überprüfen, ob der Key wirklich gelöscht wurde (besonders wichtig für first_survey_checked)
          if (key === 'first_survey_checked') {
            const checkValue = await AsyncStorage.getItem(key);
            if (checkValue !== null) {
              log.warn(`Key '${key}' was not properly deleted, explicitly clearing value`);
              await AsyncStorage.setItem(key, '');
            } else {
              log.info(`Key '${key}' was successfully deleted`);
            }
          }
        } catch (error) {
          log.warn(`Error deleting key ${key}:`, error);
        }
      } else {
        log.warn(`Skipping invalid storage key: ${key}`);
      }
    }
    
    log.info("Slot data cleared, re-initializing...");
    
    // Setze den internen Status des SlotCoordinators zurück
    slotCoordinator.resetInitializationState();
    
    // Initialisiere das System neu
    await slotCoordinator.initialize();
    
    // Prüfe, ob nach der Initialisierung wirklich ein Slot erstellt wurde
    const currentSlot = await slotCoordinator.getCurrentSlot();
    const lastMeta = await slotCoordinator.readLastMeta();
    
    log.info("Slot system reset completed. New state:", {
      hasSlot: !!currentSlot,
      slotStart: currentSlot?.start?.toLocaleString(),
      slotEnd: currentSlot?.end?.toLocaleString(),
      status: lastMeta?.status || "N/A"
    });
  } catch (error) {
    log.error("Error resetting slot system", error);
    throw error;
  }
}

// Export alle Typen und Klassen für direkten Zugriff
export {
  SlotManager,
  SlotStateStore,
  AsyncStorageSlotStateStore,
  NotificationScheduler,
  ExpoNotificationScheduler,
  SlotCoordinator,
  SurveyEvent,
  Slot,
  SlotStatus,
  SlotMeta,
  DaySegment,
  DEFAULT_CONFIG
}; 