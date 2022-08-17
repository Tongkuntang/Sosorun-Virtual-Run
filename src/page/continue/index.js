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
import {
  SimpleLineIcons,
  FontAwesome5,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import HeaderFree from "../components/headerfree";
import { apiservice } from "../../service/service";
import { useIsFocused } from "@react-navigation/core";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { timeformet } from "../components/test";
const { width, height } = Dimensions.get("window");
export default function index({ navigation }) {
  const focus = useIsFocused();
  const [user, setUser] = useRecoilState(userState);
  const [token, setKoen] = useRecoilState(tokenState);
  const [event, setevent] = useState(false);
  const [mission, setmission] = useState(true);
  const [level, setlevel] = useState(true);
  const [data, setData] = useState([]);
  // console.log("data", data);
  useEffect(() => {
    getHistorypayment();
  }, [focus]);

  async function getHistorypayment() {
    const response = await apiservice({
      path: "/event/getmyEvent/" + user.id,
      token: token.accessToken,
    });

    // console.log("datave", response);
    if (response.status == 200) {
      setData(
        response.data.data.filter((item) => {
          return item.last_distance <= item.total_distance;
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
        <HeaderFree navigation={navigation} />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 30 }}
        >
          <View style={styles.background}>
            <View style={styles.backimg}>
              <Image
                style={styles.imgmap}
                source={{
                  uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/soso1.png",
                }}
              />
            </View>
            <View>
              <TouchableOpacity
                onPress={() => setevent((val) => !val)}
                style={styles.touch}
              >
                <Text style={styles.text}>เวอร์ชวล</Text>
                <View style={{ flexDirection: "row", marginRight: 20 }}>
                  <View style={styles.re}>
                    <Text style={styles.text}>
                      {
                        data.filter(
                          (i) =>
                            i.last_distance < i.total_distance &&
                            i.Type == "EVENT" &&
                            i.status == null &&
                            i?.event_Listt?.Type != "Eventonroad"
                        ).length
                      }
                    </Text>
                  </View>
                  <FontAwesome
                    name="caret-right"
                    size={29}
                    color="black"
                    style={{ alignSelf: "center", marginLeft: 20 }}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.line} />
            </View>
            <FlatList
              data={data.filter(
                (i) =>
                  i.last_distance < i.total_distance &&
                  i.Type == "EVENT" &&
                  i.status == null &&
                  i?.event_Listt?.Type != "Eventonroad"
              )}
              renderItem={({ item, index }) => {
                console.log("item", item);
                const total_distance = item.event_Listt.distance
                  .filter((items) => {
                    return items.price == item.pay_status;
                  })
                  .map((items) => items.distance)?.[0];
                return (
                  <View>
                    {event == true && (
                      <View>
                        <View style={styles.view}>
                          <Text style={styles.nameevent}>
                            {item.event_name}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              // navigation.navigate("Campaign", { item })
                              {
                                console.log(item?.distance);
                                const dataEV = item?.event_Listt;
                                navigation.navigate("RunEvant", {
                                  dataEV: {
                                    ...dataEV,
                                    distance: dataEV.distance
                                      .filter((items) => {
                                        return (
                                          items.price ==
                                          data.filter(
                                            (item) =>
                                              item?.event_id == dataEV.id
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
                                });

                                // navigation.navigate("RunEvant", {
                                //   BIB: item.bib,
                                //   dataEV: {
                                //     ...item.event_List,
                                //     distance: item.event_Listt.distance
                                //       .filter((items) => {
                                //         return items.price == item.pay_status;
                                //       })
                                //       .map((items) => items.distance),
                                //   },
                                //   ...item,
                                // });
                              }
                            }
                            style={styles.viewbottom}
                          >
                            <Text style={styles.texttail}>เลือก</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.texttime}>
                          {timeformet(Math.floor(item.running_Time / 3600))} ชม.
                          :{" "}
                          {timeformet(
                            Math.floor((item.running_Time % 3600) / 60)
                          )}{" "}
                          น. :
                          {timeformet(
                            Math.floor((item.running_Time % 3600) % 60)
                          )}{" "}
                          วิ
                        </Text>
                        <View style={styles.viewtext}>
                          <View style={styles.viewsmall}>
                            <Text style={styles.text1}>ระยะทางทั้งหมด</Text>
                            <Text style={styles.text2}>
                              {parseFloat(total_distance).toFixed(2)} กม.
                            </Text>
                          </View>
                          <View style={styles.viewsmall}>
                            <Text style={styles.text1}>ระยะทางที่ทำได้</Text>
                            <Text style={styles.text2}>
                              {(item.last_distance / 1000).toFixed(2)} กม.
                            </Text>
                          </View>
                          <View style={styles.viewsmall}>
                            <Text style={styles.text1}>ระดับความสำเร็จ</Text>
                            <Text style={styles.text2}>
                              {(
                                ((item.last_distance / 1000).toFixed(2) * 100) /
                                parseFloat(total_distance).toFixed(2)
                              ).toFixed(2)}
                              %
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                );
              }}
            />

            <View>
              <TouchableOpacity
                onPress={() => setmission((val) => !val)}
                style={[styles.touch]}
              >
                <Text style={styles.text}>ภารกิจ</Text>
                <View style={{ flexDirection: "row", marginRight: 20 }}>
                  <View style={styles.re}>
                    <Text style={styles.text}>
                      {
                        data.filter(
                          (i) =>
                            i.last_distance < i.total_distance &&
                            i.Type == "MISSION" &&
                            i.status == null
                        ).length
                      }
                    </Text>
                  </View>
                  <FontAwesome
                    name="caret-right"
                    size={29}
                    color="black"
                    style={{ alignSelf: "center", marginLeft: 20 }}
                  />
                </View>
              </TouchableOpacity>
              <View style={styles.line} />
            </View>
            <FlatList
              data={data.filter(
                (i) =>
                  i.last_distance < i.total_distance &&
                  i.Type == "MISSION" &&
                  i.status == null
              )}
              renderItem={({ item, index }) => {
                // console.log("item", item);
                // console.log("esc", index);
                return (
                  <View>
                    {mission == false && (
                      <View>
                        <View style={styles.view}>
                          <Text style={styles.nameevent}>
                            {item.event_name}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              // navigation.navigate("Campaign", { item })
                              navigation.navigate("FromContinue", {
                                dataEV: item,
                                ...item,
                              })
                            }
                            style={styles.viewbottom}
                          >
                            <Text style={styles.texttail}>เลือก</Text>
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.texttime}>
                          {timeformet(Math.floor(item.running_Time / 3600))} ชม.
                          :{" "}
                          {timeformet(
                            Math.floor((item.running_Time % 3600) / 60)
                          )}{" "}
                          น. :
                          {timeformet(
                            Math.floor((item.running_Time % 3600) % 60)
                          )}{" "}
                          วิ
                        </Text>
                        <View style={styles.viewtext}>
                          <View style={styles.viewsmall}>
                            <Text style={styles.text1}>ระยะทางทั้งหมด</Text>
                            <Text style={styles.text2}>
                              {(item.total_distance / 1000).toFixed(2)} กม.
                            </Text>
                          </View>
                          <View style={styles.viewsmall}>
                            <Text style={styles.text1}>ระยะทางที่ทำได้</Text>
                            <Text style={styles.text2}>
                              {(item.last_distance / 1000).toFixed(2)} กม.
                            </Text>
                          </View>
                          <View style={styles.viewsmall}>
                            <Text style={styles.text1}>ระดับความสำเร็จ</Text>
                            <Text style={styles.text2}>
                              {(
                                ((item.last_distance / 1000).toFixed(2) * 100) /
                                (item.total_distance / 1000).toFixed(2)
                              ).toFixed(2)}
                              %
                            </Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                );
              }}
            />
            {level ? (
              <View>
                <TouchableOpacity
                  disabled
                  onPress={() => setlevel(false)}
                  style={[styles.touch, { opacity: 0.2 }]}
                >
                  <Text style={styles.text}>เลื่อนขั้น</Text>
                  <View style={{ flexDirection: "row", marginRight: 20 }}>
                    <View style={styles.re}>
                      <Text style={styles.text}>0</Text>
                    </View>
                    <FontAwesome
                      name="caret-right"
                      size={29}
                      color="black"
                      style={{ alignSelf: "center", marginLeft: 20 }}
                    />
                  </View>
                </TouchableOpacity>
                <View style={styles.line} />
              </View>
            ) : (
              <View>
                <TouchableOpacity
                  onPress={() => setlevel(true)}
                  style={styles.touch}
                >
                  <Text style={styles.text}>เลื่อนขั้น</Text>
                  <View style={{ flexDirection: "row", marginRight: 20 }}>
                    <View style={styles.re}>
                      <Text style={styles.text}>0</Text>
                    </View>
                    <FontAwesome
                      name="caret-down"
                      size={29}
                      color="black"
                      style={{ alignSelf: "center", marginLeft: 20 }}
                    />
                  </View>
                </TouchableOpacity>
                <View style={styles.view}>
                  <Text style={styles.nameevent}>ภารกิจเลื่อนยศ ระดับ1</Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Campaign")}
                    style={styles.viewbottom}
                  >
                    <Text style={styles.texttail}>เลือก</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.texttime}>เวลา 06 ชม. : 00 น. : 00 วิ</Text>
                <View style={styles.viewtext}>
                  <View style={styles.viewsmall}>
                    <Text style={styles.text1}>ระยะทางทั้งหมด</Text>
                    <Text style={styles.text2}>100 กม.</Text>
                  </View>
                  <View style={styles.viewsmall}>
                    <Text style={styles.text1}>ระยะทางที่ทำได้</Text>
                    <Text style={styles.text2}>9.99 กม.</Text>
                  </View>
                  <View style={styles.viewsmall}>
                    <Text style={styles.text1}>ระดับความสำเร็จ</Text>
                    <Text style={styles.text2}>9.99%</Text>
                  </View>
                </View>
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
    backgroundColor: "#FCC81D",
  },
  backimg: {
    width: width,
    height: height * 0.2,
    backgroundColor: "#393939",
  },
  imgmap: {
    width: width,
    height: height * 0.2,
    alignSelf: "center",
  },
  touch: {
    width: width,
    height: 30,
    flexDirection: "row",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    marginTop: 20,
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#000",
    alignSelf: "center",
  },
  re: {
    width: 32,
    height: 32,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignSelf: "center",
  },
  line: {
    width: width,
    borderBottomWidth: 0.5,
    borderBottomColor: "#393939",
    marginVertical: 10,
  },
  view: {
    width: width,
    height: 30,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: 10,
  },
  viewbottom: {
    width: 72,
    height: 24,
    alignSelf: "center",
    backgroundColor: "#393939",
    justifyContent: "center",
    borderRadius: 10,
  },
  nameevent: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    alignSelf: "center",
  },
  texttail: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#fff",
    alignSelf: "center",
    fontWeight: "bold",
  },
  texttime: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
    marginVertical: 10,
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
    justifyContent: "space-between",
    height: height * 0.1,
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
});
