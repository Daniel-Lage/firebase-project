import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Start({
  navigation,
  route: {
    params: { user },
  },
}) {
  console.log(user);
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
            navigation.navigate("Login");
          }}
        >
          <Text>Sair</Text>
        </Pressable>
        <Text style={{ fontWeight: "bold", userSelect: "none" }}>
          Firebased
        </Text>
      </View>
      <View style={styles.container}>
        <Text>Welcome {user.email}!</Text>
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
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
