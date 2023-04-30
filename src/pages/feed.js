import { Image, Pressable, Text, TextInput, View } from "react-native";

import { getAuth } from "firebase/auth";

import { Feather } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { styles } from "../styles/feed";
import {
  collectionDelete,
  collectionGet,
  collectionPost,
} from "../functions/dbApi";

const usersObject = {};

export default function Feed({ navigation, route }) {
  const auth = getAuth();
  const postTextInput = useRef();
  const [posts, setPosts] = useState([]);

  async function sendPost() {
    const writer = auth.currentUser.uid;
    const time = new Date().getTime();
    const postTitle = writer + time;
    const post = {
      text: postTextInput.current.value,
      time,
      writer,
    };

    postTextInput.current.value = "";

    collectionPost("posts", postTitle, post).then(() => {
      loadPosts();
    });
  }

  function loadPosts() {
    collectionGet("posts").then((posts) => {
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
    collectionGet("users").then((users) => {
      users.forEach((value) => (usersObject[value.id] = value));
      loadPosts();
    });
  }, [route]);

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
            navigation.navigate("Profile");
          }}
        >
          <Feather name="user" size={24} color="black" />
        </Pressable>
        <Text style={{ fontWeight: "bold", userSelect: "none" }}>
          Página Inicial
        </Text>
      </View>
      <View style={styles.container}>
        <View style={styles.toPost}>
          <Image
            style={styles.image}
            onError={() => setPhotoURL(null)}
            source={auth.currentUser.photoURL}
          />
          <TextInput
            style={styles.textField}
            ref={postTextInput}
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
          <Pressable onPress={sendPost} style={styles.sendButton}>
            <Feather name="send" size={24} color="black" />
          </Pressable>
          <Pressable onPress={loadPosts} style={styles.sendButton}>
            <AntDesign name="reload1" size={24} color="black" />
          </Pressable>
        </View>
        {posts.map((post) => {
          const since = Date.now() - post.time;

          var time;
          const limits = [1000, 60000, 3600000, 86400000];
          const measures = ["segundo", "minuto", "hora"];
          const index = limits.findIndex((value) => since < value);

          switch (index) {
            case -1:
              const currDate = new Date();
              const postDate = new Date(post.time);
              if (currDate.getFullYear() === postDate.getFullYear())
                time = [postDate.getDate(), postDate.getMonth() + 1].join("/");
              else
                time = [
                  postDate.getDate(),
                  postDate.getMonth() + 1,
                  postDate.getFullYear(),
                ].join("/");
              break;
            case 0:
              time = "agora";
              break;
            default:
              const amount = Math.floor(since / limits[index - 1]);
              const name = measures[index - 1];
              time = [amount, name + (amount > 1 ? "s" : ""), "atrás"].join(
                " "
              );
              break;
          }

          return (
            <View key={post.id} style={styles.post}>
              <Image style={styles.image} source={post.writer.icon} />
              <Text style={{ fontWeight: "bold" }}>{post.writer.name}</Text>
              <Text style={{ flex: 1 }}>{post.text}</Text>
              <Text>{time}</Text>
              {post.writer.uid === auth.currentUser.uid && (
                <Pressable
                  onPress={() => {
                    console.log;
                    collectionDelete("posts", post.id).then(() => {
                      loadPosts();
                    });
                  }}
                  style={styles.deleteButton}
                >
                  <Feather name="trash-2" size={24} color="black" />
                </Pressable>
              )}
            </View>
          );
        })}
      </View>
    </>
  );
}
