import * as Location from 'expo-location';
import { LocationService } from '~/src/services/location';

jest.mock('expo-location', () => ({
    requestForegroundPermissionsAsync: jest.fn(),
    getCurrentPositionAsync: jest.fn(),
    Accuracy: {
        Lowest: 1,
        Low: 2,
        Balanced: 3,
        High: 4,
        Highest: 5
    }
}));

describe('LocationService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getCurrentLocation', () => {
        it('sollte undefined zurückgeben wenn keine Berechtigung erteilt wurde', async () => {
            (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
                status: 'denied'
            });

            const location = await LocationService.getCurrentLocation();
            
            expect(location).toBeUndefined();
            expect(Location.getCurrentPositionAsync).not.toHaveBeenCalled();
        });

        it('sollte die gerundeten Koordinaten zurückgeben', async () => {
            (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
                status: 'granted'
            });
            (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValueOnce({
                coords: {
                    latitude: 52.520008,
                    longitude: 13.404954,
                    accuracy: 20
                },
                timestamp: 1234567890
            });

            const location = await LocationService.getCurrentLocation();
            
            expect(location).toEqual({
                latitude: 52.52,
                longitude: 13.405,
                accuracy: 20,
                timestamp: 1234567890
            });
            expect(Location.getCurrentPositionAsync).toHaveBeenCalledWith({
                accuracy: Location.Accuracy.Lowest
            });
        });

        it('sollte undefined zurückgeben wenn ein Fehler auftritt', async () => {
            (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValueOnce({
                status: 'granted'
            });
            (Location.getCurrentPositionAsync as jest.Mock).mockRejectedValueOnce(
                new Error('Location error')
            );

            const location = await LocationService.getCurrentLocation();
            
            expect(location).toBeUndefined();
        });
    });
}); 