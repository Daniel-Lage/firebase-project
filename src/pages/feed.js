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
          const since = new Date().getTime() - post.time;

          var time;

          if (since < 1000) {
            time = "Now";
          } else {
            var measure;
            if (since < 60000) {
              measure = { amount: Math.floor(since / 1000), name: " Segundo" };
            } else if (since < 360000) {
              measure = { amount: Math.floor(since / 60000), name: " Minuto" };
            } else if (since < 86400000) {
              measure = { amount: Math.floor(since / 360000), name: " Hora" };
            } else {
              measure = { amount: Math.floor(since / 86400000), name: " Dia" };
            }
            time =
              measure.amount + measure.name + (measure.amount > 1 ? "s" : "");
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
                    collectionDelete("posts", post.writer.uid + post.time).then(
                      () => {
                        loadPosts();
                      }
                    );
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
