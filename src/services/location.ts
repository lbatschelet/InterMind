/**
 * @packageDocumentation
 * @module Services/Location
 * 
 * @summary
 * Provides privacy-focused location services for the application.
 * 
 * @remarks
 * This service is designed with privacy as a core principle, implementing
 * various measures to protect user location data while still providing
 * sufficient accuracy for the assessment context.
 * 
 * Privacy Measures:
 * - Uses low accuracy mode (100-500m radius)
 * - Rounds coordinates to reduce precision (~100m)
 * - Single location fix (no continuous tracking)
 * - Permission-based access
 * 
 * @example
 * ```typescript
 * const location = await LocationService.getCurrentLocation();
 * if (location) {
 *   // Location available with reduced precision
 * } else {
 *   // Permission denied or error occurred
 * }
 * ```
 */

import * as Location from 'expo-location';
import { debugLog } from '~/src/config/debug';

/**
 * Represents a location reading with reduced accuracy for privacy.
 * 
 * @typedef {Object} LocationData
 * @property {number} latitude - Approximate latitude, rounded to 3 decimal places (~100m accuracy)
 * @property {number} longitude - Approximate longitude, rounded to 3 decimal places (~100m accuracy)
 * @property {number} [accuracy] - Accuracy radius in meters, if available from the device
 * @property {number} timestamp - Unix timestamp when the location was recorded
 */
export interface LocationData {
    latitude: number;
    longitude: number;
    accuracy?: number | null;
    timestamp: number;
}

/**
 * Service providing privacy-focused location functionality.
 * 
 * @namespace
 */
export const LocationService = {
    /**
     * Retrieves the user's current location with reduced accuracy.
     * 
     * @returns Location data with reduced precision or undefined if permission denied
     * 
     * @example
     * ```typescript
     * const location = await LocationService.getCurrentLocation();
     * if (location) {
     *   console.log(`Lat: ${location.latitude}, Lon: ${location.longitude}`);
     * }
     * ```
     */
    getCurrentLocation: async (): Promise<LocationData | undefined> => {
        try {
            debugLog('services', 'Requesting location permission');
            const { status } = await Location.requestForegroundPermissionsAsync();
            
            if (status !== 'granted') {
                debugLog('services', 'Location permission denied');
                return undefined;
            }

            debugLog('services', 'Retrieving current location with reduced accuracy');
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Lowest,  // Lowest accuracy for privacy
            });

            /**
             * Rounds a coordinate to reduce precision for privacy.
             * 
             * @param coord - The coordinate to round
             * @returns Rounded coordinate with 3 decimal places (~100m precision)
             */
            const roundCoordinate = (coord: number) => {
                const precision = 3;  // 3 decimal places ≈ 100m precision
                return Number(coord.toFixed(precision));
            };

            const locationData = {
                latitude: roundCoordinate(location.coords.latitude),
                longitude: roundCoordinate(location.coords.longitude),
                accuracy: location.coords.accuracy,
                timestamp: location.timestamp
            };

            debugLog('services', 'Location retrieved:', locationData);
            return locationData;
        } catch (error) {
            debugLog('services', 'Error retrieving location:', error);
            return undefined;
        }
    }
}; 