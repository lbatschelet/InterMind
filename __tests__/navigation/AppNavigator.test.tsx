import { render } from '@testing-library/react-native';
import AppNavigator from '~/src/navigation/AppNavigator';

// Mock der Navigation-Komponenten
jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: () => ({
        Navigator: ({ children }: { children: React.ReactNode }) => children,
        Screen: ({ name, component }: { name: string; component: any }) => null
    })
}));

jest.mock('@react-navigation/native', () => ({
    NavigationContainer: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@react-navigation/stack', () => ({
    createStackNavigator: () => ({
        Navigator: ({ children }: { children: React.ReactNode }) => children,
        Screen: ({ name, component }: { name: string; component: any }) => null
    })
}));

describe('AppNavigator', () => {
    it('renders without crashing', () => {
        render(<AppNavigator />);
    });
}); 