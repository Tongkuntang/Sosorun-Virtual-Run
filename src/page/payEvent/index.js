import React, { useState } from "react";
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
import moment from "moment";
const { width, height } = Dimensions.get("window");
export default function index({ navigation, route }) {
  const dataEV = route.params.event;

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <Headerdetail item={dataEV.titel} navigation={navigation} />
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
            <FlatList
              data={dataEV.distance}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("Bib", {
                        dataEV: {
                          ...dataEV,
                          img_bibPremium: item.img_pre,
                          img_bibbasic: item.img_basic,
                          distance: item.distance,
                          price:
                            item.price.length > 0 ? parseInt(item.price) : 0,
                          fee: item?.cost,
                        },
                      });
                      console.log(item?.cost);
                    }}
                    style={styles.touch}
                  >
                    <View style={styles.viewhead}>
                      <View style={{ width: width * 0.7 }}>
                        <Text style={styles.texthead}>
                          {"ระยะทาง " + item.distance + " กม."}
                        </Text>
                        <Text style={styles.textdetail}>ระยะเวลา</Text>
                        <Text style={styles.textdetail}>
                          ตั้งแต่วันที่
                          {moment(dataEV.startDate).format("DD/MM/YYYY")} -{" "}
                          {moment(dataEV.expireDate).format("DD/MM/YYYY")}
                        </Text>
                      </View>
                      <View>
                        <View style={styles.viewprice}>
                          <Text style={styles.textprice}>
                            {item.price.length > 0
                              ? parseInt(item.price) + "บาท"
                              : "ฟรี"}
                          </Text>
                        </View>
                        <Text
                          style={[styles.texthead, { alignSelf: "center" }]}
                        >
                          {item.distance}
                        </Text>
                        <View style={styles.viewprice1}>
                          <Text
                            style={[styles.texthead, { alignSelf: "center" }]}
                          >
                            กม.
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
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
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  texthead: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#000",
  },
  viewprice: {
    width: 80,
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
});
