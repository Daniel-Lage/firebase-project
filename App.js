import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useState } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import SignIn from "./src/SignIn";
import Home from "./src/Home";
import SignUp from "./src/SignUp";
import PasswordRecovery from "./src/PasswordRecovery";

const app = initializeApp({
  apiKey: "AIzaSyD5JYpWfsxBlQnZZAfJy9LxUkKQAH1zsjQ",
  authDomain: "fir-login-9a729.firebaseapp.com",
  projectId: "fir-login-9a729",
  storageBucket: "fir-login-9a729.appspot.com",
  messagingSenderId: "68169875466",
  appId: "1:68169875466:web:090c934bfc905421051ff3",
  measurementId: "G-KXNQ4MKC0L",
});

const Stack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  onAuthStateChanged(getAuth(app), (user) => {
    setUser(user);
  });

  return user ? (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PasswordRecovery"
          component={PasswordRecovery}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}