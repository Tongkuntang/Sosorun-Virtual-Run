import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StyleSheet,
  Image,
  Dimensions,
  NativeAppEventEmitter,
  TouchableOpacity,
  Share,
  Modal,
  AppState,
  NativeEventEmitter,
  NativeModules,
  Alert,
  ActivityIndicator,
} from "react-native";
const { Fitblekit } = NativeModules;
import ViewShot from "react-native-view-shot";
import { AntDesign } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";
import * as ImageManipulator from "expo-image-manipulator";
import { useIsFocused } from "@react-navigation/native";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  lans,
  LvState,
  tokenState,
  userState,
} from "../../reducer/reducer/reducer/Atom";
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from "react-native-health";
import GoogleFit, { Scopes, BucketUnit } from "react-native-google-fit";
import Headerdetail from "../components/headerdetail";
import moment from "moment";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Pedometer, Gyroscope } from "expo-sensors";
import { autolize_Lv, nextautolize_Lv } from "../../json/utils";
import { apiservice } from "../../service/service";
import { timeformet } from "../components/test";
import { actionEditwal, getActionUser } from "../../action/actionauth";
const { width, height } = Dimensions.get("window");
export default function index({ navigation, route }) {
  const viewShot = useRef();
  const BIB = route.params.BIB;
  const dataEV = route.params.dataEV;
  const lan = useRecoilValue(lans);
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);
  const [lvstate, setlvstate] = useState(null);
  const [put, setput] = useState(false);
  const [num, setnum] = useState(5);
  const [chick, setchick] = useState(true);
  const [resume, setResume] = useState(false);
  const [clear, setClear] = useState(null);
  const [modalVisible, setmodalVisible] = useState(false);
  const d = Date(Date.now());
  const a = moment(d.toString()).format("YYYY-MM-DD");
  const eventEmitter = new NativeEventEmitter(Fitblekit);
  const [Visible1, setVisible1] = useState(false);

  const markers = [
    {
      latitude: 13.819810289706782,
      longitude: 100.06122350692749,
    },
    {
      latitude: 13.82036734011308,
      longitude: 100.06116483360529,
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
      const lv = autolize_Lv(parseInt(users.user_accounts.total_distance)).lv;

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

  const filterDistance = dataEV.distance[0] / markers.length;

  const onShare = async () => {
    try {
      viewShot.current.capture().then(async (uri) => {
        const response = await ImageManipulator.manipulateAsync(uri, [], {
          base64: true,
        });
        const shareOptions = {
          title: "Share file",
          url: "data:image/png;base64," + response.base64, // places a base64 image here our your file path
          failOnCancel: false,
        };
        if (Platform.OS == "ios") {
          Share.share({
            url: uri,
          });
          // setBorder(true);
        } else {
          const ShareResponse = await Sharing.shareAsync(uri, shareOptions);
          // setBorder(true);
        }
      });
    } catch (error) {
      alert(error.message);
    }
  };

  const walkingFactor = 0.57;
  const customerheight = user.height;
  const weight = user.weight;
  let _subscription = useRef();
  const strip = customerheight * 0.415; // ความสูง
  const CaloriesBurnedPerMile = walkingFactor * (weight * 2.2);
  const stepCountMile = 160934.4 / strip;
  const conversationFactor = CaloriesBurnedPerMile / stepCountMile;
  const [MagnitudePrevious, setMagnitudePrevious] = useState(0);
  let counts = useRef();
  function count() {
    let a = setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 1000);
    let b = setTimeout(() => {
      clearTimeout(a);
      setnum((connt) => connt - 1);
    }, 2000);
    let c = setTimeout(() => {
      clearTimeout(b);

      setnum((connt) => connt - 1);
    }, 3000);
    let d = setTimeout(() => {
      clearTimeout(c);

      setnum((connt) => connt - 1);
    }, 4000);
    let e = setTimeout(() => {
      clearTimeout(d);

      setnum((connt) => connt - 1);
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
    uplevel(user);
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
            setTime((val) => val + (new Date().getTime() - dates) / 1000);
          }
        } else {
          dates = new Date().getTime();
        }
      }
    );
  }, []);

  useEffect(() => {
    if (chick) {
      Pedometer.getPermissionsAsync();
      _subscribe();
    } else {
      _unsubscribe();

      // _subscription.current.remove();
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

  console.log("dataEV", dataEV);

  useEffect(() => {
    let cear;
    if (num == 0 && resume == false) {
      cear = setTimeout(() => setTime((val) => val + 1), 1000);
    } else if (resume == true) {
      clearTimeout(cear);
    }
  }, [isFocus, num, timecal, resume]);

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
    if (
      dataEV.distance[0] <=
      parseInt(parseFloat(parseFloat(route.params.last_distance) / 1000))
    ) {
      navigation.navigate("Succeed", {
        dataEV,
        item: {
          total_distance: dataEV.distance[0],
          last_distance: (
            parseFloat(parseFloat(route.params.last_distance) / 1000) +
            parseFloat((state.currentStepCount * strip) / 100000)
          ).toFixed(2),
        },
      });
    } else {
      completeRunning();
    }
    uplevel(user);
  }, [state]);

  async function completeRunning() {
    if (
      dataEV.distance[0] <=
      parseInt(
        (
          parseFloat((state.currentStepCount * strip) / 100000) +
          parseFloat(parseFloat(route.params.last_distance) / 1000)
        ).toFixed(2)
      )
    ) {
      clearInterval(clear);
      setchick((val) => !val);
      const response1 = await apiservice({
        path: "/event/resultsrunning",
        method: "post",
        body: {
          uid: user.id,
          distance: dataEV.distance[0] * 1000,
          date: a,
          info: {
            time: timecal,
            distance: dataEV.distance[0] * 1000,
            callery: (state.currentStepCount * conversationFactor).toFixed(2),
          },
          Type: "EVENT",
          event_id: dataEV.id,
          joinEvent_id: route.params.id,
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
          id: route.params.id,
          distance: dataEV.distance[0] * 1000,
          running_Time: timecal,
          cal: (state.currentStepCount * conversationFactor).toFixed(2),
        },
        token: token.accessToken,
      });

      if (response.status == 200) {
        navigation.navigate("Succeed", {
          dataEV,
          item: {
            total_distance: dataEV.distance[0],
            last_distance: (
              parseFloat(parseFloat(route.params.last_distance) / 1000) +
              parseFloat((state.currentStepCount * strip) / 100000)
            ).toFixed(2),
          },
        });
      }
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
                      // date: a,
                      info: {
                        time: timecal,
                        distance: (state.currentStepCount * strip) / 100000,
                        callery: (
                          state.currentStepCount * conversationFactor
                        ).toFixed(2),
                      },
                      Type: "EVENT",
                      event_id: dataEV.id,
                      joinEvent_id: route.params.id,
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
                      id: route.params.id,
                      distance:
                        parseFloat((state.currentStepCount * strip) / 100000) *
                        1000,
                      running_Time: timecal,
                      cal: (
                        state.currentStepCount * conversationFactor
                      ).toFixed(2),
                    },
                    token: token.accessToken,
                  });

                  if (response.status == 200) {
                    setput(false);
                    navigation.navigate("EventInfor", { dataEV });
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
        <Headerdetail item={dataEV.titel} navigation={navigation} />
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setmodalVisible(!modalVisible);
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#000000bb",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              onPress={() => setmodalVisible(!modalVisible)}
              style={{ alignSelf: "flex-end", marginRight: 20 }}
            >
              <AntDesign
                name="close"
                size={30}
                color="red"
                style={{ alignSelf: "center" }}
              />
            </TouchableOpacity>
            <MapView
              style={{
                width: width,
                height: height * 0.85,
                backgroundColor: "#393939",
                alignSelf: "center",
              }}
              onPress={(e) => {
                // console.log(e.nativeEvent.coordinate);
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
            >
              <Polyline
                // lineDashPattern={[0]}
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
              {markers.map((marker, index) => {
                return (
                  filterDistance * index <=
                    parseFloat(route.params.last_distance / 1000) +
                      parseFloat((state.currentStepCount * strip) / 100000) &&
                  filterDistance * (index + 1) >=
                    parseFloat(route.params.last_distance / 1000) +
                      parseFloat((state.currentStepCount * strip) / 100000) && (
                    <Marker
                      key={index}
                      coordinate={marker}
                      title={marker.title}
                      description={marker.description}
                    />
                  )
                );
              })}
            </MapView>
          </View>
        </Modal>
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
                  <Text style={styles.text}>ระยะทางที่เหลือ</Text>
                </View>
                <View style={styles.viewsmall}>
                  <Text style={styles.text}>ระยะทางที่ทำได้</Text>
                </View>
              </View>
              <View style={styles.viewdistance}>
                <View style={styles.viewsmall2}>
                  <Text style={styles.text1}>
                    {(
                      dataEV.distance[0] -
                      (parseFloat(route.params.last_distance) / 1000).toFixed(2)
                    ).toFixed(2)}{" "}
                    กม.
                  </Text>
                </View>
                <View style={styles.viewsmall}>
                  <Text style={styles.text1}>
                    {parseFloat(
                      (state.currentStepCount * strip) / 100000
                    ).toFixed(2)}{" "}
                    กม.
                  </Text>
                </View>
              </View>
              <Text style={styles.textcallery}>
                พลังงานที่ใช้ไป{" "}
                {(state.currentStepCount * conversationFactor).toFixed(2)}
                แคลอรี่
              </Text>
              {chick ? (
                <TouchableOpacity
                  onPress={() => {
                    setResume(true);

                    setchick((val) => !val);
                  }}
                  style={styles.bottompause}
                >
                  <Text style={styles.textpause}>พัก</Text>
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
                      setResume(false);
                      setchick((val) => !val);
                    }}
                    style={styles.bottomresume}
                  >
                    <Text style={styles.textpause}>ดำเนินการต่อ</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      setput(true);
                    }}
                    style={styles.bottomresume}
                  >
                    <Text style={styles.textpause}>หยุด</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Text style={styles.textsasom}>ระยะวิ่งสะสม</Text>
              <View style={styles.viewrank}>
                <Image
                  style={{ width: 35, height: 40, alignSelf: "center" }}
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
                />
                <View
                  style={{
                    alignSelf: "center",
                    justifyContent: "center",
                    marginLeft: -80,
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
                        style={{
                          width:
                            width *
                            ((((parseFloat(
                              user.user_accounts.total_distance / 1000
                            ) +
                              (state.currentStepCount * strip) / 100000) *
                              1000) /
                              nextautolize_Lv(
                                (parseFloat(
                                  user.user_accounts.total_distance / 1000
                                ) +
                                  (state.currentStepCount * strip) / 100000) *
                                  1000
                              ).exp) *
                              0.4),
                          height: 4.5,
                          backgroundColor: "#F8CA36",
                          alignSelf: "flex-start",
                        }}
                      />
                    </View>
                    <Text style={styles.texten}>
                      {(
                        user.user_accounts.total_distance / 1000 +
                        (state.currentStepCount * strip) / 100000
                      ).toFixed(2)}
                      /
                      {autolize_Lv(
                        parseInt(
                          lvstate
                            ? parseInt(lvstate * 2000) - 2000
                            : (parseFloat(
                                user.user_accounts.total_distance / 1000
                              ) +
                                (state.currentStepCount * strip) / 100000) *
                                1000
                        )
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
                  {"  "}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setmodalVisible(true);
                }}
                style={{
                  width: width,
                  height: height * 0.3,
                  backgroundColor: "#393939",
                }}
              >
                {/* <MapView
                  style={{
                    width: width,
                    height: height * 0.5,
                    backgroundColor: "#393939",
                  }}
                  onPress={(e) => {
                    // console.log(e.nativeEvent.coordinate);
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
                    // lineDashPattern={[0]}
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
                  {markers.map((marker, index) => {
                    return (
                      filterDistance * index <=
                        parseFloat(route.params.last_distance / 1000) +
                          parseFloat(
                            (state.currentStepCount * strip) / 100000
                          ) &&
                      filterDistance * (index + 1) >=
                        parseFloat(route.params.last_distance / 1000) +
                          parseFloat(
                            (state.currentStepCount * strip) / 100000
                          ) && (
                        <Marker
                          key={index}
                          coordinate={marker}
                          title={marker.title}
                          description={marker.description}
                        />
                      )
                    );
                  })}
                </MapView> */}
                <Image
                  source={{
                    uri:
                      "https://api.sosorun.com/api/imaged/get/" +
                      dataEV?.img_Map,
                  }}
                  style={{
                    width: width,
                    height: height * 0.85,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.viewimg}>
              <Text style={styles.texthead}>
                {" "}
                {lan == "en" ? "Internal Timer Start" : "เริ่มจับเวลาภายใน"}
              </Text>
              <View style={styles.viewnumber}>
                <Text style={styles.number}>{num}</Text>
                <Text style={styles.sec}>{lan == "en" ? "sec" : "วิ"}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  count();
                }}
                style={styles.bottongo}
              >
                {num == 5 ? (
                  <Text style={styles.go}>{lan == "en" ? "GO" : "วิ่ง"}</Text>
                ) : (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Event")}
                    style={{ justifyContent: "center" }}
                  >
                    <Text style={styles.go}>CANCEL</Text>
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
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
                  <Text style={styles.text1}>
                    {dataEV?.distance?.[0] || dataEV?.distance?.[0]?.distance}{" "}
                    กม.
                  </Text>
                </View>
                <View style={styles.viewsmall1}>
                  <Text style={styles.text1}>
                    {(parseFloat(route.params.last_distance) / 1000).toFixed(2)}{" "}
                    กม.
                  </Text>
                </View>
                <View style={styles.viewsmall}>
                  <Text style={styles.text1}>
                    {(
                      ((route.params.last_distance / 1000).toFixed(2) /
                        dataEV.distance[0]) *
                      100
                    ).toFixed(2)}{" "}
                    %
                  </Text>
                </View>
              </View>
              <ViewShot
                ref={viewShot}
                options={{ format: "png", quality: 0.9 }}
              >
                <View
                  style={{
                    width: width,
                    height: height * 0.25,
                    justifyContent: "center",
                  }}
                >
                  <Image
                    resizeMode="stretch"
                    source={{
                      uri:
                        "https://api.sosorun.com/api/imaged/get/" +
                        route.params.biburl,
                    }}
                    style={{
                      width: width,
                      height: height * 0.25,
                      position: "absolute",
                    }}
                  />

                  <Text style={styles.textbib1}>{BIB}</Text>
                </View>
              </ViewShot>
              <TouchableOpacity onPress={onShare} style={styles.viewshare}>
                <Text style={styles.textshare}>แชร์ E-BIB</Text>
              </TouchableOpacity>
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
  textbib: {
    alignSelf: "flex-end",
    justifyContent: "center",
    fontFamily: "Prompt-Regular",
    fontSize: 70,
    color: "#000",
    marginRight: 20,
    fontWeight: "bold",
  },
  textbib1: {
    alignSelf: "flex-end",
    justifyContent: "center",
    fontFamily: "Prompt-Regular",
    fontSize: 70,
    color: "#000",
    marginRight: 10,
    fontWeight: "bold",
  },
});
