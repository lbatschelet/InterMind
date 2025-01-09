import { Assessment, Question, QuestionType } from '~/src/types/assessment';

/**
 * Interface for creating mock questions with required fields
 */
export interface MockQuestionBuilder {
    type: QuestionType;
    options: Array<{
        value: string;
        label: string;
    }>;
}

/**
 * Creates a mock question with default values and optional overrides
 * 
 * @param overrides - Optional values to override defaults
 * @returns A complete Question object for testing
 */
export const createMockQuestion = (overrides?: Partial<Question>): Question => ({
    id: 'test-id',
    questionText: 'Test Question',
    type: 'single_choice',
    requiresConfirmation: false,
    options: [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' }
    ],
    ...overrides
});

/**
 * Pre-defined mock questions for common test scenarios
 */
export const mockQuestions = {
    singleChoice: createMockQuestion({
        id: 'single-1',
        type: 'single_choice',
        questionText: 'Single Choice Test Question',
        options: [
            { value: 'a', label: 'Option A' },
            { value: 'b', label: 'Option B' },
            { value: 'c', label: 'Option C' }
        ]
    }),
    
    multipleChoice: createMockQuestion({
        id: 'multiple-1',
        type: 'multiple_choice',
        questionText: 'Multiple Choice Test Question',
        options: [
            { value: 'x', label: 'Option X' },
            { value: 'y', label: 'Option Y' },
            { value: 'z', label: 'Option Z' }
        ]
    })
}; 

/**
 * Mock assessment with a sequence of questions
 */
export const mockAssessment: Assessment = {
    id: 'daily-assessment',
    title: 'Daily Well-being Check',
    questions: [
        createMockQuestion({
            id: 'sleep',
            type: 'single_choice',
            requiresConfirmation: false,
            questionText: 'How did you sleep last night?',
            options: [
                { value: 'very_poor', label: 'Very poor' },
                { value: 'poor', label: 'Poor' },
                { value: 'okay', label: 'Okay' },
                { value: 'good', label: 'Good' },
                { value: 'very_good', label: 'Very good' }
            ]
        }),
        createMockQuestion({
            id: 'symptoms',
            type: 'multiple_choice',
            requiresConfirmation: true,
            questionText: 'Which symptoms are you experiencing today?',
            options: [
                { value: 'headache', label: 'Headache' },
                { value: 'fatigue', label: 'Fatigue' },
                { value: 'nausea', label: 'Nausea' },
                { value: 'none', label: 'None of the above' }
            ]
        })
    ]
}; 