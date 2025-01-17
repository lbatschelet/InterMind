import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = 'user_id';

/**
 * Generiert eine 12-stellige alphanumerische ID im Format "XXXX-XXXX-XXXX"
 * Beispiel: "ABC1-2DEF-3GHI"
 */
const generateReadableId = (): string => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    
    // Generiere 3 Blöcke von je 4 Zeichen
    for (let block = 0; block < 3; block++) {
        for (let i = 0; i < 4; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        if (block < 2) result += '-'; // Füge Bindestrich zwischen den Blöcken hinzu
    }
    
    return result;
};

/**
 * Prüft, ob eine ID dem korrekten Format entspricht
 */
const isValidFormat = (id: string): boolean => {
    return /^[0-9A-Z]{4}-[0-9A-Z]{4}-[0-9A-Z]{4}$/.test(id);
};

export const UserService = {
    /**
     * Holt die User-ID aus dem AsyncStorage oder erstellt eine neue
     */
    getUserId: async (): Promise<string> => {
        console.log('Hole User-ID...');
        try {
            let userId = await AsyncStorage.getItem(USER_ID_KEY);
            
            // Prüfe ob die ID existiert und dem korrekten Format entspricht
            if (!userId || !isValidFormat(userId)) {
                if (userId) {
                    console.log('Gefundene ID hat falsches Format:', userId);
                }
                userId = generateReadableId();
                await AsyncStorage.setItem(USER_ID_KEY, userId);
                console.log('Neue User-ID erstellt:', userId);
            } else {
                console.log('Existierende User-ID gefunden:', userId);
            }
            
            return userId;
        } catch (error) {
            console.error('Fehler beim Holen der User-ID:', error);
            const fallbackId = generateReadableId();
            console.log('Fallback User-ID erstellt:', fallbackId);
            return fallbackId;
        }
    },

    /**
     * Zeigt die aktuelle User-ID an
     */
    getCurrentUserId: async (): Promise<string | null> => {
        try {
            const userId = await AsyncStorage.getItem(USER_ID_KEY);
            console.log('Aktuelle User-ID:', userId);
            return userId;
        } catch (error) {
            console.error('Fehler beim Lesen der User-ID:', error);
            return null;
        }
    },

    /**
     * Setzt die User-ID zurück und generiert eine neue
     */
    resetUserId: async (): Promise<string> => {
        console.log('Setze User-ID zurück...');
        const newId = generateReadableId();
        await AsyncStorage.setItem(USER_ID_KEY, newId);
        console.log('Neue User-ID generiert:', newId);
        return newId;
    }
}; 