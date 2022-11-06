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
import Headerdetail from "../components/headerdetail";
import { FontAwesome } from "@expo/vector-icons";
import { apiservice } from "../../service/service";
import {
  tokenState,
  userState,
  lans,
} from "../../reducer/reducer/reducer/Atom";
import { useRecoilState, useRecoilValue } from "recoil";
import { useIsFocused } from "@react-navigation/core";
import { timeformet } from "../components/test";
import moment from "moment";
import { getallhistory, getHistrory } from "../../action/actionhistrory";
const { width, height } = Dimensions.get("window");
export default function index({ navigation }) {
  const [user, setUser] = useRecoilState(userState);
  const [token, setKoen] = useRecoilState(tokenState);
  const [esc, setesc] = useState([]);
  const [detail, setdetail] = useState(null);
  const [data, setData] = useState([]);
  const [detail1, setdetail1] = useState(null);
  const [page, setpage] = useState([0]);
  const focus = useIsFocused();
  const [his, sethis] = useState([]);
  const lan = useRecoilValue(lans);
  async function history() {
    const gethistory = await getallhistory(token);
    sethis(gethistory.data);
    const hisday = await getHistrory({
      token,
      id: user.id,
      date: "2021-08-10",
    });
  }

  useEffect(() => {
    getHistorypayment();
    getHistorymok();
    history();
  }, [focus]);

  async function getHistorypayment() {
    const response = await apiservice({
      path: "/event/getmyEvent/" + user.id,
      token: token.accessToken,
    });
    if (response.status == 200) {
      setData(
        response.data.data.filter((i) => {
          return i.Type == "EVENT";
        })
      );
    }
  }
  const [mok, setmok] = useState([]);
  async function getHistorymok() {
    const response = await apiservice({
      path: "/event/getallmockpayment/" + user.id,
      token: token.accessToken,
    });
    if (response.status == 200) {
      setmok(
        response.data.data.filter((i) => {
          return i.Type == "EVENT";
        })
      );
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
          height: height,
          backgroundColor: "#FCC81D",
        }}
      >
        <Headerdetail item="History" navigation={navigation} />
        <ScrollView style={{ marginBottom: 30 }}>
          <View style={styles.background}>
            <View style={styles.viewbar}>
              <TouchableOpacity
                onPress={() => setpage(0)}
                style={styles.touchbar}
              >
                <Text
                  style={[
                    styles.textbar,
                    { color: page == 0 ? "#FCC81D" : "#fff" },
                  ]}
                >
                  START RUN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setpage(1)}
                style={styles.touchbar}
              >
                <Text
                  style={[
                    styles.textbar,
                    { color: page == 1 ? "#FCC81D" : "#fff" },
                  ]}
                >
                  {lan == "en" ? "VIRTUAL" : "วิ่งเก็บระยะ"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setpage(2)}
                style={styles.touchbar}
              >
                <Text
                  style={[
                    styles.textbar,
                    { color: page == 2 ? "#FCC81D" : "#fff" },
                  ]}
                >
                  {lan == "en" ? "PAYMEMT" : "ประวัติการชำระเงิน"}
                </Text>
              </TouchableOpacity>
            </View>
            {page == 0 && (
              <FlatList
                data={his}
                renderItem={({ item, index }) => {
                  // console.log("item", item);
                  return (
                    <View>
                      {detail != index ? (
                        <TouchableOpacity
                          onPress={() => {
                            setdetail(index);
                          }}
                          style={styles.touch}
                        >
                          <Text style={styles.textmain}>
                            {moment(item.createdAt).format("dddd")}
                          </Text>
                          <Text style={styles.textdetail}>
                            {moment(item.createdAt).format("DD-MM-YYYY")} /
                            {moment(item.createdAt).format("LT")}
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <View style={styles.view}>
                          <TouchableOpacity
                            onPress={() => {
                              setdetail(null);
                            }}
                            style={styles.touch1}
                          >
                            <Text style={styles.textmain}>
                              {moment(item.createdAt).format("dddd")}
                            </Text>
                            <Text style={styles.textdetail}>
                              {moment(item.createdAt).format("DD-MM-YYYY")} /
                              {moment(item.createdAt).format("LT")}
                            </Text>
                          </TouchableOpacity>
                          <View style={styles.viewdetail}>
                            <Text style={styles.textdetail}>
                              {lan == "en" ? "Duration" : "ระยะเวลา"}
                            </Text>
                            <Text style={styles.textmain}>
                              {timeformet(Math.floor(item.info.time / 3600))}{" "}
                              ชม. :
                              {timeformet(
                                Math.floor((item.info.time % 3600) / 60)
                              )}{" "}
                              น. :
                              {timeformet(
                                Math.floor((item.info.time % 3600) % 60)
                              )}
                              วิ
                            </Text>
                          </View>
                          <View style={styles.viewdetail}>
                            <Text style={styles.textdetail}>
                              {lan == "en" ? "Energy" : "พลังงาน"}
                            </Text>
                            <Text style={styles.textmain}>
                              {item.info.callery.toFixed(2)}{" "}
                              {lan == "en" ? "kcal" : "แคลอรี่"}
                            </Text>
                          </View>
                          <View style={styles.viewdetail}>
                            <Text style={styles.textdetail}>
                              {lan == "en" ? "Distance" : "ระยะทาง"}
                            </Text>
                            <Text style={styles.textmain}>
                              {item.info.distance.toFixed(2)}{" "}
                              {lan == "en" ? "km" : "กม"}.
                            </Text>
                          </View>
                          <View style={styles.viewdetail}>
                            <Text style={styles.textdetail}>
                              {lan == "en" ? "AVG Speed" : "ความเร็วเฉลี่ย"}
                            </Text>
                            <Text style={styles.textmain}>
                              {(
                                ((item.info.distance * 1000) / item.info.time) *
                                3.6
                              ).toFixed(2)}{" "}
                              {lan == "en" ? "km" : "กม"}. /{" "}
                              {lan == "en" ? "hr" : "ชม"}.
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>
                  );
                }}
              />
              // </View>
            )}
            {page == 1 && (
              <View>
                <Text style={styles.textHead}>อีเวนท์</Text>
                <FlatList
                  data={data}
                  renderItem={({ item, index }) => {
                    console.log(">>>>>>>>>>>>", item);
                    console.log(">>>>>>>>>>>>", item?.last_distance);
                    console.log(">>>>>>>>>>>>", item?.running_Time);

                    console.log((item.last_distance / item.running_Time) * 3.6);
                    return (
                      <View>
                        {detail1 != index ? (
                          <TouchableOpacity
                            onPress={() => {
                              setdetail1(index);
                            }}
                            style={styles.touch}
                          >
                            {item.event_Listt != null && (
                              <Text style={styles.textmain}>
                                {item.event_Listt.titel}
                              </Text>
                            )}

                            <Text style={styles.textdetail}>
                              {moment(item.createdAt).format("YYYY-MM-DD")}
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.view}>
                            <TouchableOpacity
                              onPress={() => {
                                setdetail1(null);
                              }}
                              style={styles.touch1}
                            >
                              <Text style={styles.textmain}>
                                {moment(item.createdAt).format("dddd")}
                              </Text>
                              <Text style={styles.textdetail}>
                                {moment(item.createdAt).format("DD-MM-YYYY")} /
                                {moment(item.createdAt).format("LT")}
                              </Text>
                            </TouchableOpacity>
                            <View style={styles.viewdetail}>
                              <Text style={styles.textdetail}>
                                {lan == "en" ? "Duration" : "ระยะเวลา"}
                              </Text>

                              <Text style={styles.textmain}>
                                {timeformet(
                                  Math.floor(item.running_Time / 3600)
                                )}{" "}
                                {lan == "en" ? "hr" : "ชม"}. :
                                {timeformet(
                                  Math.floor((item.running_Time % 3600) / 60)
                                )}{" "}
                                {lan == "en" ? "m" : "น"}. :
                                {timeformet(
                                  Math.floor((item.running_Time % 3600) % 60)
                                )}
                                {lan == "en" ? "s" : "วิ"}
                              </Text>
                            </View>
                            <View style={styles.viewdetail}>
                              <Text style={styles.textdetail}>
                                {lan == "en" ? "Energy" : "พลังงาน"}
                              </Text>
                              <Text style={styles.textmain}>
                                {item.Achievement.cal}{" "}
                                {lan == "en" ? "kcal" : "แคลอรี่"}
                              </Text>
                            </View>
                            <View style={styles.viewdetail}>
                              <Text style={styles.textdetail}>
                                {lan == "en" ? "Distance" : "ระยะทาง"}
                              </Text>
                              <Text style={styles.textmain}>
                                {(item.last_distance / 1000).toFixed(2)}{" "}
                                {lan == "en" ? "km" : "กม"}.
                              </Text>
                            </View>
                            <View style={styles.viewdetail}>
                              <Text style={styles.textdetail}>
                                {lan == "en" ? "AVG Speed" : "ความเร็วเฉลี่ย"}
                              </Text>
                              {(item.last_distance / item.running_Time) * 3.6 ==
                              "NaN" ? (
                                <Text style={styles.textmain}>
                                  0.00 {lan == "en" ? "km" : "กม"}. /{" "}
                                  {lan == "en" ? "hr" : "ชม"}.
                                </Text>
                              ) : (
                                <Text style={styles.textmain}>
                                  {item?.last_distance == 0
                                    ? "0.00"
                                    : (
                                        ((item?.last_distance || 0) /
                                          (item?.running_Time || 0)) *
                                        3.6
                                      ).toFixed(2)}{" "}
                                  {lan == "en" ? "km" : "กม"}. /{" "}
                                  {lan == "en" ? "hr" : "ชม"}.
                                </Text>
                              )}
                            </View>
                          </View>
                        )}
                      </View>
                    );
                  }}
                />
              </View>
            )}
            {page == 2 && (
              <View style={styles.viewHis}>
                <FlatList
                  data={mok}
                  renderItem={({ item, index }) => {
                    console.log("item>>>>>>>>>>>>>", item);
                    return (
                      <View>
                        <View style={styles.viewsty}>
                          <Image
                            style={styles.viewbox}
                            source={{
                              uri:
                                "https://api.sosorun.com/api/imaged/get/" +
                                item.img_event,
                            }}
                          />
                          <View style={{ marginLeft: 30 }}>
                            <Text style={styles.textdetail}>
                              {item.event_name}
                            </Text>
                            <Text style={styles.textHis}>
                              ผ่านทางบัตรเครดิตหมายเลข 444X-XXXX-XXXX
                            </Text>
                            <Text style={styles.textHis}>
                              ราคา {item.pay_status} บาท
                            </Text>
                          </View>
                        </View>
                        <Text
                          style={[styles.textHis, { alignSelf: "flex-end" }]}
                        >
                          {moment(new Date()).diff(item.updatedAt, "minutes") >
                          60
                            ? moment(item.updatedAt).format("DD-MMMM-YYYY")
                            : moment(new Date()).diff(
                                item.updatedAt,
                                "minutes"
                              )}{" "}
                          {moment(new Date()).diff(item.updatedAt, "minutes") >
                          60
                            ? ""
                            : "นาทีที่แล้ว"}
                        </Text>
                        <View style={styles.line} />
                      </View>
                    );
                  }}
                />
              </View>
            )}
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
    backgroundColor: "#FBC71C",
  },
  textHead: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    color: "#000",
    marginLeft: 10,
    fontWeight: "800",
    marginTop: 20,
  },
  touch: {
    width: width,
    height: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#fff",
    paddingHorizontal: 20,
  },
  touch1: {
    width: width * 0.95,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 20,
  },
  textmain: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000000",
    fontWeight: "500",
  },
  textdetail: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
  },
  view: {
    width: width,
    backgroundColor: "#fff",
    padding: 20,
  },
  viewdetail: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  viewbar: {
    width: width,
    height: 30,
    backgroundColor: "#393939",
    justifyContent: "space-between",
    alignSelf: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  touchbar: {
    alignSelf: "center",
    justifyContent: "center",
  },
  textbar: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    alignSelf: "center",
  },
  textHis: {
    fontFamily: "Prompt-Regular",
    fontSize: 10,
    color: "#000",
  },
  viewHis: {
    width: width,
    height: height,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    justifyContent: "flex-start",
  },
  viewbox: {
    width: 64,
    height: 64,
    backgroundColor: "#DBDBDB",
  },
  viewsty: {
    height: 70,
    flexDirection: "row",
    marginTop: 20,
  },
  line: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#FBC71C",
    marginVertical: 10,
  },
});
