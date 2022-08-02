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
import Headerdetail from "../components/headerdetail";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Carousel from "react-native-snap-carousel";
import { apiservice } from "../../service/service";
import { useRecoilState } from "recoil";
import { tokenState } from "../../reducer/reducer/reducer/Atom";
const { width, height } = Dimensions.get("window");
export default function index({ navigation, item, route }) {
  const dataEV = route.params.item;
  console.log("<<<<<<<<<datadetail>>>>>>>>", dataEV);
  const award = dataEV.reward;
  // console.log(award[0].shirt[0]);
  const [datamis, setdatamis] = useState([]);
  const [token, setToken] = useRecoilState(tokenState);
  async function getresposne() {
    const resposne = await apiservice({
      path: "/event/findidjoinEvent/" + dataEV.id,
      method: "get",
      token: token.accessToken,
    });
    if (resposne.status == 200) {
      setdatamis(resposne.data.data);
    }
  }

  useEffect(() => {
    getresposne();
  }, []);

  const carouselRef = useRef();
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <Headerdetail item={dataEV.titel} navigation={navigation} />
        <ScrollView style={{ marginBottom: 50 }}>
          <View
            style={{
              width: width,
              height: height * 0.27,
              backgroundColor: "#00272C",
            }}
          >
            <Carousel
              ref={carouselRef}
              data={dataEV.img_List}
              sliderWidth={1000}
              itemWidth={1000}
              autoplay
              loop
              renderItem={({ item, index }) => {
                // console.log(item);
                return (
                  <Image
                    // resizeMode={"stretch"}
                    style={{ width: width, height: height * 0.27 }}
                    source={{
                      uri: "https://api.sosorun.com/api/imaged/get/" + item,
                    }}
                  />
                );
              }}
            />
          </View>
          <View style={styles.viewhead}>
            <View>
              <Text style={styles.textopic}>{dataEV.titel}</Text>
              <Text style={styles.textdetail}>{dataEV.discription}</Text>
            </View>
            <View>
              <View>
                <Text style={styles.textnum}>ของรางวัลที่จะได้รับ</Text>
                <View style={styles.viewprice}>
                  <View
                    style={{
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <FlatList
                      data={dataEV?.reward}
                      horizontal
                      contentContainerStyle={{ justifyContent: "center" }}
                      renderItem={({ item, index }) => {
                        return (
                          <View style={{ justifyContent: "center" }}>
                            <View
                              style={{
                                flexDirection: "row",
                                width: null,
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
                                width: null,
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
                    <TouchableOpacity style={[styles.touch, { marginTop: 15 }]}>
                      <Image
                        source={{
                          uri:
                            "https://api.sosorun.com/api/imaged/get/" +
                            dataEV?.Achievement,
                        }}
                        style={{ width: 60, height: 60, alignSelf: "center" }}
                      />
                      <Text></Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <View style={styles.view}>
                <TouchableOpacity
                  disabled
                  onPress={() =>
                    navigation.navigate("Ranking", { dataEV, type: "MISSION" })
                  }
                  style={[styles.touchrank, { opacity: 0 }]}
                >
                  <MaterialIcons
                    name="format-list-bulleted"
                    size={24}
                    color="black"
                    style={{ alignSelf: "center" }}
                  />
                  <Text style={styles.textrank}>จัดอันดับ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("RunMission", { dataEV, datamis })
                  }
                  style={styles.touchstart}
                >
                  <Text style={styles.textnum}>เริ่ม</Text>
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
  textopic: {
    fontFamily: "Prompt-Regular",
    fontSize: 34,
    color: "#000",
    marginLeft: 10,
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
    height: height * 0.65,
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
    flexDirection: "row",
    backgroundColor: "#FED652",
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
