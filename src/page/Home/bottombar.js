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
export default function bottombar({ navigation }) {
  const [page, setpage] = useState(0);
  return (
    <View style={{ position: "absolute", bottom: -30 }}>
      <View style={[styles.background, { height: null, alignItems: "center" }]}>
        <SafeAreaView style={styles.background}>
          <View style={styles.view}>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={{ justifyContent: "center" }}
            >
              <FontAwesome
                name="home"
                size={25}
                color="#000"
                style={{ alignSelf: "center", marginLeft: 20 }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Event")}
              style={{ justifyContent: "center" }}
            >
              <MaterialCommunityIcons
                name="map-marker-path"
                size={24}
                color="#fff"
                style={{ alignSelf: "center" }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Account")}
              style={{ justifyContent: "center" }}
            >
              <Ionicons
                name="settings-outline"
                size={24}
                color="#fff"
                style={{ alignSelf: "center" }}
              />
            </TouchableOpacity>
          </View>
          <Image
            source={{
              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/logo_sosorun.png",
            }}
            style={styles.img}
          />
        </SafeAreaView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  background: {
    backgroundColor: "#FFD650",
    height: 52,
    width: width,
    borderWidth: 0.2,
    borderColor: "#707070",
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 0,
    marginBottom: 15,
  },
  view: {
    flexDirection: "row",
    width: width * 0.5,
    justifyContent: "space-between",
  },
  img: {
    width: 118,
    height: 31,
    alignSelf: "center",
    marginRight: 20,
  },
});
