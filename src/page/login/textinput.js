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
export default function textInput({
  icon,
  placeholder,
  onChangeText,
  defaultValue,
  maxLength,
  autoCapitalize,
  secureTextEntry,
}) {
  return (
    <View style={styles.container}>
      {icon == "user" && (
        <Image
          source={{
            uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/User.png",
          }}
          style={styles.img}
        />
      )}
      {icon == "Email" && (
        <Image
          source={{
            uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Email.png",
          }}
          style={styles.img1}
        />
      )}
      {icon == "lock" && (
        <Image
          source={{
            uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/lock.png",
          }}
          style={styles.img}
        />
      )}
      <View>
        <TextInput
          placeholder={({ color: "#AFAFAF" }, placeholder)}
          onChangeText={onChangeText}
          style={styles.input}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
        />
      </View>
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
    width: width * 0.8,
    height: 50,
    fontFamily: "Prompt-Regular",
    color: "#393939",
    paddingLeft: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  img: {
    width: 20,
    height: 19,
    marginRight: -30,
    zIndex: 99,
  },
  img1: {
    width: 20,
    height: 16,
    marginRight: -30,
    zIndex: 99,
  },
});
