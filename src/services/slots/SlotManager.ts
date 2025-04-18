import { createLogger } from "~/src/utils/logger";
import { 
  DaySegment, 
  Slot, 
  SlotManagerConfig, 
  SlotStatus,
  TimeRange 
} from "./types";

const log = createLogger("SlotManager");

/**
 * Standardkonfiguration für den SlotManager
 */
export const DEFAULT_CONFIG: SlotManagerConfig = {
  MORNING_RANGE: {
    name: 'morning',
    startHour: 6,
    startMinute: 0,
    endHour: 11,
    endMinute: 0
  },
  NOON_RANGE: {
    name: 'noon',
    startHour: 11,
    startMinute: 0,
    endHour: 17,
    endMinute: 0
  },
  EVENING_RANGE: {
    name: 'evening',
    startHour: 17, 
    startMinute: 0,
    endHour: 22,
    endMinute: 0
  },
  SLOT_LENGTH_MINUTES: 60,
  TIME_GRANULARITY_MINUTES: 5,
  MIN_GAP_COMPLETED_MINUTES: 120,
  MIN_GAP_EXPIRED_MINUTES: 60
};

/**
 * SlotManager
 * -----------
 * 
 * Zuständig für die Berechnung des nächsten Umfrage-Slots.
 * 
 * Diese Klasse ist zustandslos und berechnet slot-Zeiten
 * basierend auf der Konfiguration und den übergebenen Parametern.
 */
export class SlotManager {
  private config: SlotManagerConfig;

  constructor(config: SlotManagerConfig = DEFAULT_CONFIG) {
    this.config = config;
  }

  /**
   * Berechnet den nächsten Slot für eine Umfrage.
   * 
   * @param now Aktuelle Zeit
   * @param lastEnd Ende des letzten Slots oder null, wenn es noch keinen gab
   * @param lastStatus Status des letzten Slots oder null, wenn es noch keinen gab
   * @returns Ein neuer Slot (start, end)
   */
  nextSlot(now: Date, lastEnd: Date | null, lastStatus: SlotStatus | null): Slot {
    // Logge wesentliche Informationen kompakter
    log.info("Calculating next slot", { 
      now: now.toLocaleTimeString(),
      lastEnd: lastEnd?.toLocaleTimeString(),
      lastStatus,
      currentSegment: this.getSegmentForTime(now)
    });

    // 0. Bestimme das Segment des vorherigen Slots
    let prevSegment: DaySegment;
    let prevDate: Date;

    if (lastEnd === null || lastStatus === null) {
      // Erster Aufruf überhaupt
      prevSegment = DaySegment.EVENING; // damit nextSegment zu MORNING wird
      prevDate = new Date(now);
      prevDate.setDate(prevDate.getDate() - 1);
    } else {
      prevSegment = this.getSegmentForTime(lastEnd);
      prevDate = new Date(lastEnd);
    }
    
    // Nur wesentliche Daten loggen
    log.debug(`Previous: ${prevSegment} at ${prevDate.toLocaleTimeString()}`);

    // 1. Berechne das nächste Segment (zyklische Reihenfolge)
    let nextSegment = this.getNextSegment(prevSegment);
    
    // Zieldatum - bei Abend -> Morgen geht es auf den nächsten Tag
    let targetDate = new Date(prevDate);
    if (prevSegment === DaySegment.EVENING) {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    
    // WICHTIG: Überprüfe, ob das aktuelle Segment bereits das berechnete 'nextSegment' ist oder sogar darüber hinaus
    // Wenn ja, müssen wir ein oder zwei Segmente weiter gehen
    const currentSegment = this.getSegmentForTime(now);
    
    // Segmentanpassung bei Überlappungen
    let segmentChanged = false;
    
    if (currentSegment === nextSegment) {
      // Wir sind bereits im nächsten Segment. Gehe ein Segment weiter.
      const oldSegment = nextSegment;
      nextSegment = this.getNextSegment(nextSegment);
      segmentChanged = true;
      
      // Anpassung des Datums, wenn wir von Abend zu Morgen wechseln
      if (currentSegment === DaySegment.EVENING) {
        targetDate = new Date(now);
        targetDate.setDate(targetDate.getDate() + 1);
      }
      
      log.info(`Time already in next segment (${oldSegment}), advancing to ${nextSegment}`);
    } else if (
      (prevSegment === DaySegment.MORNING && currentSegment === DaySegment.EVENING) ||
      (prevSegment === DaySegment.NOON && currentSegment === DaySegment.MORNING)
    ) {
      // Wir haben das nächste Segment schon überschritten
      const oldSegment = nextSegment;
      nextSegment = currentSegment;
      targetDate = new Date(now);
      segmentChanged = true;
      
      log.info(`Time has passed beyond next segment (${oldSegment}), using current ${nextSegment}`);
    }
    
    // Setze das Datum auf Mitternacht und füge dann die Startzeit hinzu
    targetDate.setHours(0, 0, 0, 0);

    // 2. Respektiere die Mindestabstände
    const gap = lastStatus === SlotStatus.EXPIRED 
      ? this.config.MIN_GAP_EXPIRED_MINUTES 
      : this.config.MIN_GAP_COMPLETED_MINUTES;
    
    // Berechne die früheste mögliche Startzeit
    let earliest = new Date(now);
    
    // WICHTIG: Stellen wir sicher, dass der nächste Slot mindestens 60 Minuten in der Zukunft liegt
    // Dies verhindert sofortige oder zu schnelle Benachrichtigungen
    const MIN_IMMEDIATE_BUFFER_MINUTES = 60;
    earliest.setMinutes(earliest.getMinutes() + MIN_IMMEDIATE_BUFFER_MINUTES);
    
    // Anwendung der Mindestwartezeit
    if (lastEnd) {
      const minWaitEnd = new Date(lastEnd);
      minWaitEnd.setMinutes(minWaitEnd.getMinutes() + gap);
      if (minWaitEnd > earliest) {
        earliest = minWaitEnd;
      }
    }

    // Stelle sicher, dass wir innerhalb des Zielsegments sind
    const segmentStart = this.getSegmentStartTime(nextSegment, targetDate);
    if (segmentStart > earliest) {
      earliest = segmentStart;
    }

    // Runde auf das nächste Granularitätsintervall
    earliest = this.roundUpToGranularity(earliest);

    // Spätester Start ist das Ende des Segments minus Slotlänge
    const segmentEnd = this.getSegmentEndTime(nextSegment, targetDate);
    const slotLengthMs = this.config.SLOT_LENGTH_MINUTES * 60 * 1000;
    const latest = new Date(segmentEnd.getTime() - slotLengthMs);

    // Wenn das früheste Zeitfenster später als das späteste Zeitfenster ist,
    // bedeutet das, dass wir das aktuelle Segment überspringen müssen
    if (earliest > latest) {
      log.info(`Segment ${nextSegment} can't accommodate next slot (${earliest.toLocaleTimeString()} > ${latest.toLocaleTimeString()})`);
      
      // Rekursiver Aufruf mit der Endzeit des aktuellen Segments als "lastEnd"
      // Dies führt dazu, dass das nächste Segment ausgewählt wird
      return this.nextSlot(now, segmentEnd, lastStatus);
    }

    // 3. Wähle eine reproduzierbare Zufallszeit im Bereich [earliest, latest]
    const start = this.getRandomTimeInRange(earliest, latest, targetDate, nextSegment);
    const end = new Date(start.getTime() + slotLengthMs);

    log.info(`Next slot: ${nextSegment} on ${targetDate.toLocaleDateString()} from ${start.toLocaleTimeString()} to ${end.toLocaleTimeString()}`);

    return { start, end };
  }

  /**
   * Findet das Tagessegment (MORNING, NOON, EVENING) für eine gegebene Zeit
   */
  public getSegmentForTime(time: Date): DaySegment {
    const hour = time.getHours();
    const minute = time.getMinutes();
    
    const inRange = (range: TimeRange): boolean => {
      return (hour > range.startHour || (hour === range.startHour && minute >= range.startMinute)) &&
             (hour < range.endHour || (hour === range.endHour && minute < range.endMinute));
    };

    if (inRange(this.config.MORNING_RANGE)) return DaySegment.MORNING;
    if (inRange(this.config.NOON_RANGE)) return DaySegment.NOON;
    if (inRange(this.config.EVENING_RANGE)) return DaySegment.EVENING;
    
    // Fallback, falls die Zeit in keinem Segment liegt
    const currentHourMinutes = hour * 60 + minute;
    const morningStartMinutes = this.config.MORNING_RANGE.startHour * 60 + this.config.MORNING_RANGE.startMinute;
    
    // Nachts/früh morgens (nach Ende Abend und vor Beginn Morgen)
    // d.h. zwischen 22:00 und 06:00
    if (currentHourMinutes < morningStartMinutes) {
      // Wir sind nach Mitternacht, aber vor dem Start des MORNING Segments
      log.info(`Time ${time.toLocaleTimeString()} is in early morning hours (before ${this.config.MORNING_RANGE.startHour}:${this.config.MORNING_RANGE.startMinute})`);
      return DaySegment.EVENING; // Gilt als später Abend des Vortags für Planungszwecke
    }
    
    // Sollte nie erreicht werden, aber als Fallback
    log.warn(`Time ${time.toLocaleTimeString()} couldn't be matched to any segment, using NOON as fallback`);
    return DaySegment.NOON;
  }

  /**
   * Bestimmt das nächste Segment in der zyklischen Reihenfolge
   */
  private getNextSegment(segment: DaySegment): DaySegment {
    switch (segment) {
      case DaySegment.MORNING: return DaySegment.NOON;
      case DaySegment.NOON: return DaySegment.EVENING;
      case DaySegment.EVENING: return DaySegment.MORNING;
    }
  }

  /**
   * Holt die Startzeit für ein bestimmtes Segment am gegebenen Datum
   */
  private getSegmentStartTime(segment: DaySegment, date: Date): Date {
    const result = new Date(date);
    let range: TimeRange;
    
    switch (segment) {
      case DaySegment.MORNING:
        range = this.config.MORNING_RANGE;
        break;
      case DaySegment.NOON:
        range = this.config.NOON_RANGE;
        break;
      case DaySegment.EVENING:
        range = this.config.EVENING_RANGE;
        break;
    }
    
    result.setHours(range.startHour, range.startMinute, 0, 0);
    return result;
  }

  /**
   * Holt die Endzeit für ein bestimmtes Segment am gegebenen Datum
   */
  private getSegmentEndTime(segment: DaySegment, date: Date): Date {
    const result = new Date(date);
    let range: TimeRange;
    
    switch (segment) {
      case DaySegment.MORNING:
        range = this.config.MORNING_RANGE;
        break;
      case DaySegment.NOON:
        range = this.config.NOON_RANGE;
        break;
      case DaySegment.EVENING:
        range = this.config.EVENING_RANGE;
        break;
    }
    
    result.setHours(range.endHour, range.endMinute, 0, 0);
    return result;
  }

  /**
   * Rundet eine Zeit auf das nächste Granularitätsintervall auf
   */
  private roundUpToGranularity(time: Date): Date {
    const result = new Date(time);
    const granularityMs = this.config.TIME_GRANULARITY_MINUTES * 60 * 1000;
    
    // Runde auf das nächste Granularitätsintervall auf
    const remainder = result.getTime() % granularityMs;
    if (remainder > 0) {
      result.setTime(result.getTime() + (granularityMs - remainder));
    }
    
    return result;
  }

  /**
   * Wählt eine reproduzierbare Zufallszeit im Bereich [earliest, latest]
   */
  private getRandomTimeInRange(earliest: Date, latest: Date, targetDate: Date, segment: DaySegment): Date {
    // Statt eines deterministischen Seeds verwenden wir echte Zufälligkeit
    // Berechne die Anzahl der möglichen Zeitpunkte
    const granularityMs = this.config.TIME_GRANULARITY_MINUTES * 60 * 1000;
    const rangeMs = latest.getTime() - earliest.getTime();
    const numSteps = Math.floor(rangeMs / granularityMs) + 1;
    
    if (numSteps <= 0) {
      log.warn("Invalid time range for random selection, using earliest time", {
        earliest, latest, segment
      });
      return earliest;
    }
    
    // Verwende Math.random() für echte Zufälligkeit anstelle eines festen Seeds
    const stepIndex = Math.floor(Math.random() * numSteps);
    const result = new Date(earliest.getTime() + (stepIndex * granularityMs));
    
    log.debug(`Generated random time: ${result.toLocaleTimeString()} (from ${numSteps} possible time slots)`);
    
    return result;
  }

  /**
   * Erstellt einen einfachen Hash für ein Datum
   */
  private hashDate(date: Date): number {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    return (year * 10000) + (month * 100) + day;
  }

  /**
   * Konvertiert ein Segment in eine Ordinalzahl
   */
  private segmentToOrdinal(segment: DaySegment): number {
    switch (segment) {
      case DaySegment.MORNING: return 0;
      case DaySegment.NOON: return 1;
      case DaySegment.EVENING: return 2;
      default: return 0;
    }
  }
} 