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
  Switch,
  Share,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import Header from "../components/header";
import {
  SimpleLineIcons,
  FontAwesome5,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as ImageManipulator from "expo-image-manipulator";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";
import { useRecoilState } from "recoil";
import { LvState, tokenState } from "../../reducer/reducer/reducer/Atom";
import { getActionUser } from "../../action/actionauth";
import { apiservice } from "../../service/service";
import { autolize_Lv, nextautolize_Lv } from "../../json/utils";
const { width, height } = Dimensions.get("window");
export default function index({ navigation }) {
  const viewShot = useRef();
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const [State, setState] = useState(false);
  const toggleSwitch1 = () => setState((previousState) => !previousState);
  const [Visible, setVisible] = useState(false);
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

  const focus = useIsFocused();
  const [token, setToken] = useRecoilState(tokenState);
  const [lvstate, setlvstate] = useRecoilState(LvState);
  const [user, setuser] = useState(null);
  console.log(">>>>>", user);
  const [ssc, setssc] = useState(false);
  async function getUser() {
    const getuser = await getActionUser(token);
    // user.user_accounts.total_distance;
    setuser((val) => ({
      ...getuser.data,
      user_accounts: {
        ...getuser.data.user_accounts,
        total_distance:
          getuser.data.user_accounts.total_distance != null
            ? getuser.data.user_accounts.total_distance
            : 0,
      },
    }));
  }

  useEffect(() => {
    if (ssc) {
      onShare();
    }
  }, [ssc]);
  useEffect(() => {
    getUser();
    // getresultsrunning()
  }, [token, focus]);

  console.log(user?.role);

  if (user == null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  return (
    <View style={styles.contalner}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
          height: height * 0.9,
          backgroundColor: "#f6f6f6",
        }}
      >
        <Header onPress={() => navigation.goBack()} navigation={navigation} />
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
            <View style={{ marginTop: height * 0.1 }}>
              <LinearGradient
                colors={["#8B4714", "#C28D66", "#D4A683", "#8B4714"]}
                style={[styles.backgroundmodal]}
              >
                <View style={styles.viewimgphoflie1}>
                  {user.image_Profile == null ? (
                    <Image
                      style={[
                        styles.imgphoflie1,
                        { marginLeft: -10, height: 55, width: 55 },
                      ]}
                      source={{
                        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/userprofice.png",
                      }}
                    />
                  ) : (
                    <Image
                      style={[
                        styles.imgphoflie1,
                        { marginLeft: -10, height: 55, width: 55 },
                      ]}
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" +
                          user.image_Profile,
                      }}
                    />
                  )}

                  <View
                    style={{
                      marginLeft: 20,
                      justifyContent: "flex-start",
                      height: 55,
                    }}
                  >
                    {user.name == null ? (
                      <Text style={styles.textname}>{user.username}</Text>
                    ) : (
                      <Text style={styles.textname}>{user.name}</Text>
                    )}
                  </View>
                </View>
                <Image
                  resizeMode={"contain"}
                  source={{
                    uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/logo_sosorun_update_black.png",
                  }}
                  style={styles.imglogo}
                />

                {user?.role != "VIP" ? (
                  <Image
                    resizeMode="stretch"
                    source={
                      autolize_Lv(parseInt(user.user_accounts.total_distance))
                        .lv > 60
                        ? lvstate.length == 0
                          ? {
                              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/D/50.png",
                            }
                          : lvstate[0].status == true
                          ? autolize_Lv(
                              parseInt(user.user_accounts.total_distance)
                            ).grid
                          : {
                              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/D/50.png",
                            }
                        : autolize_Lv(
                            parseInt(user.user_accounts.total_distance)
                          ).grid
                    }
                    style={styles.imgrank1}
                  />
                ) : (
                  <Image
                    resizeMode="stretch"
                    source={require("../../img/vip.png")}
                    style={styles.imgrank1}
                  />
                )}
                <Text style={[styles.textname, { alignSelf: "center" }]}>
                  {autolize_Lv(parseInt(user.user_accounts.total_distance)).lv >
                  60
                    ? lvstate.length == 0
                      ? "D"
                      : lvstate[0].status == true
                      ? autolize_Lv(parseInt(user.user_accounts.total_distance))
                          .rank
                      : "D"
                    : "D"}{" "}
                  CLASS
                </Text>

                {
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 15,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setssc(true);
                        setTimeout(() => {
                          setssc(false);
                        }, 1000);
                      }}
                      style={styles.touchh}
                    >
                      <Text style={styles.texttouch}>SHARE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setVisible(!Visible)}
                      style={styles.touchh}
                    >
                      <Text style={styles.texttouch}>OK</Text>
                    </TouchableOpacity>
                  </View>
                }
              </LinearGradient>
            </View>
            <ViewShot
              style={{ marginTop: height }}
              ref={viewShot}
              options={{ format: "png", quality: 0.9 }}
            >
              <LinearGradient
                colors={["#8B4714", "#C28D66", "#D4A683", "#8B4714"]}
                style={[
                  styles.backgroundmodal,
                  {
                    paddingBottom: ssc == false ? 0 : 160,
                    width: ssc == false ? width * 0.9 : width,
                    height: width * 1.4,
                  },
                ]}
              >
                <View style={styles.viewimgphoflie1}>
                  {user.image_Profile == null ? (
                    <Image
                      style={[
                        styles.imgphoflie1,
                        {
                          marginLeft: -10,
                          height: 65,
                          width: 65,
                        },
                      ]}
                      source={{
                        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/userprofice.png",
                      }}
                    />
                  ) : (
                    <Image
                      style={[
                        styles.imgphoflie1,
                        {
                          marginLeft: -10,
                          height: 65,
                          width: 65,
                        },
                      ]}
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" +
                          user.image_Profile,
                      }}
                    />
                  )}
                  <View
                    style={{
                      marginLeft: 20,
                      justifyContent: "flex-start",
                      height: 55,
                    }}
                  >
                    {user.name == null ? (
                      <Text style={styles.textname}>{user.username}</Text>
                    ) : (
                      <Text style={styles.textname}>{user.name}</Text>
                    )}
                  </View>
                </View>
                <Image
                  resizeMode={"contain"}
                  source={{
                    uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/logo_sosorun_update_black.png",
                  }}
                  style={[styles.imglogo]}
                />

                {user.role != "VIP" ? (
                  <Image
                    resizeMode="contain"
                    source={
                      autolize_Lv(parseInt(user.user_accounts.total_distance))
                        .lv > 60
                        ? lvstate.length == 0
                          ? {
                              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/D/50.png",
                            }
                          : lvstate[0].status == true
                          ? autolize_Lv(
                              parseInt(user.user_accounts.total_distance)
                            ).grid
                          : {
                              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/D/50.png",
                            }
                        : autolize_Lv(
                            parseInt(user.user_accounts.total_distance)
                          ).grid
                    }
                    style={[
                      styles.imgrank1,
                      {
                        width: 173 + width * 0.1,
                        height: 200,
                      },
                    ]}
                  />
                ) : (
                  <Image
                    resizeMode="contain"
                    source={require("../../img/vip.png")}
                    style={[
                      styles.imgrank1,
                      {
                        width: 173 + width * 0.1,
                        height: 200,
                      },
                    ]}
                  />
                )}
                {ssc == false ? (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginVertical: 15,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        setssc(true);
                        setTimeout(() => {
                          setssc(false);
                        }, 1000);
                      }}
                      style={styles.touchh}
                    >
                      <Text style={styles.texttouch}>SHARE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setVisible(!Visible)}
                      style={styles.touchh}
                    >
                      <Text style={styles.texttouch}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <Text style={[styles.textname, { alignSelf: "center" }]}>
                    {autolize_Lv(parseInt(user.user_accounts.total_distance))
                      .lv > 60
                      ? lvstate.length == 0
                        ? "D"
                        : lvstate[0].status == true
                        ? autolize_Lv(
                            parseInt(user.user_accounts.total_distance)
                          ).rank
                        : "D"
                      : "D"}{" "}
                    CLASS
                  </Text>
                )}
              </LinearGradient>
            </ViewShot>
          </View>
        </Modal>
        <View style={styles.viewphoflie}>
          <View style={styles.viewimgphoflie}>
            {user.image_Profile == null ? (
              <Image
                style={styles.imgphoflie1}
                source={{
                  uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/userprofice.png",
                }}
              />
            ) : (
              <Image
                style={styles.imgphoflie1}
                source={{
                  uri:
                    "https://api.sosorun.com/api/imaged/get/" +
                    user.image_Profile,
                }}
              />
            )}
            {/* {console.log("img", user != undefined && user)} */}
            <View style={styles.viewname}>
              <View>
                {/* Saroj Sikarin */}
                {user.name == null ? (
                  <Text style={styles.textname}>{user.username}</Text>
                ) : (
                  <Text style={styles.textname}>{user.name}</Text>
                )}

                <Text style={[styles.textemail, { color: "#000" }]}>
                  {user.email}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setVisible(true)}>
                {user.role != "VIP" ? (
                  <Image
                    style={styles.imgrank}
                    source={
                      autolize_Lv(parseInt(user.user_accounts.total_distance))
                        .lv > 60
                        ? lvstate.length == 0
                          ? {
                              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/D/50.png",
                            }
                          : lvstate[0].status == true
                          ? autolize_Lv(
                              parseInt(user.user_accounts.total_distance)
                            ).grid
                          : {
                              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/D/50.png",
                            }
                        : autolize_Lv(
                            parseInt(user.user_accounts.total_distance)
                          ).grid
                    }
                  />
                ) : (
                  <Image
                    resizeMode="contain"
                    style={styles.imgrank}
                    source={require("../../img/vip.png")}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.view}>
            <View style={styles.back} />
            <TouchableOpacity
              onPress={() => navigation.navigate("Editproflie")}
              style={styles.touchedit}
            >
              <Text style={styles.textedit}>EDIT PROFILE</Text>
            </TouchableOpacity>

            <View
              style={{
                height: height,
                paddingTop: 5,
                width: width * 0.4,
                // marginRight: 15,
              }}
            >
              <Text style={[styles.textemail, { color: "#fff" }]}>
                Rank :{" "}
                {autolize_Lv(parseInt(user.user_accounts.total_distance)).lv >
                60
                  ? lvstate.length == 0
                    ? "D"
                    : lvstate[0].status == true
                    ? autolize_Lv(parseInt(user.user_accounts.total_distance))
                        .rank
                    : "D"
                  : "D"}{" "}
                Class
              </Text>
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
              <Text style={[styles.textemail, { color: "#fff" }]}>
                {parseInt(user.user_accounts.total_distance)}/
                {
                  nextautolize_Lv(parseInt(user.user_accounts.total_distance))
                    .exp
                }
              </Text>
              <Text style={[styles.textlv, { marginLeft: -30, marginTop: 5 }]}>
                ID Code :{""} {user.id + 100000}
              </Text>
            </View>
            <View
              style={{ height: height, paddingVertical: 20, marginRight: 15 }}
            >
              <Text />
              <Text style={styles.textlv}>Lv</Text>

              <Text style={styles.textnum}>
                {autolize_Lv(parseInt(user.user_accounts.total_distance)).lv >
                60
                  ? lvstate.length == 0
                    ? 60
                    : lvstate[0].status == true
                    ? autolize_Lv(parseInt(user.user_accounts.total_distance))
                        .lv
                    : 60
                  : autolize_Lv(parseInt(user.user_accounts.total_distance)).lv}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginTop: 15,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <FontAwesome5 name="running" size={34} color="#5BC3FF" />
            <Text style={styles.textbold}>
              {user.user_accounts.wallet.cal != undefined
                ? user.user_accounts.wallet.cal
                : 0}
            </Text>
          </View>
          <View style={{ flexDirection: "row", marginHorizontal: 20 }}>
            <Image
              source={{
                uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
              }}
              style={styles.imgpoint}
            />
            <Text style={styles.textbold}>
              {user.user_accounts.wallet.gold != undefined
                ? user.user_accounts.wallet.gold
                : 0}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Device")}
          style={[styles.viewrow]}
        >
          <MaterialIcons name="devices" size={24} color="black" />
          <View style={styles.viewrowsmall}>
            <Text style={styles.textname}>Add Device</Text>
            <TouchableOpacity disabled>
              <FontAwesome name="plus" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
        <View style={styles.line} />
        <View style={styles.viewrow}>
          <SimpleLineIcons name="envelope-letter" size={24} color="black" />
          <View style={styles.viewrowsmall}>
            <Text style={styles.textname}>Invite Friends</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#FCC71A50" }}
              thumbColor={isEnabled ? "#FCC71A" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.viewrow}>
          <MaterialIcons name="notifications" size={24} color="black" />
          <View style={styles.viewrowsmall}>
            <Text style={styles.textname}>Notification Settings</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#FCC71A50" }}
              thumbColor={State ? "#FCC71A" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch1}
              value={State}
            />
          </View>
        </View>
        <View style={styles.line} />
        <View style={styles.viewrow}>
          <MaterialIcons name="language" size={24} color="black" />
          <View style={styles.viewrowsmall}>
            <Text style={styles.textname}>Language</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.textname}>EN</Text>
              <TouchableOpacity>
                <MaterialCommunityIcons
                  name="arrow-right-drop-circle-outline"
                  size={24}
                  color="black"
                  style={{ marginLeft: 5, marginTop: 2 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.line} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  contalner: {
    flex: 1,
  },
  viewphoflie: {
    width: width,
    height: height * 0.22,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  viewimgphoflie: {
    width: width * 0.9,
    height: height * 0.15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    marginBottom: -40,
    zIndex: 99,
  },
  viewimgphoflie1: {
    flexDirection: "row",
    marginTop: 10,
  },
  imgphoflie: {
    width: 82,
    height: 82,
    marginLeft: 10,
  },
  imgphoflie1: {
    width: 80,
    height: 80,
    alignSelf: "center",
    borderRadius: 40,
    marginLeft: 10,
  },
  viewname: {
    width: width * 0.6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
  },
  textname: {
    fontFamily: "Prompt-Medium",
    fontSize: 20,
    color: "#000",
  },
  textemail: {
    fontFamily: "Prompt-Regular",
    fontSize: 13,
  },
  imgrank: {
    width: 74,
    height: 82,
    alignSelf: "center",
  },
  view: {
    width: width * 0.9,
    height: height * 0.12,
    flexDirection: "row",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  back: {
    width: width * 0.9,
    height: height * 0.12,
    alignSelf: "center",
    position: "absolute",
    backgroundColor: "#393939",
    borderBottomRightRadius: 20,
    marginTop: 10,
  },
  touchedit: {
    width: 75,
    height: 19,
    justifyContent: "center",
    alignSelf: "flex-end",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
  },
  textedit: {
    fontFamily: "Prompt-Regular",
    fontSize: 9,
    color: "#000",
    alignSelf: "center",
  },
  textlv: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#FCC81D",
    alignSelf: "center",
  },
  textnum: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    color: "#fff",
    alignSelf: "center",
  },
  linelevel: {
    width: width * 0.4,
    height: 5,
    backgroundColor: "#000000",
    marginTop: 5,
    marginHorizontal: 10,
    alignSelf: "center",
  },
  linelevelrank: {
    width: width * 0.12,
    height: 4.5,
    backgroundColor: "#F8CA36",
    alignSelf: "flex-start",
  },
  imgpoint: {
    width: 42,
    height: 42,
    marginTop: -5,
  },
  textbold: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
    marginLeft: 20,
  },
  viewrow: {
    width: width * 0.9,
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 20,
    alignSelf: "center",
  },
  viewrowsmall: {
    width: width * 0.75,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  line: {
    width: width * 0.75,
    alignSelf: "flex-end",
    marginRight: width * 0.1,
    borderBottomWidth: 1,
    marginTop: 10,
    borderBottomColor: "#44444450",
  },
  backgroundmodal: {
    width: width * 0.9,
    alignSelf: "center",
    // backgroundColor: "red",
    // marginTop: height * 0.1,
    paddingHorizontal: 20,
  },
  imglogo: {
    width: 140,
    height: 30,
    alignSelf: "center",
    marginTop: 25,
    marginBottom: 15,
  },
  imgrank1: {
    width: 173,
    height: 187,
    alignSelf: "center",
    marginVertical: 15,
  },
  textrank: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
    alignSelf: "center",
    marginVertical: 15,
  },
  touchh: {
    width: 129,
    height: 54,
    backgroundColor: "#393939",
    borderRadius: 5,
    justifyContent: "center",
  },
  texttouch: {
    fontFamily: "Prompt-Regular",
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
  },
});
