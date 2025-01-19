/**
 * User Service
 * -----------
 * Handles device identification in the app. In our case, each device is treated
 * as a unique "user" with its own readable ID (e.g., "ABC1-2DEF-3GHI").
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
 * 4. Reset possible through resetUserId()
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = 'user_id';

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

export const UserService = {
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
    getUserId: async (): Promise<string> => {
        try {
            let userId = await AsyncStorage.getItem(USER_ID_KEY);
            
            if (!userId || !isValidFormat(userId)) {
                userId = generateReadableId();
                await AsyncStorage.setItem(USER_ID_KEY, userId);
                console.log('Created new device ID:', userId);
            } else {
                console.log('Using existing device ID:', userId);
            }
            
            return userId;
        } catch (error) {
            console.error('Error managing device ID:', error);
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
    getCurrentUserId: async (): Promise<string | null> => {
        return AsyncStorage.getItem(USER_ID_KEY);
    },

    /**
     * Resets the device ID by generating a new one
     * Use with caution as this will disconnect from previous data
     * 
     * @returns Promise<string> New device ID
     */
    resetUserId: async (): Promise<string> => {
        const newId = generateReadableId();
        await AsyncStorage.setItem(USER_ID_KEY, newId);
        console.log('Reset device ID to:', newId);
        return newId;
    }
}; 