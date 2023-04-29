import { useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

import { getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { AntDesign } from "@expo/vector-icons";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { colors } from "../styles/colors";
import { styles } from "../styles/profile";

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
    updateProfile(auth.currentUser, {
      displayName: nameInputRef.current.value,
    }).then(() => {
      setRenaming(false);
      setUpdated(true);
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
            setUpdated(false);
            navigation.navigate("Feed", { updated });
          }}
        >
          <AntDesign name="home" size={24} color="black" />
        </Pressable>
        <Text style={{ fontWeight: "bold", userSelect: "none" }}>
          Seu Perfil
        </Text>
      </View>
      <View style={styles.container}>
        {auth.currentUser.photoURL ? (
          <View style={{ justifyContent: "flex-end" }}>
            <Image style={styles.image} source={auth.currentUser.photoURL} />
            <Pressable
              style={{ position: "absolute", alignSelf: "flex-end" }}
              onPress={configurarImagem}
            >
              <AntDesign name="edit" size={24} color="black" />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.image} onPress={configurarImagem}>
            <AntDesign name="plus" size={100} color="rgb(172, 172, 172)" />
          </Pressable>
        )}
        {renaming ? (
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
        ) : (
          <View style={styles.nameDisplay}>
            <Text style={{ fontWeight: "bold", marginHorizontal: 24 }}>
              {auth.currentUser.displayName}
            </Text>
            <Pressable
              style={{ position: "absolute", alignSelf: "flex-end" }}
              onPress={() => setRenaming(true)}
            >
              <AntDesign name="edit" size={24} color="black" />
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

        <Pressable onPress={() => auth.signOut()} style={styles.mainButton}>
          <Text>Sair</Text>
        </Pressable>
      </View>
    </>
  );
}
