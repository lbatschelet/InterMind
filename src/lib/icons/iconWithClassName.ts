import { cssInterop } from 'nativewind';
import { ComponentType } from 'react';
import { SvgProps } from 'react-native-svg';

/**
 * Wraps an SVG icon component with className support.
 * 
 * @param Icon - The SVG icon component to wrap
 * @returns A new component that accepts className prop
 */
export function iconWithClassName(Icon: ComponentType<SvgProps>) {
    cssInterop(Icon, {
        className: {
            target: 'style',
            nativeStyleToProp: {
                color: true,
                opacity: true,
            },
        },
    });
} 