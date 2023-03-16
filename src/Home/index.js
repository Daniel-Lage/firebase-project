import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
} from "react-native";
import { useState } from "react";

import { getAuth, updateProfile, sendEmailVerification } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";

export default function Home({ navigation }) {
  const auth = getAuth();

  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState(user.photoURL);
  const [displayName, setDisplayName] = useState(user.displayName);

  console.log(user);

  const [message, setMessage] = useState(
    user.emailVerified ? "None" : "Email não verificado"
  );

  function configurarImagem() {
    const url = prompt("Insira o link da sua imagem");
    updateProfile(user, {
      photoURL: url,
    }).then(() => {
      setPhotoURL(url);
      setUser(auth.currentUser);
    });
  }

  function configurarNome() {
    updateProfile(user, { displayName: name }).then(() => {
      setDisplayName(name);
      setUser(auth.currentUser);
    });
  }

  return (
    <>
      <View style={styles.header}>
        <Pressable
          style={{
            position: "absolute",
            alignSelf: "flex-start",
            marginLeft: 10,
          }}
          onPress={() => {
            auth.signOut();
          }}
        >
          <Text>Sair</Text>
        </Pressable>
        <Text style={{ fontWeight: "bold", userSelect: "none" }}>
          Firebased - Home
        </Text>
      </View>
      <View style={styles.container}>
        {photoURL ? (
          <Image
            style={{
              height: 200,
              width: 200,
              backgroundColor: "rgb(212, 212, 212)",
              borderRadius: 5,
            }}
            onError={(error) => {
              setImage(null);
            }}
            source={photoURL}
          />
        ) : (
          <Pressable
            style={{
              height: 200,
              width: 200,
              backgroundColor: "rgb(212, 212, 212)",
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={configurarImagem}
          >
            <AntDesign name="plus" size={100} color="rgb(172, 172, 172)" />
          </Pressable>
        )}
        {displayName ? (
          <Text style={{ fontWeight: "bold" }}>{displayName}</Text>
        ) : (
          <TextInput
            placeholder="Nome"
            style={styles.textField}
            value={name}
            onChangeText={setName}
            onKeyPress={(e) => {
              if (e.keyCode === 13) configurarNome();
            }}
          />
        )}
        {message === "None" || (
          <Pressable
            onPress={() => {
              sendEmailVerification(user).then(() => {
                setMessage(
                  "Email Enviado, entre novamente quando verificar Email"
                );
                setTimeout(() => {
                  auth.signOut();
                }, 5000);
              });
            }}
          >
            <Text
              style={{
                color:
                  message === "Email não verificado"
                    ? "rgb(230, 71, 71)"
                    : "rgb(71, 230, 79)",
                userSelect: "none",
                fontWeight: "600",
              }}
            >
              {message}
            </Text>
          </Pressable>
        )}
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
