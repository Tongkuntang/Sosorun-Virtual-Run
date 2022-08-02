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
export default function headerHome({ navigation, onPress }) {
  return (
    <View style={styles.view}>
      <TouchableOpacity onPress={onPress} style={styles.touchback}>
        <Fontisto
          name="angle-left"
          size={25}
          color="black"
          style={{ alignSelf: "center" }}
        />
      </TouchableOpacity>
      <View style={styles.smallview}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={{ justifyContent: "center" }}
        >
          <Image
            // source={{
            //   uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/logo_sosorun.png",
            // }}
            resizeMode="contain"
            source={require("../../img/lo_hor.png")}
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
    height: height * 0.08,
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  touchback: {
    justifyContent: "center",
    marginLeft: 20,
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
});
