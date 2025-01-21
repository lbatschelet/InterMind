import { useEffect, useState } from 'react';

/**
 * Hook für verzögerte Wertaktualisierungen
 * Nützlich für Text-Eingaben oder Slider, wo nicht jede Änderung sofort gespeichert werden soll
 * 
 * @param value Der zu verzögernde Wert
 * @param delay Verzögerung in Millisekunden
 * @returns Der verzögerte Wert
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