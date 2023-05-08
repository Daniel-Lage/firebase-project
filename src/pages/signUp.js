import { useState } from "react";
import { Pressable, Text, TextInput } from "react-native";

import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";

import { isEmail, isLength } from "validator";

import { Feather } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import Header from "../components/header";
import Container from "../components/container";
import Menu from "../components/menu";
import { insert } from "../functions/dbApi";

export default function SignUp({ navigation }) {
  const auth = getAuth();

  const [error, setError] = useState("None");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function signUp() {
    let emailVal = email;
    const mistakes = [];

    if (!isLength(password, 6)) mistakes.push("Senha abaixo de 6 caracteres");

    if (!isEmail(emailVal)) {
      emailVal += "@gmail.com";
      if (!isEmail(emailVal)) mistakes.push("Email Invalido");
    }

    if (mistakes.length) {
      setTimeout(() => setError("None"), 2000);
      return setError(mistakes.join(", "));
    }

    createUserWithEmailAndPassword(auth, emailVal, password)
      .then(() => {
        const newDisplayName = auth.currentUser.email.slice(
          0,
          auth.currentUser.email.indexOf("@")
        );

        updateProfile(auth.currentUser, {
          displayName: newDisplayName,
          photoURL:
            "https://firebasestorage.googleapis.com/v0/b/fir-login-9a729.appspot.com/o/dXJT53tYuCTt3NuiR4DgP8zLrpG2?alt=media&token=a4145c21-ad55-472b-9021-677052dad812",
        });

        insert("users", auth.currentUser.uid, {
          uid: auth.currentUser.uid,
          followers: [],
          following: [],
          name: newDisplayName,
          icon: "https://firebasestorage.googleapis.com/v0/b/fir-login-9a729.appspot.com/o/dXJT53tYuCTt3NuiR4DgP8zLrpG2?alt=media&token=a4145c21-ad55-472b-9021-677052dad812",
        });
      })
      .catch((error) => {
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
