/**
 * Device Service
 * -------------
 * Handles device identification in the app. Each device gets a unique
 * readable ID (e.g., "ABC1-2DEF-3GHI") for identification and data access.
 * 
 * Why readable IDs?
 * ---------------
 * - Easy to communicate if needed (support, debugging)
 * - User-friendly format (compared to UUIDs)
 * - Follows pattern: XXXX-XXXX-XXXX (like product keys)
 * 
 * ID Lifecycle:
 * -----------
 * 1. First app start: Generate new ID
 * 2. Store ID in AsyncStorage
 * 3. Reuse stored ID on subsequent starts
 * 4. Reset possible through resetDeviceId()
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { debugLog } from '~/src/config/debug';
import { supabase } from './supabase';

const DEVICE_ID_KEY = 'device_id';
const STORAGE_KEY = 'assessment_drafts';

/**
 * Generates a 12-character readable ID in format "XXXX-XXXX-XXXX"
 * Example: "ABC1-2DEF-3GHI"
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
 * Validates if a string matches the ID format XXXX-XXXX-XXXX
 */
const isValidFormat = (id: string): boolean => {
    return /^[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(id);
};

export const DeviceService = {
    /**
     * Gets or creates a device ID
     * 
     * Flow:
     * 1. Try to get existing ID from storage
     * 2. Validate format if ID exists
     * 3. Generate new ID if none exists or invalid
     * 4. Store and return ID
     * 
     * @returns Promise<string> Device ID in format XXXX-XXXX-XXXX
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
            // Fallback: Generate new ID if storage fails
            return generateReadableId();
        }
    },

    /**
     * Gets the current device ID without generating a new one
     * Useful for checking if a device is already registered
     * 
     * @returns Promise<string | null> Current device ID or null if none exists
     */
    getCurrentDeviceId: async (): Promise<string | null> => {
        return AsyncStorage.getItem(DEVICE_ID_KEY);
    },

    /**
     * Resets the device ID by generating a new one
     * Use with caution as this will disconnect from previous data
     * 
     * @returns Promise<string> New device ID
     */
    resetDeviceId: async (): Promise<string> => {
        const newId = generateReadableId();
        await AsyncStorage.setItem(DEVICE_ID_KEY, newId);
        debugLog('services', 'Reset device ID to:', newId);
        return newId;
    },

    /**
     * Deletes all data associated with a device
     * This includes assessments, answers, and local drafts
     */
    deleteDeviceData: async (): Promise<void> => {
        debugLog('services', 'Lösche alle Daten für das Gerät');
        
        try {
            const deviceId = await DeviceService.getCurrentDeviceId();
            if (!deviceId) {
                debugLog('services', 'Keine Device ID gefunden, nichts zu löschen');
                return;
            }

            // Setze die device_id in der Session VOR dem Datenbankzugriff
            await supabase.rpc('set_device_id', { device_id: deviceId });
            debugLog('database', 'Set device_id in session:', deviceId);

            // Hole zuerst alle Assessments des Geräts
            const { data: assessments, error: assessmentError } = await supabase
                .from('assessments')
                .select('id')
                .eq('device_id', deviceId);

            if (assessmentError) {
                debugLog('database', 'Fehler beim Laden der Assessments:', assessmentError);
                throw assessmentError;
            }

            const assessmentIds = assessments?.map(a => a.id) || [];
            debugLog('database', 'Gefundene Assessment IDs:', assessmentIds);

            // Lösche alle zugehörigen Antworten
            if (assessmentIds.length > 0) {
                const { error: answersError } = await supabase
                    .from('assessment_answers')
                    .delete()
                    .in('assessment_id', assessmentIds);

                if (answersError) {
                    debugLog('database', 'Fehler beim Löschen der Antworten:', answersError);
                    throw answersError;
                }
                debugLog('database', 'Alle Antworten gelöscht');
            }

            // Lösche alle Assessments des Geräts
            const { error: deleteError } = await supabase
                .from('assessments')
                .delete()
                .eq('device_id', deviceId);

            if (deleteError) {
                debugLog('database', 'Fehler beim Löschen der Assessments:', deleteError);
                throw deleteError;
            }
            debugLog('database', 'Alle Assessments gelöscht');

            // Lösche lokale Drafts
            const keys = await AsyncStorage.getAllKeys();
            const draftKeys = keys.filter(key => key.startsWith(STORAGE_KEY));
            await AsyncStorage.multiRemove(draftKeys);
            debugLog('services', 'Lokale Drafts gelöscht');

            debugLog('services', 'Alle Gerätedaten erfolgreich gelöscht');
        } catch (error) {
            debugLog('services', 'Fehler beim Löschen der Gerätedaten:', error);
            throw error;
        }
    }
}; 