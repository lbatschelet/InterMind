import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserService } from '../services/user';

interface DeviceIdContextType {
    deviceId: string | null;
}

const DeviceIdContext = createContext<DeviceIdContextType>({ deviceId: null });

export const useDeviceId = () => useContext(DeviceIdContext);

export const DeviceIdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [deviceId, setDeviceId] = useState<string | null>(null);

    useEffect(() => {
        const loadDeviceId = async () => {
            const id = await UserService.getUserId();
            setDeviceId(id);
        };

        loadDeviceId();
    }, []);

    return (
        <DeviceIdContext.Provider value={{ deviceId }}>
            {children}
        </DeviceIdContext.Provider>
    );
}; 