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
  Modal,
  FlatList,
  ScrollView,
  Share,
} from "react-native";
import {
  FontAwesome5,
  Fontisto,
  FontAwesome,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Headerevent from "../components/headerevent";
import { apiservice } from "../../service/service";
import { useRecoilValue } from "recoil";
import { tokenState } from "../../reducer/reducer/reducer/Atom";
import moment from "moment";
const { width, height } = Dimensions.get("window");

const DATA = [
  {
    title: "EVENT",
    imageURL: {
      uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/icon_noti1.png",
    },
  },
  {
    title: "EVENT",
    imageURL: {
      uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/icon_noti1.png",
    },
  },
  {
    title: "FRIEND",
    imageURL: {
      uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/icon_noti2.png",
    },
  },
];

export default function notification({ navigation }) {
  const [state, setstate] = useState([]);
  const token = useRecoilValue(tokenState);
  useEffect(() => {
    callAPi();
  }, []);

  async function callAPi() {
    const res = await apiservice({
      path: "/notification/getnoti_log",
      token: token.accessToken,
    });
    console.log(res);
    if (res?.status == 200) {
      setstate(res?.data?.data);
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
        <Headerevent item="อีเว้นทั้งหมด" navigation={navigation} />
      </View>
      <View>
        <FlatList
          data={state}
          style={{ backgroundColor: "white", width: width }}
          renderItem={({ item, index }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (item.type == "EVENT") {
                    navigation.navigate("EventDetail", { item: item?.detail });
                  } else {
                  }
                }}
                style={{
                  width: width,
                  height: 80,
                  marginTop: 10,
                  paddingHorizontal: 10,
                  alignSelf: "center",
                  backgroundColor: "#FFFFFF",
                  justifyContent: "center",
                  borderBottomWidth: 1,
                  borderBottomColor: "#707070",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{
                      uri:
                        item?.type != "EVENT"
                          ? "https://ssr-project.s3.ap-southeast-1.amazonaws.com/icon_noti2.png"
                          : "https://ssr-project.s3.ap-southeast-1.amazonaws.com/icon_noti1.png",
                    }}
                    style={{
                      width: 50,
                      height: 50,
                      alignSelf: "center",
                      resizeMode: "contain",
                      justifyContent: "center",
                    }}
                  />

                  <View
                    style={{
                      marginLeft: 10,
                      alignSelf: "center",
                      width: width * 0.8,
                    }}
                  >
                    <View
                      style={{
                        alignSelf: "flex-end",
                        flexDirection: "row",
                        justifyContent: "center",
                      }}
                    >
                      <Image
                        source={{
                          uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/clock.png",
                        }}
                        style={{
                          width: 10,
                          height: 10,
                          resizeMode: "contain",
                          marginRight: 10,
                          alignSelf: "center",
                        }}
                      />
                      <Text
                        style={{
                          fontFamily: "Prompt-Regular",
                          fontSize: 10,
                          color: "#434343",
                          alignSelf: "center",
                        }}
                      >
                        {moment(item?.createdAt).format("DD-MM-YYYY hh:mm:ss")}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: "Prompt-Regular",
                        color: "#434343",
                      }}
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={{
                        fontFamily: "Prompt-Regular",
                        fontSize: 12,
                        color: "#434343",
                      }}
                    >
                      {item.message}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
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
