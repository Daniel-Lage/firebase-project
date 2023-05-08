import { Pressable, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "../styles/colors";

export default function Header({
  title,
  lSymbol,
  lOnPress,
  rSymbol,
  rOnPress,
  children,
}) {
  return (
    <View
      style={{
        width: "100%",
        borderBottomWidth: 2,
        borderBottomColor: colors.dark,
        shadowRadius: 10,
        shadowOpacity: 0.2,
        zIndex: 1,
      }}
    >
      <View
        style={{
          width: "100%",
          height: 42,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {Boolean(lSymbol) && (
          <Pressable
            style={{
              position: "absolute",
              alignSelf: "flex-start",
              marginLeft: 10,
            }}
            onPress={lOnPress}
          >
            <Feather name={lSymbol} size={24} color={colors.dark} />
          </Pressable>
        )}
        <Text style={{ fontWeight: "bold", userSelect: "none" }}>{title}</Text>
        {Boolean(rSymbol) && (
          <Pressable
            style={{
              position: "absolute",
              alignSelf: "flex-end",
              marginRight: 10,
            }}
            onPress={rOnPress}
          >
            <Feather name={rSymbol} size={24} color={colors.dark} />
          </Pressable>
        )}
      </View>
      {children}
    </View>
  );
}
