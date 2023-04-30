import { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { isEmail, isLength } from "validator";

import { styles } from "../styles/start";
import { colors } from "../styles/colors";

export default function SignIn({ navigation }) {
  const auth = getAuth();

  const [error, setError] = useState("None");

  const emailTextInput = useRef();
  const passwordTextInput = useRef();

  function signIn() {
    var email = emailTextInput.current.value;
    const password = passwordTextInput.current.value;

    if (!isLength(password, 6)) {
      setTimeout(() => setError("None"), 2000);
      setError("Email ou Senha incorretos");
      return;
    }

    if (!isEmail(email)) {
      email += "@gmail.com";
      if (!isEmail(email)) {
        setTimeout(() => setError("None"), 2000);
        setError("Email ou Senha incorretos");
        return;
      }
    }

    signInWithEmailAndPassword(auth, email, password).catch(() => {
      setTimeout(() => setError("None"), 2000);
      setError("Email ou Senha incorretos");
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
      <View style={styles.header}>
        <Text style={{ fontWeight: "bold", userSelect: "none" }}>Entrada</Text>
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
              navigation.navigate("SignUp");
            }}
            style={styles.otherButton}
          >
            <Text>Cadastrar</Text>
          </Pressable>
          <Pressable onPress={signIn} style={styles.mainButton}>
            <Text>Entrar</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => navigation.navigate("PasswordRecovery")}>
          <Text style={{ color: colors.link }}>Esqueci Minha Senha</Text>
        </Pressable>
      </View>
    </>
  );
}
