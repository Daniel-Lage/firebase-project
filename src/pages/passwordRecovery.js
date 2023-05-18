import { useState } from "react";
import { Pressable, Text, TextInput } from "react-native";

import { getAuth, sendPasswordResetEmail } from "firebase/auth";

import { isEmail } from "validator";

import { Feather } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import Header from "../components/header";
import Container from "../components/container";
import Menu from "../components/menu";

export default function PasswordRecovery({ navigation }) {
  const auth = getAuth();

  const [error, setError] = useState("None");

  const [email, setEmail] = useState("");

  function recover() {
    if (!isEmail(email)) {
      setEmail((prev) => {
        prev += "@gmail.com";

        if (!isEmail(prev)) {
          setTimeout(() => setError("None"), 2000);
          setError("Email ou Senha incorretos");
        } else {
          sendPasswordResetEmail(auth, prev).then(() => {
            setMessage("Email Enviado");
            setTimeout(() => {
              setMessage("None");
              navigation.navigate("SignIn");
            }, 2000);
          });
        }
        return prev;
      });
    } else {
      sendPasswordResetEmail(auth, email).then(() => {
        setMessage("Email Enviado");
        setTimeout(() => {
          setMessage("None");
          navigation.navigate("SignIn");
        }, 2000);
      });
    }
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
      <Header title="Recuperar Senha" />
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

          <Pressable
            onPress={recover}
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
