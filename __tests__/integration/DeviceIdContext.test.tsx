import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { DeviceIdProvider, useDeviceId } from '~/src/contexts/DeviceIdContext';
import { AssessmentService } from '~/src/services/assessment';
import { UserService } from '~/src/services/user';

// Mock der externen Services
jest.mock('~/src/services/assessment');
jest.mock('~/src/services/user', () => ({
    UserService: {
        getUserId: jest.fn(),
        resetUserId: jest.fn()
    }
}));

// Test-Komponente die den DeviceId-Context nutzt
const TestComponent = () => {
    const { deviceId, setDeviceId } = useDeviceId();
    return (
        <View>
            <Text testID="device-id">{deviceId || 'no-device-id'}</Text>
            <Pressable 
                onPress={() => setDeviceId('NEW-DEVICE-ID')}
                testID="change-device-id"
            >
                <Text>Change Device ID</Text>
            </Pressable>
        </View>
    );
};

describe('DeviceIdContext Integration', () => {
    const mockDeviceId = 'TEST-DEVICE-1';

    beforeEach(() => {
        jest.clearAllMocks();
        (UserService.getUserId as jest.Mock).mockResolvedValue(mockDeviceId);
        (UserService.resetUserId as jest.Mock).mockResolvedValue('NEW-DEVICE-ID');
        (AssessmentService.createAssessment as jest.Mock).mockResolvedValue({
            id: 'test-assessment-123',
            deviceId: mockDeviceId,
            userId: mockDeviceId,
            startedAt: new Date(),
            completedAt: null
        });
    });

    it('sollte die device_id korrekt durch den Context propagieren', async () => {
        const { getByTestId } = render(
            <DeviceIdProvider>
                <TestComponent />
            </DeviceIdProvider>
        );

        // Initial sollte keine device_id gesetzt sein
        expect(getByTestId('device-id')).toHaveTextContent('no-device-id');

        // Warte auf die asynchrone Initialisierung
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Nach der Initialisierung sollte die device_id gesetzt sein
        expect(getByTestId('device-id')).toHaveTextContent(mockDeviceId);
    });

    it('sollte die device_id in allen Kind-Komponenten aktualisieren', async () => {
        const { getAllByTestId, getByTestId } = render(
            <DeviceIdProvider>
                <TestComponent />
                <TestComponent />
            </DeviceIdProvider>
        );

        // Warte auf die initiale Initialisierung
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Ändere die device_id
        await act(async () => {
            fireEvent.press(getByTestId('change-device-id'));
        });

        // Beide Komponenten sollten die neue device_id haben
        const deviceIds = getAllByTestId('device-id');
        deviceIds.forEach(element => {
            expect(element).toHaveTextContent('NEW-DEVICE-ID');
        });
    });

    it('sollte die device_id beim Assessment-Service korrekt setzen', async () => {
        const { getByTestId } = render(
            <DeviceIdProvider>
                <TestComponent />
            </DeviceIdProvider>
        );

        // Warte auf die initiale Initialisierung
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Erstelle ein Assessment
        await act(async () => {
            await AssessmentService.createAssessment();
        });

        // Überprüfe ob die korrekte device_id verwendet wurde
        const createdAssessment = (AssessmentService.createAssessment as jest.Mock).mock.results[0].value;
        expect(createdAssessment.deviceId).toBe(mockDeviceId);
    });

    it('sollte die device_id nach dem Reset korrekt aktualisieren', async () => {
        const { getByTestId } = render(
            <DeviceIdProvider>
                <TestComponent />
            </DeviceIdProvider>
        );

        // Warte auf die initiale Initialisierung
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 0));
        });

        // Ändere die device_id
        await act(async () => {
            fireEvent.press(getByTestId('change-device-id'));
        });

        // UserService.resetUserId sollte aufgerufen worden sein
        expect(UserService.resetUserId).toHaveBeenCalled();

        // Die neue device_id sollte gesetzt sein
        expect(getByTestId('device-id')).toHaveTextContent('NEW-DEVICE-ID');

        // Erstelle ein Assessment mit der neuen device_id
        await act(async () => {
            await AssessmentService.createAssessment();
        });

        // Das Assessment sollte die neue device_id verwenden
        const createdAssessment = (AssessmentService.createAssessment as jest.Mock).mock.results[1].value;
        expect(createdAssessment.deviceId).toBe('NEW-DEVICE-ID');
    });
}); 