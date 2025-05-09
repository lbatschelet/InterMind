/**
 * Interface für den Datenbank-Client
 * 
 * Dieses Interface abstrahiert den Zugriff auf die Datenbank,
 * um die Abhängigkeit zu einer spezifischen Datenbanktechnologie zu reduzieren
 */
export interface IDatabaseClient {
  /**
   * Führt eine Abfrage auf einer Tabelle aus
   * @param table Name der Tabelle
   * @returns Query-Builder
   */
  from(table: string): IDatabaseQuery | Promise<IDatabaseQuery>;
}

/**
 * Interface für Datenbank-Abfragen
 */
export interface IDatabaseQuery {
  /**
   * Wählt Spalten aus
   * @param columns Auszuwählende Spalten oder SQL-Ausdruck
   * @param options Zusätzliche Optionen
   */
  select(columns: string, options?: any): IDatabaseQuery;
  
  /**
   * Fügt Daten in die Tabelle ein
   * @param data Einzufügende Daten
   */
  insert(data: any[]): IDatabaseQuery;
  
  /**
   * Aktualisiert Daten
   * @param data Zu aktualisierende Daten
   */
  update(data: any): IDatabaseQuery;
  
  /**
   * Löscht Daten
   */
  delete(): IDatabaseQuery;
  
  /**
   * Filtert nach Gleichheit
   * @param column Spaltenname
   * @param value Vergleichswert
   */
  eq(column: string, value: any): IDatabaseQuery;
  
  /**
   * Führt die Abfrage durch und gibt das Ergebnis zurück
   */
  then(onfulfilled?: (value: { data: any; error: any }) => any): Promise<{ data: any; error: any }>;
  
  /**
   * Wählt einen einzelnen Datensatz aus
   */
  single(): IDatabaseQuery;
} 