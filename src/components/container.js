import { View } from "react-native";
import { colors } from "../styles/colors";

export default function Container({ children, scroll }) {
  return (
    <View
      style={{
        flex: 1,
        width: "100%",
        paddingVertical: 10,
        gap: 10,
        backgroundColor: colors.background,
        alignItems: "center",
        overflowY: scroll ? "scroll" : "auto",
        paddingTop: scroll ? 10 : "15%",
      }}
    >
      {children}
    </View>
  );
}
