import { act, renderHook } from '@testing-library/react-native';
import React from 'react';
import { DeviceIdProvider, useDeviceId } from '~/src/contexts/DeviceIdContext';
import { UserService } from '~/src/services/user';

// Mock der UserService Funktionen
jest.mock('~/src/services/user', () => ({
    UserService: {
        getUserId: jest.fn(),
        resetUserId: jest.fn()
    }
}));

describe('DeviceIdContext', () => {
    const mockDeviceId = 'TEST-DEVICE-1';

    beforeEach(() => {
        jest.clearAllMocks();
        (UserService.getUserId as jest.Mock).mockResolvedValue(mockDeviceId);
        (UserService.resetUserId as jest.Mock).mockResolvedValue(mockDeviceId);
    });

    it('sollte die device_id beim ersten Laden abrufen', async () => {
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <DeviceIdProvider>{children}</DeviceIdProvider>
        );

        const { result } = renderHook(() => useDeviceId(), { wrapper });

        // Initial sollte deviceId undefined sein
        expect(result.current.deviceId).toBeUndefined();

        // Warte auf die asynchrone Initialisierung
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Nach der Initialisierung sollte deviceId gesetzt sein
        expect(result.current.deviceId).toBe(mockDeviceId);
        expect(UserService.getUserId).toHaveBeenCalled();
    });

    it('sollte die device_id über setDeviceId aktualisieren können', async () => {
        const newDeviceId = 'NEW-TEST-DEVICE';
        const wrapper = ({ children }: { children: React.ReactNode }) => (
            <DeviceIdProvider>{children}</DeviceIdProvider>
        );

        const { result } = renderHook(() => useDeviceId(), { wrapper });

        // Warte auf die initiale Initialisierung
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Setze neue device_id
        await act(async () => {
            await result.current.setDeviceId(newDeviceId);
        });

        expect(result.current.deviceId).toBe(newDeviceId);
        expect(UserService.resetUserId).toHaveBeenCalled();
    });

    it('sollte einen Fehler werfen wenn useDeviceId außerhalb des Providers verwendet wird', () => {
        const consoleError = console.error;
        console.error = jest.fn(); // Unterdrücke React-Fehler in der Konsole
        
        try {
            renderHook(() => useDeviceId());
            fail('Hook sollte einen Fehler werfen');
        } catch (error) {
            expect(error).toEqual(
                Error('useDeviceId muss innerhalb eines DeviceIdProvider verwendet werden')
            );
        }

        console.error = consoleError; // Stelle console.error wieder her
    });
}); 