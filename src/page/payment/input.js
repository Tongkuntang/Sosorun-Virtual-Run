import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
const { width, height } = Dimensions.get("window");
export default function input({
  defaultValue,
  placeholder,
  onChangeText,
  maxLength,
}) {
  return (
    <View>
      <TextInput
        defaultValue={defaultValue}
        placeholder={({ color: "#AFAFAF" }, placeholder)}
        style={styles.input}
        onChangeText={onChangeText}
        maxLength={maxLength}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    alignItems: "center",
    marginTop: 20,
  },
  input: {
    width: width * 0.9,
    height: 50,
    fontFamily: "Prompt-Regular",
    color: "#393939",
    paddingLeft: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginVertical: 10,
  },
});
