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
  FlatList,
  Modal,
  ActivityIndicator,
} from "react-native";
import HeaDer from "../components/header";
import {
  AntDesign,
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { tokenState, lans } from "../../reducer/reducer/reducer/Atom";
import { getActionUser } from "../../action/actionauth";
import { useIsFocused } from "@react-navigation/core";
const { width, height } = Dimensions.get("window");
export default function indxx({ navigation }) {
  const [token, setToken] = useRecoilState(tokenState);
  const [lan, setlans] = useRecoilState(lans);
  const [user, setUser] = useState(null);
  const isFocus = useIsFocused();
  // console.log(token);

  useEffect(() => {
    getUser();
  }, [isFocus]);

  async function getUser() {
    // console.log("call");
    const resonse = await getActionUser(token);
    // console.log();
    if (resonse) {
      console.log(resonse.data.user_accounts.wallet);
      setUser(resonse.data);
    }
  }

  if (user == null) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView />
      <View
        style={[
          styles.background,
          { marginTop: Platform.OS === "ios" ? 0 : 0 },
        ]}
      >
        <HeaDer
          onPress={() => navigation.navigate("Home")}
          navigation={navigation}
        />
        <View style={styles.view}>
          {user.image_Profile == null ? (
            <Image
              style={styles.imgphoflie1}
              source={{
                uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/userprofice.png",
              }}
            />
          ) : (
            <Image
              style={styles.imgphoflie1}
              source={{
                uri:
                  "https://api.sosorun.com/api/imaged/get/" +
                  user.image_Profile,
              }}
            />
          )}
          <View style={{ alignSelf: "center" }}>
            <Text style={[styles.textname, { fontSize: 28 }]}>
              Hello,{" "}
              {user.name == null ? (
                <Text style={styles.textna}>{user.username}</Text>
              ) : (
                <Text style={styles.textna}>{user.name}</Text>
              )}
            </Text>
            <Text style={styles.textdetail}>
              {lan == "en" ? "Your current wallet" : "กระเป๋าเงินของคุณ"}
            </Text>
          </View>
        </View>
        <View style={styles.viewdetail}>
          <View style={styles.viewsmalldetail}>
            <Image
              source={{
                uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
              }}
              style={styles.imgpoint}
            />
            <View
              style={{ flex: 0.8, justifyContent: "center", marginLeft: -20 }}
            >
              <Text style={styles.textgold}>
                {" "}
                {lan == "en" ? "GOLD" : "โกลด์"}
              </Text>
              <Text style={styles.textname}>
                {user.user_accounts.wallet.gold != undefined
                  ? user.user_accounts.wallet.gold
                  : 0}{" "}
                {lan == "en" ? "GOLD" : "โกลด์"}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("FreePoint")}>
            <AntDesign
              name="pluscircle"
              size={30}
              color="black"
              style={{ alignSelf: "center", marginTop: 25 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.viewdetail}>
          <View style={styles.viewsmalldetail1}>
            <FontAwesome5
              name="running"
              size={50}
              color="#5BC3FF"
              style={{ alignSelf: "center" }}
            />
            <View style={{ flex: 0.8, justifyContent: "center" }}>
              <Text style={styles.textgold}>
                {lan == "en" ? "CALORIES" : "แคลอรี่"}
              </Text>
              <Text style={styles.textname}>
                {user.user_accounts.wallet.cal != undefined
                  ? user.user_accounts.wallet.cal
                  : 0}{" "}
                {lan == "en" ? "CALORIES" : "แคลอรี่"}
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Discount");
          }}
          style={{
            width: width,
            height: 80,
            backgroundColor: "#FCC81D",
            marginTop: 20,
            paddingHorizontal: 20,
            justifyContent: "space-between",
            flexDirection: "row",
          }}
        >
          <View style={styles.viewsmalldetail1}>
            <MaterialCommunityIcons
              name="arrow-right-bold-circle"
              size={50}
              color="black"
              style={{ alignSelf: "center" }}
            />
            <View style={{ flex: 0.8, justifyContent: "center" }}>
              <Text style={styles.textname}>
                {" "}
                {lan == "en" ? "USE POINTS" : "ใช้แต้ม"}
              </Text>
            </View>
          </View>

          <MaterialIcons
            name="card-giftcard"
            size={45}
            color="#000"
            style={{ alignSelf: "center" }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  background: {
    backgroundColor: "#F6F6F6",
    width: width,
    height: height,
  },
  view: {
    flexDirection: "row",
    padding: 20,
  },
  img: {
    width: 83,
    height: 83,
    alignSelf: "center",
    borderRadius: 83,
  },
  textna: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    marginLeft: 10,
    color: "#000",
    fontWeight: "800",
  },
  textname: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    marginLeft: 10,
    color: "#000",
    fontWeight: "800",
  },
  textdetail: {
    fontFamily: "Prompt-Regular",
    fontSize: 18,
    marginLeft: 10,
    color: "#393939",
  },
  textgold: {
    fontFamily: "Prompt-Regular",
    fontSize: 11,
    color: "#8E9DBA",
    marginLeft: 10,
  },
  viewdetail: {
    width: width,
    height: height * 0.15,
    backgroundColor: "#fff",
    marginTop: 20,
    padding: 20,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  viewsmalldetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.6,
  },
  viewsmalldetail1: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.6,
  },
  imgpoint: {
    width: 60,
    height: 60,
    alignSelf: "center",
  },
  imgphoflie1: {
    width: 80,
    height: 80,
    alignSelf: "center",
    borderRadius: 40,
    marginLeft: 10,
  },
});
