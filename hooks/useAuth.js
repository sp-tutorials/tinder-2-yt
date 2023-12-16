import React from 'react';
import {View} from 'react-native';

export const AuthProvider = ({ children }) => {
    return (
        <View>
            {children}
        </View>
    );
}
