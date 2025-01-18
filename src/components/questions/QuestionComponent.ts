import type { Question } from '~/src/services/supabase';

export interface QuestionComponentProps {
    question: Question;
    value: any;
    onChange: (value: any) => void;
    isValid?: boolean;
}

export interface QuestionComponent {
    render: (props: QuestionComponentProps) => JSX.Element;
    validate: (value: any) => boolean;
    getInitialValue: () => any;
} 