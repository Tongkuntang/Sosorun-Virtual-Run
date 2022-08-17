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
export default function friend({ navigation }) {
  const [search, setsearch] = useState("");
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
      <Image
        source={{
          uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/flag.gif",
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
        วิ่งเก็บแต้ม
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
          07 ชม. : 0 น. : 0 วิ
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
          1200 แคลอรี่
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
          30 กม. / ชม.
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
