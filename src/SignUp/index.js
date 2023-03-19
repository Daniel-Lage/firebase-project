import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useRef, useState } from "react";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { isEmail, isLength } from "validator";

export default function SignUp({ navigation }) {
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("None");

  const passwordTextInput = useRef();

  function signUp() {
    const mistakes = [];

    if (!isEmail(email)) mistakes.push("Email Invalido");

    if (!isLength(password, 6)) mistakes.push("Senha abaixo de 6 caracteres");

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

  window.onkeydown = (e) => e.keyCode === 13 && signUp();

  return (
    <>
      <View style={styles.header}>
        <Text style={{ fontWeight: "bold", userSelect: "none" }}>
          Firebased - Cadastro
        </Text>
      </View>
      <View style={styles.container}>
        <Text
          style={{
            color: error !== "None" ? "rgb(230, 71, 71)" : "transparent",
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
              borderColor:
                error !== "None" ? "rgb(230, 71, 71)" : "rgb(46, 46, 46)",
            },
          ]}
          value={email}
          onChangeText={setEmail}
          onKeyPress={(e) =>
            e.keyCode === 13 && passwordTextInput.current.focus()
          }
          placeholder="Email"
        />
        <TextInput
          secureTextEntry={true}
          style={[
            styles.textField,
            {
              borderColor:
                error !== "None" ? "rgb(230, 71, 71)" : "rgb(46, 46, 46)",
            },
          ]}
          ref={passwordTextInput}
          onKeyPress={(e) => e.keyCode === 13 && signUp()}
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
        />
        <View style={{ flexDirection: "row" }}>
          <Pressable
            onPress={() => {
              setError("None");
              navigation.navigate("SignIn");
            }}
            style={{
              width: 100,
              height: 40,
              justifyContent: "center",
              userSelect: "none",
              textAlign: "center",
            }}
          >
            <Text>Voltar</Text>
          </Pressable>
          <Pressable
            onPress={signUp}
            style={{
              width: 100,
              height: 40,
              justifyContent: "center",
              backgroundColor: "rgb(71, 230, 79)",
              textAlign: "center",
              userSelect: "none",
              borderRadius: 5,
            }}
          >
            <Text>Cadastrar</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: "rgb(71, 230, 79)",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    gap: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  textField: {
    width: 200,
    height: 40,
    borderRadius: 5,
    textAlign: "center",
    borderWidth: 2,
    borderColor: "rgb(46, 46, 46)",
    backgroundColor: "rgb(212, 212, 212)",
  },
});
