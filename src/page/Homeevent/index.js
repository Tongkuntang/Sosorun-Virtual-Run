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
import BottomBar from "../Home/bottombar";
import HeaderHome from "../components/headerHome";
const { width, height } = Dimensions.get("window");
export default function startRun({ navigation }) {
  const [page, setpage] = useState(0);
  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
          height: height,
          backgroundColor: "#FCC81D",
        }}
      >
        <View style={{ position: "absolute", zIndex: 99 }}>
          <SafeAreaView />
          <HeaderHome navigation={navigation} />
        </View>
        <View>
          <Image
            // resizeMode={"stretch"}
            source={{
              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/event.png",
            }}
            style={styles.img}
          />
          <View
            style={{
              height: height * 0.45,
            }}
          ></View>
          <Text style={styles.text}>EVENTS</Text>
        </View>
        <View style={styles.viewdetail}>
          <Text style={styles.textdetail}>
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              position: "absolute",
              width: width,
              paddingHorizontal: 10,
              bottom: 70,
            }}
          >
            <TouchableOpacity
              disabled
              onPress={() => navigation.navigate("Continue")}
              style={[styles.bottonstart1, { opacity: 0.2 }]}
            >
              <Text style={styles.textstart}>CONTUNUE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled
              onPress={() => navigation.navigate("Event")}
              style={[styles.bottonstart, { opacity: 0.2 }]}
            >
              <Text style={styles.textstart}>START</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View>
        <BottomBar navigation={navigation} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1 },
  img: {
    width: width,
    height: height * 0.56,
    position: "absolute",
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 50,
    marginTop: 20,
    paddingLeft: 20,
    color: "#fff",
    fontStyle: "italic",
    fontWeight: "700",
  },
  viewdetail: {
    paddingTop: 20,
    paddingHorizontal: 20,
    flex: 1,
  },
  textdetail: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#fff",
    lineHeight: 25,
  },
  bottonstart: {
    width: 95,
    height: 48,
    backgroundColor: "#393939",
    marginTop: 50,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  bottonstart1: {
    width: 150,
    height: 48,
    backgroundColor: "#393939",
    marginTop: 50,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  textstart: {
    fontFamily: "Prompt-Regular",
    fontSize: 26,
    color: "#fff",
    alignSelf: "center",
    fontStyle: "italic",
    fontWeight: "700",
  },
});
