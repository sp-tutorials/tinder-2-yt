import StackNavigator from "./StackNavigator";
LogBox.ignoreAllLogs(); //Ignore all log notifications
import {NavigationContainer} from "@react-navigation/native";
import {AuthProvider} from "./hooks/useAuth";
import {LogBox} from "react-native";
import {FakeLoginProvider} from "./hooks/useFakeLogin";

export default function App() {
    return (
        <NavigationContainer>
            {/* HOC - Higher Order Component */}
            <FakeLoginProvider>
                <AuthProvider>
                    {/* Passes down the cool auth stuff to children... */}
                    <StackNavigator/>
                </AuthProvider>
            </FakeLoginProvider>
        </NavigationContainer>
    );
}