import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { DeviceIdProvider } from '~/src/contexts/DeviceIdContext';
import HomeScreen from '~/src/screens/HomeScreen';
import { AssessmentService } from '~/src/services/assessment';

// Mock der externen Services
jest.mock('~/src/services/assessment');

// Mock der Navigation
const mockNavigation = {
    navigate: jest.fn()
} as any;

describe('HomeScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock der AssessmentService Funktionen
        (AssessmentService.createAssessment as jest.Mock).mockResolvedValue({
            id: 'test-assessment-123',
            deviceId: 'TEST-DEVICE-1',
            userId: 'TEST-DEVICE-1',
            startedAt: new Date(),
            completedAt: null
        });
    });

    it('renders correctly', () => {
        const { getByText } = render(
            <HomeScreen navigation={mockNavigation} />
        );
        expect(getByText('Start Assessment')).toBeTruthy();
    });

    it('navigates to AssessmentScreen on button press', () => {
        const { getByText } = render(<HomeScreen navigation={mockNavigation} />);
        fireEvent.press(getByText('Start Assessment'));
        expect(mockNavigation.navigate).toHaveBeenCalledWith('Assessment');
    });

    it('sollte ein neues Assessment starten wenn der Start-Button geklickt wird', async () => {
        const { getByText } = render(
            <DeviceIdProvider>
                <HomeScreen navigation={mockNavigation} />
            </DeviceIdProvider>
        );

        await act(async () => {
            fireEvent.press(getByText('Start Assessment'));
        });

        expect(AssessmentService.createAssessment).toHaveBeenCalled();
        expect(mockNavigation.navigate).toHaveBeenCalledWith('Question', {
            assessmentId: 'test-assessment-123',
            questionIndex: 0
        });
    });

    it('sollte einen Fehler anzeigen wenn das Assessment nicht erstellt werden kann', async () => {
        // Mock eines Fehlers
        (AssessmentService.createAssessment as jest.Mock).mockResolvedValue(null);

        const { getByText } = render(
            <DeviceIdProvider>
                <HomeScreen navigation={mockNavigation} />
            </DeviceIdProvider>
        );

        await act(async () => {
            fireEvent.press(getByText('Start Assessment'));
        });

        expect(getByText('Fehler beim Erstellen des Assessments')).toBeTruthy();
    });

    it('sollte den Loading-Zustand während der Assessment-Erstellung anzeigen', async () => {
        // Mock einer verzögerten Assessment-Erstellung
        (AssessmentService.createAssessment as jest.Mock).mockImplementation(
            () => new Promise(resolve => setTimeout(resolve, 100))
        );

        const { getByText, queryByText } = render(
            <DeviceIdProvider>
                <HomeScreen navigation={mockNavigation} />
            </DeviceIdProvider>
        );

        fireEvent.press(getByText('Start Assessment'));
        
        // Loading-Text sollte sichtbar sein
        expect(getByText('Erstelle Assessment...')).toBeTruthy();

        // Warte auf Abschluss
        await act(async () => {
            await new Promise(resolve => setTimeout(resolve, 150));
        });

        // Loading-Text sollte verschwunden sein
        expect(queryByText('Erstelle Assessment...')).toBeNull();
    });
});
