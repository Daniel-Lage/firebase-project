import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: colors.primary,
    color: colors.dark,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    gap: 10,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    color: colors.dark,
  },
});
