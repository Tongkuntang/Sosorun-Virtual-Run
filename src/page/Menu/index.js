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
import { apiservice } from "../../service/service";
import { useRecoilState, useRecoilValue } from "recoil";
import { lans, tokenState } from "../../reducer/reducer/reducer/Atom";
const { width, height } = Dimensions.get("window");
export default function index({}) {
  const [token, setToken] = useRecoilState(tokenState);
  const lan = useRecoilValue(lans);
  const [data, setstate] = useState([]);

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
              <View style={styles.viewheader}>
                <Image
                  // resizeMode={"stretch"}
                  source={{
                    uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/home1.png",
                  }}
                  style={styles.imgpro}
                />
                <View>
                  <View style={styles.viewicon}>
                    <FontAwesome5 name="user-alt" size={20} color="#000" />
                    <Text style={styles.textna}>Saroj Sikarin</Text>
                  </View>
                  <View style={styles.viewicon}>
                    <FontAwesome5
                      name="map-marker-alt"
                      size={20}
                      color="#000"
                    />
                    <Text style={styles.textaddress}>Samutprakan, Bangkok</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={{ justifyContent: "center" }}>
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
            <TouchableOpacity style={styles.touch}>
              <FontAwesome name="home" size={25} color="#717171" />
              <Text style={styles.textname}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touch}>
              <FontAwesome5 name="user-alt" size={20} color="#717171" />
              <Text style={styles.textname}>AVATAR</Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity style={styles.touch}>
              <MaterialIcons name="pin-drop" size={24} color="#717171" />
              <Text style={styles.textname}>CAMPAIGN</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touch}>
              <MaterialCommunityIcons
                name="map-marker-path"
                size={24}
                color="#717171"
              />
              <Text style={styles.textname}>EVENT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touch}>
              <Ionicons name="ios-map-sharp" size={24} color="#717171" />
              <Text style={styles.textname}>CHALLENGES</Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity style={styles.touch}>
              <MaterialIcons
                name="attach-money"
                size={20}
                color="#fff"
                style={{ backgroundColor: "#717171", borderRadius: 12 }}
              />
              <Text style={styles.textname}>FREE POINT</Text>
            </TouchableOpacity>
            <View style={styles.view}>
              <TouchableOpacity style={styles.touch}>
                <MaterialIcons name="loyalty" size={22} color="#717171" />
                <Text style={styles.textname}>PROMOTION</Text>
              </TouchableOpacity>
              <View style={styles.viewN}>
                <Text style={styles.textN}>N</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.touch}>
              <MaterialIcons name="attach-money" size={24} color="#717171" />
              <Text style={styles.textname}>TOP UP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touch}>
              <FontAwesome5 name="shopping-basket" size={22} color="#717171" />
              <Text style={styles.textname}>SHOP</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.touch}>
              <Ionicons name="ios-basket" size={24} color="#717171" />
              <Text style={styles.textname}>PREMIUM SHOP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Discount");
              }}
              style={styles.touch}
            >
              <MaterialIcons name="card-giftcard" size={24} color="#717171" />
              <Text style={styles.textname}>DISCOUNT</Text>
            </TouchableOpacity>
            <View style={styles.line} />
            <TouchableOpacity style={styles.touch}>
              <FontAwesome5 name="running" size={24} color="#717171" />
              <Text style={styles.textname}>HISTORY</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Achievement");
              }}
              style={styles.touch}
            >
              <FontAwesome5 name="trophy" size={20} color="#717171" />
              <Text style={styles.textname}>ACHIEVEMENT</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Friend");
              }}
              style={styles.touch}
            >
              <Ionicons name="ios-person-add-sharp" size={24} color="#717171" />
              <Text style={styles.textname}>FRIEND</Text>
            </TouchableOpacity>
            <View style={styles.view}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Notification");
                }}
                style={styles.touch}
              >
                <Ionicons name="ios-notifications" size={24} color="#717171" />
                <Text style={styles.textname}>NOTIFICATION</Text>
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
            <TouchableOpacity style={styles.touch}>
              <MaterialIcons name="logout" size={24} color="#717171" />
              <Text style={styles.textname}>LOGOUT</Text>
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
  },
  viewheader1: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.75,
    alignSelf: "center",
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewheader: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.5,
  },
  imgpro: {
    width: 60,
    height: 60,
    borderRadius: 50,
    alignSelf: "center",
    marginHorizontal: 5,
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
