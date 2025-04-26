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
 *      ├─ About
 *      └─ Privacy Policy
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
 * About:
 * - Information about the app
 * - Simple back navigation
 * 
 * Privacy Policy:
 * - Legal information about privacy
 * - Simple back navigation
 * 
 * Design Patterns:
 * - Type-safe navigation parameters
 * - Custom header components
 * - Consistent UI/UX patterns
 * - Modal-based confirmations
 */

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackHeaderProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '~/src/components/ui/alert-dialog';
import { Button } from '~/src/components/ui/button';
import { useLanguage } from '~/src/contexts/LanguageContext';
import { ArrowLeft } from '~/src/lib/icons/ArrowLeft';
import { Settings } from '~/src/lib/icons/Settings';
import { PORTAL_HOST_NAME } from '../lib/constants';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SurveyScreen from '../screens/SurveyScreen';
import AboutScreen from '../screens/AboutScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import ConsentScreen from '../screens/ConsentScreen';
import ThankYouScreen from '../screens/ThankYouScreen';

/**
 * Type definitions for the navigation stack parameters.
 */
export type RootStackParamList = {
    Home: undefined;
    Settings: undefined;
    Question: { questionIndex: number; assessmentId: string };
    SurveyScreen: undefined;
    About: undefined;
    PrivacyPolicy: undefined;
    Consent: undefined;
    ThankYou: undefined;
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
const HomeHeader = (props: StackHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <SafeAreaView edges={['top']} className="bg-background">
        <View className="px-4 pt-2">
            <View className="flex-row items-center justify-between">
                <View className="flex-1" />
                <Text style={{ fontSize: 36 }} className="text-primary font-bold">
                    {t('home.title')}
                </Text>
                <View className="flex-1 items-end">
                    <Button 
                        variant="ghost" 
                        onPress={() => props.navigation.navigate('Settings')}
                        className="h-10 w-10 rounded-full"
                    >
                        <Settings className="text-primary" size={24} />
                    </Button>
                </View>
            </View>
        </View>
    </SafeAreaView>
  );
};

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
const SettingsHeader = (props: StackHeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <SafeAreaView edges={['top']} className="bg-background">
        <View className="px-4 pt-2">
            <View className="flex-row items-center">
                <Button 
                    variant="ghost" 
                    className="h-10 w-10 rounded-full"
                    onPress={() => props.navigation.goBack()}
                >
                    <ArrowLeft className="text-primary" size={24} />
                </Button>
                <Text className="text-xl font-bold text-primary ml-2">
                    {t('settings.title')}
                </Text>
            </View>
        </View>
    </SafeAreaView>
  );
};

/**
 * Generic info screen header component (for About and Privacy Policy screens).
 * 
 * @param props.navigation - Navigation object for screen transitions
 * @param title - Title to display in the header
 * 
 * @remarks
 * Features:
 * - Back button for simple navigation
 * - Localized title
 * - Consistent styling with other headers
 */
const InfoScreenHeader = (props: StackHeaderProps, title: string) => {
  const { t } = useLanguage();
  
  return (
    <SafeAreaView edges={['top']} className="bg-background">
        <View className="px-4 pt-2">
            <View className="flex-row items-center">
                <Button 
                    variant="ghost" 
                    className="h-10 w-10 rounded-full"
                    onPress={() => props.navigation.goBack()}
                >
                    <ArrowLeft className="text-primary" size={24} />
                </Button>
                <Text className="text-xl font-bold text-primary ml-2">
                    {title}
                </Text>
            </View>
        </View>
    </SafeAreaView>
  );
};

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
    const { t } = useLanguage();
    
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen} 
                    options={{ header: HomeHeader }}
                />
                <Stack.Screen 
                    name="Settings" 
                    component={SettingsScreen} 
                    options={{ header: SettingsHeader }}
                />
                <Stack.Screen 
                    name="SurveyScreen" 
                    component={SurveyScreen} 
                    options={{ headerShown: false }} 
                />
                <Stack.Screen 
                    name="About" 
                    component={AboutScreen} 
                    options={{ 
                        header: (props) => InfoScreenHeader(props, t('about.title'))
                    }} 
                />
                <Stack.Screen 
                    name="PrivacyPolicy" 
                    component={PrivacyPolicyScreen} 
                    options={{ 
                        header: (props) => InfoScreenHeader(props, t('privacy.title'))
                    }} 
                />
                <Stack.Screen 
                    name="Consent" 
                    component={ConsentScreen} 
                    options={{ 
                        header: (props) => InfoScreenHeader(props, t('consent.title'))
                    }} 
                />
                <Stack.Screen 
                    name="ThankYou" 
                    component={ThankYouScreen} 
                    options={{ header: HomeHeader }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
