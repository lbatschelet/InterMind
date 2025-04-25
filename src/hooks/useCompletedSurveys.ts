import { useEffect, useState, useCallback } from 'react';
import { slotService, SlotStatus } from '../services/slot-scheduling';
import { createLogger } from '../utils/logger';

const log = createLogger('useCompletedSurveys');

/**
 * Hook that checks if all survey slots have been completed or missed.
 * Used to determine if we should show the thank-you screen.
 * 
 * @returns {boolean} True if all survey slots are completed or missed.
 */
export const useCompletedSurveys = () => {
  const [areAllSlotsCompleted, setAreAllSlotsCompleted] = useState(false);
  
  /**
   * Checks if all slots are either completed or missed
   */
  const checkSlotCompletion = useCallback(async () => {
    try {
      // First ensure that the slot service is initialized
      await slotService.initialize();
      
      // Get all the slots from the slot service
      const allSlots = slotService.getAllSlots();
      
      // If there are no slots yet, we're not done
      if (allSlots.length === 0) {
        setAreAllSlotsCompleted(false);
        return;
      }
      
      // Check if there's at least one pending slot in the future
      const now = new Date();
      const hasActivePendingSlot = allSlots.some(slot => 
        (slot.status === SlotStatus.PENDING && slot.start > now) || 
        slot.status === SlotStatus.ACTIVE
      );
      
      // Get the next pending slot (returns null if none exists)
      const nextPendingSlot = slotService.getNextPendingSlot();
      
      log.debug('Slot completion check', { 
        totalSlots: allSlots.length,
        hasActivePendingSlot,
        hasNextPendingSlot: !!nextPendingSlot
      });
      
      // Only if we don't have any active or pending slots and we have at least one slot
      setAreAllSlotsCompleted(!hasActivePendingSlot && allSlots.length > 0);
    } catch (error) {
      log.error('Error checking slot completion', error);
      setAreAllSlotsCompleted(false);
    }
  }, []);
  
  // Run the check on mount
  useEffect(() => {
    checkSlotCompletion();
    
    // Set up a timer to periodically check (every hour)
    const intervalId = setInterval(checkSlotCompletion, 60 * 60 * 1000);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [checkSlotCompletion]);
  
  return areAllSlotsCompleted;
}; 