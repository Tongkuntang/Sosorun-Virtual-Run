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
} from "react-native";
import Headerdetail from "../components/headerdetail";
import {
  MaterialIcons,
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { tokenState } from "../../reducer/reducer/reducer/Atom";
import { getbibevent, updatebib } from "../../action/actionbib";
const { width, height } = Dimensions.get("window");
export default function total({ navigation, route }) {
  const [token, setToken] = useRecoilState(tokenState);
  const dataEV = route.params.dataEV;
  console.log("??????!!!!", dataEV);
  const [price, setprice] = useState("");
  const [BIB, setBIB] = useState([]);

  async function allbibevent() {
    const getbib = await getbibevent({ token, id: dataEV.id });
    let bo = getbib.data[0].event_id;
    console.log("bo35", bo);
    if (getbib.data != null) {
      const upbib = await updatebib({ body1: { event_id: dataEV.id }, token });
      console.log("upbib35", upbib);
    }
    setbib(getbib.data[0]);
  }

  const character = BIB.last_character != null && BIB.last_character;
  const number = BIB.last_number != null && BIB.last_number;
  const numm = number.toString();

  useEffect(() => {
    allbibevent();
  }, [token]);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <Headerdetail item={dataEV.titel} navigation={navigation} />
        <ScrollView>
          <View style={styles.background}>
            <Text style={styles.texthead}>E-BIB ของคุณ</Text>
            <View
              style={{
                width: width,
                height: height * 0.25,
                justifyContent: "center",
              }}
            >
              <Image
                resizeMode="stretch"
                source={{
                  uri:
                    "https://api.sosorun.com/api/imaged/get/" +
                    dataEV.img_bibbasic,
                }}
                style={{
                  width: width,
                  height: height * 0.25,
                  position: "absolute",
                }}
              />
              {numm.length == 1 && (
                <Text style={styles.textbib}>{character + "000" + numm}</Text>
              )}
              {numm.length == 2 && (
                <Text style={styles.textbib}>{character + "00" + numm}</Text>
              )}
              {numm.length == 3 && (
                <Text style={styles.textbib}>{character + "0" + numm}</Text>
              )}
              {numm.length == 4 && (
                <Text style={styles.textbib}>{character + numm}</Text>
              )}
            </View>
            {/* <Image
                resizeMode="stretch"
                
                style={{ width: width, height: height * 0.25 }}
              /> */}
            <View style={styles.view}>
              <View style={{ flexDirection: "row" }}>
                <Ionicons name="ios-cart-outline" size={24} color="black" />
                <Text style={styles.textpre}>Order summary</Text>
              </View>
              <Text style={styles.textpall}>Remove all</Text>
            </View>
            <View style={styles.view}>
              <View style={styles.viewbigframe}>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    resizeMode="stretch"
                    source={{
                      uri:
                        "https://api.sosorun.com/api/imaged/get/" +
                        dataEV.img_title,
                    }}
                    style={styles.viewframe}
                  />
                  <View>
                    <Text style={styles.textpre}>{dataEV.titel}</Text>
                    <Text style={styles.textraya}>
                      ระยะ {dataEV.distance} กิโล
                    </Text>
                  </View>
                </View>
                <Text style={[styles.textpall, { alignSelf: "center" }]}>
                  1
                </Text>
                <Text style={[styles.textpall, { alignSelf: "center" }]}>
                  {dataEV.price} บาท
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={24}
                  color="black"
                  style={{ alignSelf: "center" }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.line} />

            <View style={styles.view}>
              <Text style={styles.textpall}>ยอดรวมทั้งหมด</Text>
              <Text style={styles.textpall}>{dataEV.price} บาท</Text>
            </View>
            <View style={styles.view}>
              <Text style={styles.textpall}>ค่าส่ง</Text>
              <Text style={styles.textpall}>ฟรี</Text>
            </View>
            <View style={styles.view}>
              <Text style={styles.texttotle}>รวมทั้งสิ้น</Text>
              <Text style={styles.texttotle}>{dataEV.price} บาท</Text>
            </View>
            <View style={[styles.view, { marginVertical: 20 }]}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Payment", {
                    dataEV,
                    price,
                    token,
                    premium: false,
                    BIB,
                  })
                }
                style={styles.touch}
              >
                <Text style={styles.texttouch}>ชำระเงิน</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={styles.touch}
              >
                <Text style={styles.texttouch}>ยกเลิก</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  background: {
    width: width,
    height: height,
    backgroundColor: "#FBC71C",
  },
  texthead: {
    fontFamily: "Prompt-Regular",
    fontSize: 26,
    color: "#000",
    marginLeft: 20,
    marginVertical: 20,
  },
  textpre: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    marginLeft: 5,
  },
  textraya: {
    fontFamily: "Prompt-Regular",
    fontSize: 12,
    color: "#393939",
    marginLeft: 5,
  },
  textpall: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
  },
  texttotle: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
    fontWeight: "bold",
  },
  view: {
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  viewframe: {
    width: 41,
    height: 41,
    backgroundColor: "#DEDEDE",
    borderRadius: 5,
    alignSelf: "center",
  },
  viewbigframe: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.8,
  },
  line: {
    width: width * 0.8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#fff",
    alignSelf: "center",
    marginTop: 5,
  },
  texttouch: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#fff",
    fontWeight: "700",
    alignSelf: "center",
  },
  touch: {
    width: 98,
    height: 28,
    backgroundColor: "#393939",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
  },
  textbib: {
    alignSelf: "flex-end",
    justifyContent: "center",
    fontFamily: "Prompt-Regular",
    fontSize: 70,
    color: "#000",
    marginRight: 20,
    fontWeight: "bold",
  },
});
