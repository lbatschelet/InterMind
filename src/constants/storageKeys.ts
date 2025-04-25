/**
 * Global storage keys used by various services
 * 
 * By having these keys in a centralized location,
 * we avoid circular dependencies between services.
 */

/** Key for storing whether the first survey has been completed */
export const FIRST_SURVEY_CHECKED_KEY = "first_survey_completed";

/** Key for storing the device ID */
export const DEVICE_ID_KEY = "device_id"; 