export type QuestionType = 'single_choice' | 'multiple_choice';

export interface Question {
    id: string;
    questionText: string;
    imageUrl?: string;
    type: QuestionType;
    options: Array<{
        value: string;
        label: string;
    }>;
}

// Beispiel für eine Single-Choice Frage
export const MOCK_SLEEP_QUESTION: Question = {
    id: '1',
    type: 'single_choice',
    questionText: 'How would you rate the quality of your sleep last night?',
    imageUrl: 'our-neighborhood',
    options: [
        { value: 'very_poor', label: 'Very poor' },
        { value: 'poor', label: 'Poor' },
        { value: 'average', label: 'Average' },
        { value: 'good', label: 'Good' },
        { value: 'very_good', label: 'Very good' }
    ]
};

// Beispiel für eine Multiple-Choice Frage
export const MOCK_SYMPTOMS_QUESTION: Question = {
    id: '2',
    type: 'multiple_choice',
    questionText: 'Which symptoms did you experience today?',
    imageUrl: 'our-neighborhood',
    options: [
        { value: 'headache', label: 'Headache' },
        { value: 'fatigue', label: 'Fatigue' },
        { value: 'nausea', label: 'Nausea' },
        { value: 'dizziness', label: 'Dizziness' },
        { value: 'none', label: 'None of the above' }
    ]
}; 