import React, { useState, useRef, useEffect } from "react";
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
  NativeModules,
  LayoutAnimation,
  Alert,
  AsyncStorage,
} from "react-native";
import Start from "./startRun";
import HeaderHome from "../components/headerHome";
import EvEnt from "./event";
import Challangse from "./challanees";
import BottomBar from "./bottombar";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  lans,
  LvState,
  tokenState,
  userState,
} from "../../reducer/reducer/reducer/Atom";
import {
  actionEditprofile,
  actionEditwal,
  getActionUser,
} from "../../action/actionauth";
import moment from "moment";
import { apiservice } from "../../service/service";
import { getAllbanner, getBanNer } from "../../action/actionbanner";
const { width, height } = Dimensions.get("window");
import Carousel from "react-native-snap-carousel";
import { FontAwesome5 } from "@expo/vector-icons";
const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export default function index({ navigation }) {
  const [page, setpage] = useState(0);
  const [daily, setDaily] = useState([]);
  const [Visible, setVisible] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [token, setToken] = useRecoilState(tokenState);
  const [lvstate, setlvstate] = useRecoilState(LvState);
  const lan = useRecoilValue(lans);
  const carouselRef = useRef();
  const carouselRef1 = useRef();
  const [banner1, setbanner1] = useState([]);
  const [Iindex, setIindex] = useState(null);

  const [state, setState] = useState({
    w: width * 0.2,
    h: height * 0.1,
  });

  async function allbanner() {
    const getbanner1 = await getBanNer({ token, page: "pagedaily" });

    setbanner1(getbanner1.data[0].img_list);
  }

  async function uplevel() {
    const response = await apiservice({
      path: "/event/getchackrank",
      method: "get",
      token: token.accessToken,
    });
    if (response.status == 200) {
      setlvstate(response.data.data);
    }
  }

  async function refresh() {
    const response = await apiservice({
      path: "/authen/refreshtoken",
      method: "post",
      body: {
        refreshToken: token.refreshToken,
      },
    });
    if (response.status == 200) {
      setToken({ ...token, accessToken: response.data });
    }
  }

  useEffect(() => {
    allbanner();
    updateApi();
    uplevel();
  }, [token]);

  const updateApi = async () => {
    const users = await getActionUser(token);

    if (users == "data not found") {
      setToken("");
    }

    if (users.data == null) {
      setToken("");
    }

    const notitoken = await AsyncStorage.getItem("notitoken");

    if (notitoken) {
      const to = await apiservice({
        path: "/notification/postnotifications",
        method: "post",
        body: {
          uid: users.data.id,
          user_id: users.data.id,
          tokenId: notitoken,
          chack_status: true,
        },
        token: token.accessToken,
      });
    }

    setUser(users.data);

    const lastdate =
      users.data.user_accounts.DAILYBONUS.lastdate ?? moment().diff(1, "days");

    if (
      moment(lastdate).format("DD-MM-YYYY") != moment().format("DD-MM-YYYY")
    ) {
      const response = await actionEditprofile({
        body: {
          id: users.data.user_accounts.id,
          DAILYBONUS: {
            ...users.data.user_accounts.DAILYBONUS,
            lastdate: new Date(),
            dailyBonus:
              users.data.user_accounts.DAILYBONUS.dailyBonus != undefined
                ? users.data.user_accounts.DAILYBONUS.dailyBonus
                : [],
            dailycount:
              users.data.user_accounts.DAILYBONUS.dailycount != undefined
                ? users.data.user_accounts.DAILYBONUS.dailycount ==
                  users.data.user_accounts.DAILYBONUS.dailyBonus.length
                  ? users.data.user_accounts.DAILYBONUS.dailycount + 1
                  : users.data.user_accounts.DAILYBONUS.dailycount
                : 1,
          },
        },
        token,
      });

      if (response.status == 200) {
        setTimeout(async () => {
          const resp = await getActionUser(token);
          // console.log("getActionUser", resp);
          setUser(resp.data);
        }, 1000);
      }
    } else {
    }
    setDaily([]);
    let dataMockDaily = ["", "", "", ""];
    await Promise.all(
      dataMockDaily.map(async (item, index) => {
        const getAll = await apiservice({
          path:
            "/freepoint/getdaily/" +
            (index + 1) +
            "?month=" +
            moment().format("M") +
            "&year=" +
            moment().format("YYYY"),
          method: "get",
          token: token.accessToken,
        });

        if (getAll.status == 200) {
          setDaily((val) => val.concat(getAll?.data?.data?.reward || []));
        }
      })
    );

    setVisible(!(token?.role == "VIP"));
  };

  const data = [0, 1, 2, 3, 4, 5, 6];
  const data2 = [7, 8, 9, 10, 11, 12, 13];
  const data3 = [14, 15, 16, 17, 18, 19, 20];
  const data4 = [21, 22, 23, 24, 25, 26, 27];
  const [mock, setMock] = useState(data);

  useEffect(() => {
    if (user != null) {
      if (user?.user_accounts?.DAILYBONUS?.dailycount > 21) {
        setMock(data4);
      } else if (user?.user_accounts?.DAILYBONUS?.dailycount > 14) {
        setMock(data3);
      } else if (user?.user_accounts?.DAILYBONUS?.dailycount > 7) {
        setMock(data2);
      } else {
        setMock(data);
      }
    }
  }, [user]);

  if (user == null || user == undefined) {
    return <View />;
  }

  if (user.user_accounts == undefined) {
    return <View />;
  }

  if (user.user_accounts.DAILYBONUS.dailyBonus == undefined) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
          height: height,
          backgroundColor: "#FEB50E",
        }}
      >
        <View style={{ position: "absolute", zIndex: 99 }}>
          <HeaderHome navigation={navigation} />
        </View>
        <Modal
          animationType="none"
          transparent={true}
          visible={Visible}
          onRequestClose={() => {
            setVisible(!Visible);
          }}
        >
          <View activeOpacity={1} style={styles.containermodal}>
            <View style={styles.backgroundmodai}>
              <View style={styles.viewdaily}>
                <Text style={styles.textdaily}>
                  {lan == "en" ? "DAILY BONUS" : "โบนัสรายวัน"}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setVisible(false);
                  }}
                  style={{ position: "absolute", top: 10, right: 10 }}
                >
                  <Image
                    style={{ tintColor: "#2A2C2B", width: 16, height: 16 }}
                    source={require("../../img/cancel.png")}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.viewreward}>
                <Text style={[styles.textreward, { alignSelf: "center" }]}>
                  {lan == "en"
                    ? "Login every day and earn to reward"
                    : "เข้าสู่ระบบทุกวันเพื่อรับของรางวัล"}
                </Text>
                <Text style={[styles.textreward, { alignSelf: "center" }]}>
                  {lan == "en" ? "Week" : "สัปดาห์ที่"}{" "}
                  {user.user_accounts.DAILYBONUS.dailycount > 7
                    ? user.user_accounts.DAILYBONUS.dailycount > 14
                      ? user.user_accounts.DAILYBONUS.dailycount > 21
                        ? 4
                        : 3
                      : 2
                    : 1}
                </Text>
                <FlatList
                  data={daily.filter((item, index) => {
                    return (
                      mock.filter((itemsss, i) => {
                        return itemsss == index;
                      }).length > 0
                    );
                  })}
                  style={{ alignSelf: "center" }}
                  contentContainerStyle={{
                    justifyContent: "center",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: width * 0.9,
                  }}
                  horizontal
                  scrollEnabled={false}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        disabled={
                          !(
                            user.user_accounts.DAILYBONUS.dailycount >
                            mock[index]
                          ) ||
                          (user.user_accounts.DAILYBONUS.dailyBonus !=
                            undefined &&
                            user.user_accounts.DAILYBONUS.dailyBonus.filter(
                              (items) => {
                                return items.day == mock[index];
                              }
                            ).length > 0)
                        }
                        onPress={async () => {
                          setIindex(mock[index]);
                          LayoutAnimation.spring();
                          setState({ w: state.w + 15, h: state.h + 15 });
                          let dailyBonus = [];
                          if (
                            user.user_accounts.DAILYBONUS.dailyBonus !=
                            undefined
                          ) {
                            dailyBonus =
                              user.user_accounts.DAILYBONUS.dailyBonus;
                          }
                          const response = await actionEditprofile({
                            body: {
                              id: user.user_accounts.id,
                              DAILYBONUS: {
                                ...user.user_accounts.DAILYBONUS,
                                gold:
                                  user.user_accounts.DAILYBONUS.gold +
                                  item.coin,
                                dailyBonus: dailyBonus.concat({
                                  ...item,
                                  day: mock[index],
                                }),
                              },
                            },
                            token,
                          });
                          if (response.status == 200) {
                            const resp = await getActionUser(token);
                            const response1 = await actionEditwal({
                              body: {
                                gold: item.coin,
                              },
                              token,
                            });
                            const respt = await getActionUser(token);
                            setUser(respt.data);
                            setTimeout(() => {
                              setVisible(!Visible);
                            }, 1000);
                          }
                        }}
                        style={[
                          mock[index] == 6 ? styles.touchday : styles.touchflat,
                          {
                            opacity:
                              user.user_accounts.DAILYBONUS.dailycount >
                              mock[index]
                                ? user.user_accounts.DAILYBONUS.dailyBonus.filter(
                                    (items) => items.day == mock[index]
                                  ).length > 0
                                  ? 1
                                  : 1
                                : 0.3,
                          },
                          {
                            width:
                              mock[index] == Iindex
                                ? state.w
                                : index == 6
                                ? width * 0.75
                                : width * 0.2,
                            height:
                              mock[index] == Iindex ? state.h : height * 0.1,
                            marginHorizontal: mock[index] == Iindex ? 7.5 : 15,
                          },
                        ]}
                      >
                        <Text style={styles.textday}>
                          {lan == "en"
                            ? mock[index] + 1 + "days"
                            : "วันที่ " + (mock[index] + 1)}
                        </Text>
                        <Image
                          source={{
                            uri:
                              "https://api.sosorun.com/api/imaged/get/" +
                              item.iamge,
                          }}
                          style={styles.img}
                        />
                        <Text style={styles.textprice}>{item.coin}</Text>
                        {user.user_accounts.DAILYBONUS.dailyBonus.filter(
                          (items) => items.day == mock[index]
                        ).length > 0 && (
                          <FontAwesome5
                            name="check-circle"
                            size={50}
                            color="#FF0000"
                            style={{
                              position: "absolute",
                              alignSelf: "center",
                            }}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
                {/* <TouchableOpacity style={styles.touchday}>
                  <Text style={styles.textday}>7 day</Text>
                  <Image
                     source={{
                        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
                      }}
                    style={styles.img}
                  />
                  <Text style={styles.textprice}>150</Text>
                </TouchableOpacity> */}
              </View>
              <View style={[styles.imgsup, { backgroundColor: "#ccc" }]}>
                <Carousel
                  ref={carouselRef}
                  data={banner1}
                  sliderWidth={Dimensions.get("window").width * 0.9}
                  itemWidth={Math.round(width * 0.9)}
                  autoplay
                  loop
                  inactiveSlideScale={1}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={styles.imgsup}>
                        <Image
                          style={styles.imgsup}
                          source={{
                            uri:
                              "https://api.sosorun.com/api/imaged/get/" + item,
                          }}
                        />
                      </View>
                    );
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>

        {/* <Carousel
            layout={"default"}
            ref={(ref) => (carousel = ref)}
            data={state}
            sliderWidth={300}
            itemWidth={300}
            renderItem={_renderItem}
            autoplay={3000}
            loop
          // /> */}
        <View style={{ width: width, height: height }}>
          <Carousel
            ref={carouselRef1}
            data={["", "", ""]}
            sliderWidth={width}
            itemWidth={width}
            firstItem={page}
            inactiveSlideScale={1}
            autoplay
            autoplayInterval={5000}
            onSnapToItem={(e) => {
              setpage(e);
              if (e == 2) {
                setTimeout(() => {
                  carouselRef1.current.snapToItem(0);
                }, 5000);
              }
            }}
            renderItem={({ item, index }) => {
              return (
                <View style={{ width: width, height: height }}>
                  {index == 0 && <Start navigation={navigation} />}
                  {index == 1 && <EvEnt navigation={navigation} />}
                  {index == 2 && <Challangse navigation={navigation} />}
                </View>
              );
            }}
          />

          <View
            style={[
              styles.viewtouch,
              { position: "absolute", right: 10, top: 90 },
            ]}
          >
            <TouchableOpacity
              onPress={() => carouselRef1.current.snapToItem(0)}
              style={[
                styles.touch,
                { backgroundColor: page == 0 ? "#FCC81D" : "#fff" },
              ]}
            ></TouchableOpacity>
            <TouchableOpacity
              onPress={() => carouselRef1.current.snapToItem(1)}
              style={[
                styles.touch,
                { backgroundColor: page == 1 ? "#FCC81D" : "#fff" },
              ]}
            ></TouchableOpacity>
            <TouchableOpacity
              onPress={() => carouselRef1.current.snapToItem(2)}
              style={[
                styles.touch,
                { backgroundColor: page == 2 ? "#FCC81D" : "#fff" },
              ]}
            ></TouchableOpacity>
          </View>
        </View>
      </View>
      <BottomBar navigation={navigation} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  viewtouch: {
    height: height * 0.4,
    justifyContent: "space-between",
    paddingBottom: 80,
    paddingRight: 20,
    marginBottom: height * 0.1,
  },
  touch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    zIndex: 99,
    borderWidth: 5,
    borderColor: "#EEEEEE",
    alignSelf: "flex-end",
  },
  containermodal: {
    flex: 1,
    backgroundColor: "#000000bb",
    alignItems: "center",
    justifyContent: "center",
  },
  backgroundmodai: {
    backgroundColor: "#fff",
    width: width * 0.9,
    alignSelf: "center",
    justifyContent: "center",
    // marginTop: 30,
  },
  viewdaily: {
    height: height * 0.1,
    justifyContent: "center",
  },
  textdaily: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#FCC81D",
    fontWeight: "bold",
    alignSelf: "center",
  },
  viewreward: {
    width: width * 0.9,
    justifyContent: "center",
    backgroundColor: "#000000bb",
    alignSelf: "center",
  },
  textreward: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#fff",
    // marginLeft: 20,
    marginTop: 10,
  },
  touchflat: {
    width: width * 0.2,
    height: height * 0.1,
    borderRadius: 8,
    backgroundColor: "#FCC81D",
    justifyContent: "center",
    marginHorizontal: 17,
    marginTop: 17,
  },
  textday: {
    fontFamily: "Prompt-Regular",
    fontSize: 13,
    color: "#000",
    marginLeft: 5,
  },
  img: {
    width: 37,
    height: 37,
    alignSelf: "center",
  },
  textprice: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
    alignSelf: "center",
  },
  touchday: {
    width: width * 0.77,
    height: height * 0.1,
    borderRadius: 8,
    backgroundColor: "#FCC81D",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 17,
  },
  viewsup: {
    height: height * 0.2,
    justifyContent: "center",
  },
  imgsup: {
    width: width * 0.9,
    height: height * 0.2,
  },
  backgroundmodall: {
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
  input: {
    width: width * 0.8,
    height: 50,
    fontFamily: "Prompt-Regular",
    color: "#393939",
    paddingLeft: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});
