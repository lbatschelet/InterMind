import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceService } from '~/src/services/device';
import { supabase } from '~/src/services/supabase';

// Mock der externen Services
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    multiRemove: jest.fn(() => Promise.resolve())
}));

jest.mock('~/src/services/supabase', () => ({
    supabase: {
        rpc: jest.fn(() => Promise.resolve({ data: null, error: null })),
        from: jest.fn(() => ({
            select: jest.fn(() => ({
                eq: jest.fn(() => Promise.resolve({ data: [], error: null }))
            })),
            delete: jest.fn(() => ({
                eq: jest.fn(() => Promise.resolve({ error: null })),
                in: jest.fn(() => Promise.resolve({ error: null }))
            }))
        }))
    }
}));

describe('DeviceService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getDeviceId', () => {
        it('sollte eine vorhandene Device ID zurückgeben', async () => {
            const mockDeviceId = 'TEST-1234-ABCD';
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(mockDeviceId);

            const deviceId = await DeviceService.getDeviceId();
            
            expect(deviceId).toBe(mockDeviceId);
            expect(AsyncStorage.getItem).toHaveBeenCalledWith('device_id');
            expect(AsyncStorage.setItem).not.toHaveBeenCalled();
        });

        it('sollte eine neue Device ID generieren wenn keine existiert', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

            const deviceId = await DeviceService.getDeviceId();
            
            expect(deviceId).toMatch(/^[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/);
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('device_id', deviceId);
        });

        it('sollte eine neue Device ID generieren wenn das Format ungültig ist', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('invalid-id');

            const deviceId = await DeviceService.getDeviceId();
            
            expect(deviceId).toMatch(/^[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/);
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('device_id', deviceId);
        });
    });

    describe('getCurrentDeviceId', () => {
        it('sollte die aktuelle Device ID zurückgeben', async () => {
            const mockDeviceId = 'TEST-1234-ABCD';
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(mockDeviceId);

            const deviceId = await DeviceService.getCurrentDeviceId();
            
            expect(deviceId).toBe(mockDeviceId);
            expect(AsyncStorage.getItem).toHaveBeenCalledWith('device_id');
        });

        it('sollte null zurückgeben wenn keine Device ID existiert', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

            const deviceId = await DeviceService.getCurrentDeviceId();
            
            expect(deviceId).toBeNull();
        });
    });

    describe('resetDeviceId', () => {
        it('sollte eine neue Device ID generieren und speichern', async () => {
            const newDeviceId = await DeviceService.resetDeviceId();
            
            expect(newDeviceId).toMatch(/^[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/);
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('device_id', newDeviceId);
        });
    });

    describe('deleteDeviceData', () => {
        it('sollte alle Daten für eine Device ID löschen', async () => {
            const mockDeviceId = 'TEST-1234-ABCD';
            const mockAssessments = [{ id: 'test-1' }, { id: 'test-2' }];
            
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(mockDeviceId);
            (supabase.from as jest.Mock).mockImplementation((table) => ({
                select: jest.fn(() => ({
                    eq: jest.fn(() => Promise.resolve({ data: mockAssessments, error: null }))
                })),
                delete: jest.fn(() => ({
                    eq: jest.fn(() => Promise.resolve({ error: null })),
                    in: jest.fn(() => Promise.resolve({ error: null }))
                }))
            }));

            await DeviceService.deleteDeviceData();
            
            // Überprüfe Supabase Aufrufe
            expect(supabase.rpc).toHaveBeenCalledWith('set_device_id', { device_id: mockDeviceId });
            expect(supabase.from).toHaveBeenCalledWith('assessments');
            expect(supabase.from).toHaveBeenCalledWith('assessment_answers');
            
            // Überprüfe AsyncStorage Aufrufe
            expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
            expect(AsyncStorage.multiRemove).toHaveBeenCalled();
        });

        it('sollte nichts tun wenn keine Device ID existiert', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

            await DeviceService.deleteDeviceData();
            
            expect(supabase.rpc).not.toHaveBeenCalled();
            expect(supabase.from).not.toHaveBeenCalled();
            expect(AsyncStorage.multiRemove).not.toHaveBeenCalled();
        });

        it('sollte einen Fehler werfen wenn das Löschen fehlschlägt', async () => {
            const mockDeviceId = 'TEST-1234-ABCD';
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(mockDeviceId);
            (supabase.from as jest.Mock).mockImplementation(() => ({
                select: jest.fn(() => ({
                    eq: jest.fn(() => Promise.resolve({ data: null, error: new Error('DB Error') }))
                }))
            }));

            await expect(DeviceService.deleteDeviceData()).rejects.toThrow('DB Error');
        });
    });
}); 