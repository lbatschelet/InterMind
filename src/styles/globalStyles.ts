// src/styles/globalStyles.ts
import { StyleSheet } from 'react-native';


export const colors = {
    background: "#FFFFFF",
    foreground: "#08090B",
    card: "#FFFFFF",
    cardForeground: "#08090B",
    popover: "#FFFFFF",
    popoverForeground: "#08090B",
    primary: "#2B2E46",
    primaryForeground: "#FAFAFA",
    secondary: "#F1F2F5",
    secondaryForeground: "#191A1D",
    muted: "#F1F2F5",
    mutedForeground: "#6E7076",
    accent: "#F9A602",
    accentForeground: "#191A1D",
    destructive: "#F25555",
    destructiveForeground: "#FAFAFA",
    border: "#E4E6EB",
    input: "#E4E6EB",
    ring: "#191A1D",
  };

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: colors.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingIndicator: {
        color: colors.accent,
    }
});