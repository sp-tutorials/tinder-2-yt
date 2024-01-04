import React from 'react';
import {View, Text, Button} from 'react-native';
import useAuth from "../hooks/useAuth";
import useFakeLogin from "../hooks/useFakeLogin";

const LoginScreen = () => {
    const {signInWithGoogle} = useAuth();
    const {fakeLoginSuccess, setFakeLoginSuccess} = useFakeLogin();

    return (
        <View>
            <View>
                <Text>Login to the app</Text>
                <Button title='login' onPress={signInWithGoogle}/>
            </View>
            <View>
                <Text>Fake login success</Text>
                <Button title={fakeLoginSuccess ? 'Enabled' : 'Disabled'}
                        onPress={() => setFakeLoginSuccess(!fakeLoginSuccess)}></Button>
            </View>
        </View>
    );
}

export default LoginScreen