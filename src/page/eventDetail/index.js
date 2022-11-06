import React, { useEffect, useRef, useState } from "react";
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
import Imagescalable from "react-native-scalable-image";
import Headerdetail from "../components/headerdetail";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
import { getalleventid, getmyeventid } from "../../action/actiongetall";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  lans,
  tokenState,
  userState,
} from "../../reducer/reducer/reducer/Atom";
import { set } from "react-native-reanimated";
import moment from "moment";
const { width, height } = Dimensions.get("window");
export default function index({ navigation, route }) {
  const lan = useRecoilValue(lans);
  const [state, setstate] = useState(true);
  const dataEV = route.params.item;
  const carouselRef = useRef();
  const [data, setdata] = useState([]);
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setuser] = useRecoilState(userState);
  const [event, setevent] = useState([]);
  const [BIB, setBIB] = useState("");
  const [visible, setvisible] = useState(false);
  const [price, setprice] = useState("");
  const [premium, setpremium] = useState("");

  async function allevent() {
    const getevent = await getalleventid({ token, id: dataEV.id });
    setevent(getevent.data);
    const getmy = await getmyeventid({ token, uid: user.id });
    setdata(getmy.data);
  }

  useEffect(() => {
    allevent();
    if (dataEV?.Type == "Eventonroad") {
      setvisible(true);
    }
  }, [token]);

  console.log(dataEV);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Modal visible={false} transparent style={{ flex: 1 }}>
        <View
          style={{ width: width, height: height, backgroundColor: "#000000" }}
        >
          <SafeAreaView />
          <TouchableOpacity
            onPress={() => {
              setvisible((val) => !val);
            }}
            style={{ alignSelf: "flex-end", padding: 20 }}
          >
            <Text style={[styles.textrank, { color: "#FBC71C", fontSize: 14 }]}>
              SKIP
            </Text>
          </TouchableOpacity>
          <Text style={[styles.textrank, { color: "#fff", fontSize: 16 }]}>
            เงื่อนไขในการเข้าร่วมการแข่งขัน
          </Text>
          <Text
            style={[
              styles.textrank,
              { color: "#fff", fontSize: 14, marginTop: 10 },
            ]}
          >
            ในการเข้าร่วมการแข่งขัน จำเป็นจะต้องมีอุปกรณ์ เสริม ในการเชื่อมต่อ
            กับตัวแอพพลิเคชั่นเพื่อทำ การส่งผลการวิ่ง
          </Text>
          <Text style={[styles.textrank, { color: "#fff", fontSize: 14 }]}>
            อุปกรณ์ที่ใช้ในการเชื่อมต่อ
          </Text>
          <Text style={[styles.textrank, { color: "#fff", fontSize: 14 }]}>
            1. เชื่อมต่อกับ อุปกรณ์ SOSORUN POD
          </Text>
          <Image
            style={{
              width: 90,
              height: 90,
              marginVertical: 25,
              alignSelf: "center",
            }}
            source={require("../../img/112.png")}
          />
          <Text style={[styles.textrank, { color: "#fff", fontSize: 14 }]}>
            2. เชื่อมต่อกับ นาฬิกาในแบรนด์ที่รองรับ
          </Text>
          <View style={{ flexDirection: "row", alignSelf: "center" }}>
            <Image
              resizeMode="contain"
              style={{
                width: 55,
                height: 55,
                marginVertical: 25,
                alignSelf: "center",
                marginHorizontal: 25,
              }}
              source={require("../../img/113.png")}
            />
            <Image
              resizeMode="contain"
              style={{
                width: 55,
                height: 55,
                marginVertical: 25,
                alignSelf: "center",
                marginHorizontal: 25,
              }}
              source={require("../../img/114.png")}
            />
            <Image
              resizeMode="contain"
              style={{
                width: 55,
                height: 55,
                marginVertical: 25,
                alignSelf: "center",
                marginHorizontal: 25,
              }}
              source={require("../../img/115.png")}
            />
          </View>
          <Text style={[styles.textrank, { color: "#fff", fontSize: 14 }]}>
            กรุณาตรวจสอบการรองรับของอุปกรณ์ในแต่ละรุ่นได้ที่
          </Text>
          <Text style={[styles.textrank, { color: "#fff", fontSize: 14 }]}>
            www.sosorun.com/Device
          </Text>
        </View>
      </Modal>
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
          backgroundColor: "#FBC71C",
          flex: 1,
        }}
      >
        <Headerdetail item={dataEV.titel} navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 50 }}
        >
          {state ? (
            <View
              style={{
                width: width,
                height: width * 0.5,
              }}
            >
              <Image
                resizeMode={"contain"}
                source={{
                  uri:
                    "https://api.sosorun.com/api/imaged/get/" + event.img_title,
                }}
                style={{ width: width, height: width * 0.5 }}
              />
            </View>
          ) : (
            <View
              style={{
                width: width,
                height: null,
              }}
            >
              <Carousel
                ref={carouselRef}
                data={event.img_List}
                sliderWidth={Dimensions.get("window").width}
                itemWidth={Math.round(width * 1)}
                autoplay
                loop
                inactiveSlideScale={1}
                renderItem={({ item, index }) => {
                  return (
                    <Image
                      resizeMode={"contain"}
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" +
                          item?.data?.imageRefId,
                      }}
                      style={{
                        width: width,
                        height: width * (item?.height / item?.width),
                      }}
                    />
                  );
                }}
              />
            </View>
          )}
          {state ? (
            <View style={styles.viewhead}>
              <View>
                <TouchableOpacity
                  onPress={() => setstate()}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.textopic}>{event.titel}</Text>
                  <TouchableOpacity
                    style={{ alignSelf: "center", justifyContent: "center" }}
                  >
                    <AntDesign
                      name="caretright"
                      size={14}
                      color="black"
                      style={{ alignSelf: "center", marginRight: 10 }}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
                <Text
                  numberOfLines={5}
                  minimumFontScale={50}
                  style={styles.textdetail}
                >
                  {event.discription}
                </Text>
              </View>

              <View>
                <Text
                  style={[
                    styles.textnum,
                    {
                      marginTop: 15,
                    },
                  ]}
                >
                  {lan == "en" ? "Rewards" : "ของรางวัลที่จะได้รับ"}
                </Text>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <FlatList
                      data={event?.reward}
                      horizontal
                      renderItem={({ item, index }) => {
                        return (
                          <View style={{ justifyContent: "center" }}>
                            <View
                              style={{
                                flexDirection: "row",
                              }}
                            >
                              {item.type == "โกลด์" && (
                                <Image
                                  style={{
                                    width: 35,
                                    height: 35,
                                    alignSelf: "center",
                                    marginHorizontal: 10,
                                  }}
                                  source={{
                                    uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
                                  }}
                                />
                              )}
                              {item.type == "โกลด์" && (
                                <Text style={styles.textnum}>{item?.coin}</Text>
                              )}
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                width: "30%",
                              }}
                            >
                              {item.type == "ไดมอนด์" && (
                                <Image
                                  style={{
                                    width: 35,
                                    height: 35,
                                    alignSelf: "center",
                                    marginHorizontal: 10,
                                  }}
                                  source={{
                                    uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group2835.png",
                                  }}
                                />
                              )}
                              {item.type == "ไดมอนด์" && (
                                <Text style={styles.textnum}>
                                  {item?.diamond}
                                </Text>
                              )}
                            </View>
                          </View>
                        );
                      }}
                    />
                  </View>
                  <TouchableOpacity style={[styles.touch, { marginTop: 15 }]}>
                    <Image
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" +
                          event?.Achievement,
                      }}
                      style={{ width: 60, height: 60, alignSelf: "center" }}
                    />
                    <Text></Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.view}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Ranking", {
                        dataEV,
                        type: "EVENT",
                      })
                    }
                    style={styles.touchrank}
                  >
                    <MaterialIcons
                      name="format-list-bulleted"
                      size={24}
                      color="black"
                      style={{ alignSelf: "center" }}
                    />
                    <Text style={styles.textrank}>
                      {lan == "en" ? "Ranking" : "จัดอันดับ"}
                    </Text>
                  </TouchableOpacity>
                  {data.filter((e, i) => {
                    return e.event_id == dataEV.id;
                  }).length > 0 ? (
                    <TouchableOpacity
                      disabled={
                        moment(
                          dataEV?.Type != "Eventonroad"
                            ? dataEV?.startDate
                            : moment(dataEV?.startDate).format(
                                "YYYY-MM-DDT" +
                                  dataEV?.distance
                                    ?.filter((e) => {
                                      console.log(
                                        data.filter((e, i) => {
                                          return e.event_id == dataEV.id;
                                        })?.[0]?.total_distance
                                      );
                                      return (
                                        parseFloat(e?.distance) * 1000 ==
                                        data.filter((e, i) => {
                                          return e.event_id == dataEV.id;
                                        })?.[0]?.total_distance
                                      );
                                    })?.[0]
                                    ?.time?.replace(".", ":") +
                                  ":ssZ"
                              )
                        )?.valueOf() > moment()?.valueOf()
                      }
                      onPress={() => {
                        navigation.navigate(
                          dataEV?.Type == "Eventonroad"
                            ? "SelectDevice"
                            : "RunEvant",
                          {
                            dataEV: {
                              ...dataEV,
                              distance: dataEV.distance
                                .filter((items) => {
                                  return (
                                    items.price ==
                                    data.filter(
                                      (item) => item?.event_id == dataEV.id
                                    )?.[0]?.pay_status
                                  );
                                })
                                .map((items) => items.distance),
                            },
                            BIB: data.filter(
                              (e, i) => e.event_id == dataEV.id
                            )[0].bib,
                            ...data.filter(
                              (e, i) => e.event_id == dataEV.id
                            )[0],
                            id: data.filter(
                              (e, i) => e.event_id == dataEV.id
                            )[0].id,
                          }
                        );
                      }}
                      style={styles.touchstart}
                    >
                      <Text style={[styles.textnum]}>
                        {lan == "en" ? "Start" : "เริ่ม"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      disabled={
                        moment(dataEV?.startDate).valueOf() < moment().valueOf()
                      }
                      onPress={() => navigation.navigate("PayEvent", { event })}
                      style={styles.touchstart}
                    >
                      <Text style={styles.textnum}>
                        {moment(dataEV?.startDate).valueOf() <
                        moment().valueOf()
                          ? lan == "en"
                            ? "Time up"
                            : "หมดเวลา"
                          : lan == "en"
                          ? "Pay"
                          : "ชำระเงิน"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.viewhead1}>
              <View>
                <TouchableOpacity
                  onPress={() => setstate(true)}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.textopic}>{event.titel}</Text>
                  <TouchableOpacity
                    style={{ alignSelf: "center", justifyContent: "center" }}
                  >
                    <AntDesign
                      name="caretdown"
                      size={14}
                      color="black"
                      style={{ alignSelf: "center", marginRight: 10 }}
                    />
                  </TouchableOpacity>
                </TouchableOpacity>
                <Text style={styles.textdetail}>{event.discription}</Text>
              </View>

              <View style={{ marginTop: 30 }}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("WebView", {
                      url: event?.link_url,
                      title: event?.titel,
                    });
                  }}
                  style={[
                    styles.touchrank,
                    { marginVertical: 15, alignSelf: "flex-end" },
                  ]}
                >
                  <Text style={styles.textnum}>ดูรายละเอียดเพิ่มเติม</Text>
                </TouchableOpacity>
                <Text
                  style={[
                    styles.textnum,
                    {
                      marginTop: 15,
                    },
                  ]}
                >
                  {lan == "en" ? "Rewards" : "ของรางวัลที่จะได้รับ"}
                </Text>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    alignSelf: "center",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <FlatList
                      data={event?.reward}
                      horizontal
                      renderItem={({ item, index }) => {
                        return (
                          <View style={{ justifyContent: "center" }}>
                            <View
                              style={{
                                flexDirection: "row",
                              }}
                            >
                              {item.type == "โกลด์" && (
                                <Image
                                  style={{
                                    width: 35,
                                    height: 35,
                                    alignSelf: "center",
                                    marginHorizontal: 10,
                                  }}
                                  source={{
                                    uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
                                  }}
                                />
                              )}
                              {item.type == "โกลด์" && (
                                <Text style={styles.textnum}>{item?.coin}</Text>
                              )}
                            </View>
                            <View
                              style={{
                                flexDirection: "row",
                                width: "30%",
                              }}
                            >
                              {item.type == "ไดมอนด์" && (
                                <Image
                                  style={{
                                    width: 35,
                                    height: 35,
                                    alignSelf: "center",
                                    marginHorizontal: 10,
                                  }}
                                  source={{
                                    uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group2835.png",
                                  }}
                                />
                              )}
                              {item.type == "ไดมอนด์" && (
                                <Text style={styles.textnum}>
                                  {item?.diamond}
                                </Text>
                              )}
                            </View>
                          </View>
                        );
                      }}
                    />
                  </View>
                  <TouchableOpacity style={[styles.touch, { marginTop: 15 }]}>
                    <Image
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" +
                          event?.Achievement,
                      }}
                      style={{ width: 60, height: 60, alignSelf: "center" }}
                    />
                    <Text></Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.view}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Ranking", {
                        dataEV,
                        type: "EVENT",
                      })
                    }
                    style={styles.touchrank}
                  >
                    <MaterialIcons
                      name="format-list-bulleted"
                      size={24}
                      color="black"
                      style={{ alignSelf: "center" }}
                    />
                    <Text style={styles.textrank}>
                      {lan == "en" ? "Ranking" : "จัดอันดับ"}
                    </Text>
                  </TouchableOpacity>
                  {data.filter((e, i) => e.event_id == dataEV.id).length > 0 ? (
                    <TouchableOpacity
                      disabled={
                        moment(
                          dataEV?.Type != "Eventonroad"
                            ? moment(dataEV?.startDate)
                            : moment(dataEV?.startDate)?.format(
                                "YYYY-MM-DDTHH:mm:ss"
                              ) + "Z"
                        )?.valueOf() > moment()?.valueOf()
                      }
                      onPress={() => {
                        console.log(data);

                        // navigation.navigate(
                        //   dataEV?.Type == "Eventonroad"
                        //     ? "SelectDevice"
                        //     : "RunEvant",
                        //   {
                        //     dataEV: {
                        //       ...dataEV,
                        //       distance: dataEV.distance
                        //         .filter((items) => {
                        //           return items.price == dataEV.pay_status;
                        //         })
                        //         .map((items) => items.distance),
                        //     },
                        //     BIB: data.filter(
                        //       (e, i) => e.event_id == dataEV.id
                        //     )[0].bib,
                        //     ...data.filter(
                        //       (e, i) => e.event_id == dataEV.id
                        //     )[0],
                        //     id: data.filter(
                        //       (e, i) => e.event_id == dataEV.id
                        //     )[0].id,
                        //   }
                        // );
                      }}
                      style={styles.touchstart}
                    >
                      <Text style={styles.textnum}>
                        {lan == "en" ? "Start" : "เริ่ม"}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      disabled={
                        moment(dataEV?.startDate).valueOf() < moment().valueOf()
                      }
                      onPress={() => navigation.navigate("PayEvent", { event })}
                      style={styles.touchstart}
                    >
                      <Text style={styles.textnum}>
                        {moment(dataEV?.startDate).valueOf() <
                        moment().valueOf()
                          ? lan == "en"
                            ? "Time up"
                            : "หมดเวลา"
                          : lan == "en"
                          ? "Pay"
                          : "ชำระเงิน"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          )}
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
  textopic: {
    fontFamily: "Prompt-Regular",
    fontSize: 30,
    color: "#000",
    marginLeft: 10,
    width: width * 0.75,
  },
  textdetail: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    marginHorizontal: 10,
    marginTop: 20,
  },
  textnum: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    alignSelf: "center",
  },
  textrank: {
    fontFamily: "Prompt-Regular",
    fontSize: 26,
    color: "#000",
    alignSelf: "center",
    marginLeft: 5,
  },
  viewhead: {
    width: width,
    // height: height * 0.6,
    backgroundColor: "#FBC71C",
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  viewhead1: {
    width: width,
    backgroundColor: "#FBC71C",
    paddingVertical: 10,
    justifyContent: "space-between",
  },
  viewprice: {
    flexDirection: "row",
    paddingHorizontal: 50,
    justifyContent: "space-between",
    width: width,
    height: height * 0.15,
  },
  touch: {
    justifyContent: "center",
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  view: {
    width: width,
    height: height * 0.1,
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 50,
  },
  touchrank: {
    width: 170,
    height: 50,
    justifyContent: "center",
    backgroundColor: "#FED652",
    flexDirection: "row",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  touchstart: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#fff",
    justifyContent: "center",
    marginRight: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
});
