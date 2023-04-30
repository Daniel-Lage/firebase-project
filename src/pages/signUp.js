import { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";

import { isEmail, isLength } from "validator";

import { styles } from "../styles/start";
import { colors } from "../styles/colors";

export default function SignUp({ navigation }) {
  const auth = getAuth();

  const [error, setError] = useState("None");

  const emailTextInput = useRef();
  const passwordTextInput = useRef();

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
        signUp();
        break;
    }
  }

  window.onkeydown = handleKeyPress;

  return (
    <>
      <View style={styles.header}>
        <Text style={{ fontWeight: "bold", userSelect: "none" }}>Cadastro</Text>
      </View>
      <View style={styles.container}>
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
          style={[
            styles.textField,
            {
              borderColor: error !== "None" ? colors.error : "rgb(46, 46, 46)",
            },
          ]}
          ref={emailTextInput}
          placeholder="Email"
          onKeyPress={handleKeyPress}
        />
        <TextInput
          secureTextEntry={true}
          style={[
            styles.textField,
            {
              borderColor: error !== "None" ? colors.error : "rgb(46, 46, 46)",
            },
          ]}
          ref={passwordTextInput}
          placeholder="Senha"
          onKeyPress={handleKeyPress}
        />
        <View style={{ flexDirection: "row" }}>
          <Pressable
            onPress={() => {
              setError("None");
              navigation.navigate("SignIn");
            }}
            style={styles.otherButton}
          >
            <Text>Entrar</Text>
          </Pressable>
          <Pressable onPress={signUp} style={styles.mainButton}>
            <Text>Cadastrar</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
