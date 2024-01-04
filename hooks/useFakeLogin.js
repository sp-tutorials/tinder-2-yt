import {createContext, useContext, useState} from "react";


const FakeLoginContext = createContext({})

export const FakeLoginProvider = ({children}) => {
    const [fakeLoginSuccess, setFakeLoginSuccess] = useState(false);

    return (
        <FakeLoginContext.Provider value={{fakeLoginSuccess, setFakeLoginSuccess}}>
            {children}
        </FakeLoginContext.Provider>
    )
}

export default function useFakeLogin() {
    return useContext(FakeLoginContext);
}