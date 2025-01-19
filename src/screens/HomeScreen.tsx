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

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

/**
 * Home screen component that displays the main entry point of the app.
 * Shows a welcome illustration and start assessment button.
 * 
 * @component
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const [isCreating, setIsCreating] = useState(false);  // Prevent double creation

    /**
     * Handles the start of a new assessment
     * Gets location and creates a new assessment
     */
    const handleStartAssessment = async () => {
        if (isCreating) return;  // Prevent double calls
        
        try {
            setIsCreating(true);
            
            // Get location first
            const location = await LocationService.getCurrentLocation();
            console.log('Got location:', location);
            
            // Create assessment with location
            const assessment = await AssessmentService.createAssessment(location);
            console.log('Created assessment:', assessment);
            
            if (assessment) {
                navigation.navigate('Question', { 
                    questionIndex: 0,
                    assessmentId: assessment.id
                });
            }
        } catch (error) {
            console.error('Error starting assessment:', error);
        } finally {
            setIsCreating(false);
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

                {/* Center SVG */}
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
