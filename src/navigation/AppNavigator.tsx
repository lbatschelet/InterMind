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
import { mockAssessment } from '../mocks/questions';
import AssessmentScreen from '../screens/AssessmentScreen';
import HomeScreen from '../screens/HomeScreen';
import QuestionScreen from '../screens/QuestionScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { AssessmentService } from '../services/assessment';

export type RootStackParamList = {
    Home: undefined;
    Assessment: undefined;
    Settings: undefined;
    Question: { questionIndex: number };
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

const AssessmentHeader = ({ navigation }: { navigation: any }) => {
    const [open, setOpen] = useState(false);
    const assessment = mockAssessment;
    
    const handleCancel = async () => {
        await AssessmentService.cancelAssessment(assessment.id);
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
                                <AlertDialogTitle>Assessment abbrechen?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Möchtest du das Assessment wirklich abbrechen? Dein Fortschritt geht dabei verloren.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="space-y-2">
                                <AlertDialogCancel className="w-full">
                                    <Text>Weiter machen</Text>
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                    className="w-full"
                                    onPress={handleCancel}
                                >
                                    <Text>Abbrechen</Text>
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
                    name="Assessment" 
                    component={AssessmentScreen}
                    options={{
                        header: AssessmentHeader
                    }}
                />
                <Stack.Screen 
                    name="Question" 
                    component={QuestionScreen}
                    options={{
                        header: AssessmentHeader,
                        animation: 'slide_from_right'
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
