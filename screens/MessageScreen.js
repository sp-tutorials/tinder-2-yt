import React from 'react';
import {View, Text} from "react-native";
import Header from "../components/Header";
import {SafeAreaView} from "react-native-safe-area-context";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import useAuth from "../hooks/useAuth";
import {useRoute} from "@react-navigation/native";

const MessageScreen = () => {
    const { user } = useAuth();
    const {params} = useRoute();

    const { matchDetails } = params;

    return (
        <SafeAreaView>
            <Header
                title={getMatchedUserInfo(matchDetails.users, user.uid).displayName}
                callEnabled
            />
            <Text>Message Screen</Text>
        </SafeAreaView>
    );
}

export default MessageScreen