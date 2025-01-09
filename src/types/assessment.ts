export interface Question {
    id: string;
    questionText: string;
    imageUrl?: string;
    options: Array<{
        value: string;
        label: string;
    }>;
}

// Beispiel für eine Frage (später aus DB)
export const MOCK_QUESTION: Question = {
    id: '1',
    questionText: 'Wie fühlst du dich heute?',
    imageUrl: 'our-neighborhood',  // oder kompletter Pfad
    options: [
        { value: 'very_good', label: 'Sehr gut' },
        { value: 'good', label: 'Gut' },
        { value: 'neutral', label: 'Neutral' },
        { value: 'bad', label: 'Schlecht' },
        { value: 'unknown', label: 'Weiß nicht' }
    ]
}; 