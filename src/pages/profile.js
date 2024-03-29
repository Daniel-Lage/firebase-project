import { useEffect, useMemo, useRef, useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

import { getAuth, sendEmailVerification, updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { Feather } from "@expo/vector-icons";
import { launchImageLibraryAsync, MediaTypeOptions } from "expo-image-picker";
import { colors } from "../styles/colors";
import { styles } from "../styles/profile";
import { dbRead, dbReadFiltered, dbUpdate } from "../functions/dbApi";
import Header from "../components/header";
import Container from "../components/container";
import { Entypo } from "@expo/vector-icons";
import formatTime from "../functions/formatTime";

const sortingOptions = ["Mais Curtidas", "Recente"];
var usersObj = {};
var updated = false;

export default function Profile({ navigation, route }) {
  const auth = getAuth();
  const storage = getStorage();

  const [renaming, setRenaming] = useState(false);
  const [sortBy, setSortBy] = useState(localStorage.sortBy || "Mais Curtidas");
  const [posts, setPosts] = useState([]);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (sortBy === "Mais Curtidas") {
        if (a.likes.length < b.likes.length) return 1;
        if (a.likes.length > b.likes.length) return -1;
      }
      return b.time - a.time;
    });
  }, [posts, sortBy]);

  const [message, setMessage] = useState(
    auth.currentUser.emailVerified ? "None" : "Verificar Email"
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
          const images = ref(storage, auth.currentUser.uid);
          uploadBytes(images, image).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((photoURL) => {
              dbUpdate("users", auth.currentUser.uid, {
                icon: photoURL,
              });

              updateProfile(auth.currentUser, {
                photoURL,
              }).then(() => {
                updated = true;
              });
            });
          });
        });
    });
  }

  function configurarNome() {
    dbUpdate("users", auth.currentUser.uid, {
      name: renaming,
    });

    updateProfile(auth.currentUser, {
      displayName: renaming,
    }).then(() => {
      setRenaming(false);
      updated = true;
    });
  }

  function goToUser(uid) {
    navigation.navigate("User", { uid });
  }

  function goToProfile() {
    navigation.navigate("Profile");
  }

  async function loadPosts() {
    const postList = await dbReadFiltered(
      "posts",
      "writer",
      "==",
      auth.currentUser.uid
    );
    setPosts(postList);
  }

  async function loadUsers() {
    const users = await dbRead("users");

    usersObj = {};

    users.forEach((value) => (usersObj[value.id] = value));
  }

  useEffect(() => {
    loadUsers().then(loadPosts);
  }, [route]);

  useEffect(() => {
    localStorage.sortBy = sortBy;
  }, [sortBy]);

  return (
    <>
      <Header
        title="Seu Perfil"
        lSymbol="home"
        lOnPress={() => {
          updated = false;
          navigation.navigate("Feed", { updated });
        }}
        rSymbol="log-out"
        rOnPress={() => auth.signOut()}
      />
      <Container scroll>
        <Pressable
          onPress={loadPosts}
          style={{
            height: 50,
            aspectRatio: 1,
            borderRadius: "50%",
            justifyContent: "center",
            backgroundColor: colors.primary,
            textAlign: "center",
            userSelect: "none",
            borderWidth: 2,
            borderColor: colors.dark,
            shadowRadius: 10,
            shadowOpacity: 0.2,
          }}
        >
          <Feather name="refresh-cw" size={24} color={colors.dark} />
        </Pressable>
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
        {renaming !== false ? (
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TextInput
              placeholder="Nome"
              style={styles.textField}
              value={renaming}
              onChangeText={setRenaming}
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
              <Feather name="check" size={24} color={colors.dark} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.nameDisplay}>
            <Text style={{ fontWeight: "bold", marginHorizontal: 24 }}>
              {auth.currentUser.displayName}
            </Text>
            <Pressable
              style={{ position: "absolute", alignSelf: "flex-end" }}
              onPress={() => setRenaming("")}
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
                  message === "Verificar Email" ? colors.error : colors.primary,
                userSelect: "none",
                fontWeight: "600",
              }}
            >
              {message}
            </Text>
          </Pressable>
        )}
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            borderRadius: 37,
            borderWidth: 2,
            backgroundColor: colors.background,
            borderColor: colors.dark,
            shadowRadius: 10,
            shadowOpacity: 0.2,
            padding: 10,
          }}
        >
          {sortingOptions.map((value) =>
            value === sortBy ? (
              <Text
                key={value}
                style={{
                  backgroundColor: colors.backgroundDarker,
                  paddingHorizontal: 5,
                  borderRadius: 5,
                }}
              >
                {value}
              </Text>
            ) : (
              <Pressable key={value} onPress={() => setSortBy(value)}>
                <Text
                  style={{
                    paddingHorizontal: 5,
                  }}
                >
                  {value}
                </Text>
              </Pressable>
            )
          )}
        </View>

        {sortedPosts.map((post) => (
          <View
            key={post.id}
            style={{
              width: "90%",
              alignItems: "center",
              borderRadius: 37,
              borderWidth: 2,
              backgroundColor: colors.background,
              borderColor: colors.dark,
              shadowRadius: 10,
              shadowOpacity: 0.2,
              padding: 10,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Image
                style={{
                  height: 50,
                  aspectRatio: 1,
                  borderRadius: "50%",
                  borderWidth: 2,
                  backgroundColor: colors.dark,
                  borderColor: colors.dark,
                }}
                source={auth.currentUser.photoURL}
              />
              <View
                style={{
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  {auth.currentUser.displayName}
                </Text>
                <Text>{post.text.slice(0, 180)}</Text>
              </View>
              <View style={{ gap: 10 }}>
                {post.likes.some((user) => user === auth.currentUser.uid) ? (
                  <Pressable
                    onPress={() => {
                      dbUpdate("posts", post.id, {
                        likes: post.likes.filter(
                          (user) => user !== auth.currentUser.uid
                        ),
                      }).then(loadPosts);
                    }}
                  >
                    <Entypo name="heart" size={16} color={colors.error} />
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => {
                      dbUpdate("posts", post.id, {
                        likes: [...post.likes, auth.currentUser.uid],
                      }).then(loadPosts);
                    }}
                  >
                    <Entypo
                      name="heart-outlined"
                      size={16}
                      color={colors.error}
                    />
                  </Pressable>
                )}
                {post.writer === auth.currentUser.uid && (
                  <Pressable
                    onPress={() =>
                      remove("posts", post.id).then(() => {
                        loadPosts();
                      })
                    }
                  >
                    <Feather name="trash-2" size={16} color={colors.dark} />
                  </Pressable>
                )}
              </View>
              <Text style={{ width: 60 }}>{formatTime(post)}</Text>
            </View>
            {post.likes.length > 0 && (
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text>Curtido por</Text>
                {post.likes.map((userId) => {
                  if (userId === auth.currentUser.uid) {
                    return (
                      <Pressable key={userId}>
                        <Text
                          key={userId}
                          style={{
                            fontWeight: "bold",
                            backgroundColor: colors.backgroundDarker,
                            paddingHorizontal: 5,
                            borderRadius: 5,
                          }}
                        >
                          Você
                        </Text>
                      </Pressable>
                    );
                  }

                  return (
                    <Pressable key={userId} onPress={() => goToUser(userId)}>
                      <Text
                        style={{
                          fontWeight: "bold",
                          backgroundColor: colors.backgroundDarker,
                          paddingHorizontal: 5,
                          borderRadius: 5,
                        }}
                      >
                        {usersObj[userId].name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </Container>
    </>
  );
}
