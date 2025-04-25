/**
 * @packageDocumentation
 * @module SlotScheduling/Interfaces
 * 
 * @summary
 * Interface für den Slot-Generator.
 */

import { ISlot } from "./ISlot";
import { ITimeConfig } from "../interfaces/ITimeConfig";

/**
 * Generator für Slots
 * Zuständig für die Erzeugung eines vordefinierten Zeitplans mit Slots
 */
export interface ISlotGenerator {
  /**
   * Erzeugt einen kompletten Zeitplan für einen bestimmten Zeitraum
   * 
   * @param startDate Startdatum des Zeitplans
   * @param days Anzahl der Tage, für die der Zeitplan erstellt werden soll
   * @param config Zeitkonfiguration für die Slot-Erzeugung
   * @returns Ein Array von Slots für den gesamten Zeitraum
   */
  generateSchedule(startDate: Date, days: number, config: ITimeConfig): ISlot[];
} 