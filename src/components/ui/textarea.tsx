import React from 'react';
import { TextInput, TextInputProps } from 'react-native';
import { cn } from '~/src/lib/utils';

export interface TextAreaProps extends TextInputProps {
    className?: string;
}

export const TextArea = React.forwardRef<TextInput, TextAreaProps>(
    ({ className, ...props }, ref) => {
        return (
            <TextInput
                ref={ref}
                className={cn(
                    "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                multiline
                textAlignVertical="top"
                {...props}
            />
        );
    }
);

TextArea.displayName = "TextArea";
