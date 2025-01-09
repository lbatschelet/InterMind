import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/src/components/ui/button';
import { Text } from '~/src/components/ui/text';
import { ArrowLeft } from '~/src/lib/icons/ArrowLeft';
import type { RootStackParamList } from '../navigation/AppNavigator';

type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
    navigation: SettingsScreenNavigationProp;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
    return (
        <View className="flex-1 bg-background">
            <SafeAreaView edges={['top']} className="flex-1">
                {/* Header */}
                <View className="flex-row items-center px-4 py-2">
                    <Button
                        variant="ghost"
                        className="h-10 w-10 rounded-full"
                        onPress={() => navigation.goBack()}
                    >
                        <ArrowLeft className="text-primary" size={24} />
                    </Button>
                    <Text className="flex-1 text-center text-xl font-bold text-primary mr-10">
                        Einstellungen
                    </Text>
                </View>

                {/* Settings Content */}
                <View className="p-4">
                    <Text className="text-primary text-lg">
                        Einstellungen kommen hier...
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default SettingsScreen; 