import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as Clipboard from 'expo-clipboard';
import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "~/src/components/ui/alert-dialog";
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { useDeviceId } from '../contexts/DeviceIdContext';
import { PORTAL_HOST_NAME } from '../lib/constants';
import type { RootStackParamList } from '../navigation/AppNavigator';
import { AssessmentService } from '../services/assessment';
import { supabase } from '../services/supabase';
import { UserService } from '../services/user';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
    navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
    const { deviceId } = useDeviceId();
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(deviceId || '');
    };

    const handleShowUserId = async () => {
        const userId = await UserService.getCurrentUserId();
        console.log('User ID:', userId);
    };

    const verifyDeletion = async (userId: string): Promise<boolean> => {
        const { data: assessments } = await supabase
            .from('assessments')
            .select('id')
            .eq('user_id', userId);
        
        return !assessments || assessments.length === 0;
    };

    const handleDeleteData = async () => {
        try {
            const userId = await UserService.getCurrentUserId();
            if (userId) {
                await AssessmentService.deleteUserData(userId);
                
                // Überprüfe, ob die Daten wirklich gelöscht wurden
                const isDeleted = await verifyDeletion(userId);
                
                if (isDeleted) {
                    setDeleteStatus('success');
                    console.log('Alle Daten erfolgreich gelöscht');
                } else {
                    setDeleteStatus('error');
                    console.error('Daten konnten nicht vollständig gelöscht werden');
                }
            }
        } catch (error) {
            console.error('Fehler beim Löschen der Daten:', error);
            setDeleteStatus('error');
        }
    };

    return (
        <View className="flex-1 bg-background">
            <SafeAreaView edges={['top']} className="flex-1">
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
                                    variant="outline"
                                    className="w-full"
                                    onPress={copyToClipboard}
                                >
                                    <Text>Copy ID</Text>
                                </Button>
                                <Button                                     
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

                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-full">
                                <Text className="text-destructive-foreground">Alle Daten löschen</Text>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent portalHost={PORTAL_HOST_NAME}>
                            {deleteStatus === 'idle' ? (
                                <>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Daten wirklich löschen?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Diese Aktion kann nicht rückgängig gemacht werden. Alle deine Assessment-Daten werden permanent gelöscht.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="space-y-2">
                                        <AlertDialogCancel className="w-full" onPress={() => {
                                            setDeleteDialogOpen(false);
                                            setDeleteStatus('idle');
                                        }}>
                                            <Text>Abbrechen</Text>
                                        </AlertDialogCancel>
                                        <Button 
                                            className="w-full bg-destructive"
                                            onPress={async () => {
                                                await handleDeleteData();
                                            }}
                                        >
                                            <Text className="text-destructive-foreground">Ja, alle Daten löschen</Text>
                                        </Button>
                                    </AlertDialogFooter>
                                </>
                            ) : (
                                <>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            {deleteStatus === 'success' ? 'Daten gelöscht' : 'Fehler beim Löschen'}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {deleteStatus === 'success' 
                                                ? 'Alle deine Daten wurden erfolgreich gelöscht.'
                                                : 'Beim Löschen deiner Daten ist ein Fehler aufgetreten. Bitte versuche es später erneut.'}
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <Button 
                                            className="w-full"
                                            onPress={() => {
                                                setDeleteDialogOpen(false);
                                                setDeleteStatus('idle');
                                            }}
                                        >
                                            <Text>Schließen</Text>
                                        </Button>
                                    </AlertDialogFooter>
                                </>
                            )}
                        </AlertDialogContent>
                    </AlertDialog>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default SettingsScreen; 