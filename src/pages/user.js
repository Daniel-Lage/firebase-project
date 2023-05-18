import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { getAuth } from "firebase/auth";

import { Feather } from "@expo/vector-icons";
import { colors } from "../styles/colors";
import { styles } from "../styles/profile";
import { dbRead, dbReadFiltered, dbUpdate } from "../functions/dbApi";
import Header from "../components/header";
import Container from "../components/container";
import { Entypo } from "@expo/vector-icons";
import formatTime from "../functions/formatTime";

const sortingOptions = ["Mais Curtidas", "Recente"];
var usersObj = {};

export default function User({ navigation, route }) {
  const auth = getAuth();

  const [user, setUser] = useState({});
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

  async function loadUsers() {
    const users = await dbRead("users");

    usersObj = {};

    users.forEach((value) => (usersObj[value.id] = value));
  }

  function goToUser(uid) {
    if (uid === route.params.uid) return;
    navigation.navigate("User", { uid });
  }

  function goToProfile() {
    navigation.navigate("Profile");
  }

  async function loadPosts() {
    const { uid } = route.params;
    const postList = await dbReadFiltered("posts", "writer", "==", uid);
    setPosts(postList);
  }

  useEffect(() => {
    const { uid } = route.params;
    loadUsers().then(() => {
      setUser(usersObj[uid]);
      loadPosts();
    });
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
          navigation.navigate("Feed");
        }}
        rSymbol="user"
        rOnPress={goToProfile}
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
        {user && <Image style={styles.image} source={user.icon} />}
        <View style={styles.nameDisplay}>
          <Text style={{ fontWeight: "bold", marginHorizontal: 24 }}>
            {user.name}
          </Text>
        </View>
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
                source={user.icon}
              />
              <View
                style={{
                  flex: 1,
                  overflow: "hidden",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>{user.name}</Text>
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
                      <Pressable key={userId} onPress={goToProfile}>
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
