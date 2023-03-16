import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { isEmail } from "validator";
import { useState } from "react";

export default function PasswordRecovery({ navigation }) {
  const auth = getAuth();

  const [message, setMessage] = useState("None");

  const [email, setEmail] = useState("");


  function recuperar() {
    if (!isEmail(email)) {
      setMessage("Email Invalido");
      setTimeout(() => {
        setMessage("None");
      }, 2000);
      return;
    }

    sendPasswordResetEmail(auth, email).then(() => {
      setMessage("Email Enviado");
      setTimeout(() => {
        setMessage("None");
        navigation.navigate("SignIn");
      }, 2000);
    });
  }

  return (
    <>
      <View style={styles.header}>
        <Text style={{ fontWeight: "bold", userSelect: "none" }}>
          Firebased - Recuperar Senha
        </Text>
      </View>
      <View style={styles.container}>
        <Text
          style={{
            color:
              message === "None"
                ? "transparent"
                : message === "Email Invalido"
                ? "rgb(230, 71, 71)"
                : "rgb(71, 230, 79)",
            userSelect: "none",
            fontWeight: "600",
          }}
        >
          {message}
        </Text>

        <TextInput
          style={[
            styles.textField,
            {
              borderColor:
                message === "Email Invalido"
                  ? "rgb(230, 71, 71)"
                  : "rgb(46, 46, 46)",
            },
          ]}
          value={email}
          onChangeText={setEmail}
          onKeyPress={(e) => {
            if (e.keyCode === 13) recuperar();
          }}
          placeholder="Email"
        />
        <Pressable
          onPress={recuperar}
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
          <Text>Recuperar</Text>
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
