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
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import {
  getbibevent,
  getbibselect,
  postbib_event,
  updatebib,
  updatebib_event,
} from "../../action/actionbib";
import { useRecoilState } from "recoil";
import { tokenState } from "../../reducer/reducer/reducer/Atom";
const { width, height } = Dimensions.get("window");
export default function index({ navigation, route }) {
  const [token, setToken] = useRecoilState(tokenState);
  const dataEV = route.params.dataEV;
  // console.log("??????!!!!", dataEV);
  const [bib, setbib] = useState([]);

  async function allbibevent() {
    const getbib = await getbibevent({ token, id: dataEV.id });

    setbib(getbib.data[0]);
    // console.log("191919191919", getbib);
  }
  const [body, setbody] = useState({
    event_id: "",
    bib: "",
    number: 0,
    char: "A",
  });

  const character = bib.last_character != null && bib.last_character;
  const number = bib.last_number != null && bib.last_number;
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
        <ScrollView style={{ marginBottom: 15 }}>
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
            <Text style={styles.textpre}>คุณต้องการเลขพรีเมี่ยม</Text>
            <View style={styles.viewtouch}>
              <TouchableOpacity
                onPress={() => navigation.navigate("PremiumBib", { dataEV })}
                style={styles.touch}
              >
                <Text style={styles.texttouch}>ราคา 35 บาท</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  const getbibgev = await getbibselect({
                    token,
                    id: dataEV.id,
                  });
                  // console.log("getbibgewn123", getbibgev);
                  if (getbibgev.data == null) {
                    const res = await postbib_event({
                      body: { ...body, event_id: dataEV.id, bib: number },
                      token,
                    });
                    // console.log("res", res);
                  }

                  navigation.navigate("TotalPrice", {
                    dataEV,
                    body: { ...body, bib: getbibgev.bib },
                    premium: false,
                    token,
                  });
                }}
                style={styles.touch}
              >
                <Text style={styles.texttouch}>ไม่</Text>
              </TouchableOpacity>
            </View>
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
                    dataEV.img_bibPremium,
                }}
                style={{
                  width: width,
                  height: height * 0.25,
                  position: "absolute",
                }}
              />
              <Text style={[styles.textbib, { color: "#FBC71C" }]}>Z9999</Text>
            </View>

            <View style={styles.viewimg}>
              <View
                style={{
                  width: width * 0.4,
                  height: height * 0.12,
                  justifyContent: "center",
                }}
              >
                <Image
                  resizeMode="stretch"
                  source={{
                    uri:
                      "https://api.sosorun.com/api/imaged/get/" +
                      dataEV.img_bibPremium,
                  }}
                  style={{
                    width: width * 0.4,
                    height: height * 0.12,
                    position: "absolute",
                  }}
                />
                <Text style={styles.textbib1}>Z8888</Text>
              </View>

              <View
                style={{
                  width: width * 0.4,
                  height: height * 0.12,
                  justifyContent: "center",
                }}
              >
                <Image
                  resizeMode="stretch"
                  source={{
                    uri:
                      "https://api.sosorun.com/api/imaged/get/" +
                      dataEV.img_bibPremium,
                  }}
                  style={{
                    width: width * 0.4,
                    height: height * 0.12,
                    position: "absolute",
                  }}
                />
                <Text style={styles.textbib1}>Z1234</Text>
              </View>
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
    marginVertical: 10,
  },
  textpre: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    marginLeft: 20,
    marginVertical: 5,
  },
  viewtouch: {
    flexDirection: "row",
    width: width,
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  touch: {
    width: 98,
    height: 30,
    justifyContent: "center",
    backgroundColor: "#393939",
    borderRadius: 5,
  },
  texttouch: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#fff",
    alignSelf: "center",
  },
  viewimg: {
    width: width,
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: 10,
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
    fontSize: 25,
    color: "#FBC71C",
    marginRight: 10,
    fontWeight: "bold",
  },
});
