import { useEffect, useState } from 'react';

/**
 * Custom hook for debouncing value updates
 * -----------------------------------------
 * Delays the update of a value by a specified time period.
 * Useful for optimizing performance with text inputs or sliders
 * where immediate updates are not necessary.
 * 
 * Features:
 * - Type-safe implementation
 * - Configurable delay
 * - Automatic cleanup on unmount
 * - Memory efficient
 * 
 * @module Hooks
 * 
 * @example
 * ```tsx
 * const [text, setText] = useState('');
 * const debouncedText = useDebounce(text, 500);
 * ```
 * 
 * @template T The type of the value to debounce
 * @param {T} value The value to debounce
 * @param {number} delay The delay in milliseconds
 * @returns {T} The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
} 