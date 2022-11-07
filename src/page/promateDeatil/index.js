import React, { useRef, useState } from "react";
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
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import Carousel from "react-native-snap-carousel";
const { width, height } = Dimensions.get("window");
export default function index({ navigation, route }) {
  const datadetail = route.params.item;
  const award = datadetail.reward;

  const carouselRef = useRef();

  console.log(datadetail?.reward);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <Headerdetail item={datadetail.titel} navigation={navigation} />
        <ScrollView>
          <View
            style={{
              width: width,
              height: height * 0.3,
              backgroundColor: "#00272C",
            }}
          >
            <Carousel
              ref={carouselRef}
              data={datadetail.img_List}
              sliderWidth={1000}
              itemWidth={1000}
              autoplay
              loop
              renderItem={({ item, index }) => {
                return (
                  <Image
                    style={{ width: width, height: height * 0.3 }}
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
              <Text style={styles.textopic}>{datadetail.titel}</Text>
              <Text style={styles.textdetail}>{datadetail.discription}</Text>
            </View>
            <View>
              <View>
                <Text
                  style={[
                    styles.textnum,
                    {
                      marginTop: 15,
                    },
                  ]}
                >
                  ของรางวัลที่จะได้รับ
                </Text>
                <View style={styles.viewprice}>
                  <View
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    <FlatList
                      data={datadetail?.reward}
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
                </View>
              </View>
              <View style={styles.view}>
                <TouchableOpacity style={styles.touchrank}>
                  <Text style={styles.textrank}>{datadetail.distance} กม.</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("RunLevel", { datadetail })
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
    fontSize: 34,
    color: "#000",
    alignSelf: "center",
  },
  viewhead: {
    width: width,
    height: height * 0.6,
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
