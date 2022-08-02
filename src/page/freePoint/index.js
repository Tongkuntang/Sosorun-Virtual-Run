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
  ActivityIndicator,
  BackHandler,
  Alert,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import HeaderFree from "../components/headerfree";
import { LinearGradient } from "expo-linear-gradient";
import {
  getAllfreepoint,
  getfreepointUser,
} from "../../action/actionfreepoint";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { Video, AVPlaybackStatus } from "expo-av";
import { useIsFocused } from "@react-navigation/core";
import { actionEditwal, getActionUser } from "../../action/actionauth";
import { apiservice } from "../../service/service";
import moment from "moment";
import CountDown from "react-native-countdown-component";
const { width, height } = Dimensions.get("window");

export default function index({ navigation }) {
  const [Visible, setVisible] = useState(false);
  const [running, setrunning] = useState(false);

  const [modal, setModal] = useState(false);
  const [shouldPlay, setShouldPlay] = useState(false);

  const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);
  const [state, setstate] = useState(null);
  // console.log("::::::::::", state);
  const focus = useIsFocused();
  const [banner, setbanner] = useState([]);
  async function allpoint() {
    const getpoint = await getAllfreepoint(token);
    console.log("getpoint", getpoint);
    setbanner(getpoint);
    setTimeout(() => {
      setrunning(true);
    }, 1000);
  }
  useEffect(() => {
    allpoint();
  }, [token]);
  const video = useRef(null);
  const videos = state != null && state.link_url;
  const golds = state != null && state.reward[0].coin;
  const ID = state != null && state.id;

  const [num, setnum] = useState(30);
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
    }, 5000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 6000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 7000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 8000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 9000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 10000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 11000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 12000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 13000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 14000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 15000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 16000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 17000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 18000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 19000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 20000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 21000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 22000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 23000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 24000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 25000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 26000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 27000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 28000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 29000);
    setTimeout(() => {
      setnum((connt) => connt - 1);
    }, 30000);
  }

  const a = moment(Date(Date.now())).add(6, "hours");

  async function getUser() {
    const response = await getActionUser(token);
    setUser(response.data);
  }

  useEffect(() => {
    getUser();
  }, [token, focus]);

  useEffect(() => {
    const backAction = () => {
      // return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    // return () => backHandler.remove();
  }, []);

  if (user == null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#fff" size={"large"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <HeaderFree navigation={navigation} />

        <Modal
          animationType="none"
          transparent={true}
          visible={Visible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setVisible(!Visible);
          }}
        >
          <View
            style={{ width: width, height: height, backgroundColor: "#393939" }}
          >
            <SafeAreaView />
            <View
              style={{
                paddingHorizontal: 20,
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  styles.textvd,
                  { zIndex: 99, marginTop: 20, alignItems: "flex-start" },
                ]}
              >
                {num} sec
              </Text>
              <Video
                ref={video}
                style={{
                  width: width * 0.9,
                  height: height * 0.7,
                  alignSelf: "center",
                }}
                source={{
                  uri: videos,
                }}
                onError={(e) => {
                  console.log(e);
                }}
                resizeMode="contain"
                onReadyForDisplay={(e) => {
                  setShouldPlay(e.status.isLoaded);
                }}
                shouldPlay={shouldPlay}
                volume={10}
              />
            </View>
          </View>
        </Modal>

        <Modal
          animationType="none"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setnum(0);
            setModal(!modal);
          }}
        >
          <View
            style={{
              width: width,
              height: height,
              backgroundColor: "#000000bb",
              justifyContent: "center",
            }}
          >
            <LinearGradient
              colors={["#FCC81D", "#EFD98F", "#EEE6CB", "#C29709"]}
              style={styles.backgroundmodal}
            >
              <Text style={styles.textmodal}>คุณได้รับ</Text>
              <Image
                // resizeMode={"stretch"}
                source={{
                  uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/pooop.png",
                }}
                style={styles.imgmodal}
              />
              <Text style={styles.textmodal1}>{golds} โกลด์</Text>
              <TouchableOpacity
                onPress={async () => {
                  const id = state != null && state.id;
                  const get1 = await getfreepointUser({ token, id: id });

                  const response = await actionEditwal({
                    body: { gold: golds },
                    token,
                  });

                  if (response.status == 200) {
                    const getuser = await getActionUser(token);

                    const getpoint = await getAllfreepoint(token);
                    const response = await apiservice({
                      path: "/freepoint/postuseraddfreepoint",
                      method: "post",
                      body: { freepoint_id: ID, date: a },
                      token: token.accessToken,
                    });
                  }
                  getUser();
                  allpoint();
                  setnum(30);
                  setModal(!modal);
                }}
                style={styles.touchmodal}
              >
                <Text style={styles.go}>ตกลง</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>

        <ScrollView style={{ marginBottom: 30 }}>
          <View
            style={{
              width: width,
              height: height,
              marginBottom: 30,
            }}
          >
            <View style={styles.view}>
              <View style={{ flexDirection: "row" }}>
                <FontAwesome5 name="running" size={24} color="#5BC3FF" />
                <Text style={styles.textbold}>
                  {user.user_accounts.wallet.cal != undefined
                    ? user.user_accounts.wallet.cal
                    : 0}
                </Text>
              </View>
              <View style={styles.view1}>
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
            <FlatList
              data={banner}
              extraData={[running]}
              renderItem={({ item, index }) => {
                let countss = parseInt(
                  parseInt(
                    moment(item.last_watching.date).add(6, "hours").valueOf() -
                      moment().utcOffset("+07:00").valueOf()
                  ) / 1000
                );

                return (
                  <View
                    style={[
                      styles.viewprice,
                      {
                        opacity:
                          item.last_watching.date !== undefined &&
                          moment(item.last_watching.date).add(6, "hours") >
                            moment()
                            ? 0.3
                            : 1,
                      },
                    ]}
                  >
                    <Image
                      resizeMode="stretch"
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" + item.url,
                      }}
                      style={styles.img}
                    />
                    <View>
                      <View style={styles.viewin}>
                        <View>
                          <Text style={styles.textname}>{item.name}</Text>
                          <Text style={styles.textproduct}>
                            {item.description}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.texttime}>time</Text>
                          <Text style={styles.textsec}>30 sec</Text>
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              style={[styles.texttime, { alignSelf: "center" }]}
                            >
                              {item.reward != null && item.reward[0].coin}
                            </Text>
                            <Image
                              source={{
                                uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
                              }}
                              style={[styles.imgpoint]}
                            />
                          </View>
                        </View>
                      </View>
                      {item.last_watching.date == undefined && (
                        <TouchableOpacity
                          onPress={() => {
                            setVisible(true);
                            // setTimeout(() => {
                            //   video.current.playAsync();
                            // }, 1000);

                            count();
                            setTimeout(() => {
                              setShouldPlay(false);
                              setVisible(false);
                              setModal(true);
                            }, 30100);

                            setstate(item);
                          }}
                          style={styles.touch}
                        >
                          <Text style={styles.textouch}>
                            Watch Ad for Get Free Point
                          </Text>
                        </TouchableOpacity>
                      )}
                      {moment(item.last_watching.date).add(6, "hours") <
                        moment() && (
                        <TouchableOpacity
                          onPress={() => {
                            setVisible(true);
                            // setTimeout(() => {
                            //   video.current.playAsync();
                            // }, 1000);

                            count();
                            setTimeout(() => {
                              setShouldPlay(false);
                              setVisible(false);
                              setModal(true);
                            }, 30100);

                            setstate(item);
                          }}
                          style={styles.touch}
                        >
                          <Text style={styles.textouch}>
                            Watch Ad for Get Free Point
                          </Text>
                        </TouchableOpacity>
                      )}
                      {item.last_watching.date !== undefined &&
                        moment(item.last_watching.date).add(6, "hours") >
                          moment() && (
                          <View style={{ alignSelf: "flex-end" }}>
                            {running && (
                              <CountDown
                                until={countss}
                                onFinish={allpoint}
                                size={20}
                                running={true}
                                digitStyle={{
                                  backgroundColor: "#FFF",
                                }}
                                digitTxtStyle={{
                                  right: 8,
                                  color: "#000",
                                  fontSize: 14,
                                  fontFamily: "Prompt-Regular",
                                }}
                                timeLabelStyle={{
                                  position: "absolute",
                                  color: "000",
                                  fontWeight: "bold",
                                  right: 7,
                                  fontSize: 14,
                                  fontFamily: "Prompt-Regular",
                                }}
                                separatorStyle={{ fontSize: 14, color: "#000" }}
                                timeToShow={["H", "M", "S"]}
                                timeLabels={{ h: "hr", m: "m", s: "s" }}
                                showSeparator
                              />
                            )}
                          </View>
                        )}
                    </View>
                  </View>
                );
              }}
            />
          </View>
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
  imgpoint: {
    width: 30,
    height: 30,
  },
  imgpoint1: {
    width: 25,
    height: 25,
  },
  textbold: {
    fontFamily: "Prompt-Regular",
    fontSize: 22,
    color: "#000",
    fontWeight: "bold",
    marginLeft: 10,
  },
  view: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 10,
  },
  view1: {
    flexDirection: "row",
    marginHorizontal: 20,
  },
  img: {
    width: 74,
    height: 95,
    alignSelf: "center",
  },
  viewprice: {
    width: width,
    backgroundColor: "#fff",
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 160,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: "#444",
  },
  viewin: {
    width: width * 0.65,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textname: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  textproduct: {
    fontFamily: "Prompt-Regular",
    fontSize: 10,
    color: "#000",
  },
  texttime: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    alignSelf: "flex-end",
  },
  textsec: {
    fontFamily: "Prompt-Regular",
    fontSize: 12,
    color: "#000",
    alignSelf: "flex-end",
  },
  touch: {
    width: 173,
    height: 33,
    backgroundColor: "#393939",
    borderRadius: 3,
    justifyContent: "center",
    alignSelf: "flex-end",
    marginTop: 10,
  },
  textouch: {
    fontFamily: "Prompt-Regular",
    fontSize: 11,
    color: "#fff",
    fontWeight: "500",
    alignSelf: "center",
  },
  texthr: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
    alignSelf: "flex-end",
    marginTop: 10,
  },
  textvd: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#fff",
    fontWeight: "700",
  },
  backgroundmodal: {
    width: width * 0.9,
    alignSelf: "center",
    padding: 20,
    justifyContent: "space-between",
    borderRadius: 10,
  },
  imgmodal: {
    width: 222,
    height: 222,
    alignSelf: "center",
    marginVertical: 10,
  },
  touchmodal: {
    width: width * 0.6,
    height: 48,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: "#393939",
    borderRadius: 5,
  },
  go: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#fff",
    alignSelf: "center",
  },
  textmodal: {
    fontFamily: "Prompt-Regular",
    fontSize: 48,
    color: "#000",
    alignSelf: "center",
    fontWeight: "800",
  },
  textmodal1: {
    fontFamily: "Prompt-Regular",
    fontSize: 32,
    color: "#000",
    alignSelf: "center",
    fontWeight: "800",
  },
});
