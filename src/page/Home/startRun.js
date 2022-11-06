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
import { lans } from "../../reducer/reducer/reducer/Atom";
import { useRecoilValue } from "recoil";
const { width, height } = Dimensions.get("window");
export default function startRun({ navigation }) {
  const [page, setpage] = useState(0);
  const lan = useRecoilValue(lans);
  return (
    <View style={{ height: height }}>
      <SafeAreaView />
      <View>
        <Image
          // resizeMode={"stretch"}
          source={{
            uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/home1.png",
          }}
          style={styles.img}
        />
        <View
          style={{
            height: height * 0.45,
          }}
        ></View>
        <Text style={styles.text}>START RUN</Text>
      </View>
      <View style={styles.viewdetail}>
        <Text style={styles.textdetail}>
          {lan == "th"
            ? `สนุกไปกับการวิ่งของคุณในทุกๆวัน เพื่อสุขภาพ และ เก็บสะสมระยะทาง เพื่อรับ GOLD ไว้ใช้แลก ส่วนลดต่างๆ`
            : "Enjoy your running every day for your health. and collect distance to get GOLD to redeem various discounts"}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("Countdown")}
          style={styles.bottonstart}
        >
          <Text style={styles.textstart}>
            {lan == "th" ? "เริ่มวิ่ง" : "START"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  img: {
    width: width,
    height: height * 0.55,
    position: "absolute",
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 50,
    marginTop: 10,
    paddingLeft: 20,
    color: "#fff",
    fontStyle: "italic",
    fontWeight: "700",
    justifyContent: "flex-end",
  },
  viewdetail: {
    paddingHorizontal: 10,
    marginTop: 10,
  },
  textdetail: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#fff",
    lineHeight: 25,
  },
  bottonstart: {
    width: 95,
    height: 45,
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
