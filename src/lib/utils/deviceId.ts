/**
 * Utilities for managing device identification in the SerenCity app.
 * @module
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

/** AsyncStorage key for persisting the device ID */
const DEVICE_ID_KEY = '@serencity:device_id';

/**
 * Retrieves the existing device ID from storage or creates a new one.
 * 
 * The device ID is a 12-character alphanumeric string that uniquely identifies
 * the device. Once created, it persists across app restarts but may change
 * if the app is reinstalled.
 * 
 * @returns A Promise that resolves to the device ID
 * 
 * @example
 * ```typescript
 * const deviceId = await getOrCreateDeviceId();
 * console.log(deviceId); // e.g., "a1b2c3d4e5f6"
 * ```
 * 
 * @throws {Error} If AsyncStorage operations fail
 */
export async function getOrCreateDeviceId(): Promise<string> {
    const storedId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    if (storedId) {
        return storedId;
    }

    const bytes = await Crypto.getRandomBytesAsync(8);
    const cleanId = Array.from(bytes)
        .map(b => b.toString(36))
        .join('')
        .slice(0, 12);

    await AsyncStorage.setItem(DEVICE_ID_KEY, cleanId);
    return cleanId;
}

/**
 * Validates if a given string matches the device ID format.
 * 
 * A valid device ID:
 * - Is exactly 12 characters long
 * - Contains only lowercase letters (a-z) and numbers (0-9)
 * - Is generated using base36 encoding
 * 
 * @param id - The string to validate
 * @returns `true` if the string is a valid device ID, `false` otherwise
 * 
 * @example
 * ```typescript
 * isValidDeviceId("a1b2c3d4e5f6"); // returns true
 * isValidDeviceId("invalid!"); // returns false
 * isValidDeviceId("tooshort"); // returns false
 * ```
 */
export function isValidDeviceId(id: string): boolean {
    return /^[0-9a-z]{12}$/.test(id);
} 