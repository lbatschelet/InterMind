// src/screens/AssessmentScreen.tsx
import React from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { globalStyles } from '../styles/globalStyles';

const AssessmentScreen: React.FC = () => {
    return (
        <View style={globalStyles.container}>
            <Text>Assessment Content</Text>
        </View>
    );
};

export default AssessmentScreen;
