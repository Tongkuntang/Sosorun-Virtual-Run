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
  TextInput,
} from "react-native";
import Headerdetail from "../components/headerdetail";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRecoilState } from "recoil";
import { tokenState } from "../../reducer/reducer/reducer/Atom";
import {
  getbibevent,
  getbib_Byevent,
  postbib_event,
} from "../../action/actionbib";
// import { event } from "react-native-reanimated";
import NumberFormat from "react-number-format";
import { apiservice } from "../../service/service";
import BIB from "../components/bib.json";
const { width, height } = Dimensions.get("window");

export default function index({ navigation, route }) {
  const [modal, setmodal] = useState(false);
  const [modalVisible, setmodalVisible] = useState(false);
  const [token, setToken] = useRecoilState(tokenState);
  const dataEV = route.params.dataEV;
  // console.log("??????!!!!", dataEV);
  const [bib, setbib] = useState({});
  async function allbibevent() {
    const getbib = await getbibevent({ token, id: dataEV.id });
    setbib(getbib.data[0]);
    // console.log("191919191919", getbib.data);
    const getbiball = await getbib_Byevent({ token, id: dataEV.id });
    // console.log(getbiball);
  }
  const character = bib.last_character != null && bib.last_character;
  const number = bib.last_number != null && bib.last_number;
  const numm = number.toString();

  // console.log("32", numm);
  useEffect(() => {
    allbibevent();
  }, [token]);

  const eventid = dataEV.id;
  const [bibnumber, setbibnumber] = useState("");

  async function apiSearch({ bibnumber, eventid }) {
    console.log(bibnumber);
    if (bibnumber.length == 4) {
      const response = await apiservice({
        path: "/event/chackeventbib/" + bibnumber + "/" + eventid,
        method: "get",
        token: token.accessToken,
      });

      const cheak = response.data.data;
      if (cheak.length == 0) {
        setmodal(true);
      } else {
        setmodalVisible(true);
      }
    } else {
      alert("กรุณาใส่ให้ครบ 4 หลัก");
    }
  }

  const [body, setbody] = useState({
    event_id: "",
    bib: "",
    number: 0,
    char: "A",
  });

  const [data, setdata] = useState([
    { status: true, bibnumber: 1111 },
    { status: true, bibnumber: 2222 },
    { status: true, bibnumber: 3333 },
    { status: true, bibnumber: 4444 },
    { status: true, bibnumber: 5555 },
    { status: true, bibnumber: 6666 },
    { status: true, bibnumber: 7777 },
    { status: true, bibnumber: 8888 },
    { status: true, bibnumber: 9999 },
    { status: true, bibnumber: 1234 },
    { status: true, bibnumber: 2345 },
    { status: true, bibnumber: 3456 },
    { status: true, bibnumber: 4567 },
    { status: true, bibnumber: 5678 },
    { status: true, bibnumber: 6789 },
  ]);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <Headerdetail item={dataEV.titel} navigation={navigation} />
        <Modal
          animationType="none"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setmodal(!modal);
          }}
        >
          <View style={{ flex: 1, backgroundColor: "#000000bb" }}>
            <LinearGradient
              colors={["#FCC81D", "#EFD98F", "#EEE6CB", "#C29709"]}
              style={styles.backgroundmodal}
            >
              <TouchableOpacity
                onPress={() => setmodal(!modal)}
                style={styles.touchicon}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.textopicmodal}>คุณสามารถใช้เลขนี้ได้</Text>
              {<Text style={styles.textmainmodal}>{bibnumber}</Text>}
              <View style={styles.viewtouchmodal}>
                <TouchableOpacity
                  onPress={async () => {
                    // console.log("120", response);
                    setmodal(!modal);
                    navigation.navigate("TotalPrice", {
                      dataEV,
                      body: { ...body, bib: bibnumber },
                      premium: true,
                      token,
                    });
                  }}
                  style={styles.touchmodal}
                >
                  <Text style={styles.texttouchmodal}>ตกลง</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setmodal(!modal)}
                  style={styles.touchmodal}
                >
                  <Text style={styles.texttouchmodal}>ยกเลิก</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </Modal>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setmodalVisible(!modalVisible);
          }}
        >
          <View style={{ flex: 1, backgroundColor: "#000000bb" }}>
            <LinearGradient
              colors={["#FCC81D", "#EFD98F", "#EEE6CB", "#C29709"]}
              style={styles.backgroundmodal}
            >
              <TouchableOpacity
                onPress={() => setmodalVisible(!modalVisible)}
                style={styles.touchicon}
              >
                <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
              <Text style={styles.textopicmodal}>เลขนี้มีผู้ใช้แล้ว</Text>
              {<Text style={styles.textmainmodal}>{bibnumber}</Text>}
              <TouchableOpacity style={styles.touchmodalvisible}>
                <Text style={styles.texttouchmodal}>ค้นหาอีกครั้ง</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>
        <View style={styles.background}>
          <Text style={styles.texthead}>ระบุเลขBIBที่คุณต้องการ</Text>
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
            <Text style={styles.textbib}>
              {character + (bibnumber.length > 0 ? bibnumber : "0001")}
            </Text>
          </View>
          <View style={styles.view}>
            <TextInput
              maxLength={4}
              keyboardType={"number-pad"}
              style={styles.input}
              placeholder="5678"
              onChangeText={(number) => setbibnumber(number)}
            />
            <TouchableOpacity
              onPress={async () => {
                if (bibnumber == Number(parseInt(bibnumber))) {
                  apiSearch({ bibnumber, eventid });
                } else {
                  alert("กรุณาใส่เฉพาะตัวเลข");
                }
              }}
              style={styles.touch}
            >
              <Text style={styles.texttouch}>ค้นหา</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.texthead}>เลขBIBที่สามารถเลือกได้</Text>
          <FlatList
            data={data}
            // columnWrapperStyle={{justifyContent: 'space-between'}}
            numColumns={4}
            renderItem={({ item }) => {
              return (
                <View
                  style={[
                    styles.viewflat,
                    { width: width * 0.25, alignItems: "center" },
                  ]}
                >
                  <TouchableOpacity
                    onPress={async () => {
                      const response = await apiservice({
                        path:
                          "/event/chackeventbib/" +
                          item.bibnumber +
                          "/" +
                          eventid,
                        method: "get",
                        token: token.accessToken,
                      });

                      const cheak = response.data.data;
                      if (cheak.length == 0) {
                        setbibnumber(item.bibnumber);
                        setmodal(true);
                      } else {
                        setmodalVisible(true);
                      }
                    }}
                  >
                    <Text style={[styles.text, { textAlign: "center" }]}>
                      {item.bibnumber}
                    </Text>
                  </TouchableOpacity>
                  {/* <View style={styles.viewflat} /> */}
                </View>
              );
            }}
          />
        </View>
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
    marginVertical: 15,
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width,
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  input: {
    width: width * 0.6,
    height: 36,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#444444",
    textAlign: "center",
    fontFamily: "Prompt-Regular",
    fontSize: 19,
    color: "#000",
  },
  touch: {
    width: 98,
    height: 36,
    backgroundColor: "#393939",
    justifyContent: "center",
    borderRadius: 5,
  },
  texttouch: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#fff",
    alignSelf: "center",
  },
  viewflat: {
    // width: width,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ffffff50",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    color: "#000",
    marginVertical: 10,
  },
  backgroundmodal: {
    width: width * 0.8,
    alignSelf: "center",
    marginTop: height * 0.2,
  },
  touchicon: {
    alignSelf: "flex-end",
    margin: 10,
  },
  textopicmodal: {
    fontFamily: "Prompt-Regular",
    fontSize: 32,
    color: "#000",
    alignSelf: "center",
  },
  textmainmodal: {
    fontFamily: "Prompt-Regular",
    fontSize: 60,
    color: "#000",
    alignSelf: "center",
    marginVertical: 50,
  },
  viewtouchmodal: {
    width: width * 0.8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 50,
  },
  touchmodal: {
    width: 120,
    height: 50,
    backgroundColor: "#393939",
    justifyContent: "center",
    borderRadius: 5,
  },
  texttouchmodal: {
    fontFamily: "Prompt-Regular",
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
  },
  touchmodalvisible: {
    width: 120,
    height: 50,
    backgroundColor: "#393939",
    justifyContent: "center",
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 50,
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
