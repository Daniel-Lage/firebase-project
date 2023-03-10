import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { isEmail, isLength } from "validator";

export default function Login({ navigation }) {
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("None");

  function login() {
    if (isEmail(email) && isLength(password, 6)) {
      signInWithEmailAndPassword(auth, email, password)
        .then((account) => {
          navigation.navigate("Home", { user: account.user });
        })
        .catch((error) => {
          setError("Email ou Senha incorretos");
        });
      return setError("");
    }
    setError("Email ou Senha incorretos");
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={{ fontWeight: "bold", userSelect: "none" }}>
          Firebased
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
          style={{
            width: 200,
            height: 40,
            borderRadius: 5,
            textAlign: "center",
            borderWidth: 2,
            borderColor:
              error !== "None" ? "rgb(230, 71, 71)" : "rgb(46, 46, 46)",
            backgroundColor: "rgb(212, 212, 212)",
          }}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
        />
        <TextInput
          secureTextEntry={true}
          style={{
            width: 200,
            height: 40,
            borderRadius: 5,
            textAlign: "center",
            borderWidth: 2,
            borderColor:
              error !== "None" ? "rgb(230, 71, 71)" : "rgb(46, 46, 46)",
            backgroundColor: "rgb(212, 212, 212)",
          }}
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
        />
        <View style={{ flexDirection: "row" }}>
          <Pressable
            onPress={() => {
              navigation.navigate("Cadastro");
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
            onPress={login}
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
            <Text>Login</Text>
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
});
