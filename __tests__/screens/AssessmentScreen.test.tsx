import { render } from '@testing-library/react-native';
import AssessmentScreen from '~/src/screens/AssessmentScreen';
import { MOCK_SYMPTOMS_QUESTION } from '~/src/types/assessment';

const mockNavigation = {
    goBack: jest.fn(),
} as any;

describe('AssessmentScreen', () => {
    it('renders the header text', () => {
        const { getByText } = render(
            <AssessmentScreen navigation={mockNavigation} />
        );
        expect(getByText('Assessment')).toBeTruthy();
    });

    it('renders the question text', () => {
        const { getByText } = render(
            <AssessmentScreen navigation={mockNavigation} />
        );
        expect(getByText(MOCK_SYMPTOMS_QUESTION.questionText)).toBeTruthy();
    });
}); 