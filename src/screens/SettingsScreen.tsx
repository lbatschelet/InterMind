/**
 * @packageDocumentation
 * @module Screens/Settings
 * 
 * @summary
 * Provides user settings and data management functionality.
 */

import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { View, Dimensions, ScrollView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "~/src/components/ui/alert-dialog";
import { Button } from "~/src/components/ui/button";
import { Text } from "~/src/components/ui/text";
import { useLanguage } from "~/src/contexts/LanguageContext";
import { LanguageCode, languageNames } from "~/src/locales";
import { createLogger } from "~/src/utils/logger";
import { PORTAL_HOST_NAME } from "~/src/lib/constants";
import { DeviceService } from "../services";
import { SurveyService } from "~/src/services";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { slotService } from '../services/slot-scheduling';
import { getImage } from "~/src/lib/images";
import Markdown from 'react-native-markdown-display';
import { getImageHeight, infoScreenStyles, markdownStyles } from "~/src/styles/infoScreenStyles";
import { platformStyles } from "~/src/styles/platformStyles";
import { AuthService } from "../services/auth";
import { surveyRepository } from "../repositories/survey";

const log = createLogger("SettingsScreen");

/**
 * Navigation prop type for the Settings screen
 */
type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Settings">;

/**
 * Props for the Settings screen component
 */
interface SettingsScreenProps {
  /** Navigation object for screen transitions */
  navigation: SettingsScreenNavigationProp;
}

/**
 * Settings Screen Component
 */
const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { t, language, setLanguage } = useLanguage();
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "success" | "error">(
    "idle"
  );
  const [isLoading, setIsLoading] = useState(true);
  const screenHeight = Dimensions.get('window').height;
  
  // Get settings image from registry
  const SettingsImage = getImage('settings');
  
  // Settings description text with markdown support
  const settingsContent = t('settings.content') || '## Einstellungen\n\nHier können Sie verschiedene Einstellungen der App anpassen und Ihre Daten verwalten.';

  useEffect(() => {
    const fetchDeviceId = async () => {
      try {
        const id = await DeviceService.getDeviceId();
        setDeviceId(id);
      } catch (error) {
        log.error("Error fetching device ID", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeviceId();
  }, []);

  /**
   * Copy device ID to clipboard
   */
  const copyToClipboard = async () => {
    if (deviceId) {
      await Clipboard.setStringAsync(deviceId);
      log.info("Device ID copied to clipboard", { deviceId });
    }
  };

  /**
   * Handle language change
   */
  const handleLanguageChange = async (lang: LanguageCode) => {
    await setLanguage(lang);
    setLanguageDialogOpen(false);
  };

  /**
   * Handle data deletion process
   */
  const handleDeleteData = async () => {
    setDeleteStatus("idle");
    try {
      const currentDeviceId = await DeviceService.getDeviceId();
      if (!currentDeviceId) {
        log.error("No device ID found, cannot delete data.");
        setDeleteStatus("error");
        return;
      }

      log.info("Deleting all data for device", { deviceId: currentDeviceId });

      const surveysDeleted = await SurveyService.deleteAllSurveys();
      
      try {
        await slotService.reset();
        log.info("Slot system successfully reset");
      } catch (slotError) {
        log.error("Error resetting slot system", slotError);
      }

      if (surveysDeleted) {
        log.info("All data successfully deleted.");
        
        // Verify nothing remains in the database with this device ID
        const hasAnyData = await surveyRepository.hasCompletedSurveys(currentDeviceId);
        if (hasAnyData) {
          log.warn("Some data still exists after deletion, but proceeding with identity reset");
        }
        
        // Sign out current anonymous user
        try {
          log.info("Signing out current anonymous user");
          await AuthService.signOut();
          
          // Generate new device ID
          const newDeviceId = await DeviceService.generateNewDeviceId();
          log.info("Generated new device ID after user reset", { newDeviceId });
          
          // Sign in with a new anonymous account
          log.info("Creating new anonymous user");
          await AuthService.signInAnonymously();
          
          log.info("Identity reset completed successfully");
        } catch (authError) {
          log.error("Error during auth reset", authError);
          // Continue anyway since data is deleted
        }
        
        setDeleteStatus("success");
        
        setTimeout(() => {
          setDeleteDialogOpen(false);
          navigation.navigate('Home');
        }, 1500);
      } else {
        log.error("Error deleting surveys.");
        setDeleteStatus("error");
      }
    } catch (error) {
      log.error("Unexpected error during deletion", error);
      setDeleteStatus("error");
    }
  };

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <ScrollView className={`flex-1 px-4 ${platformStyles.contentScrollViewMarginTop}`}>
          {/* Settings Header with Image */}
          <View className={`items-center mb-2 ${platformStyles.headerImageMarginTop}`}>
            {SettingsImage && <SettingsImage 
              height={getImageHeight(screenHeight, 0.2)}
              width="100%"
            />}
          </View>
          
          {/* Buttons container with consistent spacing */}

          <View className="space-y-4 mt-4">
             {/* 1. About Screen */}
             <Button
              variant="outline"
              className="w-full justify-between py-6"
              onPress={() => {
                navigation.navigate('About');
              }}
            >
              <Text className="text-primary text-lg">{t('settings.about')}</Text>
            </Button>

            {/* 2. Privacy Policy */}
            <Button
              variant="outline"
              className="w-full justify-between py-6"
              onPress={() => {
                navigation.navigate('PrivacyPolicy');
              }}
            >
              <Text className="text-primary text-lg">{t('settings.privacyPolicy')}</Text>
            </Button>

            {/* 3. Consent Screen */}
            <Button
              variant="outline"
              className="w-full justify-between py-6"
              onPress={() => {
                navigation.navigate('Consent');
              }}
            >
              <Text className="text-primary text-lg">{t('settings.consent')}</Text>
            </Button>

            {/* 4. Language Selection */}
            <AlertDialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between py-6"
                >
                  <Text className="text-primary text-lg">{`${t('settings.language')}: ${languageNames[language]}`}</Text>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent portalHost={PORTAL_HOST_NAME} className="w-full max-w-full mx-4">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('settings.languageSelection')}</AlertDialogTitle>
                </AlertDialogHeader>
                <View className="space-y-2">
                  {Object.entries(languageNames).map(([code, name]) => (
                    <Button
                      key={code}
                      variant={code === language ? "default" : "outline"}
                      className="w-full"
                      onPress={() => handleLanguageChange(code as LanguageCode)}
                    >
                      <Text className={code === language ? "text-primary-foreground" : "text-primary"}>
                        {name}
                      </Text>
                    </Button>
                  ))}
                </View>
                <AlertDialogFooter className="space-y-2">
                  <Button variant="outline" className="w-full" onPress={() => setLanguageDialogOpen(false)}>
                    <Text>{t('general.cancel')}</Text>
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* 5. Device ID Display */}
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between py-6"
                  disabled={isLoading}
                >
                  <Text className="text-primary text-lg">
                    {isLoading ? t('general.loading') : t('settings.showDeviceId')}
                  </Text>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent portalHost={PORTAL_HOST_NAME} className="w-full max-w-full mx-4">
                <AlertDialogHeader>
                  <AlertDialogTitle>{t('survey.deviceId')}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t('survey.deviceIdDesc')}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <View className="p-4 bg-muted rounded-lg">
                  <Text className="text-primary text-lg font-mono text-center">
                    {deviceId || t('general.loading')}
                  </Text>
                </View>
                <AlertDialogFooter className="space-y-2">
                  <Button variant="outline" className="w-full" onPress={copyToClipboard}>
                    <Text>{t('survey.copyDeviceId')}</Text>
                  </Button>
                  <Button className="w-full" onPress={() => setOpen(false)}>
                    <Text>{t('general.close')}</Text>
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* 6. Delete All Data */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Text className="text-destructive-foreground">{t('settings.deleteAllData')}</Text>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent portalHost={PORTAL_HOST_NAME} className="w-full max-w-full mx-4">
                {deleteStatus === "idle" ? (
                  <>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t('settings.deleteConfirmTitle')}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t('settings.deleteConfirmText')}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="space-y-2">
                      <AlertDialogCancel className="w-full" onPress={() => setDeleteDialogOpen(false)}>
                        <Text className="text-center w-full">{t('general.cancel')}</Text>
                      </AlertDialogCancel>
                      <Button className="w-full bg-destructive" onPress={handleDeleteData}>
                        <Text className="text-destructive-foreground">{t('general.yes')}, {t('settings.deleteAllData')}</Text>
                      </Button>
                    </AlertDialogFooter>
                  </>
                ) : (
                  <>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {deleteStatus === "success" ? t('settings.deleteSuccess') : t('settings.deleteError')}
                      </AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="space-y-2">
                      <Button className="w-full" onPress={() => setDeleteDialogOpen(false)}>
                        <Text>{t('general.close')}</Text>
                      </Button>
                    </AlertDialogFooter>
                  </>
                )}
              </AlertDialogContent>
            </AlertDialog>
          </View>
          
          {/* Bottom padding */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default SettingsScreen;
