import React, {createContext, useContext} from 'react';
import * as Google from "expo-auth-session/providers/google";

const AuthContext = createContext({})

const config = {
    androidClientId: process.env.EXPO_PUBLIC_ANDROID_CLIENT_ID,
    scopes: ['profile', 'email'],
    permissions: ["public_profile", "email", "gender", "location"],
}

export const AuthProvider = ({ children }) => {
    const [request, response, promptAsync] = Google.useAuthRequest(config);
    const signInWithGoogle = async () => {
        promptAsync().then(async (logInResult) => {
            if (logInResult.type === 'success') {
                // login...
            }
        });
    }
    return (
        <AuthContext.Provider value={{
            user: null,
            signInWithGoogle,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export default function useAuth() {
    return useContext(AuthContext);
}