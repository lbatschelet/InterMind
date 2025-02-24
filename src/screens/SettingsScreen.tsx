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
import { PORTAL_HOST_NAME } from "../lib/constants";
import { DeviceService } from "../services/DeviceService";
import { deleteAllSurveys } from "../services/SurveyService";
import { createLogger } from "~/src/utils/logger";
const log = createLogger("SettingsScreen");

/**
 * Settings Screen Component
 */
const SettingsScreen: React.FC = () => {
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
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

      const surveysDeleted = await deleteAllSurveys(currentDeviceId);

      if (surveysDeleted) {
        log.info("All data successfully deleted.");
        setDeleteStatus("success");
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
          {/* User ID Display */}
          <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between py-6"
                disabled={isLoading}
              >
                <Text className="text-primary text-lg">
                  {isLoading ? "Loading..." : "Show User ID"}
                </Text>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent portalHost={PORTAL_HOST_NAME}>
              <AlertDialogHeader>
                <AlertDialogTitle>User ID</AlertDialogTitle>
                <AlertDialogDescription>
                  This ID is generated from your device and used for pseudonymized data collection.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <View className="p-4 bg-muted rounded-lg">
                <Text className="text-primary text-lg font-mono text-center">
                  {deviceId || "Loading..."}
                </Text>
              </View>
              <AlertDialogFooter className="space-y-2">
                <Button variant="outline" className="w-full" onPress={copyToClipboard}>
                  <Text>Copy ID</Text>
                </Button>
                <Button className="w-full" onPress={() => setOpen(false)}>
                  <Text>Close</Text>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Privacy Policy */}
          <Button
            variant="outline"
            className="w-full justify-between py-6"
            onPress={() => {
              // Implement navigation to Privacy Policy
            }}
          >
            <Text className="text-primary text-lg">Privacy Policy</Text>
          </Button>

          {/* About Screen */}
          <Button
            variant="outline"
            className="w-full justify-between py-6"
            onPress={() => {
              // Implement navigation to About screen
            }}
          >
            <Text className="text-primary text-lg">About</Text>
          </Button>

          {/* Delete All Data */}
          <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Text className="text-destructive-foreground">Delete All Data</Text>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent portalHost={PORTAL_HOST_NAME}>
              {deleteStatus === "idle" ? (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete All Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action is irreversible. All collected survey data will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="space-y-2">
                    <AlertDialogCancel className="w-full" onPress={() => setDeleteDialogOpen(false)}>
                      <Text>Cancel</Text>
                    </AlertDialogCancel>
                    <Button className="w-full bg-destructive" onPress={handleDeleteData}>
                      <Text className="text-destructive-foreground">Yes, Delete All Data</Text>
                    </Button>
                  </AlertDialogFooter>
                </>
              ) : (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {deleteStatus === "success" ? "Data Deleted" : "Error Deleting Data"}
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <Button className="w-full" onPress={() => setDeleteDialogOpen(false)}>
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
