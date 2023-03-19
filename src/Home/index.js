import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
} from "react-native";
import { useEffect, useRef, useState } from "react";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile, sendEmailVerification } from "firebase/auth";

import { AntDesign } from "@expo/vector-icons";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";

export default function Home({ navigation }) {
  const auth = getAuth();
  const storage = getStorage();

  const [user, setUser] = useState(auth.currentUser);
  const nameInputRef = useRef();
  const [photoURL, setPhotoURL] = useState(user.photoURL);
  const [displayName, setDisplayName] = useState(user.displayName);

  const [message, setMessage] = useState(
    user.emailVerified ? "None" : "Email não verificado"
  );

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
          const images = ref(storage, user.uid);
          uploadBytes(images, image).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => setPhotoURL(url));
          });
        });
    });
  }

  function configurarNome() {
    setDisplayName(nameInputRef.current.value);
  }

  useEffect(() => {
    updateProfile(user, { displayName: displayName, photoURL: photoURL }).then(
      () => {
        setUser(auth.currentUser);
      }
    );
  }, [displayName, photoURL]);

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
          <AntDesign name="back" size={24} color="black" />
        </Pressable>
        <Text style={{ fontWeight: "bold", userSelect: "none" }}>
          Firebased - Home
        </Text>
      </View>
      <View style={styles.container}>
        {photoURL ? (
          <View style={{ justifyContent: "flex-end" }}>
            <Image
              style={{
                height: 200,
                width: 200,
                backgroundColor: "rgb(212, 212, 212)",
                borderRadius: 5,
                borderBottomRightRadius: 72,
              }}
              onError={() => setImage(null)}
              source={photoURL}
            />
            <Pressable
              style={{ position: "absolute", alignSelf: "flex-end" }}
              onPress={configurarImagem}
            >
              <AntDesign name="edit" size={24} color="black" />
            </Pressable>
          </View>
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
          <View style={styles.nameDisplay}>
            <Text style={{ fontWeight: "bold", marginHorizontal: 24 }}>
              {displayName}
            </Text>
            <Pressable
              style={{ position: "absolute", alignSelf: "flex-end" }}
              onPress={() => {
                setDisplayName(null);
              }}
            >
              <AntDesign name="edit" size={24} color="black" />
            </Pressable>
          </View>
        ) : (
          <TextInput
            placeholder="Nome"
            style={styles.textField}
            ref={nameInputRef}
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
  nameDisplay: {
    width: 200,
    height: 40,
    borderRadius: 5,
    textAlign: "center",
    justifyContent: "center",
  },
});
