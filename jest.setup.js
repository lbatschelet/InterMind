import 'react-native-gesture-handler/jestSetup';

// Mock für SVGs
jest.mock('~/assets/our-neighborhood.svg', () => 'OurNeighborhood');
jest.mock('~/assets/a-day-at-the-park.svg', () => 'ADayAtThePark');

// Mock für SafeAreaContext
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
})); 