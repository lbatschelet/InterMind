/**
 * Text Question Component
 * ---------------------
 * Implements a text question type where users can enter
 * free-form text as their answer.
 * 
 * Features:
 * - Free text input
 * - Pattern validation
 * - Auto-advance support
 * - Accessible input field
 * 
 * @module Components/Questions
 */

import React from 'react';
import { Keyboard } from 'react-native';
import { Input } from '~/src/components/ui/input';
import type { TextQuestion as TextQuestionType } from '~/src/types/questions';
import type { QuestionComponent, QuestionComponentProps } from './QuestionComponent';

type TextValue = string | null;

interface TextQuestionProps extends Omit<QuestionComponentProps<TextQuestionType, TextValue>, 'question' | 'value' | 'onChange'> {
    question: TextQuestionType;
    value: TextValue;
    onChange: (value: TextValue) => void;
}

/**
 * Component for rendering text questions.
 * 
 * @component
 */
const TextQuestionContent = React.memo(({ 
    question, 
    value, 
    onChange,
    onAutoAdvance 
}: TextQuestionProps) => {
    const handleTextChange = (text: string) => {
        onChange(text || null);
        
        if (question.autoAdvance && onAutoAdvance && question.validation?.pattern) {
            const regex = new RegExp(question.validation.pattern);
            if (regex.test(text)) {
                onAutoAdvance();
                Keyboard.dismiss();
            }
        }
    };

    return (
        <Input
            value={value || ''}
            onChangeText={handleTextChange}
            placeholder="Your answer..."
            multiline={false}
            returnKeyType="done"
            blurOnSubmit={true}
            onSubmitEditing={() => Keyboard.dismiss()}
            className="p-2 bg-background h-12"
            style={{
                textAlign: 'left',
                textAlignVertical: 'center'
            }}
        />
    );
});

TextQuestionContent.displayName = 'TextQuestionContent';

/**
 * Text question component.
 * 
 * Implements {@link QuestionComponent}
 * 
 * @remarks
 * Renders a text input field for free-form answers.
 * Handles pattern validation if specified.
 */
export const TextQuestion: QuestionComponent<TextQuestionType, TextValue> = {
    /**
     * Renders the text question component
     * @param {QuestionComponentProps<TextQuestionType, TextValue>} props - Component properties
     * @returns {JSX.Element} Rendered question component
     */
    render: (props: QuestionComponentProps<TextQuestionType, TextValue>) => {
        if (props.question.type !== 'text') {
            throw new Error('TextQuestion can only render text questions');
        }
        return <TextQuestionContent {...props} />;
    },

    /**
     * Validates the text input
     * @param {TextValue} value - The text input value
     * @param {TextQuestionType} question - The question being validated
     * @returns {boolean} True if text matches pattern or no pattern specified
     */
    validate: (value: TextValue, question?: TextQuestionType): boolean => {
        if (value === null) return false;
        if (typeof value !== 'string') return false;
        
        // Prüfe Pattern-Validierung falls vorhanden
        if (question?.validation?.pattern) {
            const regex = new RegExp(question.validation.pattern);
            return regex.test(value);
        }
        
        // Wenn kein Pattern definiert ist, muss der Text nur nicht leer sein
        return value.trim().length > 0;
    },

    /**
     * Provides the initial value
     * @returns {TextValue} null as initial value
     */
    getInitialValue: () => null
}; 