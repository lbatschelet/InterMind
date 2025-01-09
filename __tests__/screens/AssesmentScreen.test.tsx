import { fireEvent, render } from '@testing-library/react-native';
import AssessmentScreen from '~/src/screens/AssessmentScreen';
import { MOCK_QUESTION } from '~/src/types/assessment';

// Mock der Navigation
const mockNavigation = {
    goBack: jest.fn(),
} as any;

describe('AssessmentScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the question text', () => {
        const { getByText } = render(
            <AssessmentScreen navigation={mockNavigation} />
        );

        expect(getByText(MOCK_QUESTION.questionText)).toBeTruthy();
    });

    it('renders all radio options', () => {
        const { getByText } = render(
            <AssessmentScreen navigation={mockNavigation} />
        );

        MOCK_QUESTION.options.forEach(option => {
            expect(getByText(option.label)).toBeTruthy();
        });
    });

    it('allows selecting an option', () => {
        const { getByText } = render(
            <AssessmentScreen navigation={mockNavigation} />
        );

        const option = MOCK_QUESTION.options[0];
        fireEvent.press(getByText(option.label));

        // Hier könnten wir den ausgewählten Wert überprüfen
        // Dies erfordert möglicherweise eine Anpassung der Komponente
        // um den ausgewählten Wert sichtbar zu machen
    });

    it('handles back navigation', () => {
        const { getByTestId } = render(
            <AssessmentScreen navigation={mockNavigation} />
        );

        fireEvent.press(getByTestId('back-button'));
        expect(mockNavigation.goBack).toHaveBeenCalled();
    });
});