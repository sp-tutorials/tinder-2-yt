import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import getMatchedUserInfo from "../lib/getMatchedUserInfo";
import tw from "twrnc";
import {db} from "../firebase";
import {collection, onSnapshot, orderBy, query} from "firebase/firestore";

export const MATCHED_USER = {
    age: 27,
    displayName: "Gigi",
    id: '3',
    job: 'oier',
    photoURL: 'https://picsum.photos/200/300/?blur',
};


const ChatRow = ({matchDetails}) => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState('');

    useEffect(() => {
        setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
        setMatchedUserInfo(MATCHED_USER)
    }, [matchDetails, user]);

    useEffect(
        () =>
            onSnapshot(
                query(
                    collection(db, 'matches', matchDetails.id, 'messages'),
                    orderBy('timestamp', 'desc') // IDEA: limit to 1
                ),
                snapshot => setLastMessage(snapshot.docs[0]?.data()?.message)
            ),
        [matchDetails, db]
    );

    return (
        <TouchableOpacity
            style={[
                tw`flex-row items-center py-3 px-5 bg-white mx-3 my-1 rounded-lg`,
                styles.cardShadow,
            ]}
            onPress={() => navigation.navigate('Message', {
                // matchDetails,
                matchDetails: {users: [MATCHED_USER]} // dummy data bc login doesn't work
            })}
        >
            <Image
                style={tw`rounded-full h-16 w-16 mr-4`}
                source={{ uri: matchedUserInfo?.photoURL }}
            />

            <View>
                <Text style={tw`text-lg font-semibold`}>
                    {matchedUserInfo?.displayName}
                </Text>
                <Text>{lastMessage || "Say Hi!"}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChatRow

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
});