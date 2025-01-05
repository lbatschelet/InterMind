import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Dimensions, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Circle, Svg } from 'react-native-svg';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { RootStackParamList } from '../navigation/AppNavigator';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    return (
        <SafeAreaView edges={['top']} style={{ flex: 1 }} className="bg-background">
            <StatusBar barStyle="dark-content" />
            
            {/* Header Container */}
            <View className="w-full flex-row items-center justify-between px-4 py-4">
                <View className="flex-1 items-center">
                    <Text style={{ fontSize: 36, fontWeight: 'bold' }} className="text-foreground">
                        SerenCity
                    </Text>
                </View>
                <Button 
                    variant="ghost" 
                    onPress={() => alert('Settings Open')}
                    className="h-10 w-10 rounded-full"
                >
                    <Text>⚙️</Text>
                </Button>
            </View>

            {/* Center SVG */}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Svg
                    height={width * 0.6}
                    width={width * 0.6}
                    viewBox="0 0 100 100"
                >
                    <Circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        stroke="#000000" 
                        strokeWidth="2.5" 
                        fill="#f1f1f1" 
                    />
                </Svg>
            </View>

            {/* Bottom Button */}
            <View style={{ 
                width: '100%', 
                paddingHorizontal: 16, 
                marginBottom: 32,
                alignItems: 'center'
            }}>
                <Button
                    variant="default"
                    className="w-full bg-primary"
                    onPress={() => navigation.navigate('Assessment')}
                >
                    <Text className="text-primary-foreground text-lg font-medium">
                        Start Assessment
                    </Text>
                </Button>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;
