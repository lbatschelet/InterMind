import React from 'react';

// Mock der Umgebungsvariablen für Tests
process.env.SUPABASE_URL = 'http://localhost:54321';
process.env.SUPABASE_ANON_KEY = 'test-key';

// Mock für react-native-css-interop
const mockModule = {
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
    ...mockModule,
    default: mockModule
}));

// Mock für AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve(null)),
    removeItem: jest.fn(() => Promise.resolve()),
    getAllKeys: jest.fn(() => Promise.resolve([])),
    multiRemove: jest.fn(() => Promise.resolve())
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
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) => children,
    SafeAreaView: 'SafeAreaView',
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
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
    AlertDialog: ({ children }: { children: React.ReactNode }) => children,
    AlertDialogTrigger: ({ children }: { children: React.ReactNode }) => children,
    AlertDialogContent: ({ children }: { children: React.ReactNode }) => children,
    AlertDialogHeader: ({ children }: { children: React.ReactNode }) => children,
    AlertDialogFooter: ({ children }: { children: React.ReactNode }) => children,
    AlertDialogTitle: ({ children }: { children: React.ReactNode }) => children,
    AlertDialogDescription: ({ children }: { children: React.ReactNode }) => children,
    AlertDialogAction: ({ children }: { children: React.ReactNode }) => children,
    AlertDialogCancel: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('@rn-primitives/slot', () => ({
    Slot: ({ children }: { children: React.ReactNode }) => children,
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