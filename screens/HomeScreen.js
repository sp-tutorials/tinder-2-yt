import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {Text, Button, TouchableOpacity, View, Image, StyleSheet} from 'react-native';
import {useNavigation} from "@react-navigation/native";
import useAuth from "../hooks/useAuth";
import tw from "twrnc";
import {SafeAreaView} from "react-native-safe-area-context";
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import Swiper from "react-native-deck-swiper";
import {db} from "../firebase";
import {doc, onSnapshot, collection, setDoc, getDocs, query, where, getDoc, serverTimestamp} from "firebase/firestore";
import generateId from "../lib/generateId";

const DUMMY_DATA = [
    {
        firstName: "Sonny",
        lastName: "Sangha",
        job: "Software Developer",
        photoURL: "https://avatars.githubusercontent.com/u/24712956?v=4",
        age: 27,
        id: 123,
    },
    {
        firstName: "Elon",
        lastName: "Musk",
        job: "Software Developer",
        photoURL: "https://picsum.photos/id/237/200/300",
        age: 40,
        id: 456,
    },
    {
        firstName: "Sonny",
        lastName: "Sangha",
        job: "Software Developer",
        photoURL: "https://picsum.photos/id/238/200/300",
        id: 789,
    },
];

const HomeScreen = () => {
    const navigation = useNavigation();
    const { user, logout } = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swiperRef = useRef(null);

    /** this breaks the app **/
    // useLayoutEffect(() =>
    //         onSnapshot(doc(db, 'users', user.uid), snapshot => {
    //             if (!snapshot.exists()) {
    //                 navigation.navigate('Modal');
    //             }
    //         })
    //     , []);

    useEffect(() => {
        let unsub;

        const fetchCards = async () => {
            const passes = await getDocs(collection(db, 'users', user.uid, 'passes'))
                .then((snapshot) => snapshot.docs.map(doc => doc.id));

            const swipes = await getDocs(collection(db, 'users', user.uid, 'swipes'))
                .then((snapshot) => snapshot.docs.map(doc => doc.id));

            const passesUserIds = passes.length > 0 ? passes : ['test'];
            const swipesUserIds = swipes.length > 0 ? swipes : ['test'];

            unsub = onSnapshot(query(collection(db, 'users'), where('id', 'not-in', [...passesUserIds, ...swipesUserIds ])), snapshot => {
                setProfiles(
                    snapshot.docs.filter(doc => doc.id !== user.uid).map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                )
            });
        }

        fetchCards();
        return unsub;
    }, [db]);

    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        console.log(`You swiped PASS on ${userSwiped.displayName}`);

        setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.id), userSwiped);
    };

    const swipeRight = async (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        const loggedInProfile = await (
            await getDoc(db, 'users', user.uid)
        ).data();

        // Check if the user swiped right on you
        getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.id)).then(documentSnapshot => {
            if (documentSnapshot.exists()) {
                // user has matched with you before you matched with them
                // Create a MATCH!
                console.log(`Hooray, You MATCHED with ${userSwiped.displayName}`);

                setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);

                // CREATE A MATCH!!!
                setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.id)), {
                    users: {
                        [user.uid]: loggedInProfile,
                        [userSwiped.id]: userSwiped,
                    },
                    usersMatched: [user.uid, userSwiped.id],
                    timestamp: serverTimestamp(),
                });

                navigation.navigate('Match', {
                    loggedInProfile,
                    userSwiped,
                });
            } else {
                // User has swiped as first interaction between the two or didn't get swiped on...
                console.log(`You swiped on ${userSwiped.displayName} (${userSwiped.job})`);
                setDoc(doc(db, 'users', user.uid, 'swipes', userSwiped.id), userSwiped);
            }
        });
    };

    return (
        /* the SafeAreaView from react-native is iOS only */
        <SafeAreaView style={tw`flex-1`}>
            {/* Header */}
                <View style={tw`flex-row items-center justify-between px-5`}>
                    <TouchableOpacity onPress={logout}>
                        <Image style={tw`h-10 w-10 rounded-full`} source={{ uri: user.photoURL }}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Modal')}>
                        {/* logo from: https://download.logo.wine/logo/Tinder_(app)/Tinder_(app)-Flame-Logo.wine.png */}
                        <Image source={require('../logo.png')} style={tw`w-15 h-15`}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Chat')}>
                        <Ionicons name='chatbubbles-sharp' size={30} color="#FF5864"/>
                    </TouchableOpacity>
                </View>
            {/* End of Header*/}

            {/* Cards */}
            <View style={tw`flex-1 -mt-6`}>
                <Swiper
                    ref={swiperRef}
                    containerStyle={{ backgroundColor: "transparent"  }}
                    cards={profiles}
                    stackSize={5}
                    cardIndex={0}
                    animateCardOpacity
                    verticalSwipe={false}
                    onSwipedLeft={(cardIndex) => {
                        console.log(cardIndex, 'PASS');
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex) => {
                        console.log(cardIndex, 'LIKE');
                        swipeRight(cardIndex);
                    }}
                    backgroundColor={"#4FD0E9"}
                    overlayLabels={{
                        left: {
                            title: 'NOPE',
                            style: {
                                label: {
                                    textAlign: 'right',
                                    color: 'red',
                                },
                            },
                        },
                        right: {
                            title: 'MATCH',
                            style: {
                                label: {
                                    color: '#4DED30',
                                },
                            },
                        },
                    }}
                    renderCard={(card) => card ? (
                        <View key={card.id} style={tw`relative bg-white h-3/4 rounded-xl`}>
                            <Image
                                style={tw`absolute top-0 h-full w-full rounded-xl`}
                                source={{ uri: card.photoURL }}
                            />

                            <View
                                style={[tw
                                    `absolute bottom-0 bg-white w-full flex-row justify-between items-center 
                                    h-20 px-6 py-2 rounded-b-xl shadow-xl`, styles.cardShadow]
                                }
                            >
                                <View>
                                    <Text style={tw`text-xl font-bold`}>
                                        {card.displayName}
                                    </Text>
                                    <Text>
                                        {card.job}
                                    </Text>
                                </View>
                                <Text style={tw`text-2xl font-bold`}>{card.age}</Text>
                            </View>
                        </View>
                    ) : (
                        <View style={[tw`relative bg-white h-3/4 rounded-xl justify-center items-center`, styles.cardShadow]}>
                            <Text style={tw`font-bold pb-5`}>No more profiles</Text>

                            <Image
                                style={tw`h-20 w-full`}
                                height={100}
                                width={100}
                                source={{ uri: "https://links.papareact.com/6gb" }}
                            />
                        </View>
                    )}
                />
            </View>

            <View style={tw`flex flex-row justify-evenly`}>
                <TouchableOpacity
                    onPress={() => swiperRef.current.swipeLeft()}
                    style={tw`items-center justify-center rounded-full w-16 h-16 bg-red-200`}>
                    <Entypo name='cross' size={24} color='red'/>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => swiperRef.current.swipeRight()}
                    style={tw`items-center justify-center rounded-full w-16 h-16 bg-green-200`}>
                    <Entypo name='heart' size={24} color='green'/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default HomeScreen

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
    }
})