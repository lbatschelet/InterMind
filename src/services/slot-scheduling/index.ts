/**
 * @packageDocumentation
 * @module SlotScheduling
 * 
 * @summary
 * Einstiegspunkt für das vereinfachte Slot-Scheduling-System.
 * 
 * @description
 * Das Slot-Scheduling-System plant alle Slots für einen vordefinierten Zeitraum (14 Tage)
 * im Voraus und plant alle Benachrichtigungen einmalig. Dies vereinfacht die Architektur
 * und eliminiert die Notwendigkeit für komplexe Hintergrunddienste.
 * 
 * Dieses System wurde nach SOLID-Prinzipien strukturiert:
 * - Einzelne Verantwortlichkeit (S): Jede Komponente hat eine klar definierte Aufgabe
 * - Offen/Geschlossen (O): Erweiterbar ohne Änderung bestehender Komponenten
 * - Liskovsches Substitutionsprinzip (L): Interfaces können durch verschiedene Implementierungen ersetzt werden
 * - Interface-Segregation (I): Spezifische Interfaces statt Monolithen
 * - Dependency-Inversion (D): Abhängigkeiten zu Abstraktionen statt konkreten Implementierungen
 */

// Re-export interfaces
export { ISlot, SlotStatus } from "./interfaces/ISlot";
export { ISlotService, SlotServiceEvent } from "./interfaces/ISlotService";
export { ISlotGenerator } from "./interfaces/ISlotGenerator";
export { ISlotStorage } from "./interfaces/ISlotStorage";
export { INotificationService } from "./interfaces/INotificationService";
export { ITimeConfig, TimeRange } from "./interfaces/ITimeConfig";

// Re-export implementations
export { SlotGenerator } from "./implementation/SlotGenerator";
export { SlotService, FIRST_SURVEY_CHECKED_KEY } from "./implementation/SlotService";
export { AsyncStorageSlotStorage } from "./implementation/AsyncStorageSlotStorage";
export { ExpoNotificationService } from "./implementation/ExpoNotificationService";

// Re-export constants
export { DEFAULT_TIME_CONFIG } from "./constants";

// Import implementations
import { SlotGenerator } from "./implementation/SlotGenerator";
import { SlotService } from "./implementation/SlotService";
import { AsyncStorageSlotStorage } from "./implementation/AsyncStorageSlotStorage";
import { ExpoNotificationService } from "./implementation/ExpoNotificationService";
import { DEFAULT_TIME_CONFIG } from "./constants";
import { ISlotService } from "./interfaces/ISlotService";

/**
 * Standard-Singleton-Instanz des Slot-Services.
 * Verwendet die Standard-Implementierungen für alle Komponenten.
 */
export const slotService: ISlotService = new SlotService(
  new SlotGenerator(),
  new AsyncStorageSlotStorage(),
  new ExpoNotificationService(),
  DEFAULT_TIME_CONFIG
); 