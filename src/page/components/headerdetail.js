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
import {
  FontAwesome5,
  Fontisto,
  FontAwesome,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
const { width, height } = Dimensions.get("window");
export default function headerdetail({ item, navigation, goBack }) {
  return (
    <View style={styles.view}>
      <TouchableOpacity
        onPress={() => {
          try {
            goBack();
          } catch (error) {
            navigation.goBack();
          }
        }}
        style={styles.touchback}
      >
        <Fontisto
          name="angle-left"
          size={25}
          color="black"
          style={{ alignSelf: "center" }}
        />
      </TouchableOpacity>
      <View style={styles.smallview}>
        <View style={{ width: width * 0.6, alignSelf: "center" }}>
          <Text style={styles.text}>{item}</Text>
        </View>
        <View style={styles.nonti}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Bag")}
            style={{ justifyContent: "center" }}
          >
            <FontAwesome5 name="shopping-bag" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notification")}
            style={{ justifyContent: "center" }}
          >
            <Ionicons name="ios-notifications" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  view: {
    width: width,
    height: 55,
    justifyContent: "center",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imgdrawer: {
    width: 16,
    height: 16,
    alignSelf: "center",
    marginLeft: 10,
    marginTop: 20,
  },
  smallview: {
    width: width * 0.8,
    flexDirection: "row",
    justifyContent: "space-between",
    marginRight: 20,
  },
  img: {
    width: 118,
    height: 31,
    alignSelf: "center",
    marginRight: 20,
  },
  nonti: {
    flexDirection: "row",
    width: width * 0.15,
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 17,
    color: "#717171",
    alignSelf: "center",
    textAlign: "center",
  },
  touchback: {
    justifyContent: "center",
    marginLeft: 20,
  },
});
