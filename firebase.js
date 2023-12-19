// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_WEB_API_KEY,
    authDomain: "tinder-2-yt-9b72d.firebaseapp.com",
    projectId: "tinder-2-yt-9b72d",
    storageBucket: "tinder-2-yt-9b72d.appspot.com",
    messagingSenderId: "817141732167",
    appId: "1:817141732167:web:cedc0ce46aad6ece6e7262"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export {auth, db}