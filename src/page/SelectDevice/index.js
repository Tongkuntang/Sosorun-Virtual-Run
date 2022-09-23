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
  ScrollView,
  NativeModules,
  NativeEventEmitter,
  Modal,
  Linking,
  NativeAppEventEmitter,
  Alert,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import Headerdetail from "../components/headerdetail";
import { timeformet } from "../components/test";
const { Fitblekit } = NativeModules;
import { useRecoilState, useRecoilValue } from "recoil";
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from "react-native-health";
import GoogleFit, { Scopes, BucketUnit } from "react-native-google-fit";
import {
  deviceIndex,
  deviceRegis,
  tokenState,
} from "../../reducer/reducer/reducer/Atom";
import Header from "../components/header";
import { TextInput } from "react-native-gesture-handler";
import { apiservice } from "../../service/service";
import { getActionUser } from "../../action/actionauth";
import moment from "moment";
const { width, height } = Dimensions.get("window");
import ProgressCircle from "react-native-progress-circle";
import { useIsFocused } from "@react-navigation/native";

const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [AppleHealthKit.Constants.Permissions.HeartRate],
    read: [AppleHealthKit.Constants.Permissions.Steps],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
};

export default function index({ navigation, route }) {
  const [modals, setModal] = useState(false);
  const [modals1, setmodals1] = useState(false);
  const [modals3, setModal3] = useState(false);
  const peripherals = new Map();
  const [list, setList] = useState([]);
  const eventEmitter = new NativeEventEmitter(Fitblekit);
  const [devicsI, setDeviceI] = useRecoilState(deviceIndex);
  const [bodygarmin, setbodygarmin] = useRecoilState(deviceRegis);
  const token = useRecoilValue(tokenState);
  const isFocus = useIsFocused();
  const [body, setbody] = useState();
  const [healthkit, sethealthkit] = useState(0);
  const [pod, setpod] = useState(0);
  const [page, setpage] = useState(true);
  const [data, setData] = useState([]);
  const dataEV = route.params.dataEV;
  const [list_setrender, setrender] = useState([]);

  async function fetchData() {
    setmodals1(true);

    const opt = {
      startDate: "2022-06-01T00:00:17.971Z", // required ISO8601Timestamp
      endDate: new Date().toISOString(), // required ISO8601Timestamp
      bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
    };
    const res = await GoogleFit.getDailyStepCountSamples(opt);
    let steps = 0;
    res?.map((item) => {
      if (item?.source?.includes("strava")) {
        console.log(item);

        item.rawSteps
          ?.filter((e) => e?.appPackageName?.includes("strava"))
          .map((e) => (steps = steps + e.steps));
      }
    });
    setmodals1(false);

    navigation.navigate("SendResults", {
      ...route?.params,
      devices: "Xiaomi",
      last_totals: steps,
    });
  }

  async function fetchData1() {
    setmodals1(true);
    const opt = {
      startDate: moment().add(-1, "days").format("YYYY-MM-DDTHH:mm:ssz"), // required ISO8601Timestamp
      endDate: new Date().toISOString(), // required ISO8601Timestamp
      bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
    };
    const res = await GoogleFit.getDailyStepCountSamples(opt);
    let steps = 0;

    res?.map((item) => {
      item.rawSteps.map((e) => (steps = steps + e.steps));
    });

    setmodals1(false);
    navigation.navigate("SendResults", {
      ...route?.params,
      devices: "GoogleFit",
      last_totals: steps,
    });
  }

  useEffect(() => {
    if (isFocus) {
      getUser();
    }
  }, [isFocus]);

  async function getUser() {
    const resonse = await getActionUser(token);
    if (resonse) {
      setbody({
        ...resonse.data,
      });

      const response = await apiservice({
        path: "/event/getmyEvent/" + resonse.data.id,
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
  }

  async function fetchData() {
    const opt = {
      startDate: moment().add(-1, "days").format("YYYY-MM-DDTHH:mm:ssz"), // required ISO8601Timestamp
      endDate: new Date().toISOString(), // required ISO8601Timestamp
      bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
    };
    const res = await GoogleFit.getDailyStepCountSamples(opt);

    res?.map((item) => {
      if (item.source == "com.google.android.gms:estimated_steps") {
        if (
          item.rawSteps?.filter((e) => e?.appPackageName?.includes("strava"))
            .length > 0
        ) {
          setDeviceI(5);
        }
      }
    });
  }

  const renderItem = (item) => {
    const color = item.connected ? "green" : "#fff";
    return (
      <TouchableHighlight onPress={() => testPeripheral(item)}>
        <View style={[styles.row, { backgroundColor: color }]}>
          <Text
            style={{
              fontSize: 12,
              textAlign: "center",
              color: "#333333",
              padding: 10,
            }}
          >
            {item.name}
          </Text>
          <Text
            style={{
              fontSize: 10,
              textAlign: "center",
              color: "#333333",
              padding: 2,
            }}
          >
            RSSI: {item.rssi}
          </Text>
          <Text
            style={{
              fontSize: 8,
              textAlign: "center",
              color: "#333333",
              padding: 2,
              paddingBottom: 20,
            }}
          >
            {item.id}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  useEffect(() => {
    try {
      if (Platform.OS == "android") {
        const newDevice = eventEmitter.addListener(
          "EVENTFBK",
          (deviceDiscovered) => {
            const ress = deviceDiscovered.split(",");
            if (ress.length > 0) {
              // Fitblekit.onConnect("SENIOR", "APPROVE", (e) => {
              //   console.log(e);
              // });
              setrender(ress);
            }
          }
        );

        const newDevice1 = eventEmitter.addListener(
          "EVENTFBKSTEP",
          (deviceDiscovered) => {
            console.log(
              "EVENTFBKSTEP",
              deviceDiscovered
                .replace(/=/g, ":")
                .replace(/, calories:/g, `", calories:`)
                .replace(/createTime:/g, `createTime:"`)
            );

            navigation.navigate("SendResults", {
              ...route?.params,
              devices: "SOSORUNPODV2",
              last_totals: deviceDiscovered
                .replace(/=/g, ":")
                .replace(/, calories:/g, `", calories:`)
                .replace(/createTime:/g, `createTime:"`),
            });
            setmodals1(false);

            setpod(
              deviceDiscovered
                .replace(/=/g, ":")
                .replace(/, calories:/g, `", calories:`)
                .replace(/createTime:/g, `createTime:"`)
            );
            // setDeviceList(deviceList => [...deviceList,deviceDiscovered])
          }
        );

        const newDevice2 = eventEmitter.addListener(
          "CONNECT",
          (deviceDiscovered) => {
            console.log("CONNECT", deviceDiscovered);
            // setDeviceList(deviceList => [...deviceList,deviceDiscovered])
          }
        );

        const newDevice3 = eventEmitter.addListener(
          "ERRORBLE",
          (deviceDiscovered) => {
            console.log("ERRORBLE", deviceDiscovered);
            if (deviceDiscovered == "BleConnected") {
              setDeviceI(1);
            }
          }
        );

        const newDevice4 = eventEmitter.addListener(
          "batteryPower",
          (deviceDiscovered) => {
            console.log("batteryPower", deviceDiscovered);
            // setDeviceList(deviceList => [...deviceList,deviceDiscovered])
          }
        );

        const newDevice5 = eventEmitter.addListener(
          "EVENTFBKSTEP1",
          (deviceDiscovered) => {
            console.log("EVENTFBKSTEP1", deviceDiscovered);
            // setDeviceList(deviceList => [...deviceList,deviceDiscovered])
          }
        );

        const newDevice6 = eventEmitter.addListener(
          "EVENTFBKSTEP2",
          (deviceDiscovered) => {
            console.log("EVENTFBKSTEP2", deviceDiscovered);
            // setDeviceList(deviceList => [...deviceList,deviceDiscovered])
          }
        );

        const batteryPower = eventEmitter.addListener(
          "batteryPower",
          (deviceDiscovered) => {
            console.log("batteryPower", deviceDiscovered);
            // setDeviceList(deviceList => [...deviceList,deviceDiscovered])
          }
        );

        return () => {
          newDevice.remove();
          newDevice1.remove();
          newDevice2.remove();
          newDevice3.remove();
          newDevice4.remove();
          newDevice5.remove();
          newDevice6.remove();
          batteryPower.remove();
        };
      } else {
        const newDevice2 = eventEmitter.addListener(
          "CONNECT",
          (deviceDiscovered) => {
            console.log(
              deviceDiscovered.name.filter((item) => {
                return item.localName.includes("MOVE");
              })
            );
          }
        );
        return () => {
          newDevice2.remove();
        };
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (list.length > 0) {
      testPeripheral(list[3]);
    }
  }, [list]);

  useEffect(() => {
    const onReceiveURL = async ({ url }) => {
      const re = url.split("=");

      const tokens = {
        access_token: re[1].replace("?expires_in", ""),
        id_token: re[3].replace("?refreshToken", ""),
        refreshToken: re[4].replace("?scope", ""),
      };

      const getuser = await getActionUser(token);

      const res = await apiservice({
        path: "/authen/createhw",
        method: "post",
        body: {
          uid: getuser?.data?.id,
          info: tokens,
        },
      });

      const regis = await apiservice({
        method: "post",
        path: "",
        url: "https://health-api.cloud.huawei.com/healthkit/v1/dataCollectors",
        token: re[1].replace("?expires_in", ""),
        body: {
          collectorName: "DataCollectorExample",
          collectorType: "raw",
          appInfo: {
            appPackageName: "com.sosorun.asia",
            appName: "Sosorun Virtual Run",
            desc: "https://sosorun.com",
            appVersion: "1",
          },
          collectorDataType: {
            name: "com.huawei.continuous.steps.delta",
          },
          deviceInfo: {
            manufacturer: "huawei",
            modelNum: "ExampleTablet",
            devType: "Phone",
            uniqueId: moment().valueOf(),
            version: "1.0",
          },
        },
      });

      console.log("regis", regis);

      // const getuser = await getActionUser(tokens);
      // const data = getuser.data;
      // if (data.height == null) {
      //   setmodal(true);
      //   setTokenvisible(tokens);
      // } else {
      //   setAuth({
      //     auth: true,
      //   });
      //   setUser(data);
      //   setToken(tokens);
      // }
    };
    Linking.addEventListener("url", onReceiveURL);
  }, []);

  return (
    <View style={styles.contalner}>
      {/* <StatusBar backgroundColor="#61dafb" /> */}
      <SafeAreaView />
      <Modal transparent={true} visible={modals3} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000090",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setModal3(false);
            }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 5,
              borderRadius: 5,
              position: "absolute",
              top: 0,
              right: 15,
              marginTop: 15,
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 19,
                color: "#fff",
              }}
            >
              Skip
            </Text>
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: "#fff",
              width: width * 0.95,
              height: width * 0.7,
            }}
          >
            <FlatList
              data={list_setrender}
              ListHeaderComponent={
                <View
                  style={{
                    width: width * 0.95,
                    backgroundColor: "#fff",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#555",
                      fontFamily: "Prompt-Regular",
                      textAlign: "center",
                      marginTop: 25,
                      fontSize: 18,
                    }}
                  >
                    {"เลือกอุปกรณ์"}
                  </Text>
                </View>
              }
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      Fitblekit.onConnect(index, "APPROVE", (e) => {
                        console.log(e);
                      });
                      setModal3(false);
                    }}
                    style={{
                      width: width * 0.95,
                      backgroundColor: "#fff",
                      alignItems: "center",
                      paddingBottom: 25,
                    }}
                  >
                    <Text
                      style={{
                        color: "#555",
                        fontFamily: "Prompt-Regular",
                        textAlign: "center",
                        marginTop: 25,
                      }}
                    >
                      {item?.replace("[", "").replace("]", "")}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={modals1} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000090",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color="#fff" size={"large"} />
          <TouchableOpacity
            onPress={() => {
              setmodals1(false);
            }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 5,
              borderRadius: 5,
              backgroundColor: "#ff0000",
              marginTop: 15,
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 19,
              }}
            >
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal transparent={true} visible={modals} style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#00000090",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: width * 0.9,
              height: width * 0.9,
              backgroundColor: "#fff",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 19,
                marginBottom: 15,
              }}
            >
              GARMIN
            </Text>
            <TextInput
              style={{
                width: width * 0.8,
                height: 45,
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
                marginBottom: 15,
                fontFamily: "Prompt-Regular",
              }}
              defaultValue={bodygarmin.username}
              onChangeText={(text) => {
                setbodygarmin((val) => ({
                  ...val,
                  username: text,
                }));
              }}
            />
            <TextInput
              style={{
                width: width * 0.8,
                height: 45,
                borderWidth: 1,
                borderRadius: 5,
                paddingHorizontal: 10,
              }}
              secureTextEntrys
              defaultValue={bodygarmin.password}
              onChangeText={(text) => {
                setbodygarmin((val) => ({
                  ...val,
                  password: text,
                }));
              }}
            />
            <TouchableOpacity
              onPress={async () => {
                setModal(false);
                setmodals1(true);

                let count = 0;
                const res = await apiservice({
                  path:
                    "/user/garmin?user=" +
                    bodygarmin.username +
                    "&pass=" +
                    bodygarmin.password +
                    "&date=" +
                    moment().format("YYYY-MM-DD"),
                });

                res?.data?.steps?.map((item) => {
                  count = count + item?.steps;
                });
                setmodals1(false);

                navigation.navigate("SendResults", {
                  ...route?.params,
                  devices: "GARMIN",
                  last_totals: count,
                });
              }}
              style={{
                backgroundColor: "#000",
                width: width * 0.3,
                height: 45,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 13,
              }}
            >
              <Text
                style={{
                  fontFamily: "Prompt-Regular",
                  fontSize: 19,

                  color: "#fff",
                }}
              >
                Connect
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModal(false);
              }}
              style={{
                backgroundColor: "#fff",
                width: width * 0.3,
                height: 45,
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 13,
              }}
            >
              <Text
                style={{
                  fontFamily: "Prompt-Regular",
                  fontSize: 19,
                  color: "#000",
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
          backgroundColor: "#FCC81D",
          flex: 1,
        }}
      >
        <ScrollView>
          <Headerdetail item={dataEV.titel} navigation={navigation} />
          {page && (
            <View>
              <Text style={styles.texthead}>SOSORUN SMART GEAR</Text>
              <View style={styles.line} />
              <TouchableOpacity
                onPress={async () => {
                  // setmodals1(true);
                  Fitblekit.onScanStart((e, i) => {});

                  setModal3(true);
                }}
                style={styles.touch}
              >
                <Image
                  source={{
                    uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/112.png",
                  }}
                  style={styles.imgsoso1}
                />
                <Text style={styles.textdevice}>SOSORUN POD V2</Text>
              </TouchableOpacity>
              <View style={styles.line} />
              <Text style={styles.texthead}>Other Devices</Text>
              <View style={styles.line} />
              <TouchableOpacity
                onPress={() => {
                  setModal(true);
                }}
                style={styles.touch}
              >
                <Image
                  source={{
                    uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/113.png",
                  }}
                  style={styles.imgsoso2}
                />
                <Text style={styles.textdevice}>GARMIN</Text>
              </TouchableOpacity>
              <View style={styles.line} />
              {Platform.OS == "ios" && (
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("SendResults", {
                      ...route?.params,
                      devices: "HeathKit",
                    });
                  }}
                  style={styles.touch}
                >
                  <Image
                    source={require("../../img/healthkit.png")}
                    style={styles.imgsoso2}
                  />
                  <Text style={styles.textdevice}>Heath Kit</Text>
                </TouchableOpacity>
              )}
              {Platform.OS == "android" && (
                <TouchableOpacity
                  onPress={() => {
                    fetchData();
                  }}
                  style={styles.touch}
                >
                  <Image
                    resizeMode="contain"
                    source={require("../../img/115.png")}
                    style={styles.imgsoso2}
                  />
                  <Text style={styles.textdevice}>Strava</Text>
                </TouchableOpacity>
              )}
              <View style={styles.line} />
              {Platform.OS == "android" && (
                <TouchableOpacity
                  onPress={() => {
                    fetchData1();
                  }}
                  style={styles.touch}
                >
                  <Image
                    resizeMode="contain"
                    source={require("../../img/fit.png")}
                    style={styles.imgsoso2}
                  />
                  <Text style={styles.textdevice}>GoogleFit</Text>
                </TouchableOpacity>
              )}
              <View style={styles.line} />
            </View>
          )}
          {!page && (
            <View>
              <FlatList
                data={data}
                extraData={[data]}
                renderItem={({ item, index }) => {
                  return (
                    item?.event_Listt?.Type != "Eventonroad" && (
                      <View
                        style={{
                          flexDirection: "row",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Image
                          style={{
                            width: width * 0.22,
                            height: width * 0.22,
                            marginTop: 15,
                            marginLeft: 10,
                          }}
                          source={{
                            uri:
                              "https://api.sosorun.com/api/imaged/get/" +
                              item?.event_Listt?.Achievement,
                          }}
                        />
                        {
                          <View>
                            <View style={styles.view}>
                              <Text style={styles.nameevent}>
                                {item.event_name}
                              </Text>
                              <TouchableOpacity
                                onPress={async () =>
                                  // navigation.navigate("Campaign", { item })
                                  {
                                    const res1 = await apiservice({
                                      path: "/user/distance_subtract",
                                      method: "put",
                                      body: {
                                        uid: body.id,
                                        distance: body?.distance,
                                      },
                                      token: token.accessToken,
                                    });

                                    const response = await apiservice({
                                      path: "/event/updateuserjoinEvent",
                                      method: "put",
                                      body: {
                                        id: item.id,
                                        distance: body?.distance * 1000,
                                        running_Time: 0,
                                        cal: 0,
                                      },
                                      token: token.accessToken,
                                    });
                                    console.log(response);
                                    if (response.status == 200) {
                                      Alert.alert("อัพเดทข้อมูลสำเร็จ");
                                      setTimeout(() => {
                                        getUser();
                                      }, 1000);
                                    }
                                  }
                                }
                                style={styles.viewbottom}
                              >
                                <Text style={styles.texttail}>Sync</Text>
                              </TouchableOpacity>
                            </View>

                            <View style={styles.viewtext}>
                              <View style={styles.viewsmall}>
                                <Text style={styles.text1}>ระยะทางทั้งหมด</Text>
                                <Text style={styles.text2}>
                                  {(item.total_distance / 1000).toFixed(2)} กม.
                                </Text>
                              </View>
                              <View style={styles.viewsmall}>
                                <Text style={styles.text1}>
                                  ระยะทางที่ทำได้
                                </Text>
                                <Text style={styles.text2}>
                                  {(item.last_distance / 1000).toFixed(2)} กม.
                                </Text>
                              </View>
                              <View style={styles.viewsmall}>
                                <Text style={styles.text1}>
                                  ระดับความสำเร็จ
                                </Text>
                                <Text style={styles.text2}>
                                  {(
                                    ((item.last_distance / 1000).toFixed(2) *
                                      100) /
                                    (item.total_distance / 1000).toFixed(2)
                                  ).toFixed(2)}
                                  %
                                </Text>
                              </View>
                            </View>
                          </View>
                        }
                      </View>
                    )
                  );
                }}
              />
            </View>
          )}
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
    width: width * 0.75,
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
    width: width * 0.7,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    marginVertical: 5,
  },
  viewsmall: {
    width: width * 0.24,
    alignSelf: "center",
    justifyContent: "space-between",
    height: width * 0.15,
  },
  text1: {
    fontFamily: "Prompt-Regular",
    fontSize: 12,
    color: "#000",
    alignSelf: "center",
  },
  text2: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    alignSelf: "center",
  },
  contalner: {
    flex: 1,
  },
  texthead: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000000",
    marginLeft: 20,
    marginTop: 20,
  },
  textdevice: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000000",
    marginLeft: 20,
    alignSelf: "center",
  },
  touch: {
    marginLeft: 20,
    marginTop: 20,
    flexDirection: "row",
  },
  imgsoso: {
    width: 68,
    height: 84,
    alignSelf: "center",
  },
  line: {
    width: width,
    borderBottomWidth: 1,
    borderBottomColor: "#44444450",
    marginTop: 20,
  },
  imgsoso1: {
    width: 47,
    height: 57,
    alignSelf: "center",
  },
  imgsoso2: {
    width: 31,
    height: 38,
    alignSelf: "center",
  },
});
