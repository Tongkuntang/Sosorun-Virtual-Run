import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StyleSheet,
  Image,
  NativeAppEventEmitter,
  AppState,
  Dimensions,
  TouchableOpacity,
  Modal,
  NativeEventEmitter,
  NativeModules,
  Alert,
  ActivityIndicator,
} from "react-native";
import Headerdetail from "../components/headerdetail";
import { useRef } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useRecoilState } from "recoil";
import {
  LvState,
  tokenState,
  userState,
} from "../../reducer/reducer/reducer/Atom";
const { Fitblekit } = NativeModules;
import AppleHealthKit from "react-native-health";
import GoogleFit from "react-native-google-fit";
import { autolize_Lv, nextautolize_Lv } from "../../json/utils";
import { apiservice } from "../../service/service";
import moment from "moment";
import { Pedometer, Gyroscope } from "expo-sensors";
import { timeformet } from "../components/test";
import { getAllbanner, getBanNer } from "../../action/actionbanner";
import { actionEditwal, getActionUser } from "../../action/actionauth";
import Carousel from "react-native-snap-carousel";
const { width, height } = Dimensions.get("window");

export default function fromcontinue({ navigation, route }) {
  const dataEV = route.params.dataEV;
  const [put, setput] = useState(false);
  const [num, setnum] = useState(5);
  const [chick, setchick] = useState(true);
  const [clear, setClear] = useState(null);
  const [resume, setResume] = useState(false);
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);
  const [lvstate, setlvstate] = useState(null);
  const [data, setData] = useState([]);
  const carouselRef = useRef();
  const [banner, setbanner] = useState([]);
  const [banner1, setbanner1] = useState([]);
  const eventEmitter = new NativeEventEmitter(Fitblekit);

  async function uplevel(users) {
    const d_arr = [
      10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
      170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300,
    ];

    const response = await apiservice({
      path: "/event/getchackrank",
      method: "get",
      token: token.accessToken,
    });

    if (response.status == 200) {
      const lv = autolize_Lv(parseInt(users?.user_accounts?.total_distance)).lv;

      const checl_list = d_arr?.map((e) => {
        if (e < lv) {
          if (
            response.data.data?.filter((el) => {
              return (
                el?.mission_List?.request_ranking == e &&
                el?.total_distance <= el?.last_distance
              );
            })?.length > 0
          ) {
            return {
              lv: e,
              status: true,
            };
          } else {
            return {
              lv: e,
              status: false,
            };
          }
        }
      });

      for (
        let index = 0;
        index < checl_list?.filter((e) => e).length;
        index++
      ) {
        const data = checl_list?.filter((e) => e);
        if (data?.[index]?.status == false) {
          setlvstate(data?.[index]?.lv);
          return;
        }
      }
    }
  }

  async function allbanner() {
    const getbanner = await getAllbanner(token);
    const page = getbanner.data[2].page;
    const page1 = getbanner.data[1].page;
    const getbanner1 = await getBanNer({ token, page: page });
    setbanner1(getbanner1.data[0].img_list);
    const getbanner2 = await getBanNer({ token, page: page1 });
    setbanner(getbanner2.data[0].img_list);
  }

  useEffect(() => {
    uplevel(user);
    allbanner();
  }, [token]);
  const walkingFactor = 0.57;
  const customerheight = user.height;
  const weight = user.weight;
  let _subscription = useRef();
  const strip = customerheight * 0.415; // ความสูง
  const CaloriesBurnedPerMile = walkingFactor * (weight * 2.2);
  const stepCountMile = 160934.4 / strip;
  let counts = useRef();
  const conversationFactor = CaloriesBurnedPerMile / stepCountMile;
  const [MagnitudePrevious, setMagnitudePrevious] = useState(0);

  // let CaloriesBurned = stepsCount * conversationFactor;
  // {state.currentStepCount * conversationFactor;}
  const d = Date(Date.now());
  const a = moment(d.toString()).format("YYYY-MM-DD");
  function count() {
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 1000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 2000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 3000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 4000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
      // callApi();
    }, 5000);
  }

  const [state, setState] = useState({
    isPedometerAvailable: "checking",
    pastStepCount: 0,
    currentStepCount: 0,
  });
  const permissions = {
    permissions: {
      read: [AppleHealthKit.Constants.Permissions.HeartRate],
      write: [AppleHealthKit.Constants.Permissions.HeartRate],
      read: [AppleHealthKit.Constants.Permissions.Steps],
      write: [AppleHealthKit.Constants.Permissions.Steps],
    },
  };

  useEffect(() => {
    let back = 0;
    let Check = 0;
    let mainCount = 0;
    const newDevice5 = eventEmitter.addListener(
      "EVENTFBKSTEP",
      (deviceDiscovered) => {
        if (mainCount == 0) {
          mainCount = deviceDiscovered;
        }
        if (Check != deviceDiscovered - mainCount) {
          setState((val) => ({
            ...val,
            currentStepCount: deviceDiscovered - mainCount,
          }));
          Check = deviceDiscovered - mainCount;
          console.log("ทำนะ");
        }
      }
    );

    if (Platform.OS == "android") {
      GoogleFit.observeSteps((callback) => {
        if (back != callback.steps) {
          back = callback.steps;
          setState((val) => ({
            ...val,
            currentStepCount: val.currentStepCount + callback.steps,
          }));
        }
      });
    } else {
      AppleHealthKit.initHealthKit(permissions, (err, res) => {
        const sub2 = NativeAppEventEmitter.addListener(
          "healthKit:StepCount:new",
          (evt) => {
            console.log(evt);
          }
        );
      });
    }
  }, []);

  const [Visible1, setVisible1] = useState(false);

  useEffect(() => {
    let dates = null;
    let currentStepCount = 0;
    const subscription = AppState.addEventListener(
      "change",
      async (nextAppState) => {
        if (nextAppState === "active") {
          if (Platform.OS == "ios") {
            let options = {
              startDate: new Date(dates).toISOString(),
              endDate: new Date().toISOString(),
              type: "Walking", // one of: ['Walking', 'StairClimbing', 'Running', 'Cycling', 'Workout']
            };
            setVisible1(true);

            let valuse = setInterval(() => {
              AppleHealthKit.getSamples(options, (err, results) => {
                if (err) {
                  return;
                }
                let number = 0;
                console.log(results);
                if (results.length != 0) {
                  clearInterval(counts.current);
                  results.map((test) => (number = number + test.quantity));
                  setVisible1(false);

                  setState((val) => ({
                    ...val,
                    currentStepCount: val.currentStepCount + number * 1.5,
                  }));
                }
              });
            }, 1000);

            counts.current = valuse;
          }
          setTime((val) => val + (new Date().getTime() - dates) / 1000);
        } else {
          dates = new Date().getTime();
        }
        // appState.current = nextAppState;
        // setAppStateVisible(appState.current);
      }
    );
  }, []);
  useEffect(() => {
    if (chick) {
      Pedometer.requestPermissionsAsync();
      _subscribe();
    } else {
      _unsubscribe();
    }
    return () => {
      _unsubscribe();
    };
  }, [chick]);

  const [subscription, setSubscription] = useState(null);

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const _subscribe = async () => {
    let Magnitude = 0;
    let currentStepCount = 0;
    let prevcurrentStepCount = 0;

    setSubscription(
      Gyroscope.addListener((gyroscopeData) => {
        Magnitude =
          Magnitude +
          Math.sqrt(
            gyroscopeData.x * gyroscopeData.x +
              gyroscopeData.y * gyroscopeData.y +
              gyroscopeData.z * gyroscopeData.z
          ) -
          0.012;

        if (Magnitude > 8) {
          Magnitude = 0;

          currentStepCount = currentStepCount + 1;
        }

        if (currentStepCount > 20) {
          setState((val) => ({
            ...val,
            currentStepCount: val?.currentStepCount + currentStepCount / 3,
          }));
          currentStepCount = 0;
          prevcurrentStepCount = 0;
        }
      })
    );
  };

  const [timecal, setTime] = useState(0);
  const isFocus = useIsFocused();
  let Clear = useRef();

  useEffect(() => {
    Clear.current = setInterval(() => {
      setTime((val) => val + 1);
    }, 1000);
    setClear(Clear.current);
    if (!isFocus) {
      clearInterval(Clear.current);
    }
  }, [isFocus]);

  useEffect(() => {
    if (resume) {
      setResume(false);
      Clear.current = setInterval(() => {
        setTime((val) => val + 1);
      }, 1000);
      setClear(Clear.current);
    }
  }, [resume]);

  var h = timeformet(Math.floor(timecal / 3600));
  var m = timeformet(Math.floor((timecal % 3600) / 60));
  var s = timeformet(Math.floor((timecal % 3600) % 60));

  function formatTime(params) {
    let Ans = params.toString();
    if (Ans.length == 1) {
      return "0" + Ans;
    } else {
      return Ans;
    }
  }

  useEffect(() => {
    completeRunning();
    getHistorypayment();
  }, [state]);

  async function completeRunning() {
    if (
      dataEV.mission_List.distance <=
      parseInt(
        (
          (state.currentStepCount * strip) / 100000 +
          route.params.last_distance / 1000
        ).toFixed(2)
      )
    ) {
      const response1 = await apiservice({
        path: "/event/resultsrunning",
        method: "post",
        body: {
          uid: user.id,
          distance: (state.currentStepCount * strip) / 100000,
          date: a,
          info: {
            time: timecal,
            distance: (state.currentStepCount * strip) / 100000,
            callery: (state.currentStepCount * conversationFactor).toFixed(2),
          },
          Type: "MISSION",
          event_id: null,
          joinEvent_id: dataEV.id,
        },
        token: token.accessToken,
      });
      let Call = parseFloat(
        state.currentStepCount * conversationFactor
      ).toFixed(0);
      const upwal = await actionEditwal({
        body: {
          cal: Call,
        },
        token,
      });
      if (upwal.status == 200) {
        const getuser = await getActionUser(token);
        setUser(getuser.data);
        uplevel(getuser.data);
      }
      const response = await apiservice({
        path: "/event/updateuserjoinEvent",
        method: "put",
        body: {
          id: dataEV.id,
          distance:
            parseFloat((state.currentStepCount * strip) / 100000) * 1000,
          running_Time: timecal,
          cal: (state.currentStepCount * conversationFactor).toFixed(2),
        },
        token: token.accessToken,
      });
      // console.log(response);
      if (response.status == 200) {
        navigation.navigate("MissionSucc", {
          dataEV,
          item: {
            total_distance: dataEV.distance,
            last_distance: (
              parseFloat(parseFloat(route.params.last_distance) / 1000) +
              parseFloat((state.currentStepCount * strip) / 100000)
            ).toFixed(2),
          },
        });
      }
    }
  }
  async function getHistorypayment() {
    const response = await apiservice({
      path: "/event/getmyEvent/" + user.id,
      token: token.accessToken,
    });

    if (response.status == 200) {
      setData(
        response.data.data.filter((item) => {
          return (
            item.Type == "MISSION" &&
            item.mission_id == dataEV.id &&
            item.status == null
          );
        })
      );
    }
  }
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <Modal
        animationType="none"
        transparent={true}
        visible={Visible1}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setVisible1(!Visible1);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000bb",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color="#fff" size={"large"} />
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={put}
        onRequestClose={() => {
          setput(!put);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000bb",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: width * 0.8,
              // height: 150,
              alignSelf: "center",
              backgroundColor: "#fff",
              borderRadius: 10,
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Bold",
                fontSize: 16,
                color: "#000",
                alignSelf: "center",
                marginTop: 35,
              }}
            >
              Are you sure ?
            </Text>
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 16,
                color: "#000",
                alignSelf: "center",
                textAlign: "center",
              }}
            >
              Are you sure you went to discard this run ?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: width * 0.6,
                alignSelf: "center",
                marginTop: 20,
                marginBottom: 25,
              }}
            >
              <TouchableOpacity
                onPress={async () => {
                  setput(!put);
                }}
                style={{
                  width: 100,
                  height: 30,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#000",
                  backgroundColor: "#000",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Prompt-Regular",
                    fontSize: 14,
                    color: "#fff",
                    alignSelf: "center",
                  }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  const response1 = await apiservice({
                    path: "/event/resultsrunning",
                    method: "post",
                    body: {
                      uid: user.id,
                      distance: (state.currentStepCount * strip) / 100000,
                      date: a,
                      info: {
                        time: timecal,
                        distance: (state.currentStepCount * strip) / 100000,
                        callery: (
                          state.currentStepCount * conversationFactor
                        ).toFixed(2),
                      },
                      Type: "MISSION",
                      event_id: null,
                      joinEvent_id: dataEV.id,
                    },
                    token: token.accessToken,
                  });
                  let Call = parseFloat(
                    state.currentStepCount * conversationFactor
                  ).toFixed(0);
                  const upwal = await actionEditwal({
                    body: {
                      cal: Call,
                    },
                    token,
                  });
                  if (upwal.status == 200) {
                    const getuser = await getActionUser(token);
                    setUser(getuser.data);
                  }
                  const response = await apiservice({
                    path: "/event/updateuserjoinEvent",
                    method: "put",
                    body: {
                      id: dataEV.id,
                      distance:
                        ((state.currentStepCount * strip) / 100000) * 1000,
                      running_Time: timecal,
                      cal: (
                        state.currentStepCount * conversationFactor
                      ).toFixed(2),
                    },
                    token: token.accessToken,
                  });
                  // console.log(":?????????>>>>>>>>>>>>>>>>>", response);
                  if (response.status == 200) {
                    setput(false);

                    navigation.navigate("MissionInfo", { dataEV });
                  }
                }}
                style={{
                  width: 100,
                  height: 30,
                  borderRadius: 10,
                  borderWidth: 1,
                  backgroundColor: "#FFC300",
                  borderColor: "#444",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: "Prompt-Regular",
                    fontSize: 14,
                    color: "#fff",
                    alignSelf: "center",
                  }}
                >
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <Headerdetail item={dataEV.event_name} navigation={navigation} />
        <View
          style={{ width: width, height: height, backgroundColor: "#FBC71C" }}
        >
          {num == 0 ? (
            <View>
              <Text style={styles.texttime}>
                {formatTime(h)}:{formatTime(m)}:{formatTime(s)}
              </Text>
              <View style={styles.viewdistance}>
                <View style={styles.viewsmall}>
                  <Text style={styles.text}>ระยะทางทั้งหมด</Text>
                </View>
                <View style={styles.viewsmall}>
                  <Text style={styles.text}>ระยะทางที่ทำได้</Text>
                </View>
              </View>
              <View style={styles.viewdistance}>
                <View style={styles.viewsmall2}>
                  {dataEV.distance != undefined && (
                    <Text style={styles.text1}>
                      {parseFloat(dataEV.distance).toFixed(3)} กม.
                    </Text>
                  )}
                  {dataEV.total_distance != undefined && (
                    <Text style={styles.text1}>
                      {parseFloat(dataEV.total_distance / 1000).toFixed(3)} กม.
                    </Text>
                  )}
                </View>
                <View style={styles.viewsmall}>
                  <Text style={styles.text1}>
                    {(
                      (state.currentStepCount * strip) / 100000 +
                      route.params.last_distance / 1000
                    ).toFixed(3)}{" "}
                    กม.
                  </Text>
                </View>
              </View>
              <Text style={styles.textcallery}>
                พลังงานที่ใช้ไป{" "}
                {(state.currentStepCount * conversationFactor).toFixed(2)}{" "}
                แคลอรี่
              </Text>
              {chick ? (
                <TouchableOpacity
                  onLongPress={() => {
                    clearInterval(clear);
                    setchick((val) => !val);
                  }}
                  style={styles.bottompause}
                >
                  <Text style={styles.textpause}>พัก</Text>
                  <Text style={[styles.textpause, { fontSize: 16 }]}>
                    กดค้างเพื่อพัก
                  </Text>
                </TouchableOpacity>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setResume(true);
                      setchick((val) => !val);
                    }}
                    style={styles.bottomresume}
                  >
                    <Text style={styles.textpause}>ดำเนินการต่อ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onLongPress={async () => {
                      setput(!put);
                    }}
                    style={styles.bottomresume}
                  >
                    <Text style={styles.textpause}>หยุด</Text>
                    <Text style={[styles.textpause, { fontSize: 16 }]}>
                      กดค้างเพื่อหยุด
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.textsasom}>ระยะวิ่งสะสม</Text>
              <View style={styles.viewrank}>
                <Image
                  source={
                    autolize_Lv(
                      parseInt(
                        lvstate
                          ? parseInt(lvstate * 2000) - 2000
                          : (parseFloat(
                              user.user_accounts.total_distance / 1000
                            ) +
                              (state.currentStepCount * strip) / 100000) *
                              1000
                      )
                    ).grid
                  }
                  style={{ width: 35, height: 40, alignSelf: "center" }}
                />
                <View
                  style={{
                    alignSelf: "center",
                    justifyContent: "center",
                    marginLeft: -50,
                  }}
                >
                  <Text style={styles.textrank}>
                    Rank :{" "}
                    {
                      autolize_Lv(
                        parseInt(
                          lvstate
                            ? parseInt(lvstate * 2000) - 2000
                            : (parseFloat(
                                user.user_accounts.total_distance / 1000
                              ) +
                                (state.currentStepCount * strip) / 100000) *
                                1000
                        )
                      ).rank
                    }{" "}
                    Class
                  </Text>
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
                      {(
                        user.user_accounts.total_distance / 1000 +
                        (state.currentStepCount * strip) / 100000
                      ).toFixed(2)}
                      /
                      {nextautolize_Lv(
                        (parseFloat(user.user_accounts.total_distance / 1000) +
                          (state.currentStepCount * strip) / 100000) *
                          1000
                      ).exp / 1000}{" "}
                      km
                    </Text>
                  </View>
                </View>
                <Text style={styles.textlv}>
                  Lv
                  {
                    autolize_Lv(
                      parseInt(
                        lvstate
                          ? parseInt(lvstate * 2000) - 2000
                          : (parseFloat(
                              user.user_accounts.total_distance / 1000
                            ) +
                              (state.currentStepCount * strip) / 100000) *
                              1000
                      )
                    ).lv
                  }
                  {"   "}
                </Text>
              </View>
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
                        // resizeMode={"stretch"}
                        style={styles.imgsup1}
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
          ) : (
            <View style={styles.viewimg}>
              <Text style={styles.texthead}>เริ่มจับเวลาภายใน</Text>
              <View style={styles.viewnumber}>
                <Text style={styles.number}>{num}</Text>
                <Text style={styles.sec}>sec</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  count();
                  setTimeout(() => {
                    setTime(0);
                  }, 5000);
                }}
                style={styles.bottongo}
              >
                {num == 5 ? (
                  <Text style={styles.go}>วิ่ง</Text>
                ) : (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Event")}
                    style={{ justifyContent: "center" }}
                  >
                    <Text style={styles.go}>CANCEL</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
              <Text style={styles.texttime}>00 : 00 : 00</Text>
              <View style={styles.viewtext}>
                <View style={styles.viewsmall}>
                  <Text style={styles.text}>ระยะทางทั้งหมด</Text>
                </View>
                <View style={styles.viewsmall}>
                  <Text style={styles.text}>ระยะทางที่ทำได้</Text>
                </View>
                <View style={styles.viewsmall}>
                  <Text style={styles.text}>ระดับความสำเร็จ</Text>
                </View>
              </View>
              <View style={styles.viewtext}>
                <View style={styles.viewsmall1}>
                  {dataEV.distance != undefined && (
                    <Text style={styles.text1}>{dataEV.distance} กม.</Text>
                  )}
                  {dataEV.total_distance != undefined && (
                    <Text style={styles.text1}>
                      {dataEV.total_distance / 1000} กม.
                    </Text>
                  )}
                </View>
                <View style={styles.viewsmall1}>
                  <Text style={styles.text1}>
                    {(parseFloat(route.params.last_distance) / 1000).toFixed(2)}{" "}
                    กม.
                  </Text>
                </View>
                <View style={styles.viewsmall}>
                  {dataEV.distance != undefined && dataEV.distance != "NaN" ? (
                    <Text style={styles.text1}>0.00 %</Text>
                  ) : (
                    <Text style={styles.text1}>
                      {(
                        ((route.params.last_distance / 1000).toFixed(2) * 100) /
                        (dataEV.total_distance / 1000)
                      ).toFixed(2)}{" "}
                      %
                    </Text>
                  )}
                </View>
              </View>
            </View>
          )}
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
  texthead: {
    fontFamily: "Prompt-Regular",
    fontSize: 26,
    color: "#000",
    marginLeft: 20,
    marginVertical: 10,
  },
  viewnumber: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: 10,
  },
  number: {
    fontFamily: "Prompt-Regular",
    fontSize: 100,
    color: "#000",
    marginLeft: 50,
  },
  sec: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#fff",
    marginTop: 10,
    marginLeft: 10,
  },
  go: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#fff",
    alignSelf: "center",
  },
  bottongo: {
    width: width * 0.4,
    height: 48,
    backgroundColor: "#393939",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
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
    justifyContent: "center",
  },
  viewsmall1: {
    width: width * 0.28,
    alignSelf: "center",
    justifyContent: "center",
    borderRightWidth: 0.5,
    borderRightColor: "#00000040",
    height: 50,
  },
  viewsmall2: {
    width: width * 0.35,
    alignSelf: "center",
    justifyContent: "center",
    borderRightWidth: 0.5,
    borderRightColor: "#00000040",
    height: 50,
  },
  viewshare: {
    width: 91,
    height: 26,
    backgroundColor: "#707070",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "flex-end",
    marginVertical: 20,
    marginRight: 20,
  },
  textshare: {
    fontFamily: "Prompt-Regular",
    fontSize: 13,
    color: "#fff",
    alignSelf: "center",
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
    alignSelf: "center",
  },
  text1: {
    fontFamily: "Prompt-Regular",
    fontSize: 18,
    color: "#000",
    alignSelf: "center",
  },
  texttime: {
    fontFamily: "Prompt-Regular",
    fontSize: 48,
    color: "#000",
    alignSelf: "center",
    marginVertical: 20,
  },
  viewdistance: {
    width: width * 0.7,
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
    marginVertical: 15,
    marginTop: 20,
  },
  bottompause: {
    width: width * 0.98,
    height: 55,
    backgroundColor: "#393939",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
  },
  textpause: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#fff",
    alignSelf: "center",
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
  textcallery: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    color: "#000",
    marginLeft: 20,
    marginVertical: 20,
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
  imgsup1: {
    width: width,
    height: height * 0.26,
    bottom: 0,
  },
});
