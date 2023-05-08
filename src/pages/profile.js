import { useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

import { getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { Feather } from "@expo/vector-icons";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { colors } from "../styles/colors";
import { styles } from "../styles/profile";
import { update } from "../functions/dbApi";
import Header from "../components/header";
import Container from "../components/container";
import Menu from "../components/menu";

export default function Profile({ navigation }) {
  const auth = getAuth();
  const storage = getStorage();

  const [updated, setUpdated] = useState(false);
  const [renaming, setRenaming] = useState(false);

  const [message, setMessage] = useState(
    auth.currentUser.emailVerified ? "None" : "Email não verificado"
  );

  const nameInputRef = useRef();

  function configurarImagem() {
    launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    }).then((result) => {
      fetch(result.assets[0].uri)
        .then((response) => response.blob())
        .then((image) => {
          const images = ref(storage, auth.currentUser.uid);
          uploadBytes(images, image).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((photoURL) => {
              update("users", auth.currentUser.uid, {
                icon: photoURL,
              });

              updateProfile(auth.currentUser, {
                photoURL,
              }).then(() => {
                setUpdated(true);
              });
            });
          });
        });
    });
  }

  function configurarNome() {
    update("users", auth.currentUser.uid, {
      name: nameInputRef.current.value,
    });
    updateProfile(auth.currentUser, {
      displayName: nameInputRef.current.value,
    }).then(() => {
      setRenaming(false);
      setUpdated(true);
    });
  }

  return (
    <>
      <Header
        title="Seu Perfil"
        lSymbol="home"
        lOnPress={() => {
          setUpdated(false);
          navigation.navigate("Feed", { updated });
        }}
        rSymbol="log-out"
        rOnPress={() => auth.signOut()}
      />
      <Container>
        <Menu>
          {auth.currentUser.photoURL ? (
            <View style={{ justifyContent: "flex-end" }}>
              <Image style={styles.image} source={auth.currentUser.photoURL} />
              <Pressable
                style={{ position: "absolute", alignSelf: "flex-end" }}
                onPress={configurarImagem}
              >
                <Feather name="edit-3" size={24} color={colors.dark} />
              </Pressable>
            </View>
          ) : (
            <Pressable style={styles.image} onPress={configurarImagem}>
              <Feather name="plus" size={100} color="rgb(172, 172, 172)" />
            </Pressable>
          )}
          {renaming ? (
            <View style={{ flexDirection: "row" }}>
              <TextInput
                placeholder="Nome"
                style={styles.textField}
                ref={nameInputRef}
                onKeyPress={(e) => {
                  switch (e.code) {
                    case "Enter":
                    case "NumpadEnter":
                      configurarNome();
                      break;
                  }
                }}
              />
              <Pressable style={styles.button} onPress={configurarNome}>
                <Feather name="edit-3" size={24} color={colors.dark} />
              </Pressable>
            </View>
          ) : (
            <View style={styles.nameDisplay}>
              <Text style={{ fontWeight: "bold", marginHorizontal: 24 }}>
                {auth.currentUser.displayName}
              </Text>
              <Pressable
                style={{ position: "absolute", alignSelf: "flex-end" }}
                onPress={() => setRenaming(true)}
              >
                <Feather name="edit-3" size={24} color={colors.dark} />
              </Pressable>
            </View>
          )}
          {message === "None" || (
            <Pressable
              onPress={() =>
                sendEmailVerification(auth.currentUser).then(() =>
                  setMessage(
                    "Email Enviado, entre novamente quando verificar Email"
                  )
                )
              }
            >
              <Text
                style={{
                  color:
                    message === "Email não verificado"
                      ? colors.error
                      : colors.primary,
                  userSelect: "none",
                  fontWeight: "600",
                }}
              >
                {message}
              </Text>
            </Pressable>
          )}
        </Menu>
      </Container>
    </>
  );
}
