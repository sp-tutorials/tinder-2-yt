import React, {createContext, useContext} from 'react';
import * as Google from "expo-auth-session/providers/google";

const AuthContext = createContext({})

const config = {
    androidClientId: "817141732167-sg5ut34mkbhb23h9cnb1uqb5jssa4mvb.apps.googleusercontent.com",
    scopes: ['profile', 'email'],
    permissions: ["public_profile", "email", "gender", "location"],
}

export const AuthProvider = ({ children }) => {
    const [request, response, promptAsync] = Google.useAuthRequest(config);
    const signInWithGoogle = async () => {
        promptAsync().then(logInResult => {
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