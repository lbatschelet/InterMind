/**
 * @packageDocumentation
 * @module Screens/Settings
 * 
 * @summary
 * Provides user settings and data management functionality.
 */

import * as Clipboard from "expo-clipboard";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
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
import { DeviceService } from "../services/DeviceService";
import SurveyService from "~/src/services/SurveyService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { resetSlotSystem } from '../services/slots';

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
        await resetSlotSystem();
        log.info("Slot system successfully reset");
      } catch (slotError) {
        log.error("Error resetting slot system", slotError);
      }

      if (surveysDeleted) {
        log.info("All data successfully deleted.");
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
        <View className="p-4 space-y-4">
          {/* Language Selection */}
          <AlertDialog open={languageDialogOpen} onOpenChange={setLanguageDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between py-6"
              >
                <Text className="text-primary text-lg flex-shrink">{t('settings.language')}</Text>
                <Text className="text-muted-foreground ml-2">
                  {languageNames[language]}
                </Text>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent portalHost={PORTAL_HOST_NAME}>
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
              <AlertDialogFooter>
                <Button variant="outline" className="w-full" onPress={() => setLanguageDialogOpen(false)}>
                  <Text>{t('general.cancel')}</Text>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* User ID Display */}
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between py-6"
                disabled={isLoading}
              >
                <Text className="text-primary text-lg">
                  {isLoading ? t('general.loading') : t('settings.showUserId')}
                </Text>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent portalHost={PORTAL_HOST_NAME}>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('survey.userId')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('survey.userIdDesc')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <View className="p-4 bg-muted rounded-lg">
                <Text className="text-primary text-lg font-mono text-center">
                  {deviceId || t('general.loading')}
                </Text>
              </View>
              <AlertDialogFooter className="space-y-2">
                <Button variant="outline" className="w-full" onPress={copyToClipboard}>
                  <Text>{t('survey.copyId')}</Text>
                </Button>
                <Button className="w-full" onPress={() => setOpen(false)}>
                  <Text>{t('general.close')}</Text>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Privacy Policy */}
          <Button
            variant="outline"
            className="w-full justify-between py-6"
            onPress={() => {
              navigation.navigate('PrivacyPolicy');
            }}
          >
            <Text className="text-primary text-lg">{t('settings.privacyPolicy')}</Text>
          </Button>

          {/* About Screen */}
          <Button
            variant="outline"
            className="w-full justify-between py-6"
            onPress={() => {
              navigation.navigate('About');
            }}
          >
            <Text className="text-primary text-lg">{t('settings.about')}</Text>
          </Button>

          {/* Delete All Data */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Text className="text-destructive-foreground">{t('settings.deleteAllData')}</Text>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent portalHost={PORTAL_HOST_NAME}>
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
                      <Text>{t('general.cancel')}</Text>
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
                  <AlertDialogFooter>
                    <Button className="w-full" onPress={() => setDeleteDialogOpen(false)}>
                      <Text>{t('general.close')}</Text>
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
