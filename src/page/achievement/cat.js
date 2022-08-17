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
  Modal,
  FlatList,
  ScrollView,
  Share,
  TextInput,
  ImageBackground,
} from "react-native";
import {
  FontAwesome5,
  Fontisto,
  FontAwesome,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import HeaderFree from "../components/headerfree";
import { timeformet } from "../components/test";
import moment from "moment";

const { width, height } = Dimensions.get("window");

export default function friend({ navigation, route }) {
  const [search, setsearch] = useState("");
  const item = route.params;
  console.log("item>>>>>>>>>>>>>>>>>>>>>>>>>", item);

  var h = timeformet(Math.floor(item.running_Time / 3600));
  var m = timeformet(Math.floor((item.running_Time % 3600) / 60));
  var s = timeformet(Math.floor((item.running_Time % 3600) % 60));

  function formatTime(params) {
    let Ans = params.toString();
    if (Ans.length == 1) {
      return "0" + Ans;
    } else {
      return Ans;
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <HeaderFree navigation={navigation} />
      </View>
      <ScrollView>
        <Image
          source={{
            uri:
              "https://api.sosorun.com/api/imaged/get/" +
              item?.event_Listt?.Achievement,
          }}
          style={{ width: width, height: 250 }}
        />
        <Text
          style={{
            fontFamily: "Prompt-Regular",
            fontSize: 20,
            color: "#434343",
            alignSelf: "center",
            marginTop: 10,
          }}
        >
          {item.event_name}
        </Text>
        <Text
          style={{
            fontFamily: "Prompt-Regular",
            fontSize: 16,
            color: "#434343",
            alignSelf: "center",
          }}
        >
          เชิญชวนนักวิ่ง sosorun มาร่วมทำภารกิจ
        </Text>
        <Text
          style={{
            fontFamily: "Prompt-Regular",
            fontSize: 16,
            color: "#434343",
            alignSelf: "center",
          }}
        >
          เพื่อรับของรางวัล
        </Text>

        <ImageBackground
          source={{
            uri: "https://api.sosorun.com/api/imaged/get/" + item.biburl,
          }}
          style={{ width: width, height: 180 }}
        >
          <Image
            resizeMode="contain"
            source={require("../../img/lo_hor.png")}
            style={{
              width: 120,
              height: 30,
              position: "absolute",
              right: 0,
              top: 0,
              marginRight: 10,
              marginTop: 10,
            }}
          />
          <Image
            source={{
              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/cat.png",
            }}
            style={{
              width: 40,
              height: 40,
              position: "absolute",
              right: 0,
              top: 0,
              marginRight: 150,
              marginTop: 10,
            }}
          />
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 50,
              color: "#FBC71C",
              position: "absolute",
              top: 0,
              marginTop: 70,
              right: 0,
              marginRight: 20,
            }}
          >
            {item.bib}
          </Text>
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 14,
              color: "#FFFFFF",
              position: "absolute",
              bottom: 0,
              marginBottom: 10,
              right: 0,
              marginRight: 20,
            }}
          >
            www.sosorun.net
          </Text>
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 16,
              color: "#FFFFFF",
              marginLeft: 15,
              marginTop: 35,
            }}
          >
            วิ่งเพื่อแมว
          </Text>
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 12,
              color: "#393939",
              marginLeft: 15,
              marginTop: 6,
            }}
          >
            {/* 20 - 23 mar 2021 */}
          </Text>
        </ImageBackground>

        <View
          style={{
            width: width,
            alignSelf: "center",
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 30,
          }}
        >
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 16,
              color: "#434343",
              alignSelf: "center",
            }}
          >
            ระยะเวลาที่ทำได้
          </Text>
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 16,
              color: "#434343",
              alignSelf: "center",
            }}
          >
            {timeformet(Math.floor(item.running_Time / 3600))} ชม. :{" "}
            {timeformet(Math.floor((item.running_Time % 3600) / 60))} น. :{" "}
            {timeformet(Math.floor((item.running_Time % 3600) % 60))} วิ
          </Text>
        </View>
        <View
          style={{
            width: width,
            alignSelf: "center",
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 16,
              color: "#434343",
              alignSelf: "center",
            }}
          >
            พลังงานที่ใช้ไป
          </Text>
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 16,
              color: "#434343",
              alignSelf: "center",
            }}
          >
            {parseFloat(item.cal).toFixed(2)} แคลอรี่
          </Text>
        </View>
        <View
          style={{
            width: width,
            alignSelf: "center",
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 16,
              color: "#434343",
              alignSelf: "center",
            }}
          >
            ความเร็วเฉลี่ย
          </Text>
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 16,
              color: "#434343",
              alignSelf: "center",
            }}
          >
            {item.running_Time == 0
              ? "0"
              : ((item.last_distance / item.running_Time) * 3.6).toFixed(
                  2
                )}{" "}
            กม. / ชม.
          </Text>
        </View>
        <View
          style={{
            width: width,
            alignSelf: "center",
            paddingHorizontal: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 16,
              color: "#434343",
              alignSelf: "center",
            }}
          >
            วันที่วิ่งสำเร็จ
          </Text>
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 16,
              color: "#434343",
              alignSelf: "center",
            }}
          >
            {moment(item.createdAt).format("L LT")}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
