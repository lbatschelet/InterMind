// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/button';
import { Settings } from '~/src/lib/icons/Settings';
import AssessmentScreen from '../screens/AssessmentScreen';
import HomeScreen from '../screens/HomeScreen';

export type RootStackParamList = {
    Home: undefined;
    Assessment: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const HomeHeader = () => (
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
                        onPress={() => alert('Settings Open')}
                        className="h-10 w-10 rounded-full"
                    >
                        <Settings className="text-primary" size={24} />
                    </Button>
                </View>
            </View>
        </View>
    </SafeAreaView>
);

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="Home"
                screenOptions={{ 
                    headerShown: false,
                    cardStyle: { backgroundColor: 'transparent' }
                }}
            >
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{
                        headerShown: true,
                        header: () => <HomeHeader />
                    }}
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
