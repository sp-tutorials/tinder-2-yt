import React from 'react';
import {createNativeStackNavigator} from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name='Home' component={HomeScreen}></Stack.Screen>
        </Stack.Navigator>
    );
}

export default StackNavigator