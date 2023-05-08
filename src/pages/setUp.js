import { useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

import { getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { AntDesign } from "@expo/vector-icons";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { colors } from "../styles/colors";
import { styles } from "../styles/profile";
import { insert } from "../functions/dbApi";

export default function SetUp({ navigation }) {
  const auth = getAuth();
  const storage = getStorage();

  const [updated, setUpdated] = useState(false);
  const [renaming, setRenaming] = useState(false);

  const [error, setError] = useState("None");

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
          <AntDesign name="home" size={24} color={colors.dark} />
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
              <AntDesign name="edit" size={24} color={colors.dark} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.image} onPress={configurarImagem}>
            <AntDesign name="plus" size={100} color="rgb(172, 172, 172)" />
          </Pressable>
        )}
        {renaming === false ? (
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
              <AntDesign name="check" size={24} color={colors.dark} />
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
              <AntDesign name="edit" size={24} color={colors.dark} />
            </Pressable>
          </View>
        )}

        <Pressable
          onPress={() => {
            const mistakes = [];

            if (!auth.currentUser.displayName) mistakes.push("Sem Nome");
            if (!auth.currentUser.photoURL) mistakes.push("Sem Icone");

            if (mistakes.length) {
              setTimeout(() => setError("None"), 2000);
              return setError(mistakes.join(", "));
            }
            const user = auth.currentUser;
            const userObject = {
              uid: user.uid,
              icon: user.photoURL,
              name: user.displayName,
            };
            insert("users", user.uid, userObject);

            auth.signOut();
          }}
          style={styles.submitButton}
        >
          <Text>Salvar e Sair</Text>
        </Pressable>

        {error === "None" || (
          <Text
            style={{
              color: colors.error,
              userSelect: "none",
              fontWeight: "600",
            }}
          >
            {error}
          </Text>
        )}
      </View>
    </>
  );
}
