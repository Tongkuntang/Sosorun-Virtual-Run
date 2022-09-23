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
  ActivityIndicator,
  PermissionsAndroid,
} from "react-native";
import { timeformet } from "../components/test";
import BleManager from "react-native-ble-manager";
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
  n_devices,
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
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const permissions = {
  permissions: {
    read: [AppleHealthKit.Constants.Permissions.HeartRate],
    write: [AppleHealthKit.Constants.Permissions.HeartRate],
    read: [AppleHealthKit.Constants.Permissions.Steps],
    write: [AppleHealthKit.Constants.Permissions.Steps],
  },
};

export default function index({ navigation }) {
  const [modals, setModal] = useState(false);
  const [n_device, s_n_device] = useRecoilState(n_devices);
  const [list_setrender, setrender] = useState([]);

  const [modals1, setModal1] = useState(false);
  const [modals2, setModal2] = useState(Platform.OS == "android");
  const [modals3, setModal3] = useState(false);
  const peripherals = new Map();
  const [list, setList] = useState([]);
  const eventEmitter = new NativeEventEmitter(Fitblekit);
  const [devicsI, setDeviceI] = useState(0);
  const [bodygarmin, setbodygarmin] = useRecoilState(deviceRegis);
  const token = useRecoilValue(tokenState);
  const isFocus = useIsFocused();
  const [body, setbody] = useState();
  const [healthkit, sethealthkit] = useState(0);
  const [pod, setpod] = useState(0);
  const [page, setpage] = useState(true);
  const [data, setData] = useState([]);

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
        console.log(item.rawSteps);
        if (
          item.rawSteps?.filter((e) => e?.appPackageName?.includes("strava"))
            .length > 0
        ) {
          setDeviceI(5);
        }
      }
    });
  }

  async function syncData() {
    setModal1(true);

    const opt = {
      startDate: moment().add(-1, "days").format("YYYY-MM-DDTHH:mm:ssz"), // required ISO8601Timestamp
      endDate: new Date().toISOString(), // required ISO8601Timestamp
      bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
    };
    let steps = 0;
    const res = await GoogleFit.getDailyStepCountSamples(opt);

    res?.map((item) => {
      if (item.source == "com.google.android.gms:estimated_steps") {
        item.rawSteps
          ?.filter((e) => e?.appPackageName?.includes("strava"))
          .map((e) => (steps = steps + e.steps));
      }
    });

    const res1 = await apiservice({
      path: "/user/syncdistance",
      method: "post",
      body: {
        uid: body?.id,
        type: "HEALTHKIT",
        date: moment(),
        last_count: (steps * body?.height * 0.415) / 100000,
      },
    });

    if (res1.status == 200) {
      setModal1(false);
      Alert.alert("อัพเดทข้อมูลสำเร็จ");
      setDeviceI(0);

      const getuser = await getActionUser(token);
      setbody(getuser.data);
    } else {
      setModal1(false);
      Alert.alert("อัพเดทข้อมูลไม่สำเร็จ");
    }

    console.log(steps);
  }

  async function fetchData1() {
    const opt = {
      startDate: moment().add(-1, "days").format("YYYY-MM-DDTHH:mm:ssz"), // required ISO8601Timestamp
      endDate: new Date().toISOString(), // required ISO8601Timestamp
      bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
    };
    const res = await GoogleFit.getDailyStepCountSamples(opt);

    res?.map((item) => {
      if (item.source == "com.google.android.gms:estimated_steps") {
        if (item.rawSteps?.length > 0) {
          setDeviceI(4);
        }
      }
    });
  }

  async function syncData1() {
    setModal1(true);

    const opt = {
      startDate: moment().add(-1, "days").format("YYYY-MM-DDTHH:mm:ssz"), // required ISO8601Timestamp
      endDate: new Date().toISOString(), // required ISO8601Timestamp
      bucketUnit: BucketUnit.DAY, // optional - default "DAY". Valid values: "NANOSECOND" | "MICROSECOND" | "MILLISECOND" | "SECOND" | "MINUTE" | "HOUR" | "DAY"
      bucketInterval: 1, // optional - default 1.
    };
    let steps = 0;
    const res = await GoogleFit.getDailyStepCountSamples(opt);

    res?.map((item) => {
      if (item.source == "com.google.android.gms:estimated_steps") {
        item.rawSteps.map((e) => (steps = steps + e.steps));
      }
    });

    const res1 = await apiservice({
      path: "/user/syncdistance",
      method: "post",
      body: {
        uid: body?.id,
        type: "HEALTHKIT",
        date: moment(),
        last_count: (steps * body?.height * 0.415) / 100000,
      },
    });

    if (res1.status == 200) {
      setModal1(false);
      Alert.alert("อัพเดทข้อมูลสำเร็จ");
      setDeviceI(0);

      const getuser = await getActionUser(token);
      setbody(getuser.data);
    } else {
      setModal1(false);
      Alert.alert("อัพเดทข้อมูลไม่สำเร็จ");
    }

    console.log(steps);
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

  const [isScanning, setIsScanning] = useState(false);

  const startScan = () => {
    if (!isScanning) {
      BleManager.scan([], 3, true)
        .then((results) => {
          console.log("Scanning...");
          setIsScanning(true);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleStopScan = () => {
    console.log("Scan is stopped");
    setIsScanning(false);
  };

  const handleDisconnectedPeripheral = (data) => {
    let peripheral = peripherals.get(data.peripheral);
    if (peripheral) {
      peripheral.connected = false;
      peripherals.set(peripheral.id, peripheral);
      setrender(Array.from(peripherals.values()));
    }
    console.log("Disconnected from " + data.peripheral);
  };

  const handleUpdateValueForCharacteristic = (data) => {
    console.log(
      "Received data from " +
        data.peripheral +
        " characteristic " +
        data.characteristic,
      data.value
    );
  };

  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length == 0) {
        console.log("No connected peripherals");
      }
      console.log(results);
      for (var i = 0; i < results.length; i++) {
        var peripheral = results[i];
        peripheral.connected = true;
        peripherals.set(peripheral.id, peripheral);
        setrender(Array.from(peripherals.values()));
      }
    });
  };

  const handleDiscoverPeripheral = (peripheral) => {
    console.log("Got ble peripheral", peripheral);
    if (!peripheral.name) {
      peripheral.name = "NO NAME";
    }
    peripherals.set(peripheral.id, peripheral);
    setrender(Array.from(peripherals.values()));
  };

  const testPeripheral = (peripheral) => {
    if (peripheral) {
      if (peripheral.connected) {
        BleManager.disconnect(peripheral.id);
      } else {
        BleManager.connect(peripheral.id)
          .then(() => {
            let p = peripherals.get(peripheral.id);
            if (p) {
              p.connected = true;
              peripherals.set(peripheral.id, p);
              setrender(Array.from(peripherals.values()));
            }
            console.log("Connected to " + peripheral.id);

            setTimeout(() => {
              /* Test read current RSSI value */
              BleManager.retrieveServices(peripheral.id).then(
                (peripheralData) => {
                  console.log("Retrieved peripheral services", peripheralData);

                  BleManager.readRSSI(peripheral.id).then((rssi) => {
                    console.log("Retrieved actual RSSI value", rssi);
                    let p = peripherals.get(peripheral.id);
                    if (p) {
                      p.rssi = rssi;
                      peripherals.set(peripheral.id, p);
                      setrender(Array.from(peripherals.values()));
                    }
                  });
                }
              );
            }, 900);
          })
          .catch((error) => {
            console.log("Connection error", error);
          });
      }
    }
  };

  useEffect(() => {
    BleManager.start({ showAlert: false });

    bleManagerEmitter.addListener(
      "BleManagerDiscoverPeripheral",
      handleDiscoverPeripheral
    );
    bleManagerEmitter.addListener("BleManagerStopScan", handleStopScan);
    bleManagerEmitter.addListener(
      "BleManagerDisconnectPeripheral",
      handleDisconnectedPeripheral
    );
    bleManagerEmitter.addListener(
      "BleManagerDidUpdateValueForCharacteristic",
      handleUpdateValueForCharacteristic
    );

    if (Platform.OS === "android" && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      ).then((result) => {
        if (result) {
          console.log("Permission is OK");
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          ).then((result) => {
            if (result) {
              console.log("User accept");
            } else {
              console.log("User refuse");
            }
          });
        }
      });
    }

    return () => {
      console.log("unmount");
      bleManagerEmitter.removeListener(
        "BleManagerDiscoverPeripheral",
        handleDiscoverPeripheral
      );
      bleManagerEmitter.removeListener("BleManagerStopScan", handleStopScan);
      bleManagerEmitter.removeListener(
        "BleManagerDisconnectPeripheral",
        handleDisconnectedPeripheral
      );
      bleManagerEmitter.removeListener(
        "BleManagerDidUpdateValueForCharacteristic",
        handleUpdateValueForCharacteristic
      );
    };
  }, []);

  useEffect(() => {
    try {
      if (Platform.OS == "android") {
        const newDevice = eventEmitter.addListener(
          "EVENTFBK",
          (deviceDiscovered) => {
            const ress = deviceDiscovered
              ?.replace("[", "")
              ?.replace("]", "")
              .split("MOVE");
            console.log("deviceDiscovered", ress);
            if (ress.length > 0) {
              console.log(ress);
              setrender(
                ress
                  ?.map((e) => (e?.length > 0 ? "MOVE" + e : false))
                  ?.filter((e) => e)
              );
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
            if (deviceDiscovered?.includes("MOVE")) {
              s_n_device(deviceDiscovered);
            }
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
        BleManager.start({ showAlert: false }).then(() => {
          // Success code
          console.log("Module initialized");

          BleManager.scan([], 5, true).then((e) => {
            // Success code
            console.log("Scan started", e);
          });

          bleManagerEmitter.addListener(
            "BleManagerDiscoverPeripheral",
            (args) => {
              // The id: args.id
              // The name: args.name
            }
          );
        });

        const newDevice2 = eventEmitter.addListener(
          "CONNECT",
          (deviceDiscovered) => {
            // setrender(
            //   deviceDiscovered.name
            //     .filter((item) => {
            //       return item.localName.includes("MOVE");
            //     })
            //     ?.map((e, i) => ({ localName: e.localName, index: i }))
            // );
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
      // testPeripheral(list[3]);
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

      console.log("getuser", getuser);

      const res = await apiservice({
        path: "/authen/createhw",
        method: "post",
        body: {
          uid: getuser?.data?.id,
          info: tokens,
        },
      });

      console.log("res", res);

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
              data={list_setrender?.filter((e) =>
                Platform.OS == "ios" ? e?.name?.includes("MOVE") : true
              )}
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
                console.log(item);
                return (
                  <TouchableOpacity
                    onPress={() => {
                      if (Platform.OS == "android") {
                        Fitblekit.onConnect(index, "APPROVE", (e) => {
                          console.log(e);
                        });
                      } else {
                        Fitblekit.onConnect(item?.id, (e) => {
                          console.log(e);
                        });
                      }

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
                      {item?.name || item?.replace("[", "").replace("]", "")}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={modals2} style={{ flex: 1 }}>
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
              setModal2(false);
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
          <View style={{ width: width * 0.7, height: height * 0.7 }}>
            <FlatList
              data={[
                {
                  img: require("../../img/mi1.png"),
                  title: "เข้า Application Strava และเชื่อมอุปกรณ์",
                },
                {
                  img: require("../../img/mi2.png"),
                  title: "เข้าไปที่ตั้งค่า และ Link Other services",
                },
                {
                  img: require("../../img/mi3.png"),
                  title: "เลือก GoogleFit",
                },
              ]}
              pagingEnabled
              horizontal
              renderItem={({ item, index }) => {
                return (
                  <View
                    style={{
                      width: width * 0.7,
                      height: height * 0.7,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      style={{ width: width * 0.6, height: height * 0.6 }}
                      source={item?.img}
                    />
                    <Text
                      style={{
                        color: "#fff",
                        fontFamily: "Prompt-Regular",
                        textAlign: "center",
                        marginTop: 25,
                      }}
                    >
                      {item?.title}
                    </Text>
                  </View>
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
              setModal1(false);
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
                const res = await apiservice({
                  path:
                    "/user/garmin?user=" +
                    bodygarmin.username +
                    "&pass=" +
                    bodygarmin.password +
                    "&date=" +
                    moment().format("YYYY-MM-DD"),
                });
                if (res?.data?.steps) {
                  setDeviceI(2);
                  setModal(false);
                } else {
                  Alert.alert("ไม่มีบัญชีนี้ในระบบ");
                }
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
        }}
      >
        <ScrollView>
          <Header
            navigation={navigation}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View
            style={{
              width: width,
              backgroundColor: "#000",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 30,
            }}
          >
            <TouchableOpacity
              style={[{ position: "absolute", top: -5, left: -5 }]}
              onPress={() => {
                setpage((val) => !val);
              }}
            >
              <Text style={[styles.texthead]}>SYNC and BOOST</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setpage((val) => !val);
              }}
            >
              <ProgressCircle
                percent={body?.distance}
                radius={80}
                borderWidth={21}
                color="#FCC81D"
                shadowColor="#999"
                bgColor="#fff"
              >
                <Text
                  style={[
                    styles.texthead,
                    { fontSize: 18, marginLeft: 0, marginTop: 0 },
                  ]}
                >
                  {parseFloat(body?.distance || 0).toFixed(2) + "KM"}
                </Text>
              </ProgressCircle>
            </TouchableOpacity>
          </View>
          {page && (
            <View>
              {(devicsI == 0 || devicsI == 1) && (
                <Text style={styles.texthead}>SOSORUN SMART GEAR</Text>
              )}
              {(devicsI == 0 || devicsI == 1) && <View style={styles.line} />}
              {(devicsI == 0 || devicsI == 1) && (
                <View style={styles.touch}>
                  <Image
                    source={{
                      uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/112.png",
                    }}
                    style={styles.imgsoso1}
                  />
                  <View>
                    <Text style={styles.textdevice}>SOSORUN POD V2</Text>
                    <Text style={[styles.textdevice, { fontSize: 11 }]}>
                      {n_device}
                    </Text>
                  </View>

                  <View
                    style={{ position: "absolute", right: 25, top: 5 }}
                    name="check"
                    size={32}
                    color="#55AB68"
                  >
                    {devicsI == 0 && (
                      <TouchableOpacity
                        disabled={devicsI == 1}
                        onPress={() => {
                          if (pod == 0) {
                            Fitblekit.onScanStart((e, i) => {
                              if (Platform?.OS == "ios") {
                                console.log("Platform", e, i);
                              }
                            });
                            setModal3(true);
                          } else {
                            setDeviceI(1);
                          }
                        }}
                        style={{
                          backgroundColor: "#ccc",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 10,
                          width: 65,
                          height: 65,
                          borderRadius: 55,
                          marginTop: -5,
                        }}
                      >
                        <Text style={[styles.textdevice, { marginLeft: 0 }]}>
                          sync
                        </Text>
                      </TouchableOpacity>
                    )}
                    {devicsI == 1 && (
                      <TouchableOpacity
                        disabled={devicsI != 1}
                        onPress={async () => {
                          const res = await apiservice({
                            path: "/user/syncdistance",
                            method: "post",
                            body: {
                              uid: body?.id,
                              type: "POD",
                              date: moment(),
                              last_count: (pod * body?.height * 0.415) / 100000,
                            },
                          });

                          if (res.status == 200) {
                            Alert.alert("อัพเดทข้อมูลสำเร็จ");
                            setDeviceI(0);

                            const getuser = await getActionUser(token);
                            setbody(getuser.data);
                          } else {
                            setModal1(false);
                            Alert.alert("อัพเดทข้อมูลไม่สำเร็จ");
                          }
                        }}
                        style={{
                          backgroundColor: devicsI == 1 ? "#FCC81D" : "#ccc",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 10,
                          marginTop: 10,
                          width: 65,
                          height: 65,
                          borderRadius: 55,
                          marginTop: -5,
                        }}
                      >
                        <Text style={[styles.textdevice, { marginLeft: 0 }]}>
                          boost
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
              {(devicsI == 0 || devicsI == 1) && <View style={styles.line} />}
              {(devicsI == 0 ||
                devicsI == 2 ||
                devicsI == 3 ||
                devicsI == 4) && (
                <Text style={styles.texthead}>Other Devices</Text>
              )}
              {(devicsI == 0 ||
                devicsI == 2 ||
                devicsI == 3 ||
                devicsI == 4) && <View style={styles.line} />}
              {(devicsI == 0 || devicsI == 2) && (
                <View
                  onPress={() => {
                    Linking.openURL(
                      "https://oauth-login.cloud.huawei.com/oauth2/v3/authorize?response_type=code&state=state_parameter_passthrough_value&client_id=106360789&redirect_uri=https://api.sosorun.com/api/authen/huawei&scope=openid+https://www.huawei.com/healthkit/step.read&access_type=offline&display=touch"
                    );
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
                  <View
                    style={{ position: "absolute", right: 25, top: -7 }}
                    name="check"
                    size={32}
                    color="#55AB68"
                  >
                    {devicsI == 0 && (
                      <TouchableOpacity
                        onPress={() => {
                          setModal(true);
                        }}
                        style={{
                          backgroundColor: bodygarmin?.username
                            ? "#FCC81D"
                            : "#ccc",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 10,
                          width: 65,
                          height: 65,
                          borderRadius: 55,
                          marginTop: -5,
                        }}
                      >
                        <Text style={[styles.textdevice, { marginLeft: 0 }]}>
                          sync
                        </Text>
                      </TouchableOpacity>
                    )}
                    {devicsI == 2 && (
                      <TouchableOpacity
                        onPress={async () => {
                          let count = 0;
                          if (bodygarmin?.username) {
                            setModal1(true);
                            const res = await apiservice({
                              path:
                                "/user/garmin?user=" +
                                bodygarmin.username +
                                "&pass=" +
                                bodygarmin.password +
                                "&date=" +
                                moment().add(-2, "hours").format("YYYY-MM-DD"),
                            });

                            res?.data?.steps?.map((item) => {
                              count = count + item?.steps;
                            });

                            const res1 = await apiservice({
                              path: "/user/syncdistance",
                              method: "post",
                              body: {
                                uid: body?.id,
                                type: "GARMIN",
                                date: moment(),
                                last_count:
                                  (count * body?.height * 0.415) / 100000,
                              },
                            });

                            if (res1.status == 200) {
                              setModal1(false);
                              Alert.alert("อัพเดทข้อมูลสำเร็จ");
                              setDeviceI(0);
                              const getuser = await getActionUser(token);
                              setbody(getuser.data);
                            } else {
                              setModal1(false);
                              Alert.alert("อัพเดทข้อมูลไม่สำเร็จ");
                            }
                          }
                        }}
                        style={{
                          backgroundColor: "#ccc",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 10,
                          marginTop: 10,
                          width: 65,
                          height: 65,
                          borderRadius: 55,
                          marginTop: -5,
                        }}
                      >
                        <Text style={[styles.textdevice, { marginLeft: 0 }]}>
                          boost
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
              {(devicsI == 0 || devicsI == 2) && Platform.OS == "ios" && (
                <View style={styles.line} />
              )}
              {Platform.OS == "ios" && (devicsI == 0 || devicsI == 3) && (
                <View style={styles.touch}>
                  <Image
                    source={require("../../img/healthkit.png")}
                    style={styles.imgsoso2}
                  />
                  <Text style={styles.textdevice}>Heath Kit</Text>
                  <View
                    style={{ position: "absolute", right: 25, top: -7 }}
                    name="check"
                    size={32}
                    color="#55AB68"
                  >
                    {devicsI == 0 && (
                      <TouchableOpacity
                        onPress={async () => {
                          try {
                            // type: "Walking", // one of: ['Walking', 'StairClimbing', 'Running', 'Cycling', 'Workout']
                            AppleHealthKit.isAvailable((err, available) => {
                              if (err) {
                                console.log(
                                  "error initializing Healthkit: ",
                                  err
                                );
                                return;
                              }

                              console.log(available);
                              if (available) {
                                AppleHealthKit.initHealthKit(
                                  permissions,
                                  (err, res) => {
                                    const sub2 =
                                      NativeAppEventEmitter.addListener(
                                        "healthKit:StepCount:new",
                                        (evt) => {}
                                      );

                                    if (err) {
                                      return;
                                    }

                                    if (res) {
                                      let options = {
                                        startDate: new Date(
                                          parseInt(
                                            moment()
                                              .add(-2, "day")
                                              .format("YYYY")
                                          ),
                                          parseInt(
                                            moment().add(-2, "day").format("M")
                                          ),
                                          parseInt(
                                            moment().add(-2, "day").format("D")
                                          )
                                        ).toISOString(),
                                        endDate: new Date().toISOString(),
                                      };

                                      AppleHealthKit.getStepCount(
                                        options,
                                        (err, results) => {
                                          if (err) {
                                            return;
                                          }
                                          sethealthkit(results?.value);
                                        }
                                      );

                                      setDeviceI(3);
                                    }
                                  }
                                );
                              } else {
                              }
                              // Healthkit is available
                            });
                          } catch (error) {}
                        }}
                        style={{
                          backgroundColor: healthkit > 0 ? "#FCC81D" : "#ccc",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 10,
                          marginTop: -5,
                          width: 65,
                          height: 65,
                          borderRadius: 55,
                        }}
                      >
                        <Text style={[styles.textdevice, { marginLeft: 0 }]}>
                          sync
                        </Text>
                      </TouchableOpacity>
                    )}
                    {devicsI == 3 && (
                      <TouchableOpacity
                        onPress={async () => {
                          console.log(healthkit);
                          const res = await apiservice({
                            path: "/user/syncdistance",
                            method: "post",
                            body: {
                              uid: body?.id,
                              type: "HEALTHKIT",
                              date: moment(),
                              last_count:
                                (healthkit * body?.height * 0.415) / 100000,
                            },
                          });
                          console.log(res?.status);
                          if (res.status == 200) {
                            Alert.alert("อัพเดทข้อมูลสำเร็จ");
                            setDeviceI(0);

                            const getuser = await getActionUser(token);
                            setbody(getuser.data);
                          } else {
                            setModal1(false);
                            Alert.alert("อัพเดทข้อมูลไม่สำเร็จ");
                          }
                        }}
                        style={{
                          backgroundColor: "#ccc",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 10,
                          marginTop: -5,
                          width: 65,
                          height: 65,
                          borderRadius: 55,
                        }}
                      >
                        <Text style={[styles.textdevice, { marginLeft: 0 }]}>
                          boost
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
              {(devicsI == 0 || devicsI == 3) && <View style={styles.line} />}
              {(devicsI == 0 || devicsI == 5) && Platform.OS == "android" && (
                <View style={styles.touch}>
                  <Image
                    resizeMode="contain"
                    source={require("../../img/115.png")}
                    style={styles.imgsoso2}
                  />
                  <Text style={styles.textdevice}>Strava</Text>
                  <View
                    style={{ position: "absolute", right: 25, top: -7 }}
                    name="check"
                    size={32}
                    color="#55AB68"
                  >
                    {devicsI == 0 && (
                      <TouchableOpacity
                        onPress={async () => {
                          const options = {
                            scopes: [
                              Scopes.FITNESS_ACTIVITY_READ,
                              Scopes.FITNESS_ACTIVITY_WRITE,
                              Scopes.FITNESS_BODY_READ,
                              Scopes.FITNESS_BODY_WRITE,
                              Scopes.FITNESS_LOCATION_WRITE,
                              Scopes.FITNESS_LOCATION_READ,
                            ],
                          };

                          GoogleFit.authorize(options)
                            .then((authResult) => {
                              if (authResult.success) {
                                GoogleFit.startRecording((callback) => {
                                  // Process data from Google Fit Recording API (no google fit app needed)
                                  fetchData();
                                });
                              } else {
                                Alert.alert(authResult.message);
                              }
                            })
                            .catch((err) => {
                              Alert.alert(err);
                            });
                        }}
                        style={{
                          backgroundColor: healthkit > 0 ? "#FCC81D" : "#ccc",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 10,
                          marginTop: -5,
                          width: 65,
                          height: 65,
                          borderRadius: 55,
                        }}
                      >
                        <Text style={[styles.textdevice, { marginLeft: 0 }]}>
                          sync
                        </Text>
                      </TouchableOpacity>
                    )}
                    {devicsI == 5 && (
                      <TouchableOpacity
                        onPress={async () => {
                          syncData();
                        }}
                        style={{
                          backgroundColor: "#ccc",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 10,
                          marginTop: -5,
                          width: 65,
                          height: 65,
                          borderRadius: 55,
                        }}
                      >
                        <Text style={[styles.textdevice, { marginLeft: 0 }]}>
                          boost
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
              {(devicsI == 0 || devicsI == 5) && Platform.OS == "android" && (
                <View style={styles.line} />
              )}
              {/* {(devicsI == 0 || devicsI == 4) && Platform.OS == "android" && (
                <View style={styles.touch}>
                  <Image
                    resizeMode="contain"
                    source={require("../../img/fit.png")}
                    style={styles.imgsoso2}
                  />
                  <Text style={styles.textdevice}>GoogleFit</Text>
                  <View
                    style={{ position: "absolute", right: 25, top: -7 }}
                    name="check"
                    size={32}
                    color="#55AB68"
                  >
                    {devicsI == 0 && (
                      <TouchableOpacity
                        onPress={async () => {
                          const options = {
                            scopes: [
                              Scopes.FITNESS_ACTIVITY_READ,
                              Scopes.FITNESS_ACTIVITY_WRITE,
                              Scopes.FITNESS_BODY_READ,
                              Scopes.FITNESS_BODY_WRITE,
                              Scopes.FITNESS_LOCATION_WRITE,
                              Scopes.FITNESS_LOCATION_READ,
                            ],
                          };

                          GoogleFit.authorize(options)
                            .then((authResult) => {
                              if (authResult.success) {
                                GoogleFit.startRecording((callback) => {
                                  // Process data from Google Fit Recording API (no google fit app needed)
                                  fetchData1();
                                });
                              } else {
                                Alert.alert(authResult.message);
                              }
                            })
                            .catch((err) => {
                              Alert.alert(err);
                            });
                        }}
                        style={{
                          backgroundColor: healthkit > 0 ? "#FCC81D" : "#ccc",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 10,
                          marginTop: -5,
                          width: 65,
                          height: 65,
                          borderRadius: 55,
                        }}
                      >
                        <Text style={[styles.textdevice, { marginLeft: 0 }]}>
                          sync
                        </Text>
                      </TouchableOpacity>
                    )}
                    {devicsI == 4 && (
                      <TouchableOpacity
                        onPress={async () => {
                          syncData1();
                        }}
                        style={{
                          backgroundColor: "#ccc",
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 10,
                          marginTop: -5,
                          width: 65,
                          height: 65,
                          borderRadius: 55,
                        }}
                      >
                        <Text style={[styles.textdevice, { marginLeft: 0 }]}>
                          boost
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
              {(devicsI == 0 || devicsI == 4) && Platform.OS == "android" && (
                <View style={styles.line} />
              )} */}
            </View>
          )}
          {!page && (
            <View>
              <FlatList
                data={data}
                extraData={[data]}
                renderItem={({ item, index }) => {
                  return (
                    item?.event_Listt?.Type != "Eventonroad" &&
                    (item.total_distance / 1000).toFixed(2) >
                      (item.last_distance / 1000).toFixed(2) && (
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
                                      method: "post",
                                      body: {
                                        uid: body.id,
                                        distance: body?.distance,
                                      },
                                      token: token.accessToken,
                                    });

                                    console.log(res1?.data);

                                    const response = await apiservice({
                                      path: "/event/updateuserjoinEvent",
                                      method: "put",
                                      body: {
                                        id: item.id,
                                        distance:
                                          body?.distance >
                                          item?.total_distance / 1000
                                            ? item?.total_distance
                                            : body?.distance * 1000,
                                        running_Time: 0,
                                        cal: 0,
                                      },
                                      token: token.accessToken,
                                    });
                                    console.log(response);
                                    if (response.status == 200) {
                                      Alert.alert("อัพเดทข้อมูลสำเร็จ");
                                      setDeviceI(0);

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
    width: width * 0.5,
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
    color: "#717171",
    marginLeft: 20,
    marginTop: 20,
  },
  textdevice: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#717171",
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
