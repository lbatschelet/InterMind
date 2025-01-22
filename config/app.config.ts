import * as dotenv from 'dotenv';
import { ConfigContext, ExpoConfig } from 'expo/config';
import path from 'path';

// Lade Umgebungsvariablen aus der .env-Datei im Root-Verzeichnis
dotenv.config({ path: path.resolve(__dirname, '../.env') });

export default ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: 'SerenCity',
    slug: 'serencity',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
        '**/*'
    ],
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.serencity.app'
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#ffffff'
        },
        package: 'com.serencity.app'
    },
    web: {
        favicon: './assets/favicon.png'
    },
    extra: {
        supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
        supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
    },
    plugins: [
        'expo-router'
    ]
}); 