import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  FlatList,
  TextInput,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
export default function input({
  placeholder,
  onChangeText,
  defaultValue,
  maxLength,
}) {
  useEffect(() => {
    // console.log("****************************", defaultValue);
  }, [defaultValue]);
  return (
    <View style={styles.container}>
      <TextInput
        onChangeText={onChangeText}
        placeholder={({ color: "#AFAFAF" }, placeholder)}
        style={styles.input}
        defaultValue={defaultValue}
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
  },
  input: {
    width: width * 0.8,
    height: 33,
    fontFamily: "Prompt-Regular",
    color: "#000000",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D1D1",
  },
});
