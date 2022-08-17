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
export default function startRun({ navigation }) {
  const [page, setpage] = useState(0);
  return (
    <View style={{ flex: 1 }}>
      <View>
        <Image
          // resizeMode={"stretch"}
          source={{
            uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/chaa.png",
          }}
          style={styles.img}
        />
        <View
          style={{
            height: height * 0.45,
          }}
        ></View>
        <Text style={styles.text}>CHALLENGES</Text>
      </View>
      <View style={styles.viewdetail}>
        <Text style={styles.textdetail}>
          สนุกไปกับการวิ่งของคุณในทุกๆวัน เพื่อสุขภาพ และ เก็บสะสมระยะทาง
          เพื่อรับ GOLD ไว้ใช้แลก ส่วนลดต่างๆ
        </Text>
        <TouchableOpacity
          onPress={() => alert("Coming Soon")}
          style={styles.bottonstart}
        >
          <Text style={styles.textstart}>START</Text>
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
