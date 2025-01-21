/**
 * Globale Debug-Konfiguration
 * Steuert welche Debug-Informationen in der App geloggt werden
 */
export interface DebugConfig {
    /** Aktiviert Session/RLS Debug-Logs */
    session?: boolean;
    /** Aktiviert Datenbank-Operation Logs */
    database?: boolean;
    /** Aktiviert Service-Operation Logs */
    services?: boolean;
    /** Aktiviert UI/State Debug-Logs */
    ui?: boolean;
}

let debugConfig: DebugConfig = {
    session: false,
    database: false,
    services: false,
    ui: false
};

/**
 * Setzt die globale Debug-Konfiguration
 */
export const setDebugMode = (config: Partial<DebugConfig>) => {
    debugConfig = { ...debugConfig, ...config };
};

/**
 * Prüft ob ein bestimmter Debug-Mode aktiv ist
 */
export const isDebugEnabled = (mode: keyof DebugConfig): boolean => {
    return !!debugConfig[mode];
};

/**
 * Debug-Log Funktion die nur loggt wenn der entsprechende Mode aktiv ist
 */
export const debugLog = (mode: keyof DebugConfig, ...args: any[]) => {
    if (isDebugEnabled(mode)) {
        console.log(`[${mode.toUpperCase()}]`, ...args);
    }
}; 