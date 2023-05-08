import { View } from "react-native";
import { colors } from "../styles/colors";

export default function Menu({ children }) {
  return (
    <View
      style={{
        padding: 10,
        gap: 10,
        position: "absolute",
        padding: 20,
        borderRadius: 20,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: colors.background,
        alignItems: "center",
        borderWidth: 2,
        borderColor: colors.dark,
        shadowRadius: 10,
        shadowOpacity: 0.2,
      }}
    >
      {children}
    </View>
  );
}
