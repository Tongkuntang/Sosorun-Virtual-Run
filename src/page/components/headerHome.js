import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
const { width, height } = Dimensions.get("window");
export default function headerHome({ navigation }) {
  return (
    <View
      style={{
        width: width,
        height: 55,
        justifyContent: "center",
      }}
    >
      <SafeAreaView />
      <TouchableOpacity
        onPress={() => {
          navigation.openDrawer();
        }}
      >
        <Image
          source={{
            uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Menu.png",
          }}
          style={{
            width: 16,
            height: 16,
            alignSelf: "flex-start",
            marginLeft: 10,
          }}
        />
      </TouchableOpacity>
    </View>
  );
}
