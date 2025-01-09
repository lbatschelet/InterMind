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

    it('handles back navigation', () => {
        const { getByRole } = render(
            <AssessmentScreen navigation={mockNavigation} />
        );
        
        // Suche nach dem Button über seine Rolle
        const backButton = getByRole('button');
        fireEvent.press(backButton);
        expect(mockNavigation.goBack).toHaveBeenCalled();
    });
}); 