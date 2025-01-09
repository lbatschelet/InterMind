// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/src/components/ui/button';
import { ArrowLeft } from '~/src/lib/icons/ArrowLeft';
import { Settings } from '~/src/lib/icons/Settings';
import AssessmentScreen from '../screens/AssessmentScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
    Home: undefined;
    Assessment: undefined;
    Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

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

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator 
                initialRouteName="Home"
                screenOptions={{ 
                    headerShown: true,
                    cardStyle: { backgroundColor: 'transparent' },
                    headerLeft: ({ onPress }) => (
                        <Button
                            variant="ghost"
                            className="h-10 w-10 rounded-full"
                            onPress={onPress}
                        >
                            <ArrowLeft className="text-primary" size={24} />
                        </Button>
                    ),
                }}
            >
                <Stack.Screen 
                    name="Home" 
                    component={HomeScreen}
                    options={{
                        header: ({ navigation }) => <HomeHeader navigation={navigation} />
                    }}
                />
                <Stack.Screen 
                    name="Assessment" 
                    component={AssessmentScreen} 
                />
                <Stack.Screen 
                    name="Settings" 
                    component={SettingsScreen} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
