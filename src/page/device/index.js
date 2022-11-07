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
} from "react-native";
import { timeformet } from "../components/test";
const { Fitblekit } = NativeModules;
import { useRecoilState, useRecoilValue } from "recoil";
import { authHistrory } from "../../action/actionhistrory";
import AppleHealthKit, {
  HealthValue,
  HealthKitPermissions,
} from "react-native-health";
import GoogleFit, { Scopes, BucketUnit } from "react-native-google-fit";
import {
  deviceIndex,
  deviceRegis,
  tokenState,
  lans,
} from "../../reducer/reducer/reducer/Atom";
import Header from "../components/header";
import { TextInput } from "react-native-gesture-handler";
import { apiservice } from "../../service/service";
import { actionEditprofile, getActionUser } from "../../action/actionauth";
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

export default function index({ navigation }) {
  const [modals, setModal] = useState(false);
  const [n_device, s_n_device] = useState("");
  const [list_setrender, setrender] = useState([]);
  const [lan, setlan] = useRecoilState(lans);
  const [modals1, setModal1] = useState(false);
  const [modals2, setModal2] = useState(Platform.OS == "android");
  const [modals3, setModal3] = useState(false);
  const [Strava, setStrava] = useState(testjson);
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
        if (
          item.rawSteps?.filter(
            (e) => e?.appPackageName == "com.xiaomi.hm.health"
          ).length > 0
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
          ?.filter((e) => e?.appPackageName == "com.xiaomi.hm.health")
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

<<<<<<< HEAD
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

  console.log("body", body?.user_accounts?.total_distance);

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

  console.log(
    "totals >>> ",
    parseInt(body?.user_accounts?.total_distance) / 10000000
  );

=======
>>>>>>> parent of 645d93e (update)
  useEffect(() => {
    try {
      if (Platform.OS == "android") {
        const newDevice = eventEmitter.addListener(
          "EVENTFBK",
          (deviceDiscovered) => {
            const ress = deviceDiscovered.split(",");
            console.log("deviceDiscovered", ress);
            if (ress.length > 0) {
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
        const newDevice2 = eventEmitter.addListener(
          "CONNECT",
          (deviceDiscovered) => {
            setrender(
              deviceDiscovered.name
                .filter((item) => {
                  return item.localName.includes("MOVE");
                })
                ?.map((e, i) => ({ localName: e.localName, index: i }))
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
      // testPeripheral(list[3]);
    }
  }, [list]);

  useEffect(() => {
    const onReceiveURL = async ({ url }) => {
      const re = url.split("=");

      const tokens = {
        access_token: re?.reverse()?.[1].replace("?athlete", ""),
        id_token: re[3].replace("?refreshToken", ""),
        refreshToken: re[4].replace("?scope", ""),
      };

      const res = await apiservice({
        url: "https://www.strava.com/api/v3/activities?per_page=50&page=1",
        path: "",
        method: "get",
        token: tokens?.access_token,
      });

      if (res?.status == 200) {
        setStrava(res?.data);
        // setDeviceI(5);
        setpage(false);
      }
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
                      if (Platform.OS == "android") {
                        Fitblekit.onConnect(index, "APPROVE", (e) => {
                          console.log(e);
                        });
                      } else {
                        Fitblekit.onConnect(index, (e) => {
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
                      {item?.localName ||
                        item?.replace("[", "").replace("]", "")}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
      <Modal transparent={true} visible={false} style={{ flex: 1 }}>
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
                  img: require("../../img/mi3.png"),
                  title: "เข้า Application ZepLife และเชื่อมอุปกรณ์",
                },
                {
                  img: require("../../img/mi4.png"),
                  title: "เข้าไปที่ตั้งค่า และ กดเพิ่มบัญชี",
                },
                {
                  img: require("../../img/mi1.png"),
                  title: "เลือก GoogleFit และ กดที่ชื่อตนเอง",
                },
                {
                  img: require("../../img/mi2.png"),
                  title: "รอ GoogleFit Sync Data เป็นอันเสร็จขั้นตอน",
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
          {/* <View
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
          </View> */}
          {
            <View>
              {<Text style={styles.texthead}>SOSORUN SMART GEAR</Text>}
              {/* {(devicsI == 0 || devicsI == 1) && <View style={styles.line} />} */}
              {/* {(devicsI == 0 || devicsI == 1) && (
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
                          send
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )} */}
              {/* {(devicsI == 0 || devicsI == 1) && <View style={styles.line} />} */}
              {/* {(devicsI == 0 ||
                devicsI == 2 ||
                devicsI == 3 ||
                devicsI == 4) && (
                <Text style={styles.texthead}>Other Devices</Text>
              )} */}
              {/* {(devicsI == 0 ||
                devicsI == 2 ||
                devicsI == 3 ||
                devicsI == 4) && <View style={styles.line} />} */}
              {/* {(devicsI == 0 || devicsI == 2) && (
                <View style={styles.touch}>
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
                          send
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )} */}
              {/* {(devicsI == 0 || devicsI == 2) && Platform.OS == "ios" && (
                <View style={styles.line} />
              )} */}
              {/* {Platform.OS == "ios" && (devicsI == 0 || devicsI == 3) && (
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
                          send
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              )} */}
              {<View style={styles.line} />}
              {
                <View style={styles.touch}>
                  <Image
                    resizeMode="contain"
                    source={require("../../img/115.png")}
                    style={styles.imgsoso2}
                  />
<<<<<<< HEAD
                  <Text style={styles.textdevice}>Strava</Text>
                  <View style={{ position: "absolute", right: 25, top: -7 }}>
=======
                  <Text style={styles.textdevice}>Zepp Life(Mi Fit)</Text>
                  <View
                    style={{ position: "absolute", right: 25, top: -7 }}
                    name="check"
                    size={32}
                    color="#55AB68"
                  >
>>>>>>> parent of 645d93e (update)
                    {devicsI == 0 && (
                      <TouchableOpacity
                        onPress={async () => {
                          Linking.openURL(
                            // "https://www.strava.com/oauth/mobile/authorize?client_id=91716&redirect_uri=https://api.sosorun.com/api/authen/strava&response_type=code&approval_prompt=auto&scope=activity%3Awrite%2Cread_all&state=test",
                            "https://www.strava.com/oauth/mobile/authorize?client_id=91716&redirect_uri=https://api.sosorun.com/api/authen/strava&response_type=code&approval_prompt=auto&scope=activity:read_all&state=test"
                          );
                        }}
                        style={{
                          alignItems: "center",
                          justifyContent: "center",
                          paddingHorizontal: 10,
                          marginTop: -5,
                          width: 120,
                          height: 65,
                          borderRadius: 55,
                        }}
                      >
                        {page && (
                          <Text style={[styles.textdevice, { marginLeft: 0 }]}>
                            {lan == "en"
                              ? "No connected"
                              : "ยังไม่ได้เชื่อมต่อ"}
                          </Text>
                        )}
                        {!page && (
                          <Text style={[styles.textdevice, { marginLeft: 0 }]}>
                            {lan == "en" ? "Connected" : "เชื่อมต่อ"}
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}
                    {devicsI == 5 && (
                      <TouchableOpacity
                        disabled
                        onPress={async () => {
                          // setModal1(true);
                          // let distance = 0;
                          // Strava?.filter((e) => {
                          //   return (
                          //     moment(e.start_date).format("DD-MM-YYYY") ==
                          //     moment().format("DD-MM-YYYY")
                          //   );
                          // })?.map((e) => (distance = distance + e.distance));
                          // const res1 = await apiservice({
                          //   path: "/user/syncdistance",
                          //   method: "post",
                          //   body: {
                          //     uid: body?.id,
                          //     type: "STRAVA",
                          //     date: moment(),
                          //     last_count: distance / 1000,
                          //   },
                          // });
                          // if (res1.status == 200) {
                          //   setModal1(false);
                          //   Alert.alert("อัพเดทข้อมูลสำเร็จ");
                          //   setDeviceI(0);
                          //   const getuser = await getActionUser(token);
                          //   setbody(getuser.data);
                          // } else {
                          //   setModal1(false);
                          //   Alert.alert("อัพเดทข้อมูลไม่สำเร็จ");
                          // }
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
                          send
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              }
              {(devicsI == 0 || devicsI == 5) && Platform.OS == "android" && (
                <View style={styles.line} />
              )}
            </View>
          }
          {!page && (
            <View>
              <FlatList
                data={data}
                extraData={[data]}
                ListHeaderComponent={
                  <View
                    style={{
                      flexDirection: "row",
                      backgroundColor: "#fff",
                      marginBottom: 15,
                    }}
                  >
                    <Image
                      style={{
                        width: width * 0.22,
                        height: width * 0.22,
                        marginTop: 15,
                        marginLeft: 10,
                      }}
                      resizeMode={"contain"}
                      source={require("../../img/lo_hor.png")}
                    />
                    {
                      <View>
                        <View style={styles.view}>
                          <Text style={styles.nameevent}>{"Start Run"}</Text>
                        </View>

                        <View style={styles.viewtext}>
                          <View style={styles.viewsmall}>
                            <Text style={styles.text1}>ระยะทางทั้งหมด</Text>
                            <Text style={styles.text2}>
                              {}
                              {"ไม่จำกัด "}
                              กม.
                            </Text>
                          </View>
                          <View style={{ borderLeftWidth: 0.5 }} />
                          <View style={styles.viewsmall}>
                            <Text style={styles.text1}>ระยะทางที่ทำได้</Text>
                            <Text style={styles.text2}>
                              {parseInt(body?.user_accounts?.total_distance) /
                                1000}{" "}
                              กม.
                            </Text>
                          </View>
                          <View style={{ borderLeftWidth: 0.5 }} />
                          <View style={styles.viewsmall}>
                            <Text style={styles.text1}>ระดับความสำเร็จ</Text>
                            <Text style={[styles.text2, { fontSize: 14 }]}>
                              {"∞"}
                            </Text>
                          </View>
                        </View>
                        <View
                          style={{
                            height: 4,
                            width: width * 0.5,
                            backgroundColor: "#000",
                            marginTop: 5,
                          }}
                        >
                          <View
                            style={{
                              backgroundColor: "#F8CA36",
                              height: 4,
                              width:
                                width *
                                0.5 *
                                (
                                  parseInt(
                                    body?.user_accounts?.total_distance
                                  ) / 10000000
                                ).toFixed(2),
                            }}
                          />
                        </View>
                        <TouchableOpacity
                          onPress={async () => {
                            let strava_count = 0;
                            let strava_time = 0;

                            await Promise.all(
                              Strava?.map(async (el) => {
                                const res = await apiservice({
                                  path: "/user/poststava_idForeChack",
                                  method: "post",
                                  body: {
                                    event_id: 10000000001,
                                    stava_id: el?.id,
                                  },
                                  token: token?.accessToken,
                                });

                                console.log(
                                  "งงนะทำไมบัคเยอะ",
                                  {
                                    event_id: 10000000001,
                                    stava_id: el?.id,
                                  },
                                  res
                                );

                                if (res?.status == 200) {
                                  strava_count = strava_count + el?.distance;
                                  strava_time = strava_time + el?.moving_time;
                                }
                              })
                            );

                            let datamain = {
                              uid: body.id,
                              info: {
                                distance: strava_count,
                                callery: 12,
                                time: strava_time,
                              },
                              Distance: strava_count,
                              date: moment().format("YYYY-MM-DD"),
                            };

                            const response = await authHistrory({
                              body: datamain,
                              token,
                            });

                            const response1 = await actionEditprofile({
                              body: {
                                id: body.id,
                                total_distance:
                                  parseInt(body.user_accounts.total_distance) +
                                  strava_count,
                                wallet: {
                                  ...body.user_accounts?.wallet,
                                  cal:
                                    (body?.user_accounts?.wallet?.cal || 0) +
                                    12,
                                },
                              },
                              token,
                            });

                            if (response1.status == 200) {
                              Alert.alert("อัพเดทข้อมูลสำเร็จ");
                              getUser();
                            }
                          }}
                          style={styles.viewbottom}
                        >
                          <Text style={styles.texttail}>send</Text>
                        </TouchableOpacity>
                      </View>
                    }
                  </View>
                }
                renderItem={({ item, index }) => {
                  return (
                    item.total_distance > item.last_distance && (
                      <View
                        style={{
                          flexDirection: "row",
                          backgroundColor: "#fff",
                          marginBottom: 15,
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
                            </View>

                            <View style={styles.viewtext}>
                              <View style={styles.viewsmall}>
                                <Text style={styles.text1}>ระยะทางทั้งหมด</Text>
                                <Text style={styles.text2}>
                                  {(item.total_distance / 1000).toFixed(2)} กม.
                                </Text>
                              </View>
                              <View style={{ borderLeftWidth: 0.5 }} />
                              <View style={styles.viewsmall}>
                                <Text style={styles.text1}>
                                  ระยะทางที่ทำได้
                                </Text>
                                <Text style={styles.text2}>
                                  {(item.last_distance / 1000).toFixed(2)} กม.
                                </Text>
                              </View>
                              <View style={{ borderLeftWidth: 0.5 }} />
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
                            <View
                              style={{
                                height: 4,
                                width: width * 0.5,
                                backgroundColor: "#000",
                                marginTop: 5,
                              }}
                            >
                              <View
                                style={{
                                  backgroundColor: "#F8CA36",
                                  height: 4,
                                  width:
                                    width *
                                    0.5 *
                                    (
                                      ((item.last_distance / 1000).toFixed(2) *
                                        1) /
                                      (item.total_distance / 1000).toFixed(2)
                                    ).toFixed(2),
                                }}
                              />
                            </View>
                            <TouchableOpacity
                              onPress={async () => {
                                const res1 = await apiservice({
                                  path: "/user/distance_subtract",
                                  method: "post",
                                  body: {
                                    uid: body.id,
                                    distance: body?.distance,
                                  },
                                  token: token.accessToken,
                                });

                                let strava_count = 0;
                                let strava_time = 0;

                                await Promise.all(
                                  Strava.filter((e) => {
                                    return (
                                      moment(e?.start_date_local)?.valueOf() >
                                      moment(
                                        item?.event_Listt?.startDate
                                      )?.valueOf()
                                    );
                                  })?.map(async (el) => {
                                    if (strava_count < item?.total_distance) {
                                      const res = await apiservice({
                                        path: "/user/poststava_idForeChack ",
                                        method: "post",
                                        body: {
                                          event_id: item?.id,
                                          stava_id: el?.id,
                                        },
                                        token: token?.accessToken,
                                      });

                                      console.log(
                                        "งงนะทำไมบัคเยอะ",
                                        {
                                          event_id: 10000000001,
                                          stava_id: el?.id,
                                        },
                                        res
                                      );

                                      if (res?.status == 200) {
                                        strava_count =
                                          strava_count + el?.distance;
                                        strava_time =
                                          strava_time + el?.moving_time;
                                      }
                                    }
                                  })
                                );

                                const response = await apiservice({
                                  path: "/event/updateuserjoinEvent",
                                  method: "put",
                                  body: {
                                    id: item.id,
                                    distance:
                                      strava_count > item?.total_distance
                                        ? item?.total_distance
                                        : strava_count,
                                    running_Time: strava_time,
                                    cal: 0,
                                  },
                                  token: token.accessToken,
                                });

                                if (response.status == 200) {
                                  Alert.alert("อัพเดทข้อมูลสำเร็จ");

                                  setTimeout(() => {
                                    getUser();
                                  }, 1000);
                                }
                              }}
                              style={styles.viewbottom}
                            >
                              <Text style={styles.texttail}>send</Text>
                            </TouchableOpacity>
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
    borderRadius: 5,
    marginBottom: 15,
    alignSelf: "flex-end",
    marginRight: 15,
    marginTop: 15,
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
    fontSize: 7,
    color: "#000",
    alignSelf: "center",
  },
  text2: {
    fontFamily: "Prompt-Regular",
    fontSize: 11,
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

const testjson = [
  {
    achievement_count: 0,
    athlete: {
      id: 105227748,
      resource_state: 1,
    },
    athlete_count: 1,
    average_speed: 1.667,
    comment_count: 0,
    commute: false,
    display_hide_heartrate_option: false,
    distance: 100,
    elapsed_time: 60,
    end_latlng: [],
    external_id: null,
    flagged: false,
    from_accepted_tag: false,
    gear_id: null,
    has_heartrate: false,
    has_kudoed: false,
    heartrate_opt_out: false,
    id: 7871708575,
    kudos_count: 0,
    location_city: null,
    location_country: null,
    location_state: null,
    manual: true,
    map: {
      id: "a7871708575",
      resource_state: 2,
      summary_polyline: "",
    },
    max_speed: 0,
    moving_time: 60,
    name: "Night Run",
    photo_count: 0,
    pr_count: 0,
    private: false,
    resource_state: 2,
    sport_type: "Run",
    start_date: "2022-09-26T20:32:00Z",
    start_date_local: "2022-09-26T13:32:00Z",
    start_latlng: [],
    timezone: "(GMT-08:00) America/Los_Angeles",
    total_elevation_gain: 0,
    total_photo_count: 1,
    trainer: false,
    type: "Run",
    upload_id: null,
    utc_offset: -25200,
    visibility: "everyone",
    workout_type: 3,
  },
  {
    achievement_count: 0,
    athlete: {
      id: 105227748,
      resource_state: 1,
    },
    athlete_count: 1,
    average_cadence: 69.8,
    average_heartrate: 94.8,
    average_speed: 1.177,
    comment_count: 0,
    commute: false,
    display_hide_heartrate_option: true,
    distance: 93,
    elapsed_time: 79,
    end_latlng: [],
    external_id: "5074113691-1664224580-run.tcx",
    flagged: false,
    from_accepted_tag: false,
    gear_id: null,
    has_heartrate: true,
    has_kudoed: false,
    heartrate_opt_out: false,
    id: 7871721140,
    kudos_count: 0,
    location_city: null,
    location_country: null,
    location_state: null,
    manual: false,
    map: {
      id: "a7871721140",
      resource_state: 2,
      summary_polyline: "",
    },
    max_heartrate: 129,
    max_speed: 0,
    moving_time: 79,
    name: "Afternoon Run",
    photo_count: 0,
    pr_count: 0,
    private: false,
    resource_state: 2,
    sport_type: "Run",
    start_date: "2022-09-26T20:36:20Z",
    start_date_local: "2022-09-26T13:36:20Z",
    start_latlng: [],
    timezone: "(GMT-08:00) America/Los_Angeles",
    total_elevation_gain: 0,
    total_photo_count: 0,
    trainer: true,
    type: "Run",
    upload_id: 8412812123,
    upload_id_str: "8412812123",
    utc_offset: -25200,
    visibility: "everyone",
    workout_type: null,
  },
  {
    achievement_count: 0,
    athlete: {
      id: 105227748,
      resource_state: 1,
    },
    athlete_count: 1,
    average_speed: 0.103,
    comment_count: 0,
    commute: false,
    display_hide_heartrate_option: false,
    distance: 19.1,
    elapsed_time: 30864,
    elev_high: 10.4,
    elev_low: 10.4,
    end_latlng: [],
    external_id: "67747a4a-3597-4b0d-a137-5baff2889814-activity.fit",
    flagged: false,
    from_accepted_tag: false,
    gear_id: null,
    has_heartrate: false,
    has_kudoed: false,
    heartrate_opt_out: false,
    id: 7873020124,
    kudos_count: 0,
    location_city: null,
    location_country: null,
    location_state: null,
    manual: false,
    map: {
      id: "a7873020124",
      resource_state: 2,
      summary_polyline: "",
    },
    max_speed: 1.424,
    moving_time: 186,
    name: "Night Run",
    photo_count: 0,
    pr_count: 0,
    private: false,
    resource_state: 2,
    sport_type: "Run",
    start_date: "2022-09-26T20:28:58Z",
    start_date_local: "2022-09-27T03:28:58Z",
    start_latlng: [],
    timezone: "(GMT+07:00) Asia/Bangkok",
    total_elevation_gain: 0,
    total_photo_count: 0,
    trainer: false,
    type: "Run",
    upload_id: 8414257428,
    upload_id_str: "8414257428",
    utc_offset: 25200,
    visibility: "everyone",
    workout_type: 0,
  },
  {
    achievement_count: 0,
    athlete: {
      id: 105227748,
      resource_state: 1,
    },
    athlete_count: 1,
    average_speed: 3.351,
    comment_count: 0,
    commute: false,
    display_hide_heartrate_option: false,
    distance: 46.9,
    elapsed_time: 64,
    elev_high: 10.4,
    elev_low: 10.3,
    end_latlng: [],
    external_id: "db774a25-a334-4a94-9704-53f835437b8f-activity.fit",
    flagged: false,
    from_accepted_tag: false,
    gear_id: null,
    has_heartrate: false,
    has_kudoed: false,
    heartrate_opt_out: false,
    id: 7873053531,
    kudos_count: 0,
    location_city: null,
    location_country: null,
    location_state: null,
    manual: false,
    map: {
      id: "a7873053531",
      resource_state: 2,
      summary_polyline: "",
    },
    max_speed: 4.574,
    moving_time: 14,
    name: "Lunch Run",
    photo_count: 0,
    pr_count: 0,
    private: false,
    resource_state: 2,
    sport_type: "Run",
    start_date: "2022-09-27T05:18:20Z",
    start_date_local: "2022-09-27T12:18:20Z",
    start_latlng: [],
    timezone: "(GMT+07:00) Asia/Bangkok",
    total_elevation_gain: 0,
    total_photo_count: 0,
    trainer: false,
    type: "Run",
    upload_id: 8414295036,
    upload_id_str: "8414295036",
    utc_offset: 25200,
    visibility: "everyone",
    workout_type: 3,
  },
  {
    achievement_count: 0,
    athlete: {
      id: 105227748,
      resource_state: 1,
    },
    athlete_count: 1,
    average_speed: 4.087,
    comment_count: 0,
    commute: false,
    display_hide_heartrate_option: false,
    distance: 110.4,
    elapsed_time: 34,
    elev_high: 7.8,
    elev_low: 6,
    end_latlng: [],
    external_id: "d0e9d4df-2640-4ebc-b66d-07a5ca365a35-activity.fit",
    flagged: false,
    from_accepted_tag: false,
    gear_id: null,
    has_heartrate: false,
    has_kudoed: false,
    heartrate_opt_out: false,
    id: 7874910964,
    kudos_count: 0,
    location_city: null,
    location_country: null,
    location_state: null,
    manual: false,
    map: {
      id: "a7874910964",
      resource_state: 2,
      summary_polyline: "",
    },
    max_speed: 7.381,
    moving_time: 27,
    name: "Night Run",
    photo_count: 0,
    pr_count: 0,
    private: false,
    resource_state: 2,
    sport_type: "Run",
    start_date: "2022-09-27T14:12:51Z",
    start_date_local: "2022-09-27T21:12:51Z",
    start_latlng: [],
    timezone: "(GMT+07:00) Asia/Bangkok",
    total_elevation_gain: 0,
    total_photo_count: 0,
    trainer: false,
    type: "Run",
    upload_id: 8416366179,
    upload_id_str: "8416366179",
    utc_offset: 25200,
    visibility: "everyone",
    workout_type: 0,
  },
  {
    achievement_count: 0,
    athlete: {
      id: 105227748,
      resource_state: 1,
    },
    athlete_count: 1,
    average_speed: 6.347,
    comment_count: 0,
    commute: false,
    display_hide_heartrate_option: false,
    distance: 114.2,
    elapsed_time: 28,
    elev_high: 5.5,
    elev_low: 5.4,
    end_latlng: [],
    external_id: "482e129d-b776-4297-ad21-e0eaae0ed15a-activity.fit",
    flagged: false,
    from_accepted_tag: false,
    gear_id: null,
    has_heartrate: false,
    has_kudoed: false,
    heartrate_opt_out: false,
    id: 7881611829,
    kudos_count: 0,
    location_city: null,
    location_country: null,
    location_state: null,
    manual: false,
    map: {
      id: "a7881611829",
      resource_state: 2,
      summary_polyline: "",
    },
    max_speed: 11.964,
    moving_time: 18,
    name: "Night Run",
    photo_count: 0,
    pr_count: 0,
    private: false,
    resource_state: 2,
    sport_type: "Run",
    start_date: "2022-09-28T19:07:57Z",
    start_date_local: "2022-09-29T02:07:57Z",
    start_latlng: [],
    timezone: "(GMT+07:00) Asia/Bangkok",
    total_elevation_gain: 0,
    total_photo_count: 0,
    trainer: false,
    type: "Run",
    upload_id: 8423803158,
    upload_id_str: "8423803158",
    utc_offset: 25200,
    visibility: "everyone",
    workout_type: 0,
  },
];
