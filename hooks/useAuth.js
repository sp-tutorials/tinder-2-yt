import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import * as Google from "expo-auth-session/providers/google";
import {GoogleAuthProvider, onAuthStateChanged, signInWithCredential, signOut} from "firebase/auth";
import {auth} from '../firebase';
import useFakeLogin from "./useFakeLogin";

const AuthContext = createContext({})

const config = {
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    scopes: ['profile', 'email'],
    permissions: ["public_profile", "email", "gender", "location"],
}

export const AuthProvider = ({ children }) => {
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loading, setLoading] = useState(false);

    const {fakeLoginSuccess} = useFakeLogin();

    useEffect(() =>
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Logged in...
                setUser(user);
            } else {
                // Not logged in...
                setUser(null);
            }

            setLoadingInitial(false)
        }), []);

    const logout = () => {
        setLoading(true);

        signOut(auth).catch(error => setError(error)).finally(() => setLoading(false));
        setUser(null); // This is just for the fake login
    }

    const [request, response, promptAsync] = Google.useAuthRequest(config);
    const signInWithGoogle = async () => {
        setLoading(true);

        await promptAsync().then(async (logInResult) => {
            // fake login cuz this Google auth shit ain't working
            if (fakeLoginSuccess) {
                setUser({name: "Dorel"})
            }
            if (logInResult.type === 'success') {
                // login...
                const { idToken, accessToken } = logInResult;
                const credential = GoogleAuthProvider.credential(idToken, accessToken);

                await signInWithCredential(auth, credential);
            }

            return Promise.reject();
        })
            .catch(error => setError(error))
            .finally(() => setLoading(false));
    };

    const memoedValue = useMemo(() => ({
        user,
        loading,
        error,
        signInWithGoogle,
        logout,
    }), [user, loading, error]);

    return (
        <AuthContext.Provider value={memoedValue}>
            {!loadingInitial && children}
        </AuthContext.Provider>
    );
}

export default function useAuth() {
    return useContext(AuthContext);
}