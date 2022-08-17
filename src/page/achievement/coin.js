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

const { width, height } = Dimensions.get("window");
import moment from "moment";
import { timeformet } from "../components/test";
export default function friend({ navigation, route }) {
  const data = route.params.item;
  console.log("data12354", data);

  return (
    <View style={styles.container}>
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <SafeAreaView />
        <HeaderFree navigation={navigation} />
      </View>
      <Image
        resizeMode="contain"
        source={{
          uri:
            "https://api.sosorun.com/api/imaged/get/" +
            data?.mission_List?.Achievement,
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
        {data.event_name}
      </Text>
      <Text
        style={{
          fontFamily: "Prompt-Regular",
          fontSize: 16,
          color: "#434343",
          alignSelf: "center",
        }}
      >
        {data.mission_List.discription}
      </Text>

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
          {timeformet(Math.floor(data.running_Time / 3600))} ชม. :{" "}
          {timeformet(Math.floor((data.running_Time % 3600) / 60))} น. :{" "}
          {timeformet(Math.floor((data.running_Time % 3600) % 60))} วิ
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
          {data.Achievement.cal.toFixed(2)} แคลอรี่
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
          {((data.last_distance / data.running_Time) * 3.6).toFixed(2)} กม. /
          ชม.
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
          {moment(data.createdAt).format("L LT")}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
