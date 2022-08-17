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
export default function headerfree({ navigation }) {
  return (
    <View style={styles.view}>
      <TouchableOpacity
        onPress={() => {
          navigation.openDrawer();
        }}
      >
        <Image
          source={{
            uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Menu.png",
          }}
          style={styles.imgdrawer}
        />
      </TouchableOpacity>
      <View style={styles.smallview}>
        <TouchableOpacity
          style={{ alignSelf: "center", justifyContent: "center" }}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={{
              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/logo_sosorun.png",
            }}
            style={styles.img}
          />
        </TouchableOpacity>
        <View style={styles.nonti}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Bag")}
            style={{ justifyContent: "center" }}
          >
            <FontAwesome5 name="shopping-bag" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={{ justifyContent: "center" }}>
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
    width: width * 0.65,
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
    fontSize: 18,
    color: "#717171",
    alignSelf: "center",
  },
});
