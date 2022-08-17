import { useIsFocused } from "@react-navigation/core";
import React, { useEffect, useState } from "react";
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
import { useRecoilValue } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { apiservice } from "../../service/service";
const { width, height } = Dimensions.get("window");
export default function startRun({ navigation }) {
  const [page, setpage] = useState(0);
  const token = useRecoilValue(tokenState);
  const user = useRecoilValue(userState);
  const focus = useIsFocused();
  useEffect(() => {
    callApi();
  }, [focus]);

  async function callApi() {
    const response = await apiservice({
      path: "/event/getmyEvent/" + user.id,
      token: token.accessToken,
    });

    setpage(
      response.data.data.filter(
        (item) => item.last_distance <= item.total_distance
      ).length
    );
  }

  return (
    <View style={{ flex: 1 }}>
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
          สนุกไปกับการวิ่งของคุณในทุกๆวัน เพื่อสุขภาพ และ เก็บสะสมระยะทาง
          เพื่อรับ GOLD ไว้ใช้แลก ส่วนลดต่างๆ
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: width,
            paddingHorizontal: 20,
            // marginTop: -5,
          }}
        >
          {page > 0 ? (
            <TouchableOpacity
              onPress={() => navigation.navigate("Continue")}
              style={[styles.bottonstart1]}
            >
              <Text style={styles.textstart}>CONTUNUE</Text>
            </TouchableOpacity>
          ) : (
            <View />
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate("Event")}
            style={[styles.bottonstart]}
          >
            <Text style={styles.textstart}>START</Text>
          </TouchableOpacity>
        </View>
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
    // alignSelf: "flex-end",
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
  bottonstart1: {
    width: 150,
    height: 48,
    backgroundColor: "#393939",
    marginTop: 50,
    // alignSelf: "flex-end",
    justifyContent: "center",
  },
});
