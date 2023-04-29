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
    width: 200,
    height: 40,
    borderRadius: 5,
    textAlign: "center",
    borderWidth: 2,
    borderColor: colors.dark,
    backgroundColor: colors.backgroundDarker,
  },
  mainButton: {
    width: 100,
    height: 40,
    justifyContent: "center",
    backgroundColor: colors.primary,
    textAlign: "center",
    borderRadius: 5,
    userSelect: "none",
  },
  otherButton: {
    width: 100,
    height: 40,
    justifyContent: "center",
    textAlign: "center",
    userSelect: "none",
  },
});