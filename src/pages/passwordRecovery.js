import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { isEmail } from "validator";
import { styles } from "../styles/start";
import { colors } from "../styles/colors";

export default function PasswordRecovery({ navigation }) {
  const auth = getAuth();

  const [message, setMessage] = useState("None");

  const emailTextInput = useRef();

  function recover() {
    var email = emailTextInput.current.value;

    if (!isEmail(email)) {
      email += "@gmail.com";
      if (!isEmail(email)) {
        setTimeout(() => setError("None"), 2000);
        setError("Email ou Senha incorretos");
        return;
      }
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
          Recuperar Senha
        </Text>
      </View>
      <View style={styles.container}>
        <Text
          style={{
            color:
              message === "None"
                ? "transparent"
                : message === "Email Invalido"
                ? colors.error
                : colors.primary,
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
                message === "Email Invalido" ? colors.error : "rgb(46, 46, 46)",
            },
          ]}
          ref={emailTextInput}
          placeholder="Email"
          onKeyPress={(e) => {
            switch (e.code) {
              case "Enter":
              case "NumpadEnter":
                recover();
                break;
            }
          }}
        />

        <View style={{ flexDirection: "row" }}>
          <Pressable
            onPress={() => {
              setMessage("None");
              navigation.navigate("SignIn");
            }}
            style={styles.otherButton}
          >
            <Text>Entrar</Text>
          </Pressable>
          <Pressable onPress={recover} style={styles.mainButton}>
            <Text>Recuperar</Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
