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
import HeaderFree from "../components/headerfree";
import { FontAwesome } from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import moment from "moment";
import { getHistrory, getresultsrunning } from "../../action/actionhistrory";
import { useIsFocused } from "@react-navigation/core";
import { apiservice } from "../../service/service";
import { autolize_Lv } from "../../json/utils";
import { timeformet } from "../components/test";
const { width, height } = Dimensions.get("window");
export default function missionfrom({ navigation, route, onPress }) {
  const dataEV = route.params.dataEV;
  // console.log("dataEV", dataEV);
  const [OK, setOK] = useState(true);
  const [detail, setdetail] = useState(true);
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);
  // console.log(user);
  const [Visible, setVisible] = useState(false);
  const [his, sethis] = useState([]);
  const [state, setstate] = useState([]);
  // console.log("00000000", state[0] != undefined && state[0]);
  const time = state[0] != undefined && state[0].running_Time;
  async function history() {
    const resposne = await apiservice({
      path: "/event/findidjoinEvent/" + dataEV.id,
      method: "get",
      token: token.accessToken,
    });
    console.log("42", resposne);
    const id = resposne.data.data[0].id;
    const gethistory = await getresultsrunning({ token, ID: id });
    if (gethistory.status == 200) {
      sethis(gethistory.data.data);
    }

    const response1 = await apiservice({
      path: "/event/getmyEvent/" + user.id,
      token: token.accessToken,
    });
    if (response1.status == 200) {
      setstate(
        response1.data.data.filter((i) => {
          return (
            i.id == gethistory.data[0].joinEvent_id &&
            i.Type == "MISSION" &&
            i.status == null
          );
        })
      );
    }
    // console.log("data1234");
  }

  useEffect(() => {
    history();
  }, [token]);

  console.log("1111", his);
  if (his[0] != null) {
    const start0 = his[0].info.time;
    var cal0 = his[0].info.callery;
    var dis0 = his[0].info.distance.toFixed(2);
    var AVG0 = (((dis0 * 1000) / start0) * 3.6).toFixed(2);
    var hh0 = timeformet(Math.floor(start0 / 3600));
    var mm0 = timeformet(Math.floor((start0 % 3600) / 60));
    var ss0 = timeformet(Math.floor((start0 % 3600) % 60));
    // console.log("gethistory", AVG0);
  }
  if (his[1] != null) {
    const start1 = his[1].info.time;
    var cal1 = his[1].info.callery;
    var dis1 = his[1].info.distance.toFixed(2);
    var AVG1 = (((dis1 * 1000) / start1) * 3.6).toFixed(2);
    var hh1 = timeformet(Math.floor(start1 / 3600));
    var mm1 = timeformet(Math.floor((start1 % 3600) / 60));
    var ss1 = timeformet(Math.floor((start1 % 3600) % 60));
    var createdAt = his[1].createdAt;
    // console.log("gethistory", AVG1);
  }
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <HeaderFree navigation={navigation} />
        <ScrollView style={{ marginBottom: 50 }}>
          <Modal
            animationType="none"
            transparent={true}
            visible={Visible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setVisible(!Visible);
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "#000000bb",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: width * 0.9,
                  backgroundColor: "#FBC71C",
                  borderRadius: 10,
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                <Image
                  source={{
                    uri:
                      "https://api.sosorun.com/api/imaged/get/" +
                      dataEV.img_title,
                  }}
                  style={{ width: width * 0.9, height: height * 0.3 }}
                />

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Prompt-Regular",
                      fontSize: 16,
                      color: "#000",
                      marginHorizontal: 10,
                    }}
                  >
                    {dataEV.titel}
                  </Text>
                </View>
                <Text
                  minimumFontScale={50}
                  style={{
                    fontFamily: "Prompt-Regular",
                    fontSize: 16,
                    color: "#000",
                    marginHorizontal: 10,
                    marginTop: 20,
                  }}
                >
                  {dataEV.discription}
                </Text>
                {/* <Text
                      style={{
                        fontFamily: "Prompt-Regular",
                        fontSize: 16,
                        color: "#000",
                        alignSelf: "center",
                        marginTop: 40,
                      }}
                    >
                      ของรางวัลที่จะได้รับ
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        justifyContent: "space-between",
                        width: width * 0.9,
                        marginBottom: 10,
                      }}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          alignSelf: "center",
                          width: 80,
                          height: 80,
                          borderRadius: 40,
                        }}
                      >
                        <Image
                          source={{
                            uri:
                              "https://api.sosorun.com/api/imaged/get/" +
                              dataEV.reward.shirtList,
                          }}
                          style={{ width: 60, height: 60, alignSelf: "center" }}
                        />
                        <Text></Text>
                      </View>
                      <View
                        style={{
                          justifyContent: "center",
                          alignSelf: "center",
                          width: 80,
                          height: 80,
                          borderRadius: 40,
                        }}
                      >
                        <Image
                     source={{
                        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group2835.png",
                      }}
                          style={{ width: 54, height: 49, alignSelf: "center" }}
                        />
                        <Text
                          style={{
                            fontFamily: "Prompt-Regular",
                            fontSize: 16,
                            color: "#000",
                            alignSelf: "center",
                          }}
                        >
                          {dataEV.reward.dimond}
                        </Text>
                      </View>
                      <View
                        style={{
                          justifyContent: "center",
                          alignSelf: "center",
                          width: 80,
                          height: 80,
                          borderRadius: 40,
                        }}
                      >
                        <Image
                       source={{
                        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
                      }}
                          style={{ width: 54, height: 54, alignSelf: "center" }}
                        />
                        <Text
                          style={{
                            fontFamily: "Prompt-Regular",
                            fontSize: 16,
                            color: "#000",
                            alignSelf: "center",
                          }}
                        >
                          {dataEV.reward.coin}
                        </Text>
                      </View>
                    </View> */}
                <TouchableOpacity
                  onPress={() => setVisible(!Visible)}
                  style={{
                    width: 129,
                    height: 54,
                    backgroundColor: "#393939",
                    borderRadius: 5,
                    justifyContent: "center",
                    alignSelf: "center",
                    marginBottom: 20,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Prompt-Regular",
                      fontSize: 18,
                      color: "#fff",
                      alignSelf: "center",
                    }}
                  >
                    ตกลง
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <View style={styles.background}>
            <View style={{ paddingHorizontal: 20 }}>
              <View style={styles.view}>
                <Text style={styles.text}>สะสมแต้มไปแล้ว 70 แต้ม</Text>
                {/* <TouchableOpacity
                      onPress={() => setVisible(true)}
                      style={styles.styletouch}
                    >
                      <Text style={[styles.text, { alignSelf: "center" }]}>
                        ข้อมูลอีเวนท์
                      </Text>
                    </TouchableOpacity> */}
              </View>
              <View
                style={[
                  styles.view,
                  { borderBottomWidth: 0.5 },
                  { borderBottomColor: "#fff" },
                ]}
              >
                <View style={styles.smallview}>
                  <Text style={styles.text}>ระยะเวลาที่ทำได้</Text>
                  {hh0 + mm0 + ss0 == hh1 + mm1 + ss1 && (
                    <View style={{ marginTop: -10 }}>
                      <FontAwesome name="caret-up" size={29} color="black" />
                      <FontAwesome
                        name="caret-down"
                        size={29}
                        color="black"
                        style={{ marginTop: -15 }}
                      />
                    </View>
                  )}
                  {hh0 + mm0 + ss0 > hh1 + mm1 + ss1 && (
                    <FontAwesome name="caret-up" size={29} color="green" />
                  )}
                  {hh0 + mm0 + ss0 < hh1 + mm1 + ss1 && (
                    <FontAwesome name="caret-down" size={29} color="red" />
                  )}
                </View>
                <Text style={styles.text}>
                  {hh0} ชม. : {mm0} น. : {ss0} วิ
                </Text>
              </View>
              <View
                style={[
                  styles.view,
                  { borderBottomWidth: 0.5 },
                  { borderBottomColor: "#fff" },
                ]}
              >
                <View style={styles.smallview}>
                  <Text style={styles.text}>พลังงานที่ใช้ไป</Text>
                  {cal0 == cal1 && (
                    <View style={{ marginTop: -10 }}>
                      <FontAwesome name="caret-up" size={29} color="black" />
                      <FontAwesome
                        name="caret-down"
                        size={29}
                        color="black"
                        style={{ marginTop: -15 }}
                      />
                    </View>
                  )}
                  {cal0 > cal1 && (
                    <FontAwesome name="caret-up" size={29} color="green" />
                  )}
                  {cal0 < cal1 && (
                    <FontAwesome name="caret-down" size={29} color="red" />
                  )}
                </View>
                <Text style={styles.text}>{cal0} แคลอรี่</Text>
              </View>
              <View
                style={[
                  styles.view,
                  { borderBottomWidth: 0.5 },
                  { borderBottomColor: "#fff" },
                ]}
              >
                <View style={styles.smallview}>
                  <Text style={styles.text}>ความเร็วเฉลี่ย</Text>
                  {AVG0 == AVG1 && (
                    <View style={{ marginTop: -10 }}>
                      <FontAwesome name="caret-up" size={29} color="black" />
                      <FontAwesome
                        name="caret-down"
                        size={29}
                        color="black"
                        style={{ marginTop: -15 }}
                      />
                    </View>
                  )}
                  {AVG0 > AVG1 && (
                    <FontAwesome name="caret-up" size={29} color="green" />
                  )}
                  {AVG0 < AVG1 && (
                    <FontAwesome name="caret-down" size={29} color="red" />
                  )}
                </View>
                <Text style={styles.text}>{AVG0} กม. / ชม.</Text>
              </View>
              {/* <View style={styles.view}>
                <View style={styles.smallview}>
                  <Text style={styles.text}>รวมสะสม</Text>
                </View>
                {time != null && (
                  <Text style={styles.text}>
                    {Math.floor(time / 3600)} ชม. :
                    {Math.floor((time % 3600) / 60)} น. :
                    {Math.floor((time % 3600) % 60)} วิ
                  </Text>
                )}
              </View> */}
              {/* <View style={styles.view}>
                <View style={styles.smallview}>
                  <Text style={styles.text}></Text>
                </View>
                {parseInt(cal0) + parseInt(cal1) == "NaN" ? (
                  <Text style={styles.text}>{parseInt(cal0)} แคลอรี่</Text>
                ) : (
                  <Text style={styles.text}>
                    {parseInt(cal0) + parseInt(cal1)} แคลอรี่
                  </Text>
                )}
              </View> */}
            </View>
            {/* <View style={{ marginTop: 10 }}>
                  <View style={styles.viewtext}>
                    <View style={styles.viewsmall}>
                      <Text style={styles.text1}>ระยะทางทั้งหมด</Text>
                    </View>
                    <View style={styles.viewsmall}>
                      <Text style={styles.text1}>ระยะทางที่ทำได้</Text>
                    </View>
                    <View style={styles.viewsmall}>
                      <Text style={styles.text1}>ระดับความสำเร็จ</Text>
                    </View>
                  </View>
                  <View style={styles.viewtext}>
                    <View style={styles.viewsmall1}>
                      <Text style={styles.text2}>
                        {dataEV.distance != undefined && dataEV.distance[0]}
                        กม.
                      </Text>
                    </View>
                    <View style={styles.viewsmall1}>
                      <Text style={styles.text2}>0.00 กม.</Text>
                    </View>
                    <View style={styles.viewsmall}>
                      <Text style={styles.text2}>
                        {(
                                    ((item.last_distance / 1000).toFixed(2) * 100) /
                                    (item.total_distance / 1000).toFixed(2)
                                  ).toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                </View> */}
            <View style={{ paddingHorizontal: 20 }}>
              {detail ? (
                <View style={styles.view}>
                  <Text style={styles.tetxdetail}>
                    ดูประวัติการวิ่งย้อนหลัง
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      // navigation.navigate("HistoryAll");
                      setdetail(false);
                    }}
                  >
                    <FontAwesome name="caret-right" size={29} color="black" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={styles.view}>
                    <Text style={styles.tetxdetail}>
                      ดูประวัติการวิ่งย้อนหลัง
                    </Text>
                    <TouchableOpacity onPress={() => setdetail(true)}>
                      <FontAwesome name="caret-down" size={29} color="black" />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.text}>
                    {moment(createdAt).format("DD-MM-YYYY")} /
                    {moment(createdAt).format("LT")}
                  </Text>
                  <View
                    style={[
                      styles.view,
                      { borderBottomWidth: 0.5 },
                      { borderBottomColor: "#fff" },
                    ]}
                  >
                    <Text style={styles.text}>ระยะเวลาที่ทำได้</Text>
                    <Text style={styles.text}>
                      {hh1} ชม. : {mm1} น. : {ss1} วิ
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.view,
                      { borderBottomWidth: 0.5 },
                      { borderBottomColor: "#fff" },
                    ]}
                  >
                    <Text style={styles.text}>พลังงานที่ใช้ไป</Text>
                    <Text style={styles.text}>{cal1} แคลอรี่</Text>
                  </View>

                  <View
                    style={[
                      styles.view,
                      { borderBottomWidth: 0.5 },
                      { borderBottomColor: "#fff" },
                    ]}
                  >
                    <Text style={styles.text}>ความเร็วเฉลี่ย</Text>
                    <Text style={styles.text}>{AVG1} กม. / ชม.</Text>
                  </View>
                </View>
              )}
              <TouchableOpacity
                onPress={() => navigation.navigate("HistoryAll")}
                style={styles.view}
              >
                <Text style={styles.tetxdetail}>ประวัติการวิ่งทั้งหมด</Text>
              </TouchableOpacity>
              <View style={styles.view}>
                <Text style={[styles.tetxdetail, { alignSelf: "center" }]}>
                  Get the prize
                </Text>
                {autolize_Lv(parseInt(user.user_accounts.total_distance)).lv >=
                2 ? (
                  <TouchableOpacity onPress={onPress} style={styles.touch}>
                    <Text style={styles.textok}>OK</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.touchclose, { opacity: 0.5 }]}>
                    <Text style={styles.textok}>OK</Text>
                  </View>
                )}
              </View>
              <View style={styles.view}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Home")}
                  style={styles.closes}
                >
                  <Text style={styles.textclose}>ปิด</Text>
                </TouchableOpacity>
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
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  styletouch: {
    width: 126,
    height: 28,
    backgroundColor: "#fff",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
  },
  smallview: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.4,
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
  },
  tetxdetail: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    color: "#000",
  },
  touch: {
    width: width * 0.2,
    height: 45,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#393939",
    borderRadius: 5,
    marginTop: -5,
  },
  touchclose: {
    width: width * 0.2,
    height: 45,
    alignSelf: "center",
    justifyContent: "center",
    backgroundColor: "#393939",
    borderRadius: 5,
    marginTop: -5,
  },
  textok: {
    alignSelf: "center",
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#fff",
  },
  textclose: {
    alignSelf: "center",
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#fff",
  },
  closes: {
    width: width * 0.9,
    height: 48,
    borderRadius: 5,
    backgroundColor: "#393939",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 50,
  },
  viewtext: {
    flexDirection: "row",
    width: width,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    marginVertical: 5,
  },
  viewsmall: {
    width: width * 0.28,
    alignSelf: "center",
    justifyContent: "center",
  },
  text1: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
    alignSelf: "center",
  },
  text2: {
    fontFamily: "Prompt-Regular",
    fontSize: 18,
    color: "#000",
    alignSelf: "center",
  },
  viewsmall1: {
    width: width * 0.28,
    alignSelf: "center",
    justifyContent: "center",
    borderRightWidth: 0.5,
    borderRightColor: "#00000040",
    height: 50,
  },
});
