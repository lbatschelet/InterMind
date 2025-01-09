import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/src/components/ui/alert-dialog";
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { useDeviceId } from '../contexts/DeviceIdContext';
import { PORTAL_HOST_NAME } from '../lib/constants';
import type { RootStackParamList } from '../navigation/AppNavigator';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
    navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
    const { deviceId } = useDeviceId();
    const [open, setOpen] = useState(false);

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(deviceId || '');
    };

    return (
        <View className="flex-1 bg-background">
            <SafeAreaView edges={['top']} className="flex-1">

                {/* Settings Content */}
                <View className="p-4 space-y-4">
                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline" className="w-full justify-between py-6">
                                <Text className="text-primary text-lg">Show User ID</Text>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent portalHost={PORTAL_HOST_NAME}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>User ID</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This ID is calculated from your device and is unique to your device. It is used to pseudonymize your data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <View className="p-4 bg-muted rounded-lg">
                                <Text className="text-primary text-lg font-mono text-center">
                                    {deviceId}
                                </Text>
                            </View>
                            <AlertDialogFooter className="space-y-2">
                                <Button 
                                    className="w-full"
                                    onPress={copyToClipboard}
                                >
                                    <Text>Copy ID</Text>
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="w-full"
                                    onPress={() => setOpen(false)}
                                >
                                    <Text>Close</Text>
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button 
                        variant="outline" 
                        className="w-full justify-between py-6"
                        onPress={() => {/* TODO */}}
                    >
                        <Text className="text-primary text-lg">
                            Privacy Policy
                        </Text>
                    </Button>
                    
                    <Button 
                        variant="outline" 
                        className="w-full justify-between py-6"
                        onPress={() => {/* TODO */}}
                    >
                        <Text className="text-primary text-lg">
                            About
                        </Text>
                    </Button>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default SettingsScreen; 