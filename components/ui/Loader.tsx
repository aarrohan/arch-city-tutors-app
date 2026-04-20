import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Loader() {
  return (
    <View style={styles.loader}>
      <ActivityIndicator />
    </View>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
