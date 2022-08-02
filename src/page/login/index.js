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
import Register from "./register";
import LoGin from "./login";
const { width, height } = Dimensions.get("window");
export default function index({ navigation }) {
  const [page, setpage] = useState(0);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <View style={styles.background}>
          <SafeAreaView />
          <Image
            source={{
              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/soso1.png",
            }}
            style={styles.imgbackground}
          />
          <Image
            resizeMode="contain"
            source={require("../../img/lo_hor.png")}
            style={styles.imglogo}
          />
        </View>
        <View style={styles.viewpage}>
          <TouchableOpacity
            onPress={() => setpage(0)}
            style={[
              styles.bottompage,
              {
                backgroundColor: page ? "#788995" : "#FCC81D",
                borderBottomWidth: page ? 0 : 5,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 12,
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              LOGIN
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setpage(1)}
            style={[
              styles.bottompage,
              {
                backgroundColor: page == 0 ? "#788995" : "#FCC81D",
                borderBottomWidth: page == 0 ? 0 : 5,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 12,
                alignSelf: "center",
                fontWeight: "bold",
              }}
            >
              SIGN UP
            </Text>
          </TouchableOpacity>
        </View>
        {page == 1 && <Register setpage={setpage} navigation={navigation} />}
        {page == 0 && <LoGin setpage={setpage} navigation={navigation} />}
        {/* </View> */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  background: {
    width: width,
    height: height * 0.25,
    backgroundColor: "#788995",
    justifyContent: "center",
  },
  imgbackground: {
    width: width,
    height: height * 0.25,
    position: "absolute",
    zIndex: 99,
  },
  imglogo: {
    width: 277,
    height: 74,
    alignSelf: "center",
  },
  viewpage: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
    marginTop: -37,
  },
  bottompage: {
    width: 115,
    height: 37,
    borderColor: "#707070",
    justifyContent: "center",
  },
  textpage: {
    fontFamily: "Prompt-Regular",
    fontSize: 12,
    alignSelf: "center",
  },
});
