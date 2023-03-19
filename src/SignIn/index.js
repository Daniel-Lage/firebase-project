import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useReducer, useRef, useState } from "react";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { isEmail, isLength } from "validator";

export default function SignIn({ navigation }) {
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("None");

  const passwordTextInput = useRef();

  function signIn() {
    if (isEmail(email) && isLength(password, 6)) {
      signInWithEmailAndPassword(auth, email, password).catch(() => {
        setTimeout(() => setError("None"), 2000);
        setError("Email ou Senha incorretos");
      });
      return;
    }
    setTimeout(() => setError("None"), 2000);
    setError("Email ou Senha incorretos");
  }

  window.onkeydown = (e) => e.keyCode === 13 && signIn();

  return (
    <>
      <View style={styles.header}>
        <Text style={{ fontWeight: "bold", userSelect: "none" }}>
          Firebased - Entrada
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
          onKeyPress={(e) => e.keyCode === 13 && signIn()}
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
        />
        <View style={{ flexDirection: "row" }}>
          <Pressable
            onPress={() => {
              setError("None");
              navigation.navigate("SignUp");
            }}
            style={{
              width: 100,
              height: 40,
              justifyContent: "center",
              textAlign: "center",
              userSelect: "none",
            }}
          >
            <Text>Cadastrar</Text>
          </Pressable>
          <Pressable
            onPress={signIn}
            style={{
              width: 100,
              height: 40,
              justifyContent: "center",
              backgroundColor: "rgb(71, 230, 79)",
              textAlign: "center",
              borderRadius: 5,
              userSelect: "none",
            }}
          >
            <Text>Entrar</Text>
          </Pressable>
        </View>
        <Pressable onPress={() => navigation.navigate("PasswordRecovery")}>
          <Text style={{ color: "rgb(104, 171, 242)" }}>
            Esqueci Minha Senha
          </Text>
        </Pressable>
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
