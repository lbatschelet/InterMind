/**
 * @packageDocumentation
 * @module Services
 * 
 * @summary
 * Implementierung des Survey Lifecycle Service
 */

import { injectable } from 'inversify';
import { ISurveyLifecycleService } from './interfaces/ISurveyLifecycleService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLogger } from '../../utils/logger';
import { slotService } from '../slot-scheduling';
import { FIRST_SURVEY_CHECKED_KEY } from '../../constants/storageKeys';

const log = createLogger("SurveyLifecycleService");

// Definiere SurveyType direkt hier, bis Typendefinitionen behoben sind
export enum SurveyType {
  /**
   * Keine Umfrage verfügbar
   */
  NONE = 'none',

  /**
   * Die erste Umfrage, die beim ersten Start der App angezeigt wird
   */
  FIRST = 'first',

  /**
   * Reguläre Umfragen, die nach einem Zeitplan angezeigt werden
   */
  REGULAR = 'regular'
}

/**
 * Implementierung des Survey Lifecycle Service
 * Verwaltet den Lebenszyklus von Umfragen im System
 */
@injectable()
export class SurveyLifecycleService implements ISurveyLifecycleService {
  private firstSurveyShown: boolean = false;
  private lastSurveyCompletedTimestamp: number | null = null;
  
  /**
   * Prüft, ob die erste Umfrage angezeigt werden soll
   * @returns True, wenn die erste Umfrage angezeigt werden soll, sonst false
   */
  public shouldShowFirstSurvey(): boolean {
    return !this.firstSurveyShown;
  }

  /**
   * Bestimmt den Typ der nächsten Umfrage
   * @returns Den Typ der nächsten anzuzeigenden Umfrage
   */
  public getNextSurveyType(): SurveyType {
    // Wenn die erste Umfrage noch nicht angezeigt wurde, zeige sie an
    if (!this.firstSurveyShown) {
      return SurveyType.FIRST;
    }

    // Wenn die letzte Umfrage weniger als 24 Stunden her ist, zeige keine Umfrage an
    if (this.lastSurveyCompletedTimestamp) {
      const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
      const now = Date.now();
      if (now - this.lastSurveyCompletedTimestamp < twentyFourHoursInMs) {
        return SurveyType.NONE;
      }
    }

    // Ansonsten zeige eine reguläre Umfrage an
    return SurveyType.REGULAR;
  }

  /**
   * Markiert die aktuelle Umfrage als abgeschlossen
   * @param type Typ der abgeschlossenen Umfrage
   */
  public markCurrentSurveyCompleted(type: SurveyType): void {
    if (type === SurveyType.FIRST) {
      this.firstSurveyShown = true;
    }
    
    this.lastSurveyCompletedTimestamp = Date.now();
  }

  /**
   * Setzt den Service zurück (für Tests)
   */
  public reset(): void {
    this.firstSurveyShown = false;
    this.lastSurveyCompletedTimestamp = null;
  }
  
  /**
   * Überprüft, ob die erste Umfrage bereits abgeschlossen wurde.
   */
  public async isFirstSurveyCompleted(): Promise<boolean> {
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
   * Markiert die erste Umfrage als abgeschlossen.
   * Setzt auch das Slot-System zurück, um den regulären Zeitplan zu starten.
   */
  public async markFirstSurveyAsCompleted(): Promise<void> {
    try {
      log.info("Marking first survey as completed");
      
      if (!FIRST_SURVEY_CHECKED_KEY) {
        log.error("FIRST_SURVEY_CHECKED_KEY is not defined");
        throw new Error("FIRST_SURVEY_CHECKED_KEY is not defined");
      }
      
      await AsyncStorage.setItem(FIRST_SURVEY_CHECKED_KEY, 'true');
      
      // Slot-System zurücksetzen, um den regulären Zeitplan zu starten
      // Dies triggert auch die Initialisierung nach der ersten Umfrage
      await slotService.reset();
      
      log.info("First survey marked as completed and slot system initialized");
    } catch (error) {
      log.error("Error marking first survey as completed", error);
      throw error;
    }
  }
  
  /**
   * Verarbeitet den Abschluss einer Umfrage.
   * Prüft, ob es sich um die erste Umfrage handelt und markiert diese entsprechend.
   * 
   * @param answeredQuestions Die beantworteten Fragen (optional)
   */
  public async processSurveyCompletion(answeredQuestions?: any[]): Promise<void> {
    try {
      log.info("Processing survey completion");
      
      // Prüfen, ob es sich um die erste Umfrage handelt
      const isFirstCompleted = await this.isFirstSurveyCompleted();
      
      if (!isFirstCompleted) {
        log.info("First survey completed - initializing slot system");
        // Markiere die erste Umfrage als abgeschlossen und initialisiere das Slot-System
        await this.markFirstSurveyAsCompleted();
      } else {
        log.info("Regular survey completed");
        // Bei regulären Umfragen markieren wir den aktuellen Slot als abgeschlossen
        await slotService.markCurrentSlotCompleted();
      }
    } catch (error) {
      log.error("Error processing survey completion", error);
      throw error;
    }
  }
  
  /**
   * Behandelt den Ablauf einer Umfrage ohne Abschluss.
   */
  public async handleSurveyExpired(): Promise<void> {
    try {
      log.info("Handling survey expiration");
      
      // Prüfen, ob es sich um die erste Umfrage handelt
      const isFirstCompleted = await this.isFirstSurveyCompleted();
      
      if (!isFirstCompleted) {
        // Bei der ersten Umfrage tun wir nichts
        log.info("First survey expired - no action needed");
      } else {
        // Bei regulären Umfragen markieren wir den aktuellen Slot als abgeschlossen
        log.info("Regular survey expired - marking slot as completed");
        await slotService.markCurrentSlotCompleted();
      }
    } catch (error) {
      log.error("Error handling survey expiration", error);
      throw error;
    }
  }
}

/**
 * Singleton-Instanz für die OOP-Nutzung
 */
export const lifecycleService = new SurveyLifecycleService(); 