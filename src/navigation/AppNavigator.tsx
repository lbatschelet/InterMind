// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AssessmentScreen from '../screens/AssessmentScreen';
import HomeScreen from '../screens/HomeScreen';

export type RootStackParamList = {
    Home: undefined;
    Assessment: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="Home"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen} 
                />
                <Stack.Screen 
                    name="Assessment" 
                    component={AssessmentScreen} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
