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
    justifyContent: "center",
  },
  textField: {
    width: 144,
    height: 40,
    borderRadius: 5,
    textAlign: "center",
    borderWidth: 2,
    borderColor: colors.dark,
    backgroundColor: colors.backgroundDarker,
  },
  nameDisplay: {
    width: 144,
    height: 40,
    borderRadius: 5,
    textAlign: "center",
    justifyContent: "center",
  },
  image: {
    height: 144,
    width: 144,
    backgroundColor: colors.backgroundDarker,
    borderRadius: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  mainButton: {
    width: 72,
    height: 40,
    justifyContent: "center",
    backgroundColor: colors.error,
    textAlign: "center",
    borderRadius: 5,
    userSelect: "none",
  },
});
