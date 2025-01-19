/**
 * Location Service
 * ---------------
 * This service handles all location-related functionality in the app.
 * It provides a simplified and privacy-focused way to get the user's location.
 * 
 * Privacy Features:
 * ----------------
 * - Uses low accuracy mode (100-500m radius)
 * - Rounds coordinates to reduce precision
 * - Only requests location when starting an assessment
 * - No continuous tracking
 * 
 * How it works:
 * ------------
 * 1. Requests permission from the user
 * 2. Gets a single location fix
 * 3. Reduces accuracy for privacy
 * 4. Returns the approximated location
 */

import * as Location from 'expo-location';

/**
 * Represents a single location reading with reduced accuracy
 */
export interface LocationData {
    /** Approximate latitude, rounded to 3 decimal places (~100m accuracy) */
    latitude: number;

    /** Approximate longitude, rounded to 3 decimal places (~100m accuracy) */
    longitude: number;

    /** Accuracy radius in meters (if available) */
    accuracy?: number | null;

    /** Timestamp when the location was recorded */
    timestamp: number;
}

/**
 * Service to handle location-related functionality
 */
export const LocationService = {
    /**
     * Gets the user's current location with reduced accuracy for privacy
     * 
     * Privacy measures:
     * - Uses lowest accuracy setting
     * - Rounds coordinates to ~100m precision
     * - Single request (no tracking)
     * 
     * @returns LocationData with reduced precision or undefined if:
     * - User denies permission
     * - Location services are disabled
     * - Error occurs during location request
     */
    getCurrentLocation: async (): Promise<LocationData | undefined> => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                console.log('Location permission denied');
                return undefined;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Lowest,  // Lowest accuracy for privacy
            });

            // Round coordinates to reduce precision (~100m accuracy)
            const roundCoordinate = (coord: number) => {
                const precision = 3;  // 3 decimal places ≈ 100m precision
                return Number(coord.toFixed(precision));
            };

            return {
                latitude: roundCoordinate(location.coords.latitude),
                longitude: roundCoordinate(location.coords.longitude),
                accuracy: location.coords.accuracy,
                timestamp: location.timestamp
            };
        } catch (error) {
            console.error('Error getting location:', error);
            return undefined;
        }
    }
}; 