import { StyleSheet } from "react-native";
import { colors } from "./colors";

export const styles = StyleSheet.create({
  header: {
    width: "100%",
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  container: {
    flex: 1,
    gap: 10,
    backgroundColor: colors.background,
    alignItems: "center",
  },
  toPost: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    backgroundColor: colors.toPost,
    alignItems: "center",
    padding: 10,
  },
  post: {
    width: "90%",
    flexDirection: "row",
    gap: 10,
    backgroundColor: colors.post,
    alignItems: "center",
    padding: 10,
    borderRadius: 45,
  },
  textField: {
    flex: 1,
    height: 40,
    borderRadius: 5,
    textAlign: "center",
    borderWidth: 2,
    borderColor: colors.dark,
    backgroundColor: colors.backgroundDarker,
  },
  mainButton: {
    height: 72,
    width: 72,
    borderRadius: 36,
    justifyContent: "center",
    backgroundColor: colors.primary,
    textAlign: "center",
    userSelect: "none",
    fontWeight: "bold",
    fontFamily: "system-ui",
  },
  image: {
    height: 72,
    width: 72,
    borderRadius: 36,
  },
});
