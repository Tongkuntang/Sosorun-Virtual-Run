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
  ScrollView,
} from "react-native";
import {
  FontAwesome5,
  Fontisto,
  FontAwesome,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  lans,
  tokenState,
  userState,
} from "../../reducer/reducer/reducer/Atom";
import { apiservice } from "../../service/service";

const { width, height } = Dimensions.get("window");
export default function index({ navigation }) {
  const [user, setUser] = useRecoilState(userState);
  const [token, setToken] = useRecoilState(tokenState);
  const [data, setstate] = useState([]);
  const lan = useRecoilValue(lans);

  useEffect(() => {
    callAPi();
  }, []);

  async function callAPi() {
    const res = await apiservice({
      path: "/notification/getnoti_log",
      token: token.accessToken,
    });

    if (res?.status == 200) {
      setstate(res?.data?.data);
    }
  }

  if (user == null) {
    return <View />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.95 }}>
        <SafeAreaView />
        <View
          style={{
            marginTop: Platform.OS === "ios" ? 0 : 0,
          }}
        >
          <View style={styles.header}>
            <View style={styles.viewheader1}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Account")}
                style={styles.viewheader}
              >
                {user.image_Profile == null ? (
                  <Image
                    style={styles.imgpro}
                    source={{
                      uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/userprofice.png",
                    }}
                  />
                ) : (
                  <Image
                    style={styles.imgpro}
                    source={{
                      uri:
                        "https://api.sosorun.com/api/imaged/get/" +
                        user.image_Profile,
                    }}
                  />
                )}

                <View style={{ marginLeft: 10 }}>
                  <View style={styles.viewicon}>
                    <FontAwesome5 name="user-alt" size={20} color="#000" />
                    {user.name == null ? (
                      <Text style={styles.textna}>{user.username}</Text>
                    ) : (
                      <Text style={styles.textna}>{user.name}</Text>
                    )}
                  </View>
                  <View style={styles.viewicon}>
                    <FontAwesome5
                      name="map-marker-alt"
                      size={20}
                      color="#000"
                    />

                    <Text style={styles.textaddress}>
                      {user.full_address.district},{user.full_address.province}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.closeDrawer("")}
                style={{ justifyContent: "center" }}
              >
                <Fontisto
                  name="angle-left"
                  size={25}
                  color="#717171"
                  style={{ alignSelf: "center" }}
                />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView>
            <TouchableOpacity
              onPress={() => navigation.navigate("Home")}
              style={styles.touch}
            >
              <FontAwesome name="home" size={25} color="#717171" />
              <Text style={styles.textname}>
                {lan == "en" ? "Home" : "หน้าหลัก"}
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate("Account")}
              style={styles.touch}
            >
              <FontAwesome5 name="user-alt" size={20} color="#717171" />
              <Text style={styles.textname}>AVATAR</Text>
            </TouchableOpacity> */}
            <View style={styles.line} />
            <TouchableOpacity
              onPress={() => navigation.navigate("Event")}
              style={styles.touch}
            >
              <MaterialCommunityIcons
                name="map-marker-path"
                size={24}
                color="#717171"
              />
              <Text style={styles.textname}>
                {" "}
                {lan == "en" ? "EVENT" : "อีเวนท์"}
              </Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity
              disabled={token?.role == "VIP"}
              onPress={() => navigation.navigate("Bag")}
              style={styles.touch}
            >
              <FontAwesome5 name="shopping-bag" size={20} color="#717171" />
              <Text
                style={[
                  styles.textname,
                  { opacity: token?.role == "VIP" ? 0.2 : 1 },
                ]}
              >
                {lan == "en" ? "BAG" : "กระเป๋า"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={token?.role == "VIP"}
              onPress={() => navigation.navigate("FreePoint")}
              style={styles.touch}
            >
              <MaterialIcons
                name="attach-money"
                size={20}
                color="#fff"
                style={{ backgroundColor: "#717171", borderRadius: 12 }}
              />
              <Text
                style={[
                  styles.textname,
                  { opacity: token?.role == "VIP" ? 0.2 : 1 },
                ]}
              >
                {lan == "en" ? "FREE POINT" : "รับแต้มฟรี"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={token?.role == "VIP"}
              onPress={() => {
                navigation.navigate("Discount");
              }}
              style={styles.touch}
            >
              <MaterialIcons name="card-giftcard" size={24} color="#717171" />
              <Text
                style={[
                  styles.textname,
                  { opacity: token?.role == "VIP" ? 0.2 : 1 },
                ]}
              >
                {lan == "en" ? "DISCOUNT" : "แลกส่วนลด"}
              </Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity
              disabled={token?.role == "VIP"}
              onPress={() => navigation.navigate("HistoryAll")}
              style={styles.touch}
            >
              <FontAwesome5 name="running" size={24} color="#717171" />
              <Text
                style={[
                  styles.textname,
                  { opacity: token?.role == "VIP" ? 0.2 : 1 },
                ]}
              >
                {lan == "en" ? "HISTORY" : "ประวัติการวิ่งย้อนหลัง"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={token?.role == "VIP"}
              onPress={() => {
                navigation.navigate("Achievement");
              }}
              style={[styles.touch]}
            >
              <FontAwesome5 name="trophy" size={20} color="#717171" />
              <Text
                style={[
                  styles.textname,
                  { opacity: token?.role == "VIP" ? 0.2 : 1 },
                ]}
              >
                {lan == "en" ? "ACHIEVEMENT" : "เหรียญรางวัล"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={token?.role == "VIP"}
              onPress={() => {
                navigation.navigate("Friend");
              }}
              style={styles.touch}
            >
              <Ionicons name="ios-person-add-sharp" size={24} color="#717171" />
              <Text
                style={[
                  styles.textname,
                  { opacity: token?.role == "VIP" ? 0.2 : 1 },
                ]}
              >
                {lan == "en" ? "FRIEND" : "รายชื่อเพื่อน"}
              </Text>
            </TouchableOpacity>
            <View style={styles.view}>
              <TouchableOpacity
                disabled={token?.role == "VIP"}
                onPress={() => {
                  navigation.navigate("Notification");
                }}
                style={styles.touch}
              >
                <Ionicons name="ios-notifications" size={24} color="#717171" />
                <Text
                  style={[
                    styles.textname,
                    { opacity: token?.role == "VIP" ? 0.2 : 1 },
                  ]}
                >
                  {lan == "en" ? "NOTIFICATION" : "การแจ้งเตือน"}
                </Text>
                {data?.length > 0 && (
                  <View
                    style={{
                      width: 15,
                      height: 15,
                      backgroundColor: "#ff0000",
                      borderRadius: 15,
                    }}
                  />
                )}
              </TouchableOpacity>
              {/* <View style={styles.viewN}>
                <Text style={styles.textN}>99</Text>
              </View> */}
            </View>
            <View style={styles.line} />
            <TouchableOpacity
              onPress={() => {
                setToken("");
                navigation.closeDrawer("");
                // navigation.navigate("Login");
              }}
              style={styles.touch}
            >
              <MaterialIcons name="logout" size={24} color="#717171" />
              <Text style={styles.textname}>
                {lan == "en" ? "LOGOUT" : "ออกจากระบบ"}
              </Text>
            </TouchableOpacity>
            <View style={styles.linee} />
          </ScrollView>
        </View>
      </View>
      <View style={{ flex: 0.05 }}></View>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    width: width * 0.8,
    height: 78,
    backgroundColor: "#FCC81D",
    justifyContent: "space-between",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  viewheader1: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.8,
    alignSelf: "center",
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewheader: {
    flexDirection: "row",
    width: width * 0.5,
  },
  imgpro: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: "center",
    marginLeft: 5,
  },
  viewicon: {
    flexDirection: "row",
    textAlign: "center",
    margin: 3,
  },
  textname: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
    alignSelf: "center",
  },
  textna: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    marginLeft: 5,
    alignSelf: "center",
  },
  textaddress: {
    fontFamily: "Prompt-Regular",
    fontSize: 12,
    color: "#000",
    marginLeft: 5,
  },
  touch: {
    flexDirection: "row",
    marginLeft: 20,
    marginTop: 20,
  },
  line: {
    width: width * 0.8,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    opacity: 0.25,
    marginTop: 20,
  },
  linee: {
    width: width * 0.8,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    opacity: 0.25,
    marginTop: 20,
    marginBottom: 40,
  },
  viewN: {
    width: 26,
    height: 16,
    backgroundColor: "#E81111",
    borderRadius: 6,
    justifyContent: "center",
    marginTop: 20,
    marginRight: 10,
  },
  textN: {
    alignSelf: "center",
    fontFamily: "Prompt-Regular",
    fontSize: 12,
    color: "#fff",
  },
});
