import { render } from '@testing-library/react-native';
import QuestionScreen from '~/src/screens/QuestionScreen';
import { mockQuestions } from '../mocks/questions';

const mockNavigation = {
    goBack: jest.fn(),
} as any;

const mockRoute = {
    params: {
        questionIndex: 0,
        assessmentId: 'test-assessment-1'
    }
} as any;

// Mock der QuestionFactory
jest.mock('~/src/components/questions/QuestionFactory', () => ({
    QuestionFactory: () => null
}));

describe('QuestionScreen', () => {
    it('renders the correct question component based on question type', () => {
        const { getByTestId } = render(
            <QuestionScreen navigation={mockNavigation} route={mockRoute} />
        );
        
        expect(getByTestId('multiple-choice-question')).toBeTruthy();
    });

    it('renders the question text', () => {
        const { getByText } = render(
            <QuestionScreen navigation={mockNavigation} route={mockRoute} />
        );
        // Wir verwenden die erste Multiple-Choice-Frage aus den Mock-Daten
        const multipleChoiceQuestion = mockQuestions.find(q => q.type === 'multiple_choice');
        expect(getByText(multipleChoiceQuestion?.question || '')).toBeTruthy();
    });
}); 