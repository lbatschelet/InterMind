import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Dimensions, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ADayAtThePark from '~/assets/a-day-at-the-park.svg';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { RootStackParamList } from '~/src/navigation/AppNavigator';

const { width, height } = Dimensions.get('window');

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }} className="bg-background">
            <SafeAreaView edges={['top']} className="flex-1">
                <StatusBar 
                    barStyle="dark-content" 
                    backgroundColor="transparent"
                    translucent={true}
                />

                {/* Center SVG */}
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ADayAtThePark 
                        width={width * 0.8}
                        height={width * 0.8}
                    />
                </View>

                {/* Bottom Button */}
                <View className="w-full px-4 mb-20 items-center">
                    <Button
                        variant="default"
                        className="bg-accent"
                        onPress={() => navigation.navigate('Assessment')}
                    >
                        <Text className="text-primary text-lg font-bold">
                            Start Assessment
                        </Text>
                    </Button>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default HomeScreen;
