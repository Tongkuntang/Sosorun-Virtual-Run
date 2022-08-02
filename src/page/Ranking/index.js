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
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Page0 from "./page0";
const { width, height } = Dimensions.get("window");
export default function index({ navigation, route }) {
  const [page, setpage] = useState(0);
  const type = route.params.type;
  const DataR = route.params.dataEV;
  // console.log("Dat", DataR);
  return (
    <View style={styles.container}>
      <SafeAreaView />

      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <Headerdetail item={DataR.titel} navigation={navigation} />

        <View style={styles.viewpage}>
          <TouchableOpacity
            onPress={() => setpage(0)}
            style={[
              styles.touchpage,
              { borderBottomColor: page == 0 ? "#000" : "#fff" },
            ]}
          >
            <Text style={[styles.text, { color: page == 0 ? "#000" : "#fff" }]}>
              ALL
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setpage(1)}
            style={[
              styles.touchpage,
              { borderBottomColor: page == 1 ? "#000" : "#fff" },
            ]}
          >
            <Text style={[styles.text, { color: page == 1 ? "#000" : "#fff" }]}>
              FRIENDS
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setpage(2)}
            style={[
              styles.touchpage,
              { borderBottomColor: page == 2 ? "#000" : "#fff" },
            ]}
          >
            <Text style={[styles.text, { color: page == 2 ? "#000" : "#fff" }]}>
              VIP
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ marginBottom: 90 }}>
          {page == 0 && (
            <Page0
              type={type}
              navigation={navigation}
              DataR={DataR}
              tab="all"
            />
          )}
          {page == 1 && (
            <Page0
              type={type}
              navigation={navigation}
              DataR={DataR}
              tab="friend"
            />
          )}
          {page == 2 && (
            <Page0
              type={type}
              navigation={navigation}
              DataR={DataR}
              tab="vip"
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 18,

    alignSelf: "center",
  },
  viewpage: {
    width: width,
    height: 40,
    paddingHorizontal: 50,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  touchpage: {
    alignSelf: "center",
    borderBottomWidth: 1,
  },
});
