import { Question } from '~/src/types/question';

export const mockQuestions: Question[] = [
    {
        id: '1',
        question: 'Wie geht es dir?',
        type: 'single_choice',
        category: 'mood',
        created_at: new Date().toISOString(),
        options: [
            { value: '1', label: 'Sehr gut' },
            { value: '2', label: 'Gut' },
            { value: '3', label: 'Geht so' },
            { value: '4', label: 'Schlecht' }
        ]
    },
    {
        id: '2',
        question: 'Was machst du gerne?',
        type: 'multiple_choice',
        category: 'activities',
        created_at: new Date().toISOString(),
        options: [
            { value: '1', label: 'Sport' },
            { value: '2', label: 'Lesen' },
            { value: '3', label: 'Musik hören' },
            { value: '4', label: 'Kochen' }
        ]
    },
    {
        id: '3',
        question: 'Wie gestresst bist du?',
        type: 'slider',
        category: 'stress',
        created_at: new Date().toISOString(),
        options: {
            min: 0,
            max: 10,
            step: 1,
            labels: {
                min: 'Gar nicht',
                max: 'Sehr'
            }
        }
    },
    {
        id: '4',
        question: 'Was möchtest du uns mitteilen?',
        type: 'text',
        category: 'feedback',
        created_at: new Date().toISOString(),
        options: []
    }
]; 