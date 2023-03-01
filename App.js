import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { initializeApp } from "firebase/app";

import Login from "./src/Login";
import Home from "./src/Home";
import Cadastro from "./src/Cadastro";

initializeApp({
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
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Cadastro"
          component={Cadastro}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
