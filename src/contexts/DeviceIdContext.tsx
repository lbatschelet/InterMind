import { createContext, useContext, useEffect, useState } from 'react';
import { getOrCreateDeviceId } from '../lib/utils/deviceId';

interface DeviceIdContextType {
    deviceId: string | null;
    isLoading: boolean;
}

const DeviceIdContext = createContext<DeviceIdContextType>({
    deviceId: null,
    isLoading: true,
});

export function DeviceIdProvider({ children }: { children: React.ReactNode }) {
    const [deviceId, setDeviceId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getOrCreateDeviceId()
            .then(setDeviceId)
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <DeviceIdContext.Provider value={{ deviceId, isLoading }}>
            {children}
        </DeviceIdContext.Provider>
    );
}

export function useDeviceId() {
    return useContext(DeviceIdContext);
} 