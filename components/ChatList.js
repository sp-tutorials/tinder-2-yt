import React, {useEffect, useState} from 'react'
import {FlatList, Text, View} from 'react-native'
import {collection, onSnapshot, query, where} from "firebase/firestore";
import {db} from "../firebase";
import useAuth from "../hooks/useAuth";
import tw from "twrnc";
import ChatRow, {MATCHED_USER} from "./ChatRow";


const ChatList = () => {
    const [matches, setMatches] = useState([MATCHED_USER]); // MATCHED_USER is a dummy user
    const { user } = useAuth();

    {
        user.uid = "1";
    }


    useEffect(() =>
        onSnapshot(
            query(
                collection(db, 'matches'),
                where('usersMatched', 'array-contains', user.uid)
            ),
            (snapshot) =>
                setMatches(
                    snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                )
        ), [user]);


    return (
        matches.length > 0 ? (
            <FlatList
                style={tw`h-full`}
                data={matches}
                keyExtractor={item => item.id}
                renderItem={({item}) => <ChatRow matchDetails={item}/>}
            />
        ) : (
            <View style={tw`p-5`}>
                <Text style={tw`text-center text-lg`}>No matches at the moment 😢</Text>
            </View>
        )
    );
}

export default ChatList