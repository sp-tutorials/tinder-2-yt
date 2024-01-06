import React from 'react';
import {Text, Button, TouchableOpacity, View, Image} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import tw from "twrnc";
import {SafeAreaView} from "react-native-safe-area-context";
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();

    return (
        /* the SafeAreaView from react-native is iOS only */
        <SafeAreaView>
            {/* Header */}
                <View style={tw`items-center relative`}>
                    <TouchableOpacity style={tw`absolute left-5 top-3`}>
                        <Image style={tw`h-10 w-10 rounded-full`} source={{ uri: user.photoURL }}/>
                    </TouchableOpacity>

                    <TouchableOpacity>
                        {/* logo from: https://download.logo.wine/logo/Tinder_(app)/Tinder_(app)-Flame-Logo.wine.png */}
                        <Image source={require('../logo.png')} style={tw`w-15 h-15`}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={tw`absolute right-5 top-3`}>
                        <Ionicons name='chatbubbles-sharp' size={30}/>
                    </TouchableOpacity>
                </View>
            {/* End of Header*/}

            {/*<Text>I am the HomeScreen</Text>*/}
            {/*<Button title="Go to Chat Screen" onPress={() => navigation.navigate('Chat')}></Button>*/}

            {/*<Button title="Logout" onPress={logout}/>*/}
        </SafeAreaView>
    );
}

export default HomeScreen