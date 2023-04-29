import { Image, Pressable, Text, TextInput, View } from "react-native";

import { getAuth } from "firebase/auth";

import { AntDesign } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { styles } from "../styles/feed";
import { getPosts, postPost } from "../functions/postsApi";
import { Timestamp } from "firebase/firestore";

export default function Feed({ navigation }) {
  const auth = getAuth();
  const postTextInput = useRef();
  const [posts, setPosts] = useState(null);

  function loadPosts() {
    getPosts().then((posts) => {
      setPosts(posts);
    });
  }

  useEffect(() => {
    loadPosts();
  }, []);

  console.log(posts);

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
          <AntDesign name="user" size={24} color="black" />
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
          />
          <Pressable
            onPress={() => {
              const writer = auth.currentUser;
              const now = new Date();
              const postId = writer.uid + now.getTime();
              const post = {
                icon: writer.photoURL,
                text: postTextInput.current.value,
                time: now,
                uid: writer.uid,
                writer: writer.displayName,
              };

              postPost(postId, post).then(() => {
                loadPosts();
              });
            }}
            style={styles.mainButton}
          >
            <Text>Enviar</Text>
          </Pressable>
        </View>
        {posts?.map((post) => {
          const since = new Date().getTime() - post.time.toDate().getTime();

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
              <Image style={styles.image} source={post.icon} />
              <Text>{post.writer}</Text>
              <Text>{post.text}</Text>
              <Text>{time}</Text>
            </View>
          );
        })}
      </View>
    </>
  );
}
