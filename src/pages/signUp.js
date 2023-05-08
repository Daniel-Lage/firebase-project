import { useState } from "react";
import { Pressable, Text, TextInput } from "react-native";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

import { isEmail, isLength } from "validator";

import { Feather } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import Header from "../components/header";
import Container from "../components/container";
import Menu from "../components/menu";

export default function SignUp({ navigation }) {
  const auth = getAuth();

  const [error, setError] = useState("None");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function signUp() {
    var email = emailTextInput.current.value;
    const password = passwordTextInput.current.value;

    const mistakes = [];

    if (!isLength(password, 6)) mistakes.push("Senha abaixo de 6 caracteres");

    if (!isEmail(email)) {
      email += "@gmail.com";
      if (!isEmail(email)) mistakes.push("Email Invalido");
    }

    if (mistakes.length) {
      setTimeout(() => setError("None"), 2000);
      return setError(mistakes.join(", "));
    }

    createUserWithEmailAndPassword(auth, email, password).catch((error) => {
      if (error.message === "Firebase: Error (auth/email-already-in-use).") {
        setTimeout(() => setError("None"), 2000);
        setError("Email already in use");
      }
    });
  }

  function handleKeyPress(e) {
    switch (e.code) {
      case "Enter":
      case "NumpadEnter":
        signIn();
        break;
    }
  }

  window.onkeydown = handleKeyPress;

  return (
    <>
      <Header title="Entrada" />
      <Container>
        <Menu>
          <Text
            style={{
              color: error !== "None" ? colors.error : "transparent",
              userSelect: "none",
              fontWeight: "600",
            }}
          >
            {error}
          </Text>
          <TextInput
            style={{
              width: 200,
              height: 30,
              borderRadius: 15,
              textAlign: "center",
              borderWidth: 2,
              borderColor: colors.dark,
              backgroundColor: colors.backgroundDarker,
              borderColor: error !== "None" ? colors.error : "rgb(46, 46, 46)",
            }}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            onKeyPress={handleKeyPress}
          />
          <TextInput
            secureTextEntry={true}
            style={{
              width: 200,
              height: 30,
              borderRadius: 15,
              textAlign: "center",
              borderWidth: 2,
              borderColor: colors.dark,
              backgroundColor: colors.backgroundDarker,
              borderColor: error !== "None" ? colors.error : "rgb(46, 46, 46)",
            }}
            value={password}
            onChangeText={setPassword}
            placeholder="Senha"
            onKeyPress={handleKeyPress}
          />

          <Pressable
            onPress={signUp}
            style={{
              width: 50,
              aspectRatio: 1,
              borderRadius: "50%",
              justifyContent: "center",
              backgroundColor: colors.primary,
              textAlign: "center",
              userSelect: "none",
              borderWidth: 2,
              borderColor: colors.dark,
            }}
          >
            <Feather name="log-in" size={24} color={colors.dark} />
          </Pressable>
          <Pressable
            onPress={() => {
              setError("None");
              navigation.navigate("SignIn");
            }}
          >
            <Text style={{ color: colors.link }}>Entrar</Text>
          </Pressable>
        </Menu>
      </Container>
    </>
  );
}
