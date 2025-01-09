import { fireEvent, render } from '@testing-library/react-native';
import HomeScreen from '~/src/screens/HomeScreen';

const mockNavigation = {
    navigate: jest.fn()
} as any;

describe('HomeScreen', () => {
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
});
