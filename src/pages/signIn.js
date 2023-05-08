import { useState } from "react";
import { Pressable, Text, TextInput } from "react-native";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { isEmail, isLength } from "validator";

import { Feather } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import Header from "../components/header";
import Container from "../components/container";
import Menu from "../components/menu";

export default function SignIn({ navigation }) {
  const auth = getAuth();

  const [error, setError] = useState("None");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function signIn() {
    var emailVal = email;

    if (!isLength(password, 6)) {
      setTimeout(() => setError("None"), 2000);
      setError("Email ou Senha incorretos");
      return;
    }

    if (!isEmail(emailVal)) {
      emailVal += "@gmail.com";
      if (!isEmail(emailVal)) {
        setTimeout(() => setError("None"), 2000);
        setError("Email ou Senha incorretos");
        return;
      }
    }

    signInWithEmailAndPassword(auth, emailVal, password).catch(() => {
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
            onPress={signIn}
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
              navigation.navigate("SignUp");
            }}
          >
            <Text style={{ color: colors.link }}>Cadastrar</Text>
          </Pressable>
          <Pressable onPress={() => navigation.navigate("PasswordRecovery")}>
            <Text style={{ color: colors.link }}>Esqueci Minha Senha</Text>
          </Pressable>
        </Menu>
      </Container>
    </>
  );
}
