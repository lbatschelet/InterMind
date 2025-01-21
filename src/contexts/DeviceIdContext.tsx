import React, { createContext, useContext, useEffect, useState } from 'react';
import { DeviceService } from '../services/device';

interface DeviceIdContextType {
    deviceId: string | undefined;
    setDeviceId: (id: string) => Promise<void>;
}

const DeviceIdContext = createContext<DeviceIdContextType | undefined>(undefined);

export const DeviceIdProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [deviceId, setDeviceIdState] = useState<string>();

    useEffect(() => {
        // Beim ersten Laden die device_id abrufen
        const initDeviceId = async () => {
            const id = await DeviceService.getCurrentDeviceId();
            if (id) setDeviceIdState(id);
        };
        initDeviceId();
    }, []);

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

export const useDeviceId = (): DeviceIdContextType => {
    const context = useContext(DeviceIdContext);
    if (!context) {
        throw new Error('useDeviceId muss innerhalb eines DeviceIdProvider verwendet werden');
    }
    return context;
}; 