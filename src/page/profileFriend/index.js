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
import { useIsFocused } from "@react-navigation/core";
import { getActionUser } from "../../action/actionauth";
import { useRecoilState } from "recoil";
import { tokenState } from "../../reducer/reducer/reducer/Atom";
import { autolize_Lv, nextautolize_Lv } from "../../json/utils";
import { apiservice } from "../../service/service";
import { actionMyfriend } from "../../action/actionfriend";
const { width, height } = Dimensions.get("window");
export default function index({ navigation, route }) {
  const data = route.params.item;
  console.log("1234", data);
  const [token, setToken] = useRecoilState(tokenState);

  const focus = useIsFocused();
  const [user, setuser] = useState(null);
  // console.log(user);
  async function getUser() {
    const getuser = await getActionUser(token);
    // console.log("user", getuser.data);
    // user.user_accounts.total_distance;
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
        <ActivityIndicator size={"large"} />
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
          <HeaderHome onPress={() => navigation.goBack()} />
          <View style={styles.view}>
            <View style={styles.viewproflie}>
              {data?.useraccounts?.image_Profile == null ? (
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
                      data?.useraccounts?.image_Profile,
                  }}
                />
              )}
              <View style={{ alignSelf: "center", marginLeft: 30 }}>
                {data.useraccounts.name == null ? (
                  <Text style={styles.textname}>
                    {data.useraccounts.username}
                  </Text>
                ) : (
                  <Text style={styles.textname}>{data.useraccounts.name}</Text>
                )}
              </View>
            </View>
            {data?.useraccounts?.role == "VIP" ? (
              <Image
                source={require("../../img/vip.png")}
                style={styles.imgrank}
              />
            ) : (
              <Image
                source={
                  autolize_Lv(
                    parseInt(data.useraccounts.user_accounts.total_distance)
                  ).grid
                }
                style={styles.imgrank}
              />
            )}
          </View>
          <View
            style={{ justifyContent: "space-between", flexDirection: "row" }}
          >
            <View
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 20,
                marginTop: 15,
              }}
            >
              <Text style={styles.textlv}>
                LV{" "}
                {
                  autolize_Lv(
                    parseInt(data.useraccounts.user_accounts.total_distance)
                  ).lv
                }
              </Text>
              <Text style={styles.textrank}>
                Rank :{" "}
                {
                  autolize_Lv(
                    parseInt(data.useraccounts.user_accounts.total_distance)
                  ).rank
                }{" "}
                Class
              </Text>
            </View>
            <TouchableOpacity
              onPress={async () => {
                const response = await apiservice({
                  body: {
                    id: data.id,
                  },
                  method: "delete",
                  path: "/friend/cancelled-friend",
                  token: token.accessToken,
                });

                if (response.status == 200) {
                  const getstate = await actionMyfriend({
                    token,
                    uid: user.id,
                  });

                  navigation.goBack();
                }
              }}
              style={[styles.touch, { marginRight: 20 }]}
            >
              <Text style={styles.textouch}>เลิกเป็นเพื่อน</Text>
            </TouchableOpacity>
          </View>
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
    width: width * 0.45,
    flexDirection: "row",
  },
  imgprofile: {
    width: 100,
    height: 100,
    alignSelf: "center",
    borderRadius: 50,
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
