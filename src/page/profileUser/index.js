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
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import HeaderHome from "../components/header";
import { RequestFriend } from "../../action/actionfriend";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { useRecoilState } from "recoil";
import { useIsFocused } from "@react-navigation/core";
import { getActionUser } from "../../action/actionauth";
import { autolize_Lv, nextautolize_Lv } from "../../json/utils";
const { width, height } = Dimensions.get("window");
export default function index({ navigation, route }) {
  const data = route.params.response.data.data[0];

  console.log("31", data);

  const [token, setToken] = useRecoilState(tokenState);
  const [body, setbody] = useState({
    uid: "",
    status: "Requested",
    friend_id: "",
  });

  const focus = useIsFocused();
  const [user, setuser] = useState(null);
  // console.log(user);
  async function getUser() {
    const getuser = await getActionUser(token);
    // console.log(getuser);
    setuser((val) => ({
      ...getuser.data,
      user_accounts: {
        ...getuser.data.user_accounts,
        total_distance:
          getuser.data.user_accounts.total_distance != null
            ? getuser.data.user_accounts.total_distance
            : 0,
      },
    }));
  }
  useEffect(() => {
    getUser();
    // getresultsrunning()
  }, [token, focus]);
  if (user == null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#fff" size={"large"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <ScrollView>
          <HeaderHome onPress={() => navigation.goBack("")} />
          <View style={styles.view}>
            <View style={styles.viewproflie}>
              {data.image_Profile == null ? (
                <Image
                  style={styles.imgprofile}
                  source={{
                    uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/userprofice.png",
                  }}
                />
              ) : (
                <Image
                  style={styles.imgprofile}
                  source={{
                    uri:
                      "https://api.sosorun.com/api/imaged/get/" +
                      data.image_Profile,
                  }}
                />
              )}
              <View style={{ alignSelf: "center", marginLeft: 30 }}>
                {data.name == null ? (
                  <Text style={styles.textname}>{data.username}</Text>
                ) : (
                  <Text style={styles.textname}>{data.name}</Text>
                )}
              </View>
            </View>
            {data?.role == "VIP" ? (
              <Image
                source={require("../../img/vip.png")}
                style={styles.imgrank}
              />
            ) : (
              <Image
                source={
                  autolize_Lv(parseInt(data.user_accounts.total_distance)).grid
                }
                style={styles.imgrank}
              />
            )}
          </View>
          <View style={styles.view}>
            <View>
              <Text style={styles.textlv}>
                LV {autolize_Lv(parseInt(data.user_accounts.total_distance)).lv}{" "}
              </Text>
              <Text style={styles.textrank}>
                Rank :{" "}
                {autolize_Lv(parseInt(data.user_accounts.total_distance)).rank}{" "}
                Class
              </Text>
            </View>
            {!route?.params?.userfriend && (
              <TouchableOpacity
                onPress={async () => {
                  let id = { ...body, uid: user.id, friend_id: data.id };
                  const response = await RequestFriend({ body: id, token });
                  console.log("77", response);
                  setTimeout(() => {
                    navigation.navigate("Friend");
                  }, 500);
                }}
                style={styles.touch}
              >
                <Text style={styles.textouch}>เพิ่มเพื่อน</Text>
              </TouchableOpacity>
            )}
          </View>
          {!route?.params?.userfriend && (
            <TouchableOpacity
              onPress={() => navigation.navigate("Friend")}
              style={[
                styles.touch,
                { alignSelf: "flex-end", marginRight: 20, marginTop: 10 },
              ]}
            >
              <Text style={styles.textouch}>ยกเลิก</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  view: {
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  viewproflie: {
    width: width * 0.55,
    flexDirection: "row",
  },
  imgprofile: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignSelf: "center",
  },
  textname: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
  },
  textaddress: {
    fontFamily: "Prompt-Regular",
    fontSize: 10,
    color: "#000",
  },
  imgrank: {
    width: 90,
    height: 98,
    alignSelf: "center",
  },
  textlv: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    alignSelf: "center",
  },
  textrank: {
    fontFamily: "Prompt-Regular",
    fontSize: 13,
    color: "#000",
    alignSelf: "center",
  },
  touch: {
    width: 98,
    height: 30,
    backgroundColor: "#393939",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
  },
  textouch: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#fff",
    alignSelf: "center",
  },
});
