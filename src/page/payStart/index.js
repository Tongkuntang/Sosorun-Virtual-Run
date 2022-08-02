import { useIsFocused } from "@react-navigation/core";
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
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { apiservice } from "../../service/service";
import Headerdetail from "../components/headerdetail";
import moment from "moment";
const { width, height } = Dimensions.get("window");

export default function index({ navigation, route }) {
  const [user, setUser] = useRecoilState(userState);

  const [token, setKoen] = useRecoilState(tokenState);
  const [data, setData] = useState([]);
  const focus = useIsFocused();
  const dataEV = route.params.dataEV;
  const price = route.params.price;
  const BIB = route.params.BIB;
  const premium = route.params.premium;

  useEffect(() => {
    getHistorypayment();
  }, [focus]);

  async function getHistorypayment() {
    const response = await apiservice({
      path: "/event/getmyEvent/" + user.id,
      token: token.accessToken,
    });

    if (response.status == 200) {
      setData(response.data.data);
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
        <Headerdetail
          goBack={() => navigation.navigate("Home")}
          item={dataEV.titel}
          navigation={navigation}
        />
        <ScrollView style={{ marginBottom: 30 }}>
          <View style={styles.viewimg}>
            <Image
              // resizeMode={"stretch"}
              source={{
                uri:
                  "https://api.sosorun.com/api/imaged/get/" + dataEV.img_title,
              }}
              style={styles.viewimg}
            />
          </View>
          <View style={styles.viewtouch}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(
                  dataEV?.Type == "Eventonroad" ? "SelectDevice" : "RunEvant",
                  {
                    BIB,
                    dataEV: { ...dataEV, distance: [dataEV.distance] },
                    biburl: premium
                      ? dataEV.img_bibPremium
                      : dataEV.img_bibbasic,
                    last_distance: 0,
                    id: route.params.id,
                  }
                );
              }}
              style={styles.touch}
            >
              <View style={styles.viewhead}>
                <View style={{ width: width * 0.7, marginLeft: 10 }}>
                  <Text style={styles.texthead}>{dataEV.titel}</Text>
                  <Text style={styles.textdetail}>ระยะเวลา</Text>
                  <Text style={styles.textdetail}>
                    ตั้งแต่วันที่
                    {moment(dataEV.startDate).format("DD")} -{" "}
                    {moment(dataEV.expireDate).format("DD/MM/YYYY")}
                  </Text>
                </View>
                <View style={{ width: width * 0.3, marginRight: 10 }}>
                  <View style={styles.viewprice}>
                    <Text style={styles.textprice}>เริ่ม</Text>
                  </View>
                  <Text style={[styles.texthead, { alignSelf: "center" }]}>
                    {dataEV.distance}
                  </Text>
                  <View style={styles.viewprice1}>
                    <Text style={[styles.texthead, { alignSelf: "center" }]}>
                      กม.
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <View
              style={{
                width: width,
                height: height * 0.25,
                justifyContent: "center",
              }}
            >
              {/* <Image
                resizeMode="stretch"
                source={{
                  uri:
                    "https://api.sosorun.com/api/imaged/get/" + premium
                      ? dataEV.img_bibPremium
                      : dataEV.img_bibbasic,
                }}
                style={{
                  width: width,
                  height: height * 0.25,
                  position: "absolute",
                }}
              /> */}

              <Text style={styles.textbib1}>{BIB}</Text>
            </View>
            {/* <TouchableOpacity onPress={onShare} style={styles.viewshare}>
              <Text style={styles.textshare}>แชร์ E-BIB</Text>
            </TouchableOpacity> */}
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
  viewimg: {
    width: width,
    height: height * 0.3,
  },
  viewtouch: {
    width: width,
    height: height * 0.6,
    backgroundColor: "#FBC71C",
  },
  touch: {
    width: width,
    borderBottomWidth: 1,
    borderBottomColor: "#44444450",
  },
  viewhead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  texthead: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#000",
  },
  viewprice: {
    width: 96,
    height: 30,
    backgroundColor: "#707070",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
  },
  viewprice1: {
    width: 46,
    height: 30,
    backgroundColor: "#fff",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
  },
  textprice: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#fff",
    alignSelf: "center",
  },
  textdetail: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
  },
  viewshare: {
    width: 91,
    height: 26,
    backgroundColor: "#707070",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "flex-end",
    marginTop: 20,
    marginRight: 20,
  },
  textshare: {
    fontFamily: "Prompt-Regular",
    fontSize: 13,
    color: "#fff",
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
  textbib1: {
    alignSelf: "flex-end",
    justifyContent: "center",
    fontFamily: "Prompt-Regular",
    fontSize: 70,
    color: "#FBC71C",
    marginRight: 10,
    fontWeight: "bold",
  },
});
