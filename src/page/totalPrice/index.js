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
import { useRecoilState, useRecoilValue } from "recoil";
import { lans, tokenState } from "../../reducer/reducer/reducer/Atom";
import { getbibevent, updatebib } from "../../action/actionbib";
import { apiservice } from "../../service/service";
const { width, height } = Dimensions.get("window");
export default function index({ navigation, route }) {
  const [token, setToken] = useRecoilState(tokenState);
  const lan = useRecoilValue(lans);
  const dataEV = route.params.dataEV;
  const body = route.params.body;
  const [bib, setbib] = useState([]);
  const [basic, setBasic] = useState(null);

  async function allbibevent() {
    const getbib = await getbibevent({ token, id: dataEV.id });
    setbib(getbib.data[0]);
  }

  const character = bib.last_character != null && bib.last_character;
  const number = bib.last_number != null && bib.last_number;
  const numm = number.toString();
  const [premium, setPremium] = useState(route.params.premium);

  useEffect(() => {
    allbibevent();
    apise();
  }, [token]);

  async function apise() {
    const resposne = await apiservice({
      path: "/event/getbibevent/" + dataEV.id,
      method: "get",
      token: token.accessToken,
    });
    if (resposne.status == 200) {
      setBasic(resposne.data.data[0]);
    }
  }

  console.log("dataEV", dataEV);

  function formaiLenght(params) {
    let paramx = "0000";
    for (let index = 0; index < params.length; index++) {
      paramx = paramx.slice(0, -params.length) + params;
    }
    return paramx;
  }

  if (basic == null) {
    return <View />;
  }

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
            <Text style={styles.texthead}>
              {lan == "en" ? "Your E-BIB number" : "E-BIB ของคุณ"}
            </Text>
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
                    (premium ? dataEV.img_bibPremium : dataEV.img_bibbasic),
                }}
                style={{
                  width: width,
                  height: height * 0.25,
                  position: "absolute",
                }}
              />
              <Text style={styles.textbib}>
                {premium
                  ? character +
                    (route.params.body.bib.toString().length > 0
                      ? route.params.body.bib
                      : "0001")
                  : basic.last_character +
                    (basic.last_number.toString().length == 4
                      ? basic.last_number.toString()
                      : formaiLenght(basic.last_number.toString()))}
              </Text>
            </View>
            {/* <Image
              resizeMode="stretch"
              
              style={{ width: width, height: height * 0.25 }}
            /> */}
            <View style={styles.view}>
              <View style={{ flexDirection: "row" }}>
                <Ionicons name="ios-cart-outline" size={24} color="black" />
                <Text style={styles.textpre}>
                  {lan == "en" ? "Order summary" : "E-BIB ของคุณ"}
                </Text>
              </View>
              <Text style={styles.textpall}>
                {lan == "en" ? "Remove all" : "ลบทั้งหมด"}
              </Text>
            </View>
            <View style={styles.view}>
              <View style={styles.viewbigframe}>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    style={styles.viewframe}
                    source={{
                      uri:
                        "https://api.sosorun.com/api/imaged/get/" +
                        dataEV.img_title,
                    }}
                  />
                  <View>
                    <Text style={styles.textpre}>{dataEV.titel}</Text>
                    <Text style={styles.textraya}>
                      ระยะ {dataEV.distance} กิโล
                    </Text>
                  </View>
                </View>
                {/* <Text style={[styles.textpall, { alignSelf: "center" }]}>
                  x 1
                </Text> */}
                <Text style={[styles.textpall, { alignSelf: "center" }]}>
                  {lan != "en" ? "" : "฿ "}
                  {dataEV.price}
                  {lan != "en" ? "บาท" : ""}
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("Event")}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={24}
                  color="black"
                  style={{ alignSelf: "center" }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.line} />
            {premium && (
              <View style={styles.view}>
                <View style={styles.viewbigframe}>
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      style={styles.viewframe}
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" +
                          dataEV.img_bibPremium,
                      }}
                    />
                    <View>
                      <Text style={styles.textpre}>พรีเมี่ยมBIB</Text>
                      <Text style={styles.textraya}>
                        หมายเลข{" "}
                        {premium
                          ? character +
                            (route.params.body.bib.toString().length > 0
                              ? route.params.body.bib
                              : "0001")
                          : basic.last_character +
                            (basic.last_number.toString().length == 4
                              ? basic.last_number.toString()
                              : formaiLenght(basic.last_number.toString()))}
                      </Text>
                    </View>
                  </View>
                  {/* <Text style={[styles.textpall, { alignSelf: "center" }]}>
                    x 1
                  </Text> */}
                  <Text style={[styles.textpall, { alignSelf: "center" }]}>
                    {lan != "en" ? "" : "฿ "} 35 {lan != "en" ? "บาท" : ""}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    setPremium((val) => !val);
                  }}
                >
                  <MaterialCommunityIcons
                    name="trash-can-outline"
                    size={24}
                    color="black"
                    style={{ alignSelf: "center" }}
                  />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.view}>
              <Text style={styles.textpall}>
                {lan != "en" ? "ยอดรวมทั้งหมด" : "Merchandise Subtotal"}
              </Text>
              <Text style={styles.textpall}>
                {lan != "en" ? "" : "฿ "} {dataEV.price + (premium ? 35 : 0)}{" "}
                {lan != "en" ? "บาท" : ""}
              </Text>
            </View>
            <View style={styles.view}>
              <Text style={styles.textpall}>
                {" "}
                {lan != "en" ? "ค่าจัดส่ง" : "Shipping Fee"}
              </Text>
              <Text style={styles.textpall}>
                {dataEV.fee ? dataEV.fee : "ฟรี"}
              </Text>
            </View>
            <View style={styles.view}>
              <Text style={styles.texttotle}>
                {" "}
                {lan != "en" ? "รวมทั้งสิ้น" : "Oder Amount"}
              </Text>
              <Text style={styles.texttotle}>
                {lan != "en" ? "" : "฿ "}
                {dataEV.price +
                  (dataEV.fee ? parseInt(dataEV.fee) : 0) +
                  (premium ? 35 : 0)}{" "}
                {lan != "en" ? "บาท" : ""}
              </Text>
            </View>
            <View style={[styles.view, { marginVertical: 20 }]}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Payment", {
                    dataEV,
                    body,
                    token,
                    price:
                      dataEV.price +
                      (dataEV.fee ? parseInt(dataEV.fee) : 0) +
                      (premium ? 35 : 0),
                    totalssprice: dataEV.price,
                    premium,
                    BIB: premium
                      ? character +
                        (route.params.body.bib.toString().length > 0
                          ? route.params.body.bib
                          : "0001")
                      : basic.last_character +
                        (basic.last_number.toString().length == 4
                          ? basic.last_number.toString()
                          : formaiLenght(basic.last_number.toString())),
                  })
                }
                style={styles.touch}
              >
                <Text style={styles.texttouch}>
                  {lan != "en" ? "ชำระเงิน" : "Purchase"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.touch}
              >
                <Text style={styles.texttouch}>
                  {lan != "en" ? "ยกเลิก" : "Cancel"}
                </Text>
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
    fontWeight: "500",
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
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
    alignSelf: "center",
  },
  touch: {
    width: 98,
    height: 40,
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
