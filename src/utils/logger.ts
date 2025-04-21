/**
 * Structured and configurable logging utility.
 * - Supports `debug`, `info`, `warn`, and `error` levels.
 * - Each file/module gets its own logger instance.
 * - No manual filename passing.
 */

// Define __DEV__ variable - typically this would be injected by the build system
// In React Native, this is a global variable
declare const __DEV__: boolean;

// Ensure __DEV__ is available in all environments
const IS_DEV = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Configuration object to control which log levels are enabled.
 */
const ENABLED_LEVELS: Record<LogLevel, boolean> = {
  debug: true, // Debug logs are disabled by default
  info: true,
  warn: true,
  error: true,
};

/**
 * Logs messages based on the specified log level.
 * @param level - The severity level of the log message.
 * @param caller - The filename/module name.
 * @param message - The log message.
 * @param data - Optional additional data for debugging.
 */
const logMessage = (level: LogLevel, caller: string, message: string, data?: any) => {
  if (!ENABLED_LEVELS[level]) return; // Skip logging if level is disabled
  if (!IS_DEV) return; // Prevent logs in production builds

  const formattedMessage = `[${level.toUpperCase()}] [${caller}] → ${message}`;

  switch (level) {
    case "debug":
      console.debug(`🐞 ${formattedMessage}`, data ?? "");
      break;
    case "info":
      console.log(`ℹ️ ${formattedMessage}`, data ?? "");
      break;
    case "warn":
      console.warn(`⚠️ ${formattedMessage}`, data ?? "");
      break;
    case "error":
      console.error(`❌ ${formattedMessage}`, data ?? "");
      break;
  }
};

/**
 * Factory function to create a logger for a specific module/file.
 * @param moduleName - The name of the file/module
 * @returns Logger instance with predefined context.
 */
export const createLogger = (moduleName: string) => ({
  debug: (message: string, data?: any) => logMessage("debug", moduleName, message, data),
  info: (message: string, data?: any) => logMessage("info", moduleName, message, data),
  warn: (message: string, data?: any) => logMessage("warn", moduleName, message, data),
  error: (message: string, data?: any) => logMessage("error", moduleName, message, data),
});

/**
 * Updates the logging configuration to enable or disable specific log levels.
 * @param levels - Object defining enabled or disabled log levels.
 * @example
 * ```ts
 * setLogLevels({ debug: true, warn: false });
 * ```
 */
export const setLogLevels = (levels: Partial<Record<LogLevel, boolean>>) => {
  Object.assign(ENABLED_LEVELS, levels);
};
