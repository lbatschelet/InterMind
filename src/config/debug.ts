/**
 * Global Debug Configuration
 * ------------------------
 * Provides a centralized system for managing debug logging across the application.
 * Allows selective enabling of different debug categories for targeted debugging.
 * 
 * Features:
 * - Granular control over debug categories
 * - Type-safe configuration
 * - Runtime configuration updates
 * - Conditional logging
 * 
 * @module Config
 */

/**
 * Debug configuration interface defining available debug categories
 * @interface
 */
export interface DebugConfig {
    /** Enables session and Row Level Security (RLS) debug logs */
    session?: boolean;
    /** Enables database operation logs (queries, mutations, etc.) */
    database?: boolean;
    /** Enables service operation logs (API calls, business logic) */
    services?: boolean;
    /** Enables UI and state management debug logs */
    ui?: boolean;
}

let debugConfig: DebugConfig = {
    session: false,
    database: false,
    services: false,
    ui: false
};

/**
 * Updates the global debug configuration
 * @param {Partial<DebugConfig>} config - Partial configuration to merge with existing settings
 * 
 * @example
 * ```ts
 * setDebugMode({ database: true, services: true });
 * ```
 */
export const setDebugMode = (config: Partial<DebugConfig>) => {
    debugConfig = { ...debugConfig, ...config };
};

/**
 * Checks if a specific debug mode is active
 * @param {keyof DebugConfig} mode - The debug mode to check
 * @returns {boolean} True if the specified mode is enabled
 */
export const isDebugEnabled = (mode: keyof DebugConfig): boolean => {
    return !!debugConfig[mode];
};

/**
 * Conditionally logs debug information if the specified mode is active
 * Prefixes each log with the mode name for easy filtering
 * 
 * @param {keyof DebugConfig} mode - The debug mode to check
 * @param {...any[]} args - Arguments to log
 * 
 * @example
 * ```ts
 * debugLog('database', 'Query executed:', query);
 * ```
 */
export const debugLog = (mode: keyof DebugConfig, ...args: any[]) => {
    if (isDebugEnabled(mode)) {
        console.log(`[${mode.toUpperCase()}]`, ...args);
    }
}; 