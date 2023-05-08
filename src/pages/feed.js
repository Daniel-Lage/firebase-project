import { Image, Pressable, Text, TextInput, View } from "react-native";

import { getAuth } from "firebase/auth";

import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { colors } from "../styles/colors";
import { insert, read } from "../functions/dbApi";
import formatTime from "../functions/formatTime";
import Header from "../components/header";
import Container from "../components/container";

const usersObject = {};

export default function Feed({ navigation, route }) {
  const auth = getAuth();

  const [postText, setPostText] = useState("");
  const [posts, setPosts] = useState([]);

  async function sendPost() {
    if (postText.length > 180) return;
    const writer = auth.currentUser.uid;
    const time = new Date().getTime();
    const postTitle = writer + time;
    const post = {
      text: postText,
      time,
      writer,
    };

    setPostText("");
    insert("posts", postTitle, post).then(() => {
      loadPosts();
    });
  }

  function loadPosts() {
    read("posts").then((posts) => {
      setPosts(
        posts.map(({ id, text, time, writer }) => ({
          id,
          text,
          time,
          writer: usersObject[writer],
        }))
      );
    });
  }

  useEffect(() => {
    read("users").then((users) => {
      users.forEach((value) => (usersObject[value.id] = value));
      loadPosts();
    });
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
            onError={() => setPhotoURL(null)}
            source={auth.currentUser.photoURL}
          />
          <TextInput
            style={{
              flex: 1,
              height: 30,
              paddingLeft: 10,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: colors.dark,
              backgroundColor: colors.backgroundDarker,
            }}
            value={postText}
            onChangeText={setPostText}
            placeholder="Escreva seu Post"
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
                height: 50,
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
                height: 50,
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
        {posts.map((post) => (
          <View
            key={post.id}
            style={{
              width: "90%",
              flexDirection: "row",
              gap: 10,
              padding: 10,
              borderRadius: 37,
              borderWidth: 2,
              borderColor: colors.dark,
              shadowRadius: 10,
              shadowOpacity: 0.2,
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
              source={post.writer.icon}
            />
            <View
              style={{
                flex: 1,
                overflow: "hidden",
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{post.writer.name}</Text>
              <Text>{post.text.slice(0, 180)}</Text>
            </View>
            <View style={{ gap: 10 }}>
              <Pressable onPress={() => {}}>
                <Feather name="message-circle" size={16} color={colors.dark} />
              </Pressable>
              {post.writer.uid === auth.currentUser.uid && (
                <Pressable
                  onPress={() =>
                    collectionDelete("posts", post.id).then(() => {
                      loadPosts();
                    })
                  }
                >
                  <Feather name="trash-2" size={16} color={colors.error} />
                </Pressable>
              )}
            </View>
            <Text style={{ width: 60 }}>{formatTime(post)}</Text>
          </View>
        ))}
      </Container>
    </>
  );
}
