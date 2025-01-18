import React from 'react';
import { Keyboard, TextInput, TouchableWithoutFeedback, View } from 'react-native';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { TextArea } from '~/src/components/ui/textarea';
import type { QuestionComponent, QuestionComponentProps } from './QuestionComponent';

// Separate Komponente für das Rendering
const TextQuestionContent = React.memo(({ question, value = '', onChange }: QuestionComponentProps) => {
    const inputRef = React.useRef<TextInput>(null);

    const handleDone = () => {
        inputRef.current?.blur();
        Keyboard.dismiss();
    };

    const currentValue = value || '';  // Stelle sicher, dass value nie undefined ist

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="space-y-4 flex-1">
                <TextArea
                    ref={inputRef}
                    value={currentValue}
                    onChangeText={onChange}
                    placeholder="Tippe hier, um deine Antwort einzugeben..."
                    className="min-h-[120px] text-base"
                    multiline
                    blurOnSubmit={true}
                    returnKeyType="done"
                    onSubmitEditing={handleDone}
                />
                {currentValue.length > 0 && (
                    <Button
                        variant="default"
                        className="bg-accent mt-4"
                        onPress={handleDone}
                    >
                        <Text className="text-primary">Fertig</Text>
                    </Button>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
});

// QuestionComponent Definition
export const TextQuestion: QuestionComponent = {
    render: (props: QuestionComponentProps) => <TextQuestionContent {...props} />,
    validate: (value: string) => typeof value === 'string' && value.trim().length > 0,
    getInitialValue: () => ''
}; 