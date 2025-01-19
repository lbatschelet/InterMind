// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '~/src/components/ui/alert-dialog';
import { Button } from '~/src/components/ui/button';
import { ArrowLeft } from '~/src/lib/icons/ArrowLeft';
import { Settings } from '~/src/lib/icons/Settings';
import { PORTAL_HOST_NAME } from '../lib/constants';
import HomeScreen from '../screens/HomeScreen';
import QuestionScreen from '../screens/QuestionScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { AssessmentService } from '../services/assessment';

/**
 * Type definitions for the root stack navigator parameters.
 * Defines the available screens and their respective props.
 */
export type RootStackParamList = {
    /** Home screen with no parameters */
    Home: undefined;
    /** Settings screen with no parameters */
    Settings: undefined;
    /** Question screen requiring the current question index */
    Question: { 
        /** The index of the current question being displayed */
        questionIndex: number;
        /** The ID of the current assessment */
        assessmentId: string;
    };
};

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Header component for the Home screen.
 * Displays the app title and settings button.
 * 
 * @param navigation - Navigation prop for screen navigation
 */
const HomeHeader = ({ navigation }: { navigation: any }) => (
    <SafeAreaView edges={['top']} className="bg-background">
        <View className="px-4 pt-2">
            <View className="flex-row items-center justify-between">
                <View className="flex-1" />
                <Text style={{ fontSize: 36 }} className="text-primary font-bold">
                    SerenCity
                </Text>
                <View className="flex-1 items-end">
                    <Button 
                        variant="ghost" 
                        onPress={() => navigation.navigate('Settings')}
                        className="h-10 w-10 rounded-full"
                    >
                        <Settings className="text-primary" size={24} />
                    </Button>
                </View>
            </View>
        </View>
    </SafeAreaView>
);

/**
 * Header component for the Assessment/Question screen.
 * Includes a back button with confirmation dialog for canceling the assessment.
 * 
 * @param navigation - Navigation prop for screen navigation
 */
const AssessmentHeader = ({ navigation }: { navigation: any }) => {
    const [open, setOpen] = useState(false);
    
    /**
     * Handles the cancellation of the current assessment.
     * Deletes the assessment data and navigates back to home.
     */
    const handleCancel = async () => {
        const assessmentId = navigation.getParam('assessmentId');
        if (assessmentId) {
            await AssessmentService.cancelAssessment(assessmentId);
        }
        setOpen(false);
        navigation.navigate('Home');
    };
    
    return (
        <SafeAreaView edges={['top']} className="bg-background">
            <View className="px-4 pt-2">
                <View className="flex-row items-center">
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger asChild>
                            <Button 
                                variant="ghost" 
                                className="h-10 w-10 rounded-full"
                            >
                                <ArrowLeft className="text-primary" size={24} />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent portalHost={PORTAL_HOST_NAME}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Assessment?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Do you really want to cancel the assessment? Your progress will be lost.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="space-y-2">
                                <AlertDialogCancel className="w-full">
                                    <Text>Continue</Text>
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                    className="w-full"
                                    onPress={handleCancel}
                                >
                                    <Text>Cancel</Text>
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Text className="text-xl font-bold text-primary ml-2">
                        Assessment
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

/**
 * Header component for the Settings screen.
 * Displays a back button and the settings title.
 * 
 * @param navigation - Navigation prop for screen navigation
 */
const SettingsHeader = ({ navigation }: { navigation: any }) => (
    <SafeAreaView edges={['top']} className="bg-background">
        <View className="px-4 pt-2">
            <View className="flex-row items-center">
                <Button 
                    variant="ghost" 
                    className="h-10 w-10 rounded-full"
                    onPress={() => navigation.goBack()}
                >
                    <ArrowLeft className="text-primary" size={24} />
                </Button>
                <Text className="text-xl font-bold text-primary ml-2">
                    Settings
                </Text>
            </View>
        </View>
    </SafeAreaView>
);

/**
 * Main navigation component for the app.
 * Sets up the stack navigator with all available screens and their respective headers.
 * 
 * @returns The configured navigation container with all screens
 */
const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{
                        header: HomeHeader
                    }}
                />
                <Stack.Screen 
                    name="Question" 
                    component={QuestionScreen}
                    options={{
                        header: AssessmentHeader,
                        animation: 'none'
                    }}
                />
                <Stack.Screen 
                    name="Settings" 
                    component={SettingsScreen}
                    options={{
                        header: SettingsHeader
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
