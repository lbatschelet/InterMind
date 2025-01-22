/**
 * @packageDocumentation
 * @module Screens/Settings
 * 
 * @summary
 * Provides user settings and data management functionality.
 * 
 * @remarks
 * Core Features:
 * - Display and copy device ID
 * - Privacy policy access
 * - About information
 * - Data deletion with confirmation
 * 
 * Security:
 * - Secure device ID handling
 * - Data deletion verification
 * - Confirmation dialogs for critical actions
 * 
 * State Management:
 * - Dialog visibility states
 * - Delete operation status tracking
 * - Device ID context integration
 */

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
import { DeviceService } from '../services/device';
import { supabase } from '../services/supabase';

/** Navigation prop type for the Settings screen */
type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

/** Props for the Settings screen component */
interface SettingsScreenProps {
    /** Navigation object for screen transitions */
    navigation: SettingsScreenNavigationProp;
}

/**
 * Settings Screen Component
 * 
 * @param navigation - Navigation object for screen transitions
 * 
 * @remarks
 * Provides user settings and data management functionality including:
 * - Device ID display and copying
 * - Privacy policy and about information access
 * - Data deletion with verification
 * 
 * @example
 * ```tsx
 * <SettingsScreen navigation={navigation} />
 * ```
 */
const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
    const { deviceId } = useDeviceId();
    const [open, setOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle');

    /**
     * Copy device ID to clipboard
     * 
     * @returns Promise that resolves when the ID is copied
     */
    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(deviceId || '');
    };

    /**
     * Display current device ID
     * 
     * @returns Promise that resolves when the ID is retrieved
     */
    const handleShowUserId = async () => {
        const userId = await DeviceService.getCurrentDeviceId();
        console.log('User ID:', userId);
    };

    /**
     * Verify complete data deletion
     * 
     * @param deviceId - The device ID to verify
     * @returns Promise that resolves to true if all data is deleted
     */
    const verifyDeletion = async (deviceId: string): Promise<boolean> => {
        const { data: assessments } = await supabase
            .from('assessments')
            .select('id')
            .eq('device_id', deviceId);
        
        return !assessments || assessments.length === 0;
    };

    /**
     * Handle data deletion process
     * 
     * @remarks
     * Complete data deletion flow:
     * 1. Retrieve current device ID
     * 2. Delete all device data
     * 3. Verify deletion success
     * 4. Update UI status
     * 
     * @returns Promise that resolves when deletion is complete
     */
    const handleDeleteData = async () => {
        try {
            const deviceId = await DeviceService.getCurrentDeviceId();
            if (deviceId) {
                await DeviceService.deleteDeviceData();
                
                // Verify data deletion
                const isDeleted = await verifyDeletion(deviceId);
                
                if (isDeleted) {
                    setDeleteStatus('success');
                    console.log('All data successfully deleted');
                } else {
                    setDeleteStatus('error');
                    console.error('Data could not be completely deleted');
                }
            }
        } catch (error) {
            console.error('Error deleting data:', error);
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
                                <Text className="text-destructive-foreground">Delete All Data</Text>
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent portalHost={PORTAL_HOST_NAME}>
                            {deleteStatus === 'idle' ? (
                                <>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete All Data?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. All your assessment data will be permanently deleted.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="space-y-2">
                                        <AlertDialogCancel className="w-full" onPress={() => {
                                            setDeleteDialogOpen(false);
                                            setDeleteStatus('idle');
                                        }}>
                                            <Text>Cancel</Text>
                                        </AlertDialogCancel>
                                        <Button 
                                            className="w-full bg-destructive"
                                            onPress={async () => {
                                                await handleDeleteData();
                                            }}
                                        >
                                            <Text className="text-destructive-foreground">Yes, Delete All Data</Text>
                                        </Button>
                                    </AlertDialogFooter>
                                </>
                            ) : (
                                <>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            {deleteStatus === 'success' ? 'Data Deleted' : 'Error Deleting Data'}
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            {deleteStatus === 'success' 
                                                ? 'All your data has been successfully deleted.'
                                                : 'An error occurred while deleting your data. Please try again later.'}
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
                                            <Text>Close</Text>
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