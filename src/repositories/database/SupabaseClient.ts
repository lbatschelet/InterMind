import { supabase } from "../../lib/supabase";
import { IDatabaseClient, IDatabaseQuery } from "../interfaces";
import { AuthService } from "../../services/auth";
import { createLogger } from "~/src/utils/logger";

const log = createLogger("SupabaseClient");

/**
 * Adapter für Supabase als Datenbank-Client
 * 
 * Diese Klasse kapselt den direkten Zugriff auf Supabase und stellt
 * eine einheitliche Schnittstelle für Datenbankoperationen bereit.
 */
export class SupabaseClient implements IDatabaseClient {
  /**
   * Ensures a user is authenticated before DB operations
   * @private
   */
  private async ensureAuthenticated(): Promise<void> {
    const isAuthenticated = await AuthService.isAuthenticated();
    
    if (!isAuthenticated) {
      log.debug("No authenticated session, signing in anonymously");
      await AuthService.signInAnonymously();
    }
  }

  /**
   * Führt eine Abfrage auf einer Tabelle aus
   * @param table Name der Tabelle
   * @returns Query-Builder
   */
  async from(table: string): Promise<IDatabaseQuery> {
    // Ensure we have an authenticated session before DB operations
    await this.ensureAuthenticated();
    
    return new SupabaseQuery(supabase.from(table));
  }
}

/**
 * Wrapper für Supabase-Abfragen, der das IDatabaseQuery Interface implementiert
 */
class SupabaseQuery implements IDatabaseQuery {
  constructor(private query: any) {}

  select(columns: string, options?: any): IDatabaseQuery {
    this.query = this.query.select(columns, options);
    return this;
  }

  insert(data: any[]): IDatabaseQuery {
    this.query = this.query.insert(data);
    return this;
  }

  update(data: any): IDatabaseQuery {
    this.query = this.query.update(data);
    return this;
  }

  delete(): IDatabaseQuery {
    this.query = this.query.delete();
    return this;
  }

  eq(column: string, value: any): IDatabaseQuery {
    this.query = this.query.eq(column, value);
    return this;
  }

  single(): IDatabaseQuery {
    this.query = this.query.single();
    return this;
  }

  then(onfulfilled?: (value: { data: any; error: any }) => any): Promise<{ data: any; error: any }> {
    return this.query.then(onfulfilled);
  }
}

// Singleton-Instanz für die gesamte Anwendung
export const databaseClient = new SupabaseClient(); 