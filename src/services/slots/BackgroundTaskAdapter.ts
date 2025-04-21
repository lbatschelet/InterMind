import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { createLogger } from '../../utils/logger';
import { slotCoordinator } from './index';

const log = createLogger('BackgroundTaskAdapter');

/**
 * Name of the background task for regular slot checking.
 * This name is used to identify the task in the operating system.
 */
export const SLOT_CHECK_TASK_NAME = 'SLOT_CHECK_TASK';

/**
 * Registers a background task with the operating system that periodically
 * triggers the central slot check in the SlotCoordinator.
 * 
 * This serves as an adapter between the platform-specific background service
 * (expo-background-fetch) and our SlotCoordinator.
 */
TaskManager.defineTask(SLOT_CHECK_TASK_NAME, async () => {
  try {
    log.info('Background task triggered by OS');
    
    // Call the central slot checking method of the SlotCoordinator
    const result = await slotCoordinator.checkAndUpdateSlot();
    
    if (result.updated) {
      log.info('Slot updated in background', result);
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } else {
      log.debug('No slot update needed in background', result);
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }
  } catch (error) {
    log.error('Error in background task', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

/**
 * Registers the background task with the operating system.
 * 
 * @returns Promise that resolves when registration is complete
 */
export async function registerBackgroundTask(): Promise<void> {
  try {
    // Check if the task is already registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(SLOT_CHECK_TASK_NAME);
    
    if (isRegistered) {
      log.debug('Background task already registered');
      return;
    }
    
    // Register the background task with minimum interval of 15 minutes
    await BackgroundFetch.registerTaskAsync(SLOT_CHECK_TASK_NAME, {
      minimumInterval: 15, // Minimum time in minutes between calls
      stopOnTerminate: false, // Continue running after app termination (Android)
      startOnBoot: true // Start automatically after device reboot (Android)
    });
    
    log.info('Background task registered with OS');
  } catch (error) {
    log.error('Failed to register background task', error);
  }
}

/**
 * Unregisters the background task from the operating system.
 * 
 * @returns Promise that resolves when unregistration is complete
 */
export async function unregisterBackgroundTask(): Promise<void> {
  try {
    await BackgroundFetch.unregisterTaskAsync(SLOT_CHECK_TASK_NAME);
    log.info('Background task unregistered from OS');
  } catch (error) {
    log.error('Failed to unregister background task', error);
  }
} 