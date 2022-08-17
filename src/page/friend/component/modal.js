import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  TouchableHighlight,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Modal,
  ImageBackground,
} from "react-native";
import { FontAwesome5, AntDesign, Fontisto } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function index({ navigation, route, setVisible }) {
  const [search, setsearch] = useState("");
  return (
    <SafeAreaView
      style={{
        width: width,
        height: height,
        backgroundColor: "#000000bb",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
      }}
    ></SafeAreaView>
  );
}
