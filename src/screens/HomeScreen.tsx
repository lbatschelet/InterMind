import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState, useRef } from "react";
import { Dimensions, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ADayAtThePark from "~/assets/a-day-at-the-park.svg";
import { Button } from "~/src/components/ui/button";
import { Text } from "~/src/components/ui/text";
import { useLanguage } from "~/src/contexts/LanguageContext";
import { RootStackParamList } from "~/src/navigation/AppNavigator";
import SurveyService from "../services/SurveyService";
import { createLogger } from "~/src/utils/logger";
import { useFocusEffect } from "@react-navigation/native";
import { slotCoordinator, SlotStatus } from '../services/slots';

const log = createLogger("HomeScreen");

// Intervall für Verfügbarkeitsprüfung (5 Minuten)
const AVAILABILITY_CHECK_INTERVAL = 5 * 60 * 1000;

// Minimale Zeit zwischen Prüfungen (10 Sekunden)
const MIN_CHECK_INTERVAL = 10 * 1000;

/** Screen width for responsive display */
const { width } = Dimensions.get("window");

/** Navigation prop type for the Home screen */
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Home">;

/** Props for the Home screen component */
interface HomeScreenProps {
  /** Navigation object from React Navigation */
  navigation: HomeScreenNavigationProp;
}

/**
 * Home Screen Component
 *
 * @param navigation - Navigation object for screen transitions
 *
 * @remarks
 * Main entry point of the application with:
 * - Display of a welcoming illustration
 * - Start button for new survey
 * - Prevention of double submissions
 *
 * @example
 * ```tsx
 * <HomeScreen navigation={navigation} />
 * ```
 */
const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { t, language } = useLanguage();
  /** State to prevent double submissions */
  const [isCreatingSurvey, setIsCreatingSurvey] = useState(false);
  /** State to track if a survey is currently available */
  const [isSurveyAvailable, setIsSurveyAvailable] = useState(false);
  /** State to store the next scheduled survey time */
  const [nextSurveyTime, setNextSurveyTime] = useState<Date | null>(null);
  
  // Ref to track the last check time to avoid too frequent checks
  const lastCheckTimeRef = useRef<number>(0);

  /**
   * Checks survey availability and updates the UI state accordingly.
   * 
   * This method:
   * 1. Checks availability through SlotCoordinator
   * 2. Updates UI state based on result
   * 3. Handles expired survey slots by notifying SurveyService
   * 4. Fetches current slot information for display
   * 
   * @param force If true, performs check regardless of last check time
   */
  const checkSurveyAvailability = async (force = false) => {
    const now = Date.now();
    const timeSinceLastCheck = now - lastCheckTimeRef.current;
    
    // Skip check if not forced and checked recently
    if (!force && timeSinceLastCheck < MIN_CHECK_INTERVAL) {
      log.debug(`Skipping availability check, last check was ${Math.round(timeSinceLastCheck / 1000)}s ago`);
      return;
    }
    
    log.debug("Checking survey availability");
    lastCheckTimeRef.current = now;
    
    try {
      // Stellen wir zuerst sicher, dass der SlotCoordinator initialisiert ist
      await slotCoordinator.initialize();
      
      // Hole Daten direkt vom SlotCoordinator, um zu verstehen was passiert
      const currentSlot = await slotCoordinator.getCurrentSlot();
      const lastMeta = await slotCoordinator.readLastMeta();
      
      log.info("Slot system state for availability check:", { 
        hasCurrentSlot: !!currentSlot,
        slotStart: currentSlot?.start?.toLocaleString(),
        slotEnd: currentSlot?.end?.toLocaleString(),
        lastStatus: lastMeta?.status || "N/A"
      });
      
      // Get current availability state and store previous state
      const previouslyAvailable = isSurveyAvailable;
      
      // Get availability directly from SurveyService which uses SlotCoordinator
      const isAvailable = await SurveyService.isSurveyAvailable();
      log.info(`Survey availability result: ${isAvailable ? "AVAILABLE" : "NOT AVAILABLE"}`);
      
      setIsSurveyAvailable(isAvailable);
      
      // Check if a survey slot has expired without completion
      if (previouslyAvailable && !isAvailable) {
        log.info("Survey slot has expired without completion");
        // Handle expiration with SurveyService
        await SurveyService.handleSurveyExpired();
      }
      
      // Get the current slot information again after potential updates
      await updateNextSurveyTimeDisplay();
      
    } catch (error) {
      log.error("Error during availability check", error);
      setIsSurveyAvailable(false);
      setNextSurveyTime(null);
    }
  };
  
  /**
   * Updates the display of the next survey time based on current slot information
   */
  const updateNextSurveyTimeDisplay = async () => {
    try {
      // Get the current slot information
      const currentSlot = await slotCoordinator.getCurrentSlot();
      
      if (currentSlot) {
        const now = new Date();
        
        if (now < currentSlot.start) {
          // Der Slot ist in der Zukunft, zeige die Startzeit an
          log.debug("Future slot, showing start time", { startTime: currentSlot.start.toLocaleString() });
          setNextSurveyTime(currentSlot.start);
        } else if (now >= currentSlot.start && now < currentSlot.end) {
          // Wir befinden uns im aktiven Slot, kein nächster Slot anzuzeigen
          log.debug("In active slot, no next time to show");
          setNextSurveyTime(null);
        } else {
          // Der Slot ist abgelaufen, frage den nächsten ab (für den Fall, dass es einen gibt)
          log.debug("Slot expired, checking for next");
          const nextSlot = slotCoordinator.slotManager.nextSlot(
            new Date(),
            currentSlot.end,
            SlotStatus.EXPIRED
          );
          setNextSurveyTime(nextSlot.start);
        }
      } else {
        // Kein Slot vorhanden, sollte nach der Initialisierung nicht mehr vorkommen
        log.warn("No slot found after initialization");
        setNextSurveyTime(null);
      }
    } catch (error) {
      log.error("Error getting slot information", error);
      setNextSurveyTime(null);
    }
  };

  /**
   * Initial and periodic availability checking
   * 
   * This effect:
   * 1. Performs an immediate availability check on component mount
   * 2. Sets up a recurring check every AVAILABILITY_CHECK_INTERVAL (5 minutes)
   * 3. Cleans up the interval when component unmounts
   * 
   * The periodic checks ensure the UI stays updated even if the user
   * keeps the app open for extended periods.
   */
  useEffect(() => {
    // Check immediately on first render
    checkSurveyAvailability(true);
    
    // Then check with the specified interval
    const interval = setInterval(() => checkSurveyAvailability(true), AVAILABILITY_CHECK_INTERVAL);
    
    return () => clearInterval(interval);
  }, []);

  /**
   * Focus-triggered availability check
   * 
   * This effect runs whenever the screen comes into focus, ensuring that
   * the survey availability is checked when:
   * - User navigates back from another screen
   * - App returns to foreground from background
   * - User returns to this tab/screen
   * 
   * This is critical for refreshing the UI state after completing a survey
   * or when returning to the app after a notification.
   * 
   * The check is still subject to throttling to prevent excessive API calls.
   */
  useFocusEffect(
    React.useCallback(() => {
      // Force a check when returning to this screen, to catch any availability changes
      // This is critical to update the UI after survey completion
      checkSurveyAvailability(true);
    }, [])
  );

  /**
   * Formats the next survey time in a user-friendly way showing the actual time
   */
  const formatNextSurveyTime = () => {
    if (!nextSurveyTime) return t('home.noUpcomingSurvey');
    
    const now = new Date();
    const isToday = nextSurveyTime.getDate() === now.getDate() &&
                    nextSurveyTime.getMonth() === now.getMonth() &&
                    nextSurveyTime.getFullYear() === now.getFullYear();
    
    // Format time as HH:MM
    const hours = nextSurveyTime.getHours().toString().padStart(2, '0');
    const minutes = nextSurveyTime.getMinutes().toString().padStart(2, '0');
    
    if (isToday) {
      return `${t('home.nextSurveyAt')} ${hours}:${minutes}`;
    } else {
      // Format for tomorrow or later date
      const date = nextSurveyTime.getDate().toString().padStart(2, '0');
      const month = (nextSurveyTime.getMonth() + 1).toString().padStart(2, '0');
      return `${t('home.nextSurveyAt')} ${date}.${month}. ${hours}:${minutes}`;
    }
  };

  /**
   * Starts a new survey
   *
   * @remarks
   * Flow:
   * 1. Prevents double submission 
   * 2. Verifies availability with SurveyService
   * 3. Creates new survey session with SurveyService
   * 4. Navigates to the SurveyScreen
   *
   * Error handling is managed by the respective services
   *
   * @returns Promise that resolves when the survey is created and navigation occurs
   */
  const handleStartSurvey = async () => {
    // Don't allow starting survey if already creating one
    if (isCreatingSurvey) return;

    try {
      setIsCreatingSurvey(true);
      
      // Double-check availability directly with SurveyService
      const isAvailable = await SurveyService.isSurveyAvailable();
      if (!isAvailable) {
        log.info("Survey no longer available");
        setIsSurveyAvailable(false);
        await checkSurveyAvailability(true);
        return;
      }
      
      log.info("Starting a new survey session...");
      const { surveyId, questions } = await SurveyService.startSurvey(false, language);

      if (surveyId) {
        log.info("Survey session started", { surveyId });
        navigation.navigate("SurveyScreen");
      }
    } catch (error) {
      log.error("Failed to start survey", error);
      // If we get an error, update availability state
      await checkSurveyAvailability(true);
    } finally {
      setIsCreatingSurvey(false);
    }
  };

  return (
    <View style={{ flex: 1 }} className="bg-background">
      <SafeAreaView edges={["top"]} className="flex-1">
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

        {/* Centered SVG */}
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ADayAtThePark width={width * 0.8} height={width * 0.8} />
        </View>

        {/* Survey Button */}
        <View className="w-full px-4 mb-12 items-center">
          <Button 
            variant="default" 
            className={isSurveyAvailable ? "bg-accent w-full" : "bg-muted w-full"}
            disabled={!isSurveyAvailable}
            onPress={handleStartSurvey}
          >
            <Text 
              className={isSurveyAvailable 
                ? "text-primary text-lg font-bold" 
                : "text-muted-foreground text-lg"
              }
            >
              {isSurveyAvailable 
                ? t('home.startSurvey')
                : formatNextSurveyTime()
              }
            </Text>
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
