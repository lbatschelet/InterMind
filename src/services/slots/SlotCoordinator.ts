import { createLogger } from "~/src/utils/logger";
import { NotificationScheduler } from "./NotificationScheduler";
import { SlotManager } from "./SlotManager";
import { SlotStateStore } from "./SlotStateStore";
import { Slot, SlotMeta, SlotStatus, SurveyEvent, eventToStatus } from "./types";

const log = createLogger("SlotCoordinator");

/**
 * SlotCoordinator
 * --------------
 * 
 * Zentrale Komponente, die die Slot-Logik koordiniert.
 * - Empfängt Survey-Events
 * - Berechnet den nächsten Slot mit Hilfe des SlotManagers
 * - Speichert den Slot im SlotStateStore
 * - Plant Benachrichtigungen über den NotificationScheduler
 */
export class SlotCoordinator {
  public slotManager: SlotManager;
  private slotStore: SlotStateStore;
  public notificationScheduler: NotificationScheduler;
  private isInitializing: boolean = false;
  private isInitialized: boolean = false;
  
  constructor(
    slotManager: SlotManager,
    slotStore: SlotStateStore,
    notificationScheduler: NotificationScheduler
  ) {
    this.slotManager = slotManager;
    this.slotStore = slotStore;
    this.notificationScheduler = notificationScheduler;
  }
  
  /**
   * Initialisiert das Slot-System, indem überprüft wird, ob ein Slot existiert.
   * Wenn kein Slot vorhanden ist, wird ein initialer Slot erstellt.
   */
  async initialize(): Promise<void> {
    // Verhindern mehrfacher gleichzeitiger Initialisierungen
    if (this.isInitializing) {
      log.info("Slot system initialization already in progress, skipping redundant call");
      return;
    }
    
    // Verhindern wiederholter Initialisierungen nach erfolgreicher Initialisierung
    if (this.isInitialized) {
      log.info("Slot system already initialized, skipping redundant call");
      return;
    }
    
    this.isInitializing = true;
    log.info("Initializing slot system");
    
    try {
      // Prüfe, ob bereits ein Slot existiert
      const currentSlot = await this.getCurrentSlot();
      const now = new Date();
      
      if (!currentSlot) {
        // Kein Slot vorhanden - erstelle einen initialen Slot
        // Für die erste Umfrage "permanent" verfügbar machen
        
        // Erzeuge einen permanenten Slot, der jetzt beginnt und in 2 Stunden endet
        const start = new Date(now);
        const end = new Date(now);
        end.setHours(end.getHours() + 2);
        
        const initialSlot: Slot = { start, end };
        
        // Speichere den initialen Slot
        await this.slotStore.saveSlot(initialSlot, SlotStatus.INITIAL);
        
        log.info("Created initial permanent slot", {
          start: initialSlot.start.toLocaleString(),
          end: initialSlot.end.toLocaleString()
        });
      } else {
        // Slot existiert bereits - prüfen, ob es sich um die immer verfügbare Initialumfrage handelt
        const lastMeta = await this.slotStore.readLastMeta();
        
        if (lastMeta && lastMeta.status === SlotStatus.INITIAL) {
          log.info("Initial permanent survey is active", {
            start: currentSlot.start.toLocaleString(),
            end: currentSlot.end.toLocaleString()
          });
          // Keine weitere Aktion nötig, da die Erstumfrage immer verfügbar ist
        } else {
          // Normale Slot-Behandlung für nicht-initiale Slots
          
          // Überprüfen, ob der Slot bereits abgelaufen ist
          if (now > currentSlot.end) {
            log.info("Existing slot has expired, calculating new slot", {
              slotEnd: currentSlot.end.toLocaleString(),
              now: now.toLocaleString()
            });
            
            // Hole Meta-Daten des letzten Slots
            const lastMeta = await this.slotStore.readLastMeta();
            
            // Berechne einen neuen Slot
            const nextSlot = this.slotManager.nextSlot(
              now,
              lastMeta?.end || currentSlot.end,
              lastMeta?.status || SlotStatus.EXPIRED
            );
            
            // Speichere den neuen Slot
            await this.slotStore.saveSlot(nextSlot, SlotStatus.EXPIRED);
            
            // Plane eine Benachrichtigung für den neuen Slot
            await this.scheduleNotificationOnce(nextSlot);
            
            log.info("New slot created after expiration", {
              start: nextSlot.start.toLocaleString(),
              end: nextSlot.end.toLocaleString(),
              segment: this.slotManager.getSegmentForTime(nextSlot.start)
            });
          } else if (now < currentSlot.start) {
            // Der Slot beginnt in der Zukunft, plane eine Benachrichtigung
            // Aber prüfe zuerst, ob bereits eine geplant ist, um Duplikate zu vermeiden
            const needsScheduling = await this.shouldRescheduleNotification(currentSlot);
            
            if (needsScheduling) {
              await this.scheduleNotificationOnce(currentSlot);
              log.info("Re-scheduled notification for future slot", {
                start: currentSlot.start.toLocaleString(),
                end: currentSlot.end.toLocaleString(),
                minutesUntilStart: Math.round((currentSlot.start.getTime() - now.getTime()) / (60 * 1000))
              });
            } else {
              log.info("Notification already scheduled for future slot, skipping", {
                start: currentSlot.start.toLocaleString(),
                end: currentSlot.end.toLocaleString(),
                minutesUntilStart: Math.round((currentSlot.start.getTime() - now.getTime()) / (60 * 1000))
              });
            }
          } else if (now >= currentSlot.start && now < currentSlot.end) {
            // Wir befinden uns in einem aktiven Slot
            log.info("Currently in an active slot", {
              start: currentSlot.start.toLocaleString(),
              end: currentSlot.end.toLocaleString(),
              minutesRemaining: Math.round((currentSlot.end.getTime() - now.getTime()) / (60 * 1000))
            });
          }
        }
      }
      
      // Nach der Initialisierung nochmal die Slot-Daten auslesen und loggen
      const finalSlot = await this.getCurrentSlot();
      log.info("Slot system initialization complete, current slot state:", {
        hasSlot: !!finalSlot,
        start: finalSlot?.start?.toLocaleString() || 'none',
        end: finalSlot?.end?.toLocaleString() || 'none',
        segment: finalSlot ? this.slotManager.getSegmentForTime(finalSlot.start) : 'none'
      });
      
      // Initialisierung erfolgreich abgeschlossen
      this.isInitialized = true;
    } catch (error) {
      log.error("Error during slot system initialization", error);
    } finally {
      this.isInitializing = false;
    }
  }
  
  /**
   * Überprüft, ob eine Benachrichtigung neu geplant werden muss
   * Dies hilft, doppelte Benachrichtigungen zu vermeiden
   */
  private async shouldRescheduleNotification(slot: Slot): Promise<boolean> {
    const nextNotificationTime = await this.notificationScheduler.getNextScheduledNotificationTime();
    
    // Wenn keine geplant ist oder der Zeitpunkt nicht mit dem Slot übereinstimmt, neu planen
    if (!nextNotificationTime) {
      return true;
    }
    
    // Wenn die geplante Zeit mehr als 2 Minuten vom Slot-Start abweicht, neu planen
    const timeDifferenceMs = Math.abs(nextNotificationTime.getTime() - slot.start.getTime());
    return timeDifferenceMs > 2 * 60 * 1000; // 2 Minuten
  }
  
  /**
   * Plant eine Benachrichtigung, aber stellt sicher, dass keine Duplikate erstellt werden
   */
  private async scheduleNotificationOnce(slot: Slot): Promise<boolean> {
    // Bestehende Benachrichtigungen löschen, um Duplikate zu vermeiden
    await this.notificationScheduler.cancelAll();
    
    // Neue Benachrichtigung planen
    return await this.notificationScheduler.schedule(slot);
  }
  
  /**
   * Verarbeitet ein Survey-Event und berechnet den nächsten Slot
   */
  async onSurveyEvent(event: SurveyEvent): Promise<Slot> {
    log.info("Processing survey event", { event });
    
    // Bei FIRST_SURVEY_COMPLETED wechseln wir vom permanenten Modus in den Slot-Modus
    if (event === SurveyEvent.FIRST_SURVEY_COMPLETED) {
      log.info("First survey completed, switching to slot-based scheduling");
      
      // Starte mit dem aktuellen Zeitpunkt als Basis
      const now = new Date();
      
      // Berechne den ersten richtigen Slot
      const nextSlot = this.slotManager.nextSlot(
        now,   // current time
        now,   // consider "now" as the end of the permanent slot
        SlotStatus.FIRST_COMPLETED
      );
      
      // Speichere den neuen Slot mit dem entsprechenden Status
      await this.slotStore.saveSlot(nextSlot, SlotStatus.COMPLETED);
      
      // Plane eine Benachrichtigung für den Start des Slots
      await this.scheduleNotificationOnce(nextSlot);
      
      log.info("First regular slot scheduled", { 
        start: nextSlot.start.toLocaleTimeString(),
        end: nextSlot.end.toLocaleTimeString()
      });
      
      return nextSlot;
    }
    
    // Normale Slot-Planung für alle anderen Event-Typen
    try {
      // Hole Metadaten des letzten Slots
      const lastMeta = await this.slotStore.readLastMeta();
      
      // Wandle das Event in einen Status um
      const status = eventToStatus(event);
      
      // Aktuelle Zeit für die Berechnung
      const now = new Date();
      
      // Berechne den nächsten Slot
      const nextSlot = this.slotManager.nextSlot(
        now, // current time
        lastMeta?.end || now, // Wenn kein letzter Slot existiert, verwende aktuelle Zeit
        lastMeta ? lastMeta.status : status // Falls kein Status existiert, verwende den aktuellen
      );
      
      // Speichere den neuen Slot mit dem entsprechenden Status
      await this.slotStore.saveSlot(nextSlot, status);
      
      // Plane eine Benachrichtigung für den Start des Slots
      // Beachte, dass die Planung fehlschlagen kann, wenn der Zeitpunkt zu nah ist
      const scheduled = await this.scheduleNotificationOnce(nextSlot);
      
      if (scheduled) {
        log.info("New slot scheduled with notification", { 
          start: nextSlot.start.toLocaleTimeString(),
          end: nextSlot.end.toLocaleTimeString(),
          segment: this.slotManager.getSegmentForTime(nextSlot.start)
        });
      } else {
        log.info("New slot created without notification (too close or permission denied)", {
          start: nextSlot.start.toLocaleTimeString(),
          end: nextSlot.end.toLocaleTimeString(),
          segment: this.slotManager.getSegmentForTime(nextSlot.start)
        });
      }
      
      return nextSlot;
    } catch (error) {
      log.error("Error creating next slot", error);
      
      // Fallback: Erstelle einen Standardslot in einem vernünftigen Zeitfenster
      const now = new Date();
      
      // Erstelle einen Slot für nächsten Tag um 10 Uhr
      const fallbackSlot: Slot = {
        start: new Date(now),
        end: new Date(now)
      };
      
      // Setze auf nächsten Tag 10 Uhr
      fallbackSlot.start.setDate(fallbackSlot.start.getDate() + 1);
      fallbackSlot.start.setHours(10, 0, 0, 0);
      
      // Slot-Ende 1 Stunde später
      fallbackSlot.end = new Date(fallbackSlot.start);
      fallbackSlot.end.setHours(fallbackSlot.end.getHours() + 1);
      
      log.info("Created fallback slot due to error", {
        start: fallbackSlot.start.toLocaleTimeString(),
        end: fallbackSlot.end.toLocaleTimeString(),
        reason: "Error in slot calculation"
      });
      
      // Speichere den Fallback-Slot
      const status = eventToStatus(event);
      await this.slotStore.saveSlot(fallbackSlot, status);
      
      return fallbackSlot;
    }
  }
  
  /**
   * Prüft, ob eine Umfrage aktuell verfügbar ist
   */
  async isSurveyAvailable(): Promise<boolean> {
    try {
      // Prüfe zuerst den Status - wenn es INITIAL ist, ist die Umfrage immer verfügbar
      const lastMeta = await this.slotStore.readLastMeta();
      
      if (lastMeta?.status === SlotStatus.INITIAL) {
        log.debug("Survey is always available because it's in INITIAL state");
        return true;
      }
      
      // Für alle anderen Status: normale Prüfung, ob wir in einem aktiven Slot sind
      return await this.slotStore.isInActiveSlot();
    } catch (error) {
      log.error("Error checking if survey is available", error);
      return false;
    }
  }
  
  /**
   * Holt den aktuellen Slot, falls vorhanden
   */
  async getCurrentSlot(): Promise<Slot | null> {
    return await this.slotStore.readCurrentSlot();
  }
  
  /**
   * Liest die Metadaten des letzten Slots
   * @returns SlotMeta oder null, wenn kein letzter Slot existiert
   */
  async readLastMeta(): Promise<SlotMeta | null> {
    return await this.slotStore.readLastMeta();
  }
  
  /**
   * Bricht alle Benachrichtigungen ab
   */
  async cancelAllNotifications(): Promise<void> {
    await this.notificationScheduler.cancelAll();
  }
  
  /**
   * Setzt den internen Initialisierungsstatus zurück.
   * Diese Methode wird beim Reset des Slot-Systems aufgerufen.
   */
  resetInitializationState(): void {
    log.info("Resetting initialization state of SlotCoordinator");
    this.isInitialized = false;
    this.isInitializing = false;
  }
} 