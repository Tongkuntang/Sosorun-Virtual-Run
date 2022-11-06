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
} from "react-native";
import Headerevent from "../components/headerevent";
import Page0 from "./page0";
import Page1 from "./page1";
import Page2 from "./page2";
import { LinearGradient } from "expo-linear-gradient";
import { getAllbanner, getBanNer } from "../../action/actionbanner";
import Carousel from "react-native-snap-carousel";
import { useRecoilState, useRecoilValue } from "recoil";
import { lans, tokenState } from "../../reducer/reducer/reducer/Atom";
import Imagescalable from "react-native-scalable-image";
const { width, height } = Dimensions.get("window");

export default function index({ navigation }) {
  const lan = useRecoilValue(lans);
  const [Visible, setVisible] = useState(false);
  const [token, setToken] = useRecoilState(tokenState);
  const [page, setpage] = useState(0);
  const carouselRef = useRef();
  const [banner, setbanner] = useState([]);
  const [banner1, setbanner1] = useState([]);

  async function allbanner() {
    token?.role == "VIP" && setpage(1);
    const getbanner = await getAllbanner(token);
    const page = getbanner.data[0].page;

    setbanner(getbanner.data);
    const getbanner1 = await getBanNer({ token, page: page });
    setbanner1(getbanner1.data[0].img_list);
  }

  useEffect(() => {
    allbanner();
  }, [token]);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <Headerevent
          item={lan == "en" ? "All event" : "อีเวนท์ทั้งหมด"}
          navigation={navigation}
        />
        <Modal
          animationType="none"
          transparent={true}
          visible={Visible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setVisible(!Visible);
          }}
        >
          <View style={{ flex: 1, backgroundColor: "#000000bb" }}>
            <LinearGradient
              colors={["#FCC81D", "#EFD98F", "#EEE6CB", "#C29709"]}
              style={styles.backgroundmodal}
            >
              <Text
                style={{
                  fontFamily: "Prompt-Regular",
                  fontSize: 32,
                  color: "#000",
                  textAlign: "center",
                  paddingHorizontal: 10,
                  marginVertical: 30,
                }}
              >
                {lan == "en"
                  ? `You can't join 
because does not 
meet the conditions`
                  : "คุณไม่สามารถเข้าร่วม รายการนี้ได้ เนื่องจาก ไม่ตรงตามเงื่อนไข"}
              </Text>
              <TouchableOpacity
                onPress={() => setVisible(!Visible)}
                style={styles.touchmodal}
              >
                <Text style={styles.go}>{lan == "en" ? "OK" : "ตกลง"}</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>
        <View style={styles.viewpage}>
          <TouchableOpacity
            disabled={token?.role == "VIP"}
            onPress={() => setpage(0)}
            style={[
              styles.touchpage,
              { borderBottomColor: page == 0 ? "#000" : "#fff" },
            ]}
          >
            <Text style={styles.text}>
              {lan == "en" ? "Mission" : "ภารกิจ"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setpage(1)}
            style={[
              styles.touchpage,
              { borderBottomColor: page == 1 ? "#000" : "#fff" },
            ]}
          >
            <Text style={styles.text}>
              {lan == "en" ? "Virtual Run " : "เวอร์ชวล"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={token?.role == "VIP"}
            onPress={() => setpage(2)}
            style={[
              styles.touchpage,
              { borderBottomColor: page == 2 ? "#000" : "#fff" },
            ]}
          >
            <Text style={styles.text}>
              {lan == "en" ? "Next Lv" : "เลื่อนขั้น"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.viewback}>
          {page == 0 && <Page0 navigation={navigation} />}
          {page == 1 && <Page1 navigation={navigation} />}
          {page == 2 && <Page2 navigation={navigation} />}
        </View>
      </View>
      <View
        style={{
          position: "absolute",
          width: width,
          height: height * 0.2,
          bottom: 0,
        }}
      >
        <Carousel
          ref={carouselRef}
          data={banner1}
          sliderWidth={Dimensions.get("window").width}
          itemWidth={Math.round(width * 1)}
          autoplay
          loop
          inactiveSlideScale={1}
          renderItem={({ item, index }) => {
            // console.log("129", item);
            return (
              <View>
                <Image
                  style={{ width: width, height: height * 0.2 }}
                  source={{
                    uri: "https://api.sosorun.com/api/imaged/get/" + item,
                  }}
                  // style={{ backgroundColor: "red" }}
                  // style={{ marginLeft: -width * 0.22, marginTop: -width * 0.2 }}
                />
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    alignSelf: "stretch",
    width: width,
    height: height,
  },
  fitImageWithSize: {
    height: width * 0.3,
    width: width,
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 18,
    color: "#000",
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
  viewback: {
    width: width,
    height: height - height * 0.31,
    backgroundColor: "#FCC81D",
    marginTop: -5,
  },

  backgroundmodal: {
    width: width * 0.9,
    alignSelf: "center",
    backgroundColor: "red",
    marginVertical: height * 0.15,
    paddingHorizontal: 20,
  },
  touchmodal: {
    width: width * 0.6,
    height: 48,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 20,
    backgroundColor: "#393939",
    borderRadius: 5,
  },
  go: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#fff",
    alignSelf: "center",
  },
});
