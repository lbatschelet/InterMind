import { render } from '@testing-library/react-native';
import { mockQuestions } from '~/src/mocks/questions';
import AssessmentScreen from '~/src/screens/AssessmentScreen';

const mockNavigation = {
    goBack: jest.fn(),
} as any;

describe('AssessmentScreen', () => {
    it('renders the correct question component based on question type', () => {
        const { getByTestId } = render(
            <AssessmentScreen navigation={mockNavigation} />
        );
        
        expect(getByTestId('multiple-choice-question')).toBeTruthy();
    });

    it('renders the question text', () => {
        const { getByText } = render(
            <AssessmentScreen navigation={mockNavigation} />
        );
        expect(getByText(mockQuestions.multipleChoice.questionText)).toBeTruthy();
    });
}); 