import { useEffect, useState, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import { slotService, SlotStatus, SlotServiceEvent, ISlot } from '../services/slot-scheduling';
import { SurveyService } from '../services';
import { createLogger } from '../utils/logger';
import { LanguageCode } from '../locales';
import { Question } from '../types/question';

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
   * This is the core function that communicates with the slotService
   */
  const checkAvailability = useCallback(async () => {
    log.debug('Checking survey availability');
    
    try {
      // Prüfe, ob ein Slot aktiv ist
      const isSlotActive = await slotService.isCurrentlyAvailable();
      const activeSlot = isSlotActive ? await slotService.getActiveSlot() : null;
      
      log.debug('Slot system check result:', { 
        isSlotActive,
        activeSlot: activeSlot ? {
          id: activeSlot.id,
          start: activeSlot.start.toLocaleString(),
          end: activeSlot.end.toLocaleString(),
          status: activeSlot.status
        } : null
      });
      
      // Prüfe die Verfügbarkeit über den SurveyService
      const available = await SurveyService.isSurveyAvailable();
      setIsAvailable(available);
      
      // Update next survey time
      await updateNextSurveyTime(activeSlot);
      
    } catch (error) {
      log.error('Error checking availability', error);
      setIsAvailable(false);
      setNextTime(null);
    }
  }, []);

  /**
   * Updates the next survey time based on current slot information
   */
  const updateNextSurveyTime = async (currentSlot: ISlot | null) => {
    try {
      if (!currentSlot) {
        const nextPendingSlot = slotService.getNextPendingSlot();
        if (nextPendingSlot) {
          log.debug('No active slot, showing next pending slot time', { 
            startTime: nextPendingSlot.start.toLocaleString() 
          });
          setNextTime(nextPendingSlot.start);
        } else {
          setNextTime(null);
        }
        return;
      }
      
      const now = new Date();
      
      if (now < currentSlot.start) {
        // Slot is in the future, show start time
        log.debug('Future slot, showing start time', { startTime: currentSlot.start.toLocaleString() });
        setNextTime(currentSlot.start);
      } else if (now >= currentSlot.start && now <= currentSlot.end) {
        // Active slot, no next time to show
        log.debug('In active slot, no next time to show');
        setNextTime(null);
      } else {
        // Slot has expired, check for next pending slot
        log.debug('Slot expired, checking for next');
        const nextPendingSlot = slotService.getNextPendingSlot();
        if (nextPendingSlot) {
          setNextTime(nextPendingSlot.start);
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
   * Starts a survey session
   * 
   * @param language The language to use for the survey
   * @returns Promise with survey data if successful, or false if failed
   */
  const startSurvey = async (language: LanguageCode = 'en'): Promise<{ surveyId: string; questions: Question[] } | false> => {
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
      const result = await SurveyService.startSurvey(false, language);
      
      // Markiere den aktuellen Slot als abgeschlossen
      try {
        await slotService.markCurrentSlotCompleted();
        log.info('Marked current slot as completed');
      } catch (e) {
        log.warn('Failed to mark slot as completed', e);
      }
      
      return result;
    } catch (error) {
      log.error('Failed to start survey', error);
      await checkAvailability();
      return false;
    } finally {
      setIsCreatingSurvey(false);
    }
  };

  /**
   * Handles slot activated event
   */
  const handleSlotActivated = useCallback((slot: ISlot) => {
    log.debug('Slot activated event received', {
      id: slot.id,
      start: slot.start.toLocaleString(),
      end: slot.end.toLocaleString()
    });
    checkAvailability();
  }, [checkAvailability]);
  
  /**
   * Handles slot completed event
   */
  const handleSlotCompleted = useCallback((slot: ISlot) => {
    log.debug('Slot completed event received', {
      id: slot.id
    });
    checkAvailability();
  }, [checkAvailability]);
  
  /**
   * Handles slot missed event
   */
  const handleSlotMissed = useCallback((slot: ISlot) => {
    log.debug('Slot missed event received', {
      id: slot.id
    });
    checkAvailability();
  }, [checkAvailability]);

  /**
   * Sets up the event listeners
   */
  useEffect(() => {
    // Initial check
    checkAvailability();
    
    // Event-Listener für Slot-Änderungen registrieren
    slotService.on(SlotServiceEvent.SLOT_ACTIVATED, handleSlotActivated);
    slotService.on(SlotServiceEvent.SLOT_COMPLETED, handleSlotCompleted);
    slotService.on(SlotServiceEvent.SLOT_MISSED, handleSlotMissed);
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
      slotService.off(SlotServiceEvent.SLOT_ACTIVATED, handleSlotActivated);
      slotService.off(SlotServiceEvent.SLOT_COMPLETED, handleSlotCompleted);
      slotService.off(SlotServiceEvent.SLOT_MISSED, handleSlotMissed);
      
      if (appStateSubscriptionRef.current) {
        appStateSubscriptionRef.current.remove();
        appStateSubscriptionRef.current = null;
      }
    };
  }, [checkAvailability, handleSlotActivated, handleSlotCompleted, handleSlotMissed]);

  return {
    isAvailable,
    nextTime,
    startSurvey,
    isCreatingSurvey
  };
}; 