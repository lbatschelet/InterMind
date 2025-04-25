/**
 * @packageDocumentation
 * @module SlotScheduling/Implementation
 * 
 * @summary
 * Implementierung des Haupt-Slot-Services.
 */

import { EventEmitter } from "events";
import { createLogger } from "../../../utils/logger";
import { ISlot, SlotStatus } from "../interfaces/ISlot";
import { ISlotService, SlotServiceEvent } from "../interfaces/ISlotService";
import { ISlotGenerator } from "../interfaces/ISlotGenerator";
import { ISlotStorage } from "../interfaces/ISlotStorage";
import { INotificationService } from "../interfaces/INotificationService";
import { ITimeConfig } from "../interfaces/ITimeConfig";
import { DEFAULT_TIME_CONFIG } from "../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DaySegment } from "../../../types/slots";
import { FIRST_SURVEY_CHECKED_KEY } from "../../../constants/storageKeys";

const log = createLogger("SlotService");




/**
 * Implementierung des Slot-Services
 * Koordiniert die verschiedenen Komponenten des Slot-Systems
 */
export class SlotService implements ISlotService {
  /** Array aller Slots */
  private slots: ISlot[] = [];
  
  /** Event-Emitter für Slot-Ereignisse */
  private eventEmitter = new EventEmitter();
  
  /** Flag, ob das System initialisiert wurde */
  private initialized = false;
  
  /** Flag für die erste Umfrage */
  private firstSurveyMode = false;
  
  /**
   * Konstruktor für den Slot-Service
   * 
   * @param slotGenerator Generator für Slots
   * @param slotStorage Speicher für Slots
   * @param notificationService Dienst für Benachrichtigungen
   * @param timeConfig Zeitkonfiguration
   */
  constructor(
    private readonly slotGenerator: ISlotGenerator,
    private readonly slotStorage: ISlotStorage,
    private readonly notificationService: INotificationService,
    private readonly timeConfig: ITimeConfig = DEFAULT_TIME_CONFIG
  ) {}
  
  /**
   * Registriert einen Event-Listener
   * 
   * @param event Das zu überwachende Ereignis
   * @param listener Die Callback-Funktion, die aufgerufen wird
   * @returns This-Referenz für Method Chaining
   */
  on(event: SlotServiceEvent, listener: (slot: ISlot) => void): this {
    this.eventEmitter.on(event, listener);
    return this;
  }
  
  /**
   * Entfernt einen Event-Listener
   * 
   * @param event Das Ereignis
   * @param listener Die zu entfernende Callback-Funktion
   * @returns This-Referenz für Method Chaining
   */
  off(event: SlotServiceEvent, listener: (slot: ISlot) => void): this {
    this.eventEmitter.off(event, listener);
    return this;
  }
  
  /**
   * Initialisiert den Slot-Service
   * 
   * @returns Promise, das aufgelöst wird, wenn die Initialisierung abgeschlossen ist
   */
  async initialize(): Promise<void> {
    // Vermeiden von Mehrfachinitialisierung
    if (this.initialized) {
      log.debug("Slot service already initialized, skipping initialization");
      return;
    }
    
    try {
      // Prüfen, ob die erste Umfrage bereits abgeschlossen wurde
      const firstSurveyCompleted = await this.isFirstSurveyCompleted();
      
      if (!firstSurveyCompleted) {
        // Wenn die erste Umfrage noch nicht abgeschlossen wurde,
        // aktivieren wir den speziellen Modus und führen keine weitere Initialisierung durch
        log.info("First survey not yet completed, entering first-survey mode");
        this.firstSurveyMode = true;
        this.initialized = true;
        this.slots = []; // Stellt sicher, dass wir keine Slots haben
        return;
      }
      
      // Ab hier wird das reguläre Slot-System initialisiert (nur nach der ersten Umfrage)
      log.info("First survey completed, initializing regular slot system");
      
      // Prüfen, ob bereits Slots vorhanden sind
      const existingSlots = await this.slotStorage.loadSlots();
      
      if (existingSlots && existingSlots.length > 0) {
        log.info("Loaded existing slots", { count: existingSlots.length });
        this.slots = existingSlots;
        
        // Status der Slots aktualisieren (verpasste markieren, aktiven finden)
        await this.updateSlotStatuses();
      } else {
        // Neue Slots generieren, beginnend mit dem aktuellen Datum
        log.info(`Generating new slots for ${this.timeConfig.DEFAULT_SURVEY_COUNT} surveys`);
        this.slots = this.slotGenerator.generateSchedule(
          new Date(), 
          this.timeConfig.DEFAULT_SURVEY_COUNT, 
          this.timeConfig
        );
        
        await this.slotStorage.saveSlots(this.slots);
        
        // Benachrichtigungen für alle Slots planen
        await this.scheduleAllNotifications();
        
        // Erstes Slot-Erstellt-Event auslösen
        const firstSlot = this.slots.length > 0 ? this.slots[0] : null;
        if (firstSlot) {
          this.eventEmitter.emit(SlotServiceEvent.SCHEDULE_CREATED, firstSlot);
        }
      }
      
      this.initialized = true;
      this.firstSurveyMode = false;
    } catch (e) {
      log.error("Failed to initialize slot service", e);
      throw e;
    }
  }
  
  /**
   * Prüft, ob aktuell eine Umfrage verfügbar ist
   * 
   * @returns Promise mit true, wenn eine Umfrage verfügbar ist, sonst false
   */
  async isCurrentlyAvailable(): Promise<boolean> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    // Im Modus für die erste Umfrage ist die Umfrage immer verfügbar
    if (this.firstSurveyMode) {
      return true;
    }
    
    const activeSlot = await this.getActiveSlot();
    return activeSlot !== null;
  }
  
  /**
   * Markiert den aktuellen Slot als abgeschlossen
   * 
   * @returns Promise mit dem nächsten anstehenden Slot oder null, wenn keiner mehr kommt
   */
  async markCurrentSlotCompleted(): Promise<ISlot | null> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    // Im Modus für die erste Umfrage gibt es keine Slots zu markieren
    if (this.firstSurveyMode) {
      return null;
    }
    
    const activeSlot = await this.getActiveSlot();
    if (!activeSlot) {
      return null;
    }
    
    // Slot als abgeschlossen markieren
    activeSlot.status = SlotStatus.COMPLETED;
    await this.slotStorage.saveSlots(this.slots);
    
    this.eventEmitter.emit(SlotServiceEvent.SLOT_COMPLETED, activeSlot);
    
    // Nächsten anstehenden Slot finden
    return this.getNextPendingSlot();
  }
  
  /**
   * Liefert den aktuell aktiven Slot
   * 
   * @returns Promise mit dem aktiven Slot oder null, wenn keiner aktiv ist
   */
  async getActiveSlot(): Promise<ISlot | null> {
    if (!this.initialized) {
      await this.initialize();
    }
    
    // Im Modus für die erste Umfrage gibt es keine aktiven Slots
    if (this.firstSurveyMode) {
      return null;
    }
    
    const now = new Date();
    
    // Aktiven Slot suchen (aktuell laufend und nicht abgeschlossen/verpasst)
    for (const slot of this.slots) {
      if (now >= slot.start && now <= slot.end && 
          slot.status !== SlotStatus.COMPLETED && 
          slot.status !== SlotStatus.MISSED) {
        return slot;
      }
    }
    
    return null;
  }
  
  /**
   * Liefert alle Slots
   * 
   * @returns Array aller Slots
   */
  getAllSlots(): ISlot[] {
    // Im Modus für die erste Umfrage gibt es keine Slots
    if (this.firstSurveyMode) {
      return [];
    }
    
    return [...this.slots];
  }
  
  /**
   * Liefert den nächsten anstehenden Slot
   * 
   * @returns Der nächste anstehende Slot oder null, wenn keiner mehr kommt
   */
  getNextPendingSlot(): ISlot | null {
    // Im Modus für die erste Umfrage gibt es keine anstehenden Slots
    if (this.firstSurveyMode) {
      return null;
    }
    
    const now = new Date();
    
    // Nächsten ausstehenden Slot finden
    for (const slot of this.slots) {
      if (slot.start > now && slot.status === SlotStatus.PENDING) {
        return slot;
      }
    }
    
    return null;
  }
  
  /**
   * Setzt das gesamte System zurück und generiert einen neuen Zeitplan
   * 
   * @returns Promise, das aufgelöst wird, wenn das System zurückgesetzt wurde
   */
  async reset(): Promise<void> {
    try {
      log.info("Starting slot system reset");
      
      // Setze lokalen Status zurück
      this.initialized = false;
      this.firstSurveyMode = false;
      this.slots = [];
      
      // Alle Benachrichtigungen abbrechen
      await this.notificationService.cancelAllNotifications();
      
      // Alle Slot-Daten löschen
      await this.slotStorage.clearAll();
      
      // Prüfen, ob wir nach der ersten Umfrage sind
      // Wichtig: Diese Prüfung erst NACH dem Löschen aller Daten durchführen,
      // damit wir den aktuellsten Status erhalten
      const firstSurveyCompleted = await this.isFirstSurveyCompleted();
      
      if (firstSurveyCompleted) {
        log.info("First survey completed, initializing regular slot system");
        // Direkt die initializeAfterFirstSurvey-Methode aufrufen, statt initialize
        await this.initializeAfterFirstSurvey();
      } else {
        // System neu initialisieren (wird nun korrekt den firstSurveyMode setzen)
        await this.initialize();
      }
      
      log.info(`Slot system reset completed, first survey completed: ${firstSurveyCompleted}`);
    } catch (e) {
      log.error("Failed to reset slot system", e);
      throw e;
    }
  }
  
  /**
   * Initialisiert das System nach Abschluss der ersten Umfrage
   * Stellt sicher, dass der erste Slot mindestens 3 Stunden in der Zukunft liegt
   * und im nächsten Tagessegment beginnt
   * 
   * @private
   */
  private async initializeAfterFirstSurvey(): Promise<void> {
    log.info("Initializing slot system after first survey completion");
    
    // Aktuelles Datum plus Mindestabstand für den Beginn des Zeitplans
    const now = new Date();
    const earliestPossibleTime = new Date(now);
    const minHoursAfterFirstSurvey = Math.max(3, Math.ceil(this.timeConfig.MIN_GAP_MINUTES / 60));
    earliestPossibleTime.setHours(now.getHours() + minHoursAfterFirstSurvey);
    
    // Bestimme aktuelles Tagessegment
    const currentSegment = this.getCurrentDaySegment(now);
    log.info(`Current day segment: ${currentSegment}, current time: ${now.toLocaleString()}`);
    
    // Generiere Slots beginnend mit dem aktuellen Tag
    // Der SlotGenerator berücksichtigt jetzt alle Einschränkungen
    this.slots = this.slotGenerator.generateSchedule(
      earliestPossibleTime, // Starte von der frühesten möglichen Zeit
      this.timeConfig.DEFAULT_SURVEY_COUNT,
      this.timeConfig
    );
    
    // Log für Debugging
    if (this.slots.length > 0) {
      log.info(`First slot will be at ${this.slots[0].start.toLocaleString()} in segment ${this.slots[0].daySegment}`);
      if (this.slots.length > 1) {
        log.info(`Second slot will be at ${this.slots[1].start.toLocaleString()} in segment ${this.slots[1].daySegment}`);
      }
    }
    
    // Speichere die Slots
    await this.slotStorage.saveSlots(this.slots);
    
    // Plane Benachrichtigungen
    await this.scheduleAllNotifications();
    
    // Erstes Slot-Erstellt-Event auslösen
    const firstSlot = this.slots.length > 0 ? this.slots[0] : null;
    if (firstSlot) {
      log.info(`First slot scheduled for ${firstSlot.start.toLocaleString()} in segment ${firstSlot.daySegment}`);
      this.eventEmitter.emit(SlotServiceEvent.SCHEDULE_CREATED, firstSlot);
    }
    
    this.initialized = true;
  }
  
  /**
   * Stellt sicher, dass zwischen aufeinanderfolgenden Slots mindestens die angegebene Anzahl von Stunden liegt
   * 
   * @private
   * @param slots Array von Slots, sortiert nach Zeit
   * @param minHoursBetweenSlots Mindestanzahl von Stunden zwischen zwei Slots
   * @returns Array von Slots mit der Mindestdistanz
   */
  private enforceMinimumTimeBetweenSlots(slots: ISlot[], minHoursBetweenSlots: number): ISlot[] {
    if (!slots || slots.length <= 1) {
      return slots;
    }
    
    // Zuerst nach Startzeit sortieren
    const sortedSlots = [...slots].sort((a, b) => a.start.getTime() - b.start.getTime());
    
    // Ergebnisarray mit dem ersten Slot initialisieren
    const result: ISlot[] = [sortedSlots[0]];
    
    // Minimum Millisekunden zwischen Slots
    const minMillisBetweenSlots = minHoursBetweenSlots * 60 * 60 * 1000;
    
    // Iteriere über alle weiteren Slots
    for (let i = 1; i < sortedSlots.length; i++) {
      const currentSlot = sortedSlots[i];
      const lastIncludedSlot = result[result.length - 1];
      
      // Berechne die Zeit zwischen dem letzten hinzugefügten Slot und dem aktuellen
      const timeBetweenSlots = currentSlot.start.getTime() - lastIncludedSlot.start.getTime();
      
      // Wenn genügend Zeit zwischen den Slots liegt, füge den aktuellen hinzu
      if (timeBetweenSlots >= minMillisBetweenSlots) {
        result.push(currentSlot);
      } else {
        log.debug(`Skipping slot at ${currentSlot.start.toLocaleString()} - too close to previous slot (${Math.round(timeBetweenSlots / (60 * 60 * 1000))} hours)`);
      }
    }
    
    log.info(`Applied minimum time between slots: Kept ${result.length} of ${sortedSlots.length} slots`);
    return result;
  }
  
  /**
   * Ermittelt das aktuelle Tagessegment basierend auf der Uhrzeit
   * 
   * @private
   * @param date Datum, für das das Segment ermittelt werden soll
   * @returns Das aktuelle Tagessegment
   */
  private getCurrentDaySegment(date: Date): DaySegment {
    const hour = date.getHours();
    
    if (hour >= this.timeConfig.MORNING_RANGE.startHour && 
        hour < this.timeConfig.NOON_RANGE.startHour) {
      return DaySegment.MORNING;
    } else if (hour >= this.timeConfig.NOON_RANGE.startHour && 
               hour < this.timeConfig.EVENING_RANGE.startHour) {
      return DaySegment.NOON;
    } else {
      return DaySegment.EVENING;
    }
  }
  
  /**
   * Ermittelt das nächste Tagessegment nach dem angegebenen
   * 
   * @private
   * @param segment Das aktuelle Segment
   * @returns Das nächste Segment
   */
  private getNextDaySegment(segment: DaySegment): DaySegment {
    switch (segment) {
      case DaySegment.MORNING:
        return DaySegment.NOON;
      case DaySegment.NOON:
        return DaySegment.EVENING;
      case DaySegment.EVENING:
        return DaySegment.MORNING;
      default:
        return DaySegment.MORNING;
    }
  }
  
  /**
   * Prüft, ob die erste Umfrage bereits abgeschlossen wurde
   * 
   * @private
   * @returns Promise mit true, wenn die erste Umfrage bereits abgeschlossen wurde
   */
  private async isFirstSurveyCompleted(): Promise<boolean> {
    try {
      if (!FIRST_SURVEY_CHECKED_KEY) {
        log.error("FIRST_SURVEY_CHECKED_KEY is not defined");
        return false;
      }
      
      const value = await AsyncStorage.getItem(FIRST_SURVEY_CHECKED_KEY);
      return value === 'true';
    } catch (error) {
      log.error("Error checking if first survey was completed", error);
      return false;
    }
  }
  
  /**
   * Plant Benachrichtigungen für alle ausstehenden Slots
   * 
   * @private
   */
  private async scheduleAllNotifications(): Promise<void> {
    // Im Modus für die erste Umfrage keine Benachrichtigungen planen
    if (this.firstSurveyMode) {
      return;
    }
    
    try {
      // Erst alle existierenden Benachrichtigungen abbrechen
      await this.notificationService.cancelAllNotifications();
      
      const now = new Date();
      let scheduledCount = 0;
      
      // Für jeden ausstehenden künftigen Slot eine Benachrichtigung planen
      for (const slot of this.slots) {
        if (slot.start > now && slot.status === SlotStatus.PENDING) {
          const notificationId = await this.notificationService.scheduleNotification(slot);
          slot.notificationId = notificationId;
          scheduledCount++;
        }
      }
      
      // Slots mit Benachrichtigungs-IDs speichern
      await this.slotStorage.saveSlots(this.slots);
      
      log.info(`Scheduled ${scheduledCount} notifications`);
    } catch (e) {
      log.error("Failed to schedule notifications", e);
    }
  }
  
  /**
   * Aktualisiert den Status aller Slots basierend auf der aktuellen Zeit
   * 
   * @private
   */
  private async updateSlotStatuses(): Promise<void> {
    // Im Modus für die erste Umfrage keine Slots aktualisieren
    if (this.firstSurveyMode) {
      return;
    }
    
    const now = new Date();
    let activeSlotIndex = -1;
    let statusesChanged = false;
    
    // Veraltete Slots prüfen und Status aktualisieren
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      
      // Wenn der Slot bereits abgeschlossen ist, ignorieren
      if (slot.status === SlotStatus.COMPLETED) continue;
      
      // Wenn der Slot abgelaufen ist und nicht abgeschlossen wurde, als verpasst markieren
      if (slot.end < now && slot.status !== SlotStatus.MISSED) {
        slot.status = SlotStatus.MISSED;
        statusesChanged = true;
        this.eventEmitter.emit(SlotServiceEvent.SLOT_MISSED, slot);
      }
      
      // Wenn wir uns aktuell in diesem Slot befinden
      if (now >= slot.start && now <= slot.end) {
        if (slot.status !== SlotStatus.ACTIVE) {
          slot.status = SlotStatus.ACTIVE;
          statusesChanged = true;
          this.eventEmitter.emit(SlotServiceEvent.SLOT_ACTIVATED, slot);
        }
        activeSlotIndex = i;
      }
    }
    
    // Aktiven Slot-Index speichern, wenn einer gefunden wurde
    if (activeSlotIndex >= 0) {
      await this.slotStorage.saveActiveSlotIndex(activeSlotIndex);
    }
    
    // Wenn sich Status geändert haben, Slots speichern
    if (statusesChanged) {
      await this.slotStorage.saveSlots(this.slots);
    }
  }
} 