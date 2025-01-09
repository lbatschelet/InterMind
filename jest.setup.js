import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import 'react-native-gesture-handler/jestSetup';

// Mock für AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock für SVGs
jest.mock('~/assets/our-neighborhood.svg', () => 'OurNeighborhood');
jest.mock('~/assets/a-day-at-the-park.svg', () => 'ADayAtThePark');

// Mock für SafeAreaContext
jest.mock('react-native-safe-area-context', () => {
    const mockSafeArea = ({ children }) => children;
    return {
        SafeAreaProvider: mockSafeArea,
        SafeAreaView: mockSafeArea,
        useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    };
});

// Mock für UI-Komponenten
jest.mock('~/src/components/ui/text', () => {
    const { Text: RNText } = jest.requireActual('react-native');
    return {
        Text: ({ children, ...props }) => <RNText {...props}>{children}</RNText>
    };
});

jest.mock('~/src/components/ui/button', () => {
    const { Pressable, Text } = jest.requireActual('react-native');
    return {
        Button: ({ children, onPress, ...props }) => (
            <Pressable onPress={onPress} {...props}>
                <Text>{children}</Text>
            </Pressable>
        )
    };
});

// Mock für Navigation
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
}));

// Globale Test-Setup-Konfiguration
jest.useFakeTimers();

// Unterdrücke React Native Warnungen in Tests
console.warn = jest.fn();
console.error = jest.fn(); 