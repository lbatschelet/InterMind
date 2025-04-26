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
   * Erzeugt einen kompletten Zeitplan mit der angegebenen Anzahl von Umfragen
   * 
   * @param startDate Startdatum des Zeitplans
   * @param surveyCount Anzahl der zu planenden Umfragen
   * @param config Zeitkonfiguration für die Slot-Erzeugung
   * @returns Ein Array von Slots für die angeforderten Umfragen
   */
  generateSchedule(startDate: Date, surveyCount: number, config: ITimeConfig): ISlot[];
} 