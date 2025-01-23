/**
 * Application Navigation Module
 * ---------------------------
 * Defines the navigation structure and screen hierarchy of the application.
 * 
 * @packageDocumentation
 * @module Navigation/AppNavigator
 * 
 * @remarks
 * Implements a stack-based navigation system with custom headers and
 * transition animations.
 * 
 * Navigation Structure:
 * - Home (root)
 *   ├─ Question (assessment flow)
 *   └─ Settings
 * 
 * Screen Features:
 * Home:
 * - Welcome screen with assessment start
 * - Settings access
 * - Custom branded header
 * 
 * Question:
 * - Assessment progress flow
 * - Cancel confirmation
 * - Back navigation guard
 * 
 * Settings:
 * - Configuration options
 * - Simple back navigation
 * 
 * Design Patterns:
 * - Type-safe navigation parameters
 * - Custom header components
 * - Consistent UI/UX patterns
 * - Modal-based confirmations
 */

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
 * Type definitions for the navigation stack parameters.
 */
export type RootStackParamList = {
    /** Root screen, no parameters needed */
    Home: undefined;

    /** Application settings screen */
    Settings: undefined;

    /** 
     * Assessment question screen
     * @param questionIndex - Zero-based index of current question
     * @param assessmentId - UUID of current assessment session
     */
    Question: { 
        questionIndex: number;
        assessmentId: string;
    };
};

/** @const Stack navigator instance with typed parameters */
const Stack = createStackNavigator<RootStackParamList>();

/**
 * Home screen header component.
 * 
 * @param props.navigation - Navigation object for screen transitions
 * 
 * @remarks
 * Displays:
 * - Centered app title
 * - Settings button (right-aligned)
 * - Proper safe area handling
 */
const HomeHeader = ({ navigation }: { navigation: any }) => (
    <SafeAreaView edges={['top']} className="bg-background">
        <View className="px-4 pt-2">
            <View className="flex-row items-center justify-between">
                <View className="flex-1" />
                <Text style={{ fontSize: 36 }} className="text-primary font-bold">
                    InterMind
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
 * Assessment question screen header.
 * 
 * @param props.navigation - Navigation object for screen transitions
 * 
 * @remarks
 * Features:
 * - Back button with cancel confirmation
 * - Assessment title
 * - Progress preservation warning
 */
const AssessmentHeader = ({ navigation }: { navigation: any }) => {
    /** Controls visibility of the cancel confirmation dialog */
    const [open, setOpen] = useState(false);
    
    /**
     * Handles assessment cancellation.
     * 
     * @method
     * 
     * @remarks
     * Flow:
     * 1. Retrieves assessment ID from navigation state
     * 2. Calls service to clean up assessment data
     * 3. Closes confirmation dialog
     * 4. Navigates back to home screen
     */
    const handleCancel = async () => {
        const state = navigation.getState();
        const assessmentId = state.routes[state.index].params?.assessmentId;
        
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
 * Settings screen header component.
 * 
 * @param props.navigation - Navigation object for screen transitions
 * 
 * @remarks
 * Features:
 * - Back button for simple navigation
 * - Settings title
 * - Consistent styling with other headers
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
 * Root navigation component.
 * 
 * @returns Configured navigation structure
 * 
 * @remarks
 * Configures the main navigation structure of the application:
 * - Sets up the navigation container
 * - Defines screen hierarchy
 * - Configures screen-specific options
 * - Assigns custom headers
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
