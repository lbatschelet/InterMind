import type { QuestionType } from '~/src/services/supabase';
import { MultipleChoiceQuestion } from './MultipleChoiceQuestion';
import type { QuestionComponent } from './QuestionComponent';
import { SingleChoiceQuestion } from './SingleChoiceQuestion';
import { SliderQuestion } from './SliderQuestion';
import { TextQuestion } from './TextQuestion';

export const QuestionFactory = {
    getComponent: (type: QuestionType): QuestionComponent => {
        switch (type) {
            case 'single_choice':
                return SingleChoiceQuestion;
            case 'multiple_choice':
                return MultipleChoiceQuestion;
            case 'slider':
                return SliderQuestion;
            case 'text':
                return TextQuestion;
            default:
                throw new Error(`Unknown question type: ${type}`);
        }
    }
}; 