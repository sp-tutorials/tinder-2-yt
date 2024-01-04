import React from 'react';
import {View, Text, Button} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import useAuth from "../hooks/useAuth";

const HomeScreen = () => {
    const navigation = useNavigation();
    const { logout } = useAuth();

    return (
        <View>
            <Text>I am the HomeScreen</Text>
            <Button title="Go to Chat Screen" onPress={() => navigation.navigate('Chat')}></Button>

            <Button title="Logout" onPress={logout}/>
        </View>
    );
}

export default HomeScreen