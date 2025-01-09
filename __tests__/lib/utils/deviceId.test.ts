import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import { getOrCreateDeviceId, isValidDeviceId } from '~/src/lib/utils/deviceId';

// Mock Typen
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock('expo-application', () => ({
    getInstallationTimeAsync: jest.fn(),
}));

jest.mock('expo-device', () => ({
    brand: 'Apple',
    modelName: 'iPhone 12',
    osVersion: '15.0',
}));

describe('deviceId utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getOrCreateDeviceId', () => {
        it('returns existing id from storage if available', async () => {
            const mockId = 'SC1234567890';
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(mockId);

            const result = await getOrCreateDeviceId();

            expect(result).toBe(mockId);
            expect(AsyncStorage.getItem).toHaveBeenCalledWith('@serencity:device_id');
            expect(AsyncStorage.setItem).not.toHaveBeenCalled();
        });

        it('creates and stores new id if none exists', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
            (Application.getInstallationTimeAsync as jest.Mock).mockResolvedValueOnce(123456789);

            const result = await getOrCreateDeviceId();

            expect(isValidDeviceId(result)).toBe(true);
            expect(AsyncStorage.getItem).toHaveBeenCalledWith('@serencity:device_id');
            expect(AsyncStorage.setItem).toHaveBeenCalledWith('@serencity:device_id', result);
        });

        it('generates consistent ids for same device info', async () => {
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
            (Application.getInstallationTimeAsync as jest.Mock).mockResolvedValueOnce(123456789);

            const result1 = await getOrCreateDeviceId();
            
            (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);
            (Application.getInstallationTimeAsync as jest.Mock).mockResolvedValueOnce(123456789);

            const result2 = await getOrCreateDeviceId();

            expect(result1).toBe(result2);
        });
    });

    describe('isValidDeviceId', () => {
        it('validates correct format', () => {
            expect(isValidDeviceId('SC1234567890')).toBe(true);
            expect(isValidDeviceId('SCabcDEF1234')).toBe(true);
        });

        it('rejects invalid formats', () => {
            expect(isValidDeviceId('1234567890')).toBe(false);
            expect(isValidDeviceId('SC123456')).toBe(false);
            expect(isValidDeviceId('SC123456789!')).toBe(false);
            expect(isValidDeviceId('sc1234567890')).toBe(false);
        });
    });
}); 