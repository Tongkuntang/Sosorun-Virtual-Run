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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import moment from "moment";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { getallhistory, getHistrory } from "../../action/actionhistrory";
import { getAllbanner, getBanNer } from "../../action/actionbanner";
import Carousel from "react-native-snap-carousel";
import { autolize_Lv } from "../../json/utils";
import { getLV } from "../../action/actionLV";
import { timeformet } from "../components/test";
const { width, height } = Dimensions.get("window");
export default function result({ navigation, onPress }) {
  const [page, setpage] = useState(0);
  const [OK, setOK] = useState(true);
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);
  console.log(
    "History",
    autolize_Lv(parseInt(user.user_accounts.total_distance)).lv
  );
  const [detail, setdetail] = useState(true);
  const d = Date(Date.now());
  const a = moment(d.toString()).format("YYYY-MM-DD");
  // console.log(a);
  const [his, sethis] = useState([]);
  // console.log("his", his);
  async function history() {
    const gethistory = await getallhistory(token);

    sethis(gethistory.data);
  }
  // console.log("gethistory123456332", his[0]);
  const carouselRef = useRef();
  const [banner1, setbanner1] = useState([]);
  async function allbanner() {
    const getbanner = await getAllbanner(token);
    const page = getbanner.data[2].page;
    // console.log("36", page);
    // setbanner(getbanner.data);
    const getbanner1 = await getBanNer({ token, page: page });
    setbanner1(getbanner1.data[0].img_list);
    // console.log("39", getbanner1.data[0].img_list);
  }
  const [LV, setLV] = useState([]);
  async function lvlist() {
    const get = await getLV(token);
    setLV(get.data);
  }

  useEffect(() => {
    history();
    allbanner();
    lvlist();
  }, [token]);

  if (his[0] != null) {
    const start0 = his[0].info.time;
    var cal0 = his[0].info.callery.toFixed(2);
    var dis0 = his[0].info.distance.toFixed(2);
    var AVG0 = (((dis0 * 1000) / start0) * 3.6).toFixed(2);
    var hh0 = timeformet(Math.floor(start0 / 3600));
    var mm0 = timeformet(Math.floor((start0 % 3600) / 60));
    var ss0 = timeformet(Math.floor((start0 % 3600) % 60));
  }
  if (his[1] != null) {
    const start1 = his[1].info.time;
    var cal1 = his[1].info.callery.toFixed(2);
    var dis1 = his[1].info.distance.toFixed(2);
    var AVG1 = (((dis1 * 1000) / start1) * 3.6).toFixed(2);
    var hh1 = timeformet(Math.floor(start1 / 3600));
    var mm1 = timeformet(Math.floor((start1 % 3600) / 60));
    var ss1 = timeformet(Math.floor((start1 % 3600) % 60));
    var createdAt = his[1].createdAt;
  }

  return (
    <View>
      <View style={{ paddingHorizontal: 20 }}>
        <View style={styles.view}>
          <View style={styles.smallview}>
            <Text style={styles.text}>Duration</Text>
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
            {hh0} hr : {mm0} m : {ss0} s
          </Text>
        </View>
        <View style={styles.view}>
          <View style={styles.smallview}>
            <Text style={styles.text}>Energy</Text>
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
            {/* <FontAwesome name="caret-up" size={29} color="green" /> */}
          </View>
          <Text style={styles.text}>{cal0} Calories</Text>
        </View>
        <View style={styles.view}>
          <View style={styles.smallview}>
            <Text style={styles.text}>AVG Speed</Text>
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
          <Text style={styles.text}>{AVG0} km / hr</Text>
        </View>
        <View style={styles.view}>
          <View style={styles.smallview}>
            <Text style={styles.text}>Distance</Text>
            {dis0 == dis1 && (
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
            {dis0 > dis1 && (
              <FontAwesome name="caret-up" size={29} color="green" />
            )}
            {dis0 < dis1 && (
              <FontAwesome name="caret-down" size={29} color="red" />
            )}
          </View>
          <Text style={styles.text}>{dis0} km</Text>
        </View>
        {detail ? (
          <View style={styles.view}>
            <Text style={styles.tetxdetail}>View past running history</Text>
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
              <Text style={styles.tetxdetail}>View past running history</Text>
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
            <View
              style={[
                styles.view,
                { borderBottomWidth: 0.5 },
                { borderBottomColor: "#fff" },
              ]}
            >
              <Text style={styles.text}>ระยะทาง</Text>
              <Text style={styles.text}>{dis1} กม.</Text>
            </View>
          </View>
        )}
        {/* <View style={styles.view}>
          <Text style={styles.tetxdetail}>View past running history</Text>
          <TouchableOpacity onPress={() => navigation.navigate("HistoryAll")}>
            <FontAwesome name="caret-right" size={29} color="black" />
          </TouchableOpacity>
        </View> */}
        <TouchableOpacity
          onPress={() => navigation.navigate("HistoryAll")}
          style={styles.view}
        >
          <Text style={styles.tetxdetail}>Total running history</Text>
        </TouchableOpacity>
        <View style={styles.view}>
          <Text style={[styles.tetxdetail, { alignSelf: "center" }]}>
            Get the prize
          </Text>
          {autolize_Lv(parseInt(user.user_accounts.total_distance)).lv >= 2 ? (
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
            <Text style={styles.textclose}>CLOSE</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Carousel
        ref={carouselRef}
        data={banner1}
        sliderWidth={1000}
        itemWidth={1000}
        autoplay
        loop
        renderItem={({ item, index }) => {
          // console.log("129", item);
          return (
            <View>
              <Image
                // resizeMode={"stretch"}
                style={styles.imgsup}
                // source={item.img}
                source={{
                  uri: "https://api.sosorun.com/api/imaged/get/" + item,
                }}
              />
            </View>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
  },
  imgsup: {
    width: width,
    height: height * 0.3,
    marginTop: 13,
    bottom: 0,
  },
});
