/**
 * Device ID Context Module
 * ----------------------
 * Provides global access to the device ID throughout the application.
 * Manages device identification state and persistence.
 * 
 * Features:
 * - Global device ID state management
 * - Automatic ID initialization
 * - ID reset capability
 * - Type-safe context usage
 * 
 * @module Contexts
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { DeviceService } from '../services/device';

/**
 * Device ID Context Type Definition
 * 
 * @interface DeviceIdContextType
 */
interface DeviceIdContextType {
    /** Current device ID, undefined if not yet initialized */
    deviceId: string | undefined;
    /** Function to update the device ID */
    setDeviceId: (id: string) => Promise<void>;
}

/**
 * Device ID Context
 * Provides device identification state to child components
 */
const DeviceIdContext = createContext<DeviceIdContextType | undefined>(undefined);

/**
 * Device ID Provider Component
 * 
 * Manages the device ID state and provides it to the application.
 * Automatically initializes the device ID on mount.
 * 
 * @component
 * @param {object} props - Component properties
 * @param {React.ReactNode} props.children - Child components
 */
export const DeviceIdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [deviceId, setDeviceIdState] = useState<string>();

    useEffect(() => {
        // Initialize device ID on first load
        const initDeviceId = async () => {
            const id = await DeviceService.getCurrentDeviceId();
            if (id) setDeviceIdState(id);
        };
        initDeviceId();
    }, []);

    /**
     * Updates the device ID
     * Resets the current ID before setting the new one
     * 
     * @async
     * @param {string} id - New device ID to set
     */
    const setDeviceId = async (id: string) => {
        await DeviceService.resetDeviceId();
        setDeviceIdState(id);
    };

    return (
        <DeviceIdContext.Provider value={{ deviceId, setDeviceId }}>
            {children}
        </DeviceIdContext.Provider>
    );
};

/**
 * Device ID Hook
 * 
 * Custom hook to access the device ID context.
 * Must be used within a DeviceIdProvider.
 * 
 * @returns {DeviceIdContextType} Device ID context value
 * @throws {Error} If used outside of DeviceIdProvider
 */
export const useDeviceId = (): DeviceIdContextType => {
    const context = useContext(DeviceIdContext);
    if (!context) {
        throw new Error('useDeviceId must be used within a DeviceIdProvider');
    }
    return context;
}; 