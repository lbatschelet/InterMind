/**
 * @packageDocumentation
 * @module Services/Slots
 * 
 * @summary
 * Slot-based survey management system entry point.
 * 
 * @description
 * Slot System - Core Implementation
 * --------------------------------
 * 
 * The slot system manages time-based availability windows for surveys.
 * It consists of several components working together:
 * 
 * 1. SlotManager - Calculates when new survey slots should be scheduled
 *    Purely functional, handles only time calculations with no side effects.
 * 
 * 2. SlotCoordinator - Orchestrates the entire slot system
 *    Central component that coordinates slot management, notifications and events.
 *    Emits events when slots change, expire or get updated.
 * 
 * 3. SlotStateStore - Persists slot data to device storage
 *    Handles reading/writing slot information to AsyncStorage.
 * 
 * 4. NotificationScheduler - Manages push notifications for slots
 *    Schedules and cancels notifications when slots change.
 * 
 * 5. BackgroundTaskAdapter - Connects OS background services
 *    Registers background tasks that periodically check and update slots.
 * 
 * Flow:
 * - When app starts, SlotCoordinator.initialize() is called
 * - It ensures a valid slot exists and registers background tasks
 * - The slot system emits events when changes occur
 * - UI components react to these events to update their state
 * - Background tasks periodically call checkAndUpdateSlot() 
 *   even when the app is not running
 */

import { SlotManager, DEFAULT_CONFIG } from './SlotManager';
import { SlotStateStore, AsyncStorageSlotStateStore } from './SlotStateStore';
import { NotificationScheduler, ExpoNotificationScheduler } from './NotificationScheduler';
import { SlotCoordinator, SlotCoordinatorEvent } from './SlotCoordinator';
import { SurveyEvent, Slot, SlotStatus, SlotMeta, DaySegment } from '../../types/slots';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLogger } from '../../utils/logger';
import { 
  registerBackgroundTask, 
  unregisterBackgroundTask 
} from './BackgroundTaskAdapter';

const log = createLogger("SlotSystem");

/** 
 * Key needs to match exactly the one in SurveyService 
 * 
 * @category Configuration
 */
const FIRST_SURVEY_CHECKED_KEY = 'first_survey_checked';

/** 
 * Storage keys used for debugging/reset 
 * 
 * @category Configuration
 */
const SLOT_STORAGE_KEYS = [
  'slot_end_time',
  'slot_status',
  'current_slot_start',
  'current_slot_end',
  'next_notification',
  FIRST_SURVEY_CHECKED_KEY
];

// Create default instances
/**
 * Default SlotManager instance with the standard configuration
 * 
 * @category Instance
 */
const defaultSlotManager = new SlotManager(DEFAULT_CONFIG);

/**
 * Default SlotStateStore implementation using AsyncStorage
 * 
 * @category Instance
 */
const defaultSlotStore = new AsyncStorageSlotStateStore();

/**
 * Default NotificationScheduler implementation using Expo
 * 
 * @category Instance
 */
const defaultNotificationScheduler = new ExpoNotificationScheduler();

/** 
 * The singleton instance of SlotCoordinator used throughout the application.
 * This is the main interface for interacting with the slot system.
 * 
 * @category Instance
 * 
 * @example
 * ```typescript
 * // Initialize the slot system at app start
 * await slotCoordinator.initialize();
 * 
 * // Listen for slot changes
 * slotCoordinator.on(SlotCoordinatorEvent.SLOT_CHANGED, (slot) => {
 *   console.log(`New slot: ${slot.start} to ${slot.end}`);
 * });
 * 
 * // Handle survey completion
 * await slotCoordinator.onSurveyEvent(SurveyEvent.COMPLETED);
 * ```
 */
export const slotCoordinator = new SlotCoordinator(
  defaultSlotManager,
  defaultSlotStore,
  defaultNotificationScheduler
);

/**
 * Resets the entire slot system to its initial state.
 * 
 * This function:
 * 1. Cancels all notifications
 * 2. Unregisters background tasks
 * 3. Deletes all slot-related data from storage
 * 4. Re-initializes the system with an INITIAL slot
 * 5. Re-registers background tasks
 * 
 * @returns Promise that resolves when reset completes
 * @throws If reset process fails
 * 
 * @category System Management
 * 
 * @example
 * ```typescript
 * // Reset the entire slot system (e.g., during logout)
 * try {
 *   await resetSlotSystem();
 *   console.log("Slot system has been reset");
 * } catch (error) {
 *   console.error("Failed to reset slot system:", error);
 * }
 * ```
 */
export async function resetSlotSystem(): Promise<void> {
  try {
    log.info("Resetting entire slot system...");
    
    // Cancel all notifications
    await slotCoordinator.notificationScheduler.cancelAll();
    
    // Unregister background task
    await unregisterBackgroundTask();
    
    // Define all known slot-related keys explicitly using string literals
    // to avoid circular dependencies
    const keysToDelete = [
      'slot_end_time', 
      'slot_status', 
      'current_slot_start',
      'current_slot_end',
      'next_notification',
      'first_survey_checked',  // Direct string literal
      'slot_current_json',     // New compact key
      'slot_current_status'    // New compact key
    ];
    
    // Delete each key individually and verify
    for (const key of keysToDelete) {
      if (typeof key === 'string' && key.trim() !== '') {
        try {
          await AsyncStorage.removeItem(key);
          log.debug(`Deleted storage key: ${key}`);
          
          // Verify deletion especially for critical keys
          if (key === 'first_survey_checked' || 
              key === 'slot_current_json' || 
              key === 'slot_current_status') {
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
    
    // Reset the internal state of SlotCoordinator
    slotCoordinator.resetInitializationState();
    
    // Re-initialize the system
    await slotCoordinator.initialize();
    
    // Explicitly check if status is INITIAL, force if not
    const lastMeta = await slotCoordinator.readLastMeta();
    const currentSlot = await slotCoordinator.getCurrentSlot();
    
    if (lastMeta?.status !== SlotStatus.INITIAL) {
      log.warn("After reset, slot not in INITIAL state - forcing INITIAL state");
      
      if (currentSlot) {
        // Use the setStatusToInitial method
        await slotCoordinator.setStatusToInitial();
        log.info("Forced creation of permanent INITIAL slot after reset");
      }
    }
    
    // Verify reset was successful
    const finalSlot = await slotCoordinator.getCurrentSlot();
    const finalMeta = await slotCoordinator.readLastMeta();
    
    // Re-register background task
    await registerBackgroundTask();
    
    log.info("Slot system reset completed. Final state:", {
      hasSlot: !!finalSlot,
      slotStart: finalSlot?.start?.toLocaleString(),
      slotEnd: finalSlot?.end?.toLocaleString(),
      status: finalMeta?.status || "N/A"
    });
  } catch (error) {
    log.error("Error resetting slot system", error);
    throw error;
  }
}

/**
 * Export types and classes for direct access from other modules.
 * This provides a clean, single entry point to the slot system.
 * 
 * @category Exports
 */
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
  DEFAULT_CONFIG,
  registerBackgroundTask,
  unregisterBackgroundTask,
  SlotCoordinatorEvent
}; 