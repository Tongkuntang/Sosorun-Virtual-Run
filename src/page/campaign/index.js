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
  Share,
} from "react-native";
import {
  SimpleLineIcons,
  FontAwesome5,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Headerdetail from "../components/headerdetail";
import { useIsFocused } from "@react-navigation/core";
import { useRecoilState } from "recoil";
import { Pedometer } from "expo-sensors";
import { autolize_Lv, nextautolize_Lv } from "../../json/utils";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import moment from "moment";
import { resultsrunning } from "../../action/actionhistrory";
import {
  actionEditprofile,
  actionEditwal,
  getActionUser,
} from "../../action/actionauth";
import MapView, { Marker, Polyline } from "react-native-maps";
import { timeformet } from "../components/test";
const { width, height } = Dimensions.get("window");
export default function index({ navigation, route }) {
  const item = route.params.item;
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);
  const [num, setnum] = useState(5);
  const [chick, setchick] = useState(true);
  const [resume, setResume] = useState(false);
  const [clear, setClear] = useState(null);
  const markers = [
    {
      latitude: 13.82036734011308,
      longitude: 100.06116483360529,
    },
    {
      latitude: 13.819810289706782,
      longitude: 100.06122350692749,
    },
    {
      latitude: 13.820372549228068,
      longitude: 100.06116483360529,
    },
    {
      latitude: 13.82079058032594,
      longitude: 100.06109576672316,
    },
    {
      latitude: 13.820692584006625,
      longitude: 100.06047952920198,
    },
    {
      latitude: 13.8206046802964,
      longitude: 100.05987904965878,
    },
    {
      latitude: 13.820542822110053,
      longitude: 100.05938485264778,
    },
    {
      latitude: 13.820501800356372,
      longitude: 100.05890104919672,
    },
    {
      latitude: 13.820021584845318,
      longitude: 100.05899157375097,
    },
    {
      latitude: 13.81959866880581,
      longitude: 100.05900733172894,
    },
    {
      latitude: 13.819082638572038,
      longitude: 100.05911361426115,
    },
    {
      latitude: 13.818509632051798,
      longitude: 100.05920950323343,
    },
    {
      latitude: 13.818581909088294,
      longitude: 100.0596185401082,
    },
    {
      latitude: 13.818638558641748,
      longitude: 100.06007552146912,
    },
    {
      latitude: 13.818685115448355,
      longitude: 100.06041582673788,
    },
    {
      latitude: 13.81877790346175,
      longitude: 100.06080877035856,
    },
    {
      latitude: 13.818803949213256,
      longitude: 100.06116483360529,
    },
    {
      latitude: 13.818850180415005,
      longitude: 100.0614095851779,
    },
    {
      latitude: 13.818850180415005,
      longitude: 100.0614095851779,
    },
    {
      latitude: 13.819505555548487,
      longitude: 100.06129257380962,
    },
    {
      latitude: 13.819810289706782,
      longitude: 100.06122350692749,
    },
  ];

  const region = {
    latitude: 13.819658,
    longitude: 100.06015,
    latitudeDelta: 0.0044,
    longitudeDelta: 0.0044,
  };

  const filterDistance = item.total_distance / markers.length;

  function onRegionChange(params) {
    console.log(params);
  }

  const [state1, setstate1] = useState(true);

  const [state, setState] = useState({
    isPedometerAvailable: "checking",
    pastStepCount: 0,
    currentStepCount: 0,
  });

  useEffect(() => {
    if (chick) {
      Pedometer.getPermissionsAsync();
      _subscribe();
    } else {
      _subscription.current.remove();
    }
    // return _unsubscribe()
  }, [chick]);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <Headerdetail item="วิ่งเพื่อแมว" navigation={navigation} />
        <View style={styles.background}>
          <View style={styles.view}>
            <Text style={styles.text}>
              เวลา {timeformet(Math.floor(item.running_Time / 3600))} ชม. :{" "}
              {timeformet(Math.floor((item.running_Time % 3600) / 60))} น. :{" "}
              {timeformet(Math.floor((item.running_Time % 3600) % 60))} วิ
            </Text>
            <View style={styles.styletouch}>
              <Text style={[styles.text, { alignSelf: "center" }]}>
                ข้อมูลอีเวนท์
              </Text>
            </View>
          </View>
          <View style={styles.viewtext}>
            <View style={styles.viewsmall}>
              <Text style={styles.text1}>ระยะทางทั้งหมด</Text>
              <Text style={styles.text2}>{item.total_distance / 1000} กม.</Text>
            </View>
            <View style={styles.viewsmall}>
              <Text style={styles.text1}>ระยะทางที่ทำได้</Text>
              <Text style={styles.text2}>{item.last_distance / 1000} กม.</Text>
            </View>
            <View style={styles.viewsmall}>
              <Text style={styles.text1}>ระดับความสำเร็จ</Text>
              <Text style={styles.text2}>
                {(item.last_distance * 100) / item.total_distance / 1000}%
              </Text>
            </View>
          </View>
          <View style={styles.view}>
            <Text style={styles.text3}>
              ความเร็วเฉลี่ย{" "}
              {item.last_distance / 1000 / (item.running_Time / 1000) != NaN &&
                item.last_distance / 1000 / (item.running_Time / 1000)}{" "}
              km / Hr
            </Text>
          </View>
          {state1 ? (
            <TouchableOpacity
              onPress={() => {
                Clear.current = setInterval(() => {
                  setTime((val) => val + 1);
                }, 1000);
                setClear(Clear.current);

                if (!isFocus) {
                  clearInterval(Clear.current);
                }
                setstate1(false);
              }}
              style={styles.bottompause}
            >
              <Text style={styles.textpause}>เริ่ม</Text>
            </TouchableOpacity>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 10,
                marginVertical: 30,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("RunEvant")}
                style={styles.bottomresume}
              >
                <Text style={styles.textpause}>ดำเนินการต่อ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={styles.bottomresume}
              >
                <Text style={styles.textpause}>ยกเลิก</Text>
              </TouchableOpacity>
            </View>
          )}
          <Text style={styles.textsasom}>ระยะวิ่งสะสม</Text>
          <View style={styles.viewrank}>
            <Image
              style={{ width: 35, height: 40, alignSelf: "center" }}
              source={
                autolize_Lv(parseInt(user.user_accounts.total_distance)).grid
              }
            />
            <View style={{ alignSelf: "center", justifyContent: "center" }}>
              <Text style={styles.textrank}>Rank : D Class</Text>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.linelevel}>
                  <View
                    style={[
                      styles.linelevelrank,
                      {
                        width:
                          width *
                          ((parseInt(user.user_accounts.total_distance) /
                            nextautolize_Lv(
                              parseInt(user.user_accounts.total_distance)
                            ).exp) *
                            0.4),
                      },
                    ]}
                  />
                </View>
                <Text style={styles.texten}>
                  {" "}
                  {parseInt(user.user_accounts.total_distance) / 1000}/
                  {nextautolize_Lv(parseInt(user.user_accounts.total_distance))
                    .exp / 1000}
                </Text>
              </View>
            </View>
            <Text style={styles.textlv}>
              Lv {autolize_Lv(parseInt(user.user_accounts.total_distance)).lv}
            </Text>
          </View>
          <TouchableOpacity
            disabled={true}
            style={{
              width: width,
              height: height * 0.5,
              backgroundColor: "#393939",
            }}
          >
            <MapView
              style={{
                width: width,
                height: height * 0.5,
                backgroundColor: "#393939",
              }}
              onPress={(e) => {
                console.log(e.nativeEvent.coordinate);
              }}
              customMapStyle={[
                {
                  featureType: "administrative",
                  elementType: "geometry",
                  stylers: [
                    {
                      visibility: "off",
                    },
                  ],
                },
                {
                  featureType: "poi",
                  stylers: [
                    {
                      visibility: "off",
                    },
                  ],
                },
                {
                  featureType: "road",
                  elementType: "labels.icon",
                  stylers: [
                    {
                      visibility: "off",
                    },
                  ],
                },
                {
                  featureType: "road",
                  elementType: "labels.text",
                  stylers: [
                    {
                      visibility: "off",
                    },
                  ],
                },
                {
                  featureType: "transit",
                  stylers: [
                    {
                      visibility: "off",
                    },
                  ],
                },
              ]}
              provider={"google"}
              initialRegion={region}
              // onRegionChange={onRegionChange}
            >
              <Polyline
                coordinates={markers}
                strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
                strokeColors={[
                  "#ff0000",
                  "#ff0000", // no color, creates a "long" gradient between the previous and next coordinate
                  "#ff0000",
                  "#ff0000",
                  "#ff0000",
                  "#ff0000",
                ]}
                strokeWidth={6}
              />
              {markers.map(
                (marker, index) =>
                  filterDistance * index <
                    parseInt(item.last_distance) +
                      ((state.currentStepCount * strip) / 100000) * 1000 &&
                  filterDistance * (index + 1) >
                    parseInt(item.last_distance) +
                      ((state.currentStepCount * strip) / 100000) * 1000 && (
                    <Marker
                      key={index}
                      coordinate={marker}
                      title={marker.title}
                      description={marker.description}
                    />
                  )
              )}
            </MapView>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 10,
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
  },
  text3: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
  },
  styletouch: {
    width: 126,
    height: 28,
    backgroundColor: "#fff",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
  },
  viewtext: {
    flexDirection: "row",
    width: width,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    marginVertical: 15,
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
  bottompause: {
    width: width * 0.98,
    height: 55,
    backgroundColor: "#393939",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 30,
  },
  textpause: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#fff",
    alignSelf: "center",
  },
  textsasom: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    marginLeft: 20,
  },
  viewrank: {
    width: width,
    height: 51,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  textrank: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
  },
  texten: {
    fontFamily: "Prompt-Regular",
    fontSize: 10,
    color: "#000",
    marginLeft: 5,
  },
  textlv: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    alignSelf: "center",
  },
  linelevel: {
    width: width * 0.4,
    height: 5,
    backgroundColor: "#000000",
    marginTop: 5,
    alignSelf: "center",
  },
  linelevelrank: {
    width: width * 0.12,
    height: 4.5,
    backgroundColor: "#F8CA36",
    alignSelf: "flex-start",
  },
  bottomresume: {
    width: width * 0.46,
    height: 55,
    backgroundColor: "#393939",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
  },
});
