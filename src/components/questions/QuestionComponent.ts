import type { Question } from '~/src/types/Question';

export interface QuestionComponentProps {
    question: Question;
    value: any;
    onChange: (value: any) => void;
    isValid?: boolean;
    onAutoAdvance?: () => void;
}

export interface QuestionComponent {
    render: (props: QuestionComponentProps) => JSX.Element;
    validate: (value: any) => boolean;
    getInitialValue: () => any;
} 