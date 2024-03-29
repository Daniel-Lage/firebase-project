import { Image, Pressable, Text, TextInput, View } from "react-native";

import { getAuth } from "firebase/auth";

import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { colors } from "../styles/colors";
import { dbCreate, dbRead, dbDelete, dbUpdate } from "../functions/dbApi";
import Header from "../components/header";
import Container from "../components/container";
import formatTime from "../functions/formatTime";

var usersObj = {};

const sortingOptions = ["Mais Curtidas", "Recente"];

export default function Feed({ navigation, route }) {
  const auth = getAuth();

  const [error, setError] = useState("None");
  const [postText, setPostText] = useState("");
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

  async function sendPost() {
    if (postText.length > 180) {
      setTimeout(() => setError("None"), 2000);
      return setError("Post não pode incluir mais de 180 caracteres");
    }
    const writer = auth.currentUser.uid;
    const time = new Date().getTime();

    setPostText("");
    dbCreate("posts", writer + time, {
      text: postText,
      likes: [],
      time,
      writer,
    }).then(() => {
      loadPosts();
    });
  }

  function goToUser(uid) {
    navigation.navigate("User", { uid });
  }

  function goToPost(id) {
    navigation.navigate("Post", { id });
  }

  function goToProfile() {
    navigation.navigate("Profile", { updated: true });
  }

  async function loadPosts() {
    const postList = await dbRead("posts");
    setPosts(postList);
  }

  async function loadUsers() {
    const users = await dbRead("users");

    usersObj = {};

    users.forEach((value) => (usersObj[value.id] = value));
  }

  useEffect(() => {
    loadUsers().then(loadPosts());
  }, [route]);

  useEffect(() => {
    localStorage.sortBy = sortBy;
  }, [sortBy]);

  return (
    <>
      <Header title="Página Inicial" lSymbol="user" lOnPress={goToProfile} />
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
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            backgroundColor: colors.background,
            borderRadius: 37,
            borderWidth: 2,
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
        <View
          style={{
            width: "90%",
            flexDirection: "row",
            gap: 10,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 37,
            borderWidth: 2,
            borderColor: colors.dark,
            shadowRadius: 10,
            shadowOpacity: 0.2,
            padding: 10,
          }}
        >
          <Pressable onPress={goToProfile}>
            <Image
              style={{
                height: 50,
                aspectRatio: 1,
                borderRadius: "50%",
                borderWidth: 2,
                borderColor: colors.dark,
              }}
              source={auth.currentUser.photoURL}
            />
          </Pressable>
          <Text
            style={{
              position: "absolute",
              top: -5,
              color: error === "None" ? "transparent" : colors.error,
            }}
          >
            {error}
          </Text>
          <TextInput
            style={{
              flex: 1,
              height: 30,
              paddingLeft: 10,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: error === "None" ? colors.dark : colors.error,
              backgroundColor: colors.backgroundDarker,
            }}
            value={postText}
            onChangeText={setPostText}
            placeholder="Escreva seu post"
            onKeyPress={(e) => {
              switch (e.code) {
                case "Enter":
                case "NumpadEnter":
                  sendPost();
                  break;
              }
            }}
          />
          {postText.length > 180 ? (
            <View
              style={{
                height: 30,
                aspectRatio: 1,
                borderRadius: "50%",
                backgroundColor: colors.error,
                borderWidth: 2,
                borderColor: colors.dark,
              }}
            ></View>
          ) : (
            <View
              style={{
                height: 30,
                aspectRatio: 1,
                borderRadius: "50%",
                backgroundImage: `conic-gradient(${colors.background} ${
                  postText.length / 1.8
                }%, transparent ${postText.length / 1.8}%)`,
                borderWidth: 2,
                borderColor: colors.dark,
              }}
            ></View>
          )}

          <Pressable
            onPress={sendPost}
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
            }}
          >
            <Feather name="send" size={24} color={colors.dark} x />
          </Pressable>
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
              <Pressable
                onPress={() => {
                  if (post.writer === auth.currentUser.uid) goToProfile();
                  else goToUser(post.writer);
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
                  source={usersObj[post.writer].icon}
                />
              </Pressable>
              <View
                style={{
                  flex: 1,
                  overflow: "hidden",
                  alignItems: "flex-start",
                }}
              >
                <Pressable
                  onPress={() => {
                    if (post.writer === auth.currentUser.uid) goToProfile();
                    else goToUser(post.writer);
                  }}
                >
                  <Text style={{ fontWeight: "bold" }}>
                    {usersObj[post.writer].name}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    goToPost(post.id);
                  }}
                >
                  <Text>{post.text.slice(0, 180)}</Text>
                </Pressable>
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
                      dbDelete("posts", post.id).then(() => {
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
                      <Pressable key={userId} onPress={goToProfile}>
                        <Text
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
