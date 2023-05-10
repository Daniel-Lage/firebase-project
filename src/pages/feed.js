import { Image, Pressable, Text, TextInput, View } from "react-native";

import { getAuth } from "firebase/auth";

import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { colors } from "../styles/colors";
import { insert, read, remove, update } from "../functions/dbApi";
import Header from "../components/header";
import Container from "../components/container";
import formatTime from "../functions/formatTime";

var usersObj = {};

export default function Feed({ navigation, route }) {
  const auth = getAuth();

  const [error, setError] = useState("None");
  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState({});

  async function sendPost() {
    if (postText.length > 180) {
      setTimeout(() => setError("None"), 2000);
      return setError("Post não pode incluir mais de 180 caracteres");
    }
    const writer = auth.currentUser.uid;
    const time = new Date().getTime();

    setPostText("");
    insert("posts", writer + time, {
      text: postText,
      likes: [],
      time,
      writer,
    }).then(() => {
      loadPosts();
    });
  }

  async function loadPosts() {
    await read("posts").then((posts) => {
      const postsObj = {};
      posts.forEach((post) => {
        postsObj[post.id] = post;
      });
      setPosts(postsObj);
    });
  }

  async function loadUsers() {
    await read("users").then((users) => {
      usersObj = {};
      users.forEach((value) => (usersObj[value.id] = value));
    });
  }

  useEffect(() => {
    loadUsers().then(loadPosts());
  }, [route]);

  return (
    <>
      <Header
        title="Página Inicial"
        lSymbol="user"
        lOnPress={() => {
          navigation.navigate("Profile");
        }}
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            gap: 10,
            backgroundColor: colors.primary,
            alignItems: "center",
            justifyContent: "center",
            padding: 10,
          }}
        >
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
            }}
          >
            <AntDesign name="reload1" size={24} color={colors.dark} />
          </Pressable>
        </View>
      </Header>
      <Container scroll>
        {Object.entries(posts).map(([id, post]) => (
          <View
            key={id}
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
                source={usersObj[post.writer].icon}
              />
              <View
                style={{
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>
                  {usersObj[post.writer].name}
                </Text>
                <Text>{post.text.slice(0, 180)}</Text>
              </View>
              <View style={{ gap: 10 }}>
                {post.likes.some((user) => user === auth.currentUser.uid) ? (
                  <Pressable
                    onPress={() => {
                      update("posts", id, {
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
                      update("posts", id, {
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
                {usersObj[post.writer].uid === auth.currentUser.uid && (
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
                    );
                  }

                  return (
                    <Text
                      key={userId}
                      style={{
                        fontWeight: "bold",
                        backgroundColor: colors.backgroundDarker,
                        paddingHorizontal: 5,
                        borderRadius: 5,
                      }}
                    >
                      {usersObj[userId].name}
                    </Text>
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
