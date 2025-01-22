import { ReactNode } from 'react';
import { PressableStateCallbackType } from 'react-native';

/**
 * Common props for UI components that can have children.
 */
export interface UIComponentProps {
    children?: ReactNode | ((state: PressableStateCallbackType) => ReactNode);
}

/**
 * Common props for UI components that can have children and className.
 */
export interface UIComponentWithClassNameProps extends UIComponentProps {
    className?: string;
} 