import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from 'src/screens/HomeScreen';

const mockNavigate = jest.fn();

const createTestProps = () => ({
    navigation: {
        navigate: mockNavigate,
    },
});

describe('HomeScreen', () => {
    let props: any;

    beforeEach(() => {
        props = createTestProps();
        jest.clearAllMocks();
    });

    it('renders correctly', () => {
        const { getByText } = render(<HomeScreen {...props} />);
        expect(getByText('Start Assessment')).toBeTruthy();
        expect(getByText('⚙️')).toBeTruthy();
    });

    it('navigates to AssessmentScreen on button press', () => {
        const { getByText } = render(<HomeScreen {...props} />);
        fireEvent.press(getByText('Start Assessment'));
        expect(mockNavigate).toHaveBeenCalledWith('Assessment');
    });

    it('shows alert when settings button is pressed', () => {
        const alertMock = jest.spyOn(global, 'alert').mockImplementation(() => {});
        const { getByText } = render(<HomeScreen {...props} />);
        fireEvent.press(getByText('⚙️'));
        expect(alertMock).toHaveBeenCalledWith('Settings Open');
        alertMock.mockRestore();
    });
});
