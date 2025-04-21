import { useEffect, useState, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { slotCoordinator, SlotStatus, SlotCoordinatorEvent, Slot } from '../services/slots';
import { SurveyService } from '../services';
import { createLogger } from '../utils/logger';
import { LanguageCode } from '../locales';

const log = createLogger('useSurveyAvailability');

/**
 * Hook that manages survey availability state and exposes survey actions
 * 
 * @returns {Object} Survey availability state and actions
 */
export const useSurveyAvailability = () => {
  // State for survey availability
  const [isAvailable, setIsAvailable] = useState(false);
  // State for the next survey time
  const [nextTime, setNextTime] = useState<Date | null>(null);
  // State for tracking if a survey creation is in progress
  const [isCreatingSurvey, setIsCreatingSurvey] = useState(false);
  
  // Ref to track the app state subscription
  const appStateSubscriptionRef = useRef<any>(null);

  /**
   * Checks for survey availability and updates the state
   * This is the core function that communicates with the slotCoordinator
   */
  const checkAvailability = useCallback(async () => {
    log.debug('Checking survey availability');
    
    try {
      // Verwende die zentrale checkAndUpdateSlot-Methode
      const slotResult = await slotCoordinator.checkAndUpdateSlot();
      
      log.debug('Slot system check result:', { 
        hasCurrentSlot: !!slotResult.currentSlot,
        slotStart: slotResult.currentSlot?.start?.toLocaleString(),
        slotEnd: slotResult.currentSlot?.end?.toLocaleString(),
        lastStatus: slotResult.lastStatus || 'N/A',
        updated: slotResult.updated,
        reason: slotResult.reason
      });
      
      // Prüfe die Verfügbarkeit über den SurveyService
      const available = await SurveyService.isSurveyAvailable();
      setIsAvailable(available);
      
      // Update next survey time
      await updateNextSurveyTime(slotResult.currentSlot);
      
    } catch (error) {
      log.error('Error checking availability', error);
      setIsAvailable(false);
      setNextTime(null);
    }
  }, []);

  /**
   * Updates the next survey time based on current slot information
   */
  const updateNextSurveyTime = async (currentSlot: any) => {
    try {
      if (!currentSlot) {
        setNextTime(null);
        return;
      }
      
      const now = new Date();
      
      if (now < currentSlot.start) {
        // Slot is in the future, show start time
        log.debug('Future slot, showing start time', { startTime: currentSlot.start.toLocaleString() });
        setNextTime(currentSlot.start);
      } else if (now >= currentSlot.start && now < currentSlot.end) {
        // Active slot, no next time to show
        log.debug('In active slot, no next time to show');
        setNextTime(null);
      } else {
        // Slot has expired, no need to create next, the SlotCoordinator handles this
        // Just read the next slot that should be already created
        log.debug('Slot expired, checking for next');
        const freshSlot = await slotCoordinator.getCurrentSlot();
        if (freshSlot && freshSlot.start > now) {
          setNextTime(freshSlot.start);
        } else {
          setNextTime(null);
        }
      }
    } catch (error) {
      log.error('Error updating next survey time', error);
      setNextTime(null);
    }
  };

  /**
   * Slot-Änderungs-Handler
   * Wird aufgerufen, wenn sich der Slot ändert
   */
  const handleSlotChanged = useCallback(async (
    newSlot: Slot, 
    newStatus: SlotStatus, 
    oldSlot: Slot | null, 
    oldStatus: SlotStatus | undefined
  ) => {
    log.debug('Slot changed event received', {
      newStart: newSlot?.start?.toLocaleString(),
      newEnd: newSlot?.end?.toLocaleString(),
      newStatus,
      oldStatus
    });
    
    await checkAvailability();
  }, [checkAvailability]);
  
  /**
   * Status-Änderungs-Handler
   * Wird aufgerufen, wenn sich der Status ändert
   */
  const handleStatusChanged = useCallback(async (
    newStatus: SlotStatus, 
    oldStatus: SlotStatus | undefined
  ) => {
    log.debug('Status changed event received', { newStatus, oldStatus });
    await checkAvailability();
  }, [checkAvailability]);
  
  /**
   * Slot-Expired-Handler
   * Wird aufgerufen, wenn ein Slot abläuft
   */
  const handleSlotExpired = useCallback(async (
    expiredSlot: Slot, 
    newSlot: Slot
  ) => {
    log.debug('Slot expired event received', {
      expiredEnd: expiredSlot?.end?.toLocaleString(),
      newStart: newSlot?.start?.toLocaleString()
    });
    await checkAvailability();
  }, [checkAvailability]);

  /**
   * Starts a survey session
   * 
   * @param language The language to use for the survey
   * @returns Promise<boolean> True if survey was successfully started
   */
  const startSurvey = async (language: LanguageCode = 'en'): Promise<boolean> => {
    if (isCreatingSurvey) return false;
    
    try {
      setIsCreatingSurvey(true);
      
      // Double-check availability
      const available = await SurveyService.isSurveyAvailable();
      if (!available) {
        log.info('Survey no longer available');
        setIsAvailable(false);
        await checkAvailability();
        return false;
      }
      
      log.info('Starting survey session');
      const { surveyId } = await SurveyService.startSurvey(false, language);
      
      return !!surveyId;
    } catch (error) {
      log.error('Failed to start survey', error);
      await checkAvailability();
      return false;
    } finally {
      setIsCreatingSurvey(false);
    }
  };

  /**
   * Sets up the event listeners
   */
  useEffect(() => {
    // Initial check
    checkAvailability();
    
    // Event-Listener für Slot-Änderungen registrieren
    slotCoordinator.on(SlotCoordinatorEvent.SLOT_CHANGED, handleSlotChanged);
    slotCoordinator.on(SlotCoordinatorEvent.STATUS_CHANGED, handleStatusChanged);
    slotCoordinator.on(SlotCoordinatorEvent.SLOT_EXPIRED, handleSlotExpired);
    log.debug('Registered slot system event listeners');
    
    // Set up AppState listener to check availability when app comes to foreground
    appStateSubscriptionRef.current = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        log.debug('App came to foreground, checking availability');
        checkAvailability();
      }
    });
    
    // Clean up
    return () => {
      // Event-Listener entfernen
      slotCoordinator.off(SlotCoordinatorEvent.SLOT_CHANGED, handleSlotChanged);
      slotCoordinator.off(SlotCoordinatorEvent.STATUS_CHANGED, handleStatusChanged);
      slotCoordinator.off(SlotCoordinatorEvent.SLOT_EXPIRED, handleSlotExpired);
      
      if (appStateSubscriptionRef.current) {
        appStateSubscriptionRef.current.remove();
        appStateSubscriptionRef.current = null;
      }
    };
  }, [checkAvailability, handleSlotChanged, handleStatusChanged, handleSlotExpired]);

  return {
    isAvailable,
    nextTime,
    startSurvey,
    isCreatingSurvey
  };
}; 