/**
 * @packageDocumentation
 * @module Services/Device
 * 
 * @summary
 * Manages device identification and data lifecycle in the application.
 * 
 * @remarks
 * Each device receives a human-readable unique identifier that enables
 * data access and synchronization.
 * 
 * Device ID Format:
 * - Format: XXXX-XXXX-XXXX (e.g., "ABC1-2DEF-3GHI")
 * - 12 alphanumeric characters
 * - Grouped in blocks of 4
 * - Separated by hyphens
 * 
 * Benefits of Readable IDs:
 * - Human-readable for support and debugging
 * - Easy to communicate verbally
 * - Memorable format similar to product keys
 * - Sufficient uniqueness for app purposes
 * 
 * Lifecycle Management:
 * 1. First Launch:
 *    - Generate new device ID
 *    - Store in AsyncStorage
 *    - Initialize device session
 * 
 * 2. Subsequent Launches:
 *    - Retrieve stored ID
 *    - Validate format
 *    - Regenerate if invalid
 * 
 * 3. Data Management:
 *    - Associates assessments with device
 *    - Enables data cleanup
 *    - Supports device reset
 * 
 * Privacy Considerations:
 * - IDs are device-specific, not user-specific
 * - No personal data in ID format
 * - Resettable for privacy needs
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { debugLog } from '~/src/config/debug';
import { supabase } from './supabase';

/** @type {string} Storage key for the device ID */
const DEVICE_ID_KEY = 'device_id';

/** @type {string} Storage key prefix for assessment drafts */
const STORAGE_KEY = 'assessment_drafts';

/**
 * Generates a human-readable device identifier.
 * 
 * @returns Generated device ID in format XXXX-XXXX-XXXX
 * 
 * @remarks
 * Creates a 12-character string in the format XXXX-XXXX-XXXX using
 * alphanumeric characters (0-9, A-Z). Each block is randomly generated
 * and separated by hyphens.
 * 
 * @example
 * ```typescript
 * const id = generateReadableId();
 * console.log(id); // "ABC1-2DEF-3GHI"
 * ```
 */
const generateReadableId = (): string => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const blocks = Array(3)
        .fill(0)
        .map(() => 
            Array(4)
                .fill(0)
                .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
                .join('')
        );
    return blocks.join('-');
};

/**
 * Validates a device ID string against the required format.
 * 
 * @param id - The device ID to validate
 * @returns True if format is valid, false otherwise
 * 
 * @remarks
 * Checks if the provided string matches the pattern XXXX-XXXX-XXXX
 * where X is any alphanumeric character (0-9, A-Z).
 * 
 * @example
 * ```typescript
 * isValidFormat("ABC1-2DEF-3GHI") // → true
 * isValidFormat("invalid-id")      // → false
 * ```
 */
const isValidFormat = (id: string): boolean => {
    return /^[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(id);
};

/**
 * Service providing device identification and management.
 * 
 * @namespace
 */
export const DeviceService = {
    /**
     * Retrieves or generates the device identifier.
     * 
     * @returns Device ID in format XXXX-XXXX-XXXX
     * 
     * @remarks
     * This is the primary method for getting a device's ID. It will:
     * 1. Check AsyncStorage for existing ID
     * 2. Validate the format if found
     * 3. Generate new ID if none exists or invalid
     * 4. Store and return the final ID
     * 
     * @example
     * ```typescript
     * const deviceId = await DeviceService.getDeviceId();
     * console.log(`Using device: ${deviceId}`);
     * ```
     */
    getDeviceId: async (): Promise<string> => {
        try {
            let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
            
            if (!deviceId || !isValidFormat(deviceId)) {
                deviceId = generateReadableId();
                await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
                debugLog('services', 'Created new device ID:', deviceId);
            } else {
                debugLog('services', 'Using existing device ID:', deviceId);
            }
            
            return deviceId;
        } catch (error) {
            debugLog('services', 'Error managing device ID:', error);
            return generateReadableId();
        }
    },

    /**
     * Retrieves the current device ID without generation.
     * 
     * @returns Current device ID or null if not set
     * 
     * @remarks
     * Unlike getDeviceId(), this method will not generate a new ID
     * if none exists. Useful for checking device registration status.
     * 
     * @example
     * ```typescript
     * const currentId = await DeviceService.getCurrentDeviceId();
     * if (currentId) {
     *   console.log('Device is registered');
     * }
     * ```
     */
    getCurrentDeviceId: async (): Promise<string | null> => {
        return AsyncStorage.getItem(DEVICE_ID_KEY);
    },

    /**
     * Generates and sets a new device identifier.
     * 
     * @returns Newly generated device ID
     * 
     * @remarks
     * WARNING: This operation disconnects the device from its previous data.
     * Use with caution as it effectively creates a new device identity.
     * 
     * Common use cases:
     * - Privacy resets
     * - Troubleshooting
     * - Testing scenarios
     * 
     * @example
     * ```typescript
     * const newId = await DeviceService.resetDeviceId();
     * console.log(`Device reset to: ${newId}`);
     * ```
     */
    resetDeviceId: async (): Promise<string> => {
        const newId = generateReadableId();
        await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
        debugLog('services', 'Reset device ID to:', newId);
        return newId;
    },

    /**
     * Removes all data associated with the current device.
     * 
     * @throws {Error} If any deletion operation fails
     * 
     * @remarks
     * Performs a complete cleanup of device data:
     * 1. Retrieves all assessments for device
     * 2. Deletes associated answers
     * 3. Removes assessment records
     * 4. Clears local drafts
     * 
     * Note: This operation is irreversible and should be used with caution.
     * 
     * @example
     * ```typescript
     * try {
     *   await DeviceService.deleteDeviceData();
     *   console.log('Device data cleared');
     * } catch (error) {
     *   console.error('Cleanup failed:', error);
     * }
     * ```
     */
    deleteDeviceData: async (): Promise<void> => {
        debugLog('services', 'Initiating device data deletion');
        
        try {
            const deviceId = await DeviceService.getCurrentDeviceId();
            if (!deviceId) {
                debugLog('services', 'No device ID found, nothing to delete');
                return;
            }

            await supabase.rpc('set_device_id', { device_id: deviceId });
            debugLog('database', 'Set device_id in session:', deviceId);

            const { data: assessments, error: assessmentError } = await supabase
                .from('assessments')
                .select('id')
                .eq('device_id', deviceId);

            if (assessmentError) {
                debugLog('database', 'Error loading assessments:', assessmentError);
                throw assessmentError;
            }

            const assessmentIds = assessments?.map(a => a.id) || [];
            debugLog('database', 'Found assessment IDs:', assessmentIds);

            if (assessmentIds.length > 0) {
                const { error: answersError } = await supabase
                    .from('assessment_answers')
                    .delete()
                    .in('assessment_id', assessmentIds);

                if (answersError) {
                    debugLog('database', 'Error deleting answers:', answersError);
                    throw answersError;
                }
                debugLog('database', 'All answers deleted');
            }

            const { error: deleteError } = await supabase
                .from('assessments')
                .delete()
                .eq('device_id', deviceId);

            if (deleteError) {
                debugLog('database', 'Error deleting assessments:', deleteError);
                throw deleteError;
            }
            debugLog('database', 'All assessments deleted');

            const keys = await AsyncStorage.getAllKeys();
            const draftKeys = keys.filter(key => key.startsWith(STORAGE_KEY));
            await AsyncStorage.multiRemove(draftKeys);
            debugLog('services', 'Local drafts deleted');

            debugLog('services', 'Device data successfully deleted');
        } catch (error) {
            debugLog('services', 'Error during device data deletion:', error);
            throw error;
        }
    }
}; 