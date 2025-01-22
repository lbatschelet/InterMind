import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
import React from 'react';
import 'react-native-gesture-handler/jestSetup';

// Umgebungsvariablen für Tests
process.env.SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_ANON_KEY = 'test-key';

// Globale Test-Setup-Konfiguration
jest.useFakeTimers();

// Unterdrücke React Native Warnungen in Tests
console.warn = jest.fn();
console.error = jest.fn();

// Mock für AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock für SVGs
jest.mock('~/assets/our-neighborhood.svg', () => 'OurNeighborhood');
jest.mock('~/assets/a-day-at-the-park.svg', () => 'ADayAtThePark');

// Mock für react-native-css-interop
const mockCssInterop = {
    getColorScheme: jest.fn(() => 'light'),
    addColorSchemeListener: jest.fn(),
    createCssInterop: jest.fn(() => ({
        getColorScheme: jest.fn(() => 'light'),
        addColorSchemeListener: jest.fn()
    })),
    createCssInteropNative: jest.fn(() => ({
        getColorScheme: jest.fn(() => 'light'),
        addColorSchemeListener: jest.fn()
    })),
    cn: jest.fn((...args) => args.join(' ')),
};

jest.mock('react-native-css-interop', () => ({
    __esModule: true,
    ...mockCssInterop,
    default: mockCssInterop
}));

// Mock für React Native Komponenten
jest.mock('react-native', () => ({
    Platform: {
        select: jest.fn(obj => obj.default)
    },
    Dimensions: {
        get: jest.fn(() => ({ width: 375, height: 812 }))
    },
    Animated: {
        View: 'Animated.View',
        createAnimatedComponent: jest.fn(component => component),
        timing: jest.fn(),
        spring: jest.fn(),
        sequence: jest.fn(),
        parallel: jest.fn(),
        Value: jest.fn(() => ({
            setValue: jest.fn(),
            interpolate: jest.fn()
        }))
    },
    StyleSheet: {
        create: jest.fn(styles => styles),
        compose: jest.fn(),
        flatten: jest.fn(),
    },
    View: 'View',
    Text: 'Text',
    Pressable: 'Pressable',
    SafeAreaView: 'SafeAreaView'
}));

// Mock für UI-Komponenten
jest.mock('~/src/components/ui/text', () => ({
    Text: jest.fn(({ children }) => children)
}));

jest.mock('~/src/components/ui/button', () => ({
    Button: jest.fn(({ children, onPress }) => ({ type: 'button', children, onPress }))
}));

// Mock für Expo Constants
const mockExpoConfig = {
    extra: {
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseAnonKey: process.env.SUPABASE_ANON_KEY
    }
};

jest.mock('expo-constants', () => ({
    __esModule: true,
    default: {
        expoConfig: mockExpoConfig
    },
    getAppConfig: () => mockExpoConfig
}));

// Mock für react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
    SafeAreaProvider: jest.fn(({ children }) => children),
    SafeAreaView: jest.fn(({ children }) => children),
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 })
}));

// Mock für React Navigation
jest.mock('@react-navigation/native', () => ({
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
        navigate: jest.fn(),
        goBack: jest.fn(),
    }),
    useRoute: () => ({
        params: {},
    }),
}));

jest.mock('@react-navigation/native-stack', () => ({
    createNativeStackNavigator: jest.fn(() => ({
        Navigator: 'Navigator',
        Screen: 'Screen',
    })),
}));

// Mock für Supabase
jest.mock('@supabase/supabase-js', () => ({
    createClient: jest.fn(() => ({
        from: jest.fn(() => ({
            insert: jest.fn(() => ({
                select: jest.fn(() => ({
                    single: jest.fn(() => Promise.resolve({
                        data: {
                            id: '123',
                            device_id: 'TEST-DEVICE-1',
                            location: 'test-location',
                            created_at: new Date().toISOString()
                        },
                        error: null
                    }))
                }))
            })),
            select: jest.fn(() => ({
                order: jest.fn(() => Promise.resolve({ data: [], error: null }))
            }))
        })),
        rpc: jest.fn(() => Promise.resolve({ data: null, error: null }))
    }))
}));

// Mock für @rn-primitives Komponenten
jest.mock('@rn-primitives/alert-dialog', () => ({
    AlertDialog: jest.fn(({ children }) => children),
    AlertDialogTrigger: jest.fn(({ children }) => children),
    AlertDialogContent: jest.fn(({ children }) => children),
    AlertDialogHeader: jest.fn(({ children }) => children),
    AlertDialogFooter: jest.fn(({ children }) => children),
    AlertDialogTitle: jest.fn(({ children }) => children),
    AlertDialogDescription: jest.fn(({ children }) => children),
    AlertDialogAction: jest.fn(({ children }) => children),
    AlertDialogCancel: jest.fn(({ children }) => children)
}));

jest.mock('@rn-primitives/slot', () => ({
    Slot: jest.fn(({ children }) => children)
}));

// Mock für react-native-reanimated
jest.mock('react-native-reanimated', () => ({
    FadeIn: {
        duration: jest.fn(),
        delay: jest.fn(),
        springify: jest.fn(),
        build: jest.fn()
    },
    FadeOut: {
        duration: jest.fn(),
        delay: jest.fn(),
        springify: jest.fn(),
        build: jest.fn()
    },
    Layout: {
        springify: jest.fn(),
        duration: jest.fn()
    },
    SlideInRight: {
        duration: jest.fn(),
        springify: jest.fn()
    },
    createAnimatedComponent: (component: React.ComponentType<any>) => component,
    useAnimatedStyle: () => ({}),
    useSharedValue: jest.fn(),
    withSpring: jest.fn(),
    withTiming: jest.fn()
})); 