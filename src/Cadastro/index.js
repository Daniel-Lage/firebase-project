import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { isEmail, isLength } from "validator";

export default function Cadastro({ navigation }) {
  const auth = getAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setErrors] = useState("None");

  function cadastrar() {
    const mistakes = [];

    if (!isEmail(email)) mistakes.push("Email Invalido");

    if (!isLength(password, 6)) mistakes.push("Senha abaixo de 6 caracteres");

    if (!mistakes.length) {
      createUserWithEmailAndPassword(auth, email, password).then((account) => {
        navigation.navigate("Login");
      });
    }
    setErrors(mistakes.join(", "));
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
              navigation.navigate("Login");
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
            onPress={cadastrar}
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
});
