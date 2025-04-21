/**
 * Formats a survey time in a user-friendly way.
 * 
 * This function formats survey times with appropriate labels:
 * - Current date: "Next survey at HH:MM"
 * - Tomorrow: "Next survey tomorrow at HH:MM"
 * - Other dates: "Next survey at DD.MM. HH:MM"
 * - No date: "No upcoming survey"
 * 
 * @param date The date to format, or null if no survey is scheduled
 * @param t The translation function from the i18n context
 * @returns Formatted string representing the next survey time
 */
export const formatSurveyTime = (date: Date | null, t: (key: string) => string): string => {
  // Handle null date case
  if (!date) return t('home.noUpcomingSurvey');
  
  // Extract time part (we always need this)
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;
  
  // Get current date for comparison
  const now = new Date();
  
  // Check if it's the same calendar day (ignore year)
  const isSameDay = 
    date.getDate() === now.getDate() && 
    date.getMonth() === now.getMonth();
    
  if (isSameDay) {
    // If it's the same calendar day, just show the time
    return `${t('home.nextSurveyAt')} ${timeStr}`;
  }
  
  // Check if it's the next calendar day (ignore year)
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  
  const isTomorrow = 
    date.getDate() === tomorrow.getDate() && 
    date.getMonth() === tomorrow.getMonth();
    
  if (isTomorrow) {
    // If it's tomorrow, show the "tomorrow at" text
    return `${t('home.tomorrow')} ${timeStr}`;
  }
  
  // For any other date, include the calendar date (day/month)
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  
  return `${t('home.nextSurveyAt')} ${day}.${month}. ${timeStr}`;
}; 