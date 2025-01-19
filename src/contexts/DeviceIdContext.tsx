import React, { createContext, useContext, useEffect, useState } from 'react';
import { setDeviceId } from '../services/supabase';
import { UserService } from '../services/user';

interface DeviceIdContextType {
    deviceId: string | null;
}

const DeviceIdContext = createContext<DeviceIdContextType>({ deviceId: null });

export const useDeviceId = () => useContext(DeviceIdContext);

export const DeviceIdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [deviceId, setDeviceIdState] = useState<string | null>(null);

    useEffect(() => {
        const loadDeviceId = async () => {
            const id = await UserService.getUserId();
            setDeviceIdState(id);
            if (id) {
                await setDeviceId(id);
            }
        };

        loadDeviceId();
    }, []);

    return (
        <DeviceIdContext.Provider value={{ deviceId }}>
            {children}
        </DeviceIdContext.Provider>
    );
}; 