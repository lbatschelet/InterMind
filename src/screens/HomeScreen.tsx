/**
 * @packageDocumentation
 * @module Screens/Home
 * 
 * @summary
 * Main entry point of the application serving as a landing page for users.
 * 
 * @remarks
 * Provides a welcoming interface with a simple, focused call-to-action
 * to start a new assessment. The screen is intentionally minimalistic
 * to reduce cognitive load and guide users directly to the assessment process.
 * 
 * Features:
 * - Displays a welcoming illustration
 * - Single, prominent "Start Assessment" button
 * - Handles location permissions and retrieval
 * - Prevents double submissions during assessment creation
 * 
 * Flow:
 * 1. User taps "Start Assessment"
 * 2. Location permission is requested (if not already granted)
 * 3. Location is retrieved with privacy-oriented settings
 * 4. New assessment is created with location data
 * 5. User is navigated to the first question
 */

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Dimensions, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ADayAtThePark from '~/assets/a-day-at-the-park.svg';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { RootStackParamList } from '~/src/navigation/AppNavigator';
import { AssessmentService } from '../services/assessment';
import { LocationService } from '../services/location';

/** Screen width for responsive display */
const { width } = Dimensions.get('window');

/** Navigation prop type for the Home screen */
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

/** Props for the Home screen component */
interface HomeScreenProps {
    /** Navigation object from React Navigation */
    navigation: HomeScreenNavigationProp;
}

/**
 * Home Screen Component
 * 
 * @param navigation - Navigation object for screen transitions
 * 
 * @remarks
 * Main entry point of the application with the following features:
 * - Display of a welcoming illustration
 * - Start button for new assessment
 * - Prevention of double submissions
 * - Integration of location services
 * 
 * @example
 * ```tsx
 * <HomeScreen navigation={navigation} />
 * ```
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    /** State to prevent double submissions */
    const [isCreatingAssessment, setIsCreatingAssessment] = useState(false);

    /**
     * Starts a new assessment
     * 
     * @remarks
     * Flow:
     * 1. Prevents double submission
     * 2. Retrieves user location with privacy settings
     * 3. Creates new assessment with location data
     * 4. Navigates to first question
     * 
     * Error handling is managed by the respective services
     * 
     * @returns Promise that resolves when the assessment is created and navigation occurs
     */
    const handleStartAssessment = async () => {
        if (isCreatingAssessment) return;
        
        try {
            setIsCreatingAssessment(true);
            
            const location = await LocationService.getCurrentLocation();
            const assessment = await AssessmentService.createAssessment(location);
            
            if (assessment) {
                navigation.navigate('Question', { 
                    questionIndex: 0,
                    assessmentId: assessment.id
                });
            }
        } finally {
            setIsCreatingAssessment(false);
        }
    };

    return (
        <View style={{ flex: 1 }} className="bg-background">
            <SafeAreaView edges={['top']} className="flex-1">
                <StatusBar 
                    barStyle="dark-content" 
                    backgroundColor="transparent"
                    translucent={true}
                />

                {/* Centered SVG */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ADayAtThePark 
                        width={width * 0.8}
                        height={width * 0.8}
                    />
                </View>

                {/* Bottom Button */}
                <View className="w-full px-4 mb-12 items-center">
                    <Button
                        variant="default"
                        className="bg-accent"
                        onPress={handleStartAssessment}
                    >
                        <Text className="text-primary text-lg font-bold">
                            Start Assessment
                        </Text>
                    </Button>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default HomeScreen;
