import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Dimensions, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Circle, Svg } from 'react-native-svg';
import { Button } from '~/components/ui/button';
import { Text } from '~/components/ui/text';
import { RootStackParamList } from '~/src/navigation/AppNavigator';

const { width } = Dimensions.get('window');

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
                    <Svg
                        height={width * 0.6}
                        width={width * 0.6}
                        viewBox="0 0 100 100"
                    >
                        <Circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            className="stroke-foreground fill-background"
                            strokeWidth="2.5"
                        />
                    </Svg>
                </View>

                {/* Bottom Button */}
                <View className="w-full px-4 mb-8 items-center">
                    <Button
                        variant="default"
                        className="bg-accent"
                        onPress={() => navigation.navigate('Assessment')}
                    >
                        <Text className="text-primary text-lg font-medium">
                            Start Assessment
                        </Text>
                    </Button>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default HomeScreen;
