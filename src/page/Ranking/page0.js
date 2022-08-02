import React, { useState, useEffect } from "react";
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
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { apiservice } from "../../service/service";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { useIsFocused } from "@react-navigation/core";
import { actionMyfriend, getfriendreq } from "../../action/actionfriend";
const { width, height } = Dimensions.get("window");
export default function page0({ navigation, DataR, type, tab }) {
  const [token, settoken] = useRecoilState(tokenState);
  const [data, setdata] = useState([]);
  const [user, setuser] = useRecoilState(userState);

  const isFocuss = useIsFocused();
  const [EVENT, setEVENT] = useState([]);
  async function getHistorypayment() {
    const response = await apiservice({
      path: "/event/getmyEvent/" + user.id,
      token: token.accessToken,
    });
    if (response.status == 200) {
      console.log(response.data.data);
      // setEVENT(response.data.data);
    }
  }

  // async function allstate() {
  //   const getstate = await getfriendreq(token);
  //   if (getstate.status == 200) {
  //     setEVENT(getstate.data.data);
  //   }
  // }

  async function allevent() {
    const getstate = await actionMyfriend({ token, uid: user.id });

    const response = await apiservice({
      method: "Get",
      path: "/event/getrankingByEvent_id/" + DataR.id,
      token: token.accessToken,
    });

    console.log(response?.data);

    if (response.status == 200) {
      const libc = response.data.data.filter((item) => item.Type == type);
      setEVENT(getstate?.data?.data);
      console.log("libc", libc.length);

      setdata(libc);
      //   libc
      //   // libc.filter(
      //   //   (ele, ind) =>
      //   //     ind ===
      //   //     libc.findIndex(
      //   //       (elem) => elem.user_accounts.id === ele.user_accounts.id
      //   //     )
      //   // )
      // );
    }
  }

  useEffect(() => {
    allevent();
    getHistorypayment();
    // allstate();
  }, [isFocuss]);

  return (
    <View style={styles.view}>
      <View style={styles.viewrank}>
        <Text style={styles.textrank}>RANKING</Text>
      </View>
      <View style={styles.viewmyrank}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{
              uri:
                "https://api.sosorun.com/api/imaged/get/" + user.image_Profile,
            }}
            style={[
              styles.img,
              { borderRadius: 54, borderWidth: 2, borderColor: "#fff" },
            ]}
          />
          <View style={{ marginLeft: 5, alignSelf: "center" }}>
            <Text style={styles.textname}>
              {user.name == null ? (
                <Text style={styles.textna}>{user.username}</Text>
              ) : (
                <Text style={styles.textna}>{user.name}</Text>
              )}
            </Text>
            <Text style={styles.textaddess}>
              {user.full_address == null ? (
                <Text style={styles.textaddress}>-</Text>
              ) : (
                <Text style={styles.textaddress}>
                  {user.full_address.district},{user.full_address.province}
                </Text>
              )}
            </Text>
          </View>
        </View>
        <Text style={styles.texttime}>
          {" "}
          {data.filter((item) => item?.user_accounts?.id == user.id).length == 0
            ? "0.00"
            : data.filter((item) => {
                return item?.uid == user.id;
              })[0].last_distance / 1000}{" "}
          km
        </Text>
      </View>
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          return tab == "friend" &&
            EVENT.filter((e) => {
              return e?.friend_id == item?.user_accounts?.id;
            }).length > 0 ? (
            <TouchableOpacity
              onPress={async () => {
                const response = await apiservice({
                  path: "/friend/searchfriend/" + item?.user_accounts?.id,
                  method: "get",
                  token: token.accessToken,
                });

                if (response.status == 200) {
                  navigation.navigate("ProfileUser", {
                    response,
                    userfriend:
                      EVENT.filter((e) => {
                        return e?.friend_id == item?.user_accounts?.id;
                      }).length > 0,
                  });
                }
              }}
              style={[
                styles.ranking,
                {
                  backgroundColor:
                    item?.user_accounts?.role == "VIP" ? "#FCC81D" : "#FFFFFF",
                },
              ]}
            >
              <View style={{ flexDirection: "row", marginLeft: 20 }}>
                <Text
                  style={{
                    fontFamily: "Prompt-Regular",
                    fontSize: 16,
                    color: "#000",
                    alignSelf: "center",
                    marginLeft: -15,
                    marginRight: 5,
                  }}
                >
                  {index + 1}
                </Text>
                <View style={styles.profile}>
                  {item?.user_accounts?.image_Profile == null ? (
                    <Image
                      style={[
                        styles.profile,
                        { height: 35, width: 35, borderRadius: 35 },
                      ]}
                      source={{
                        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/userprofice.png",
                      }}
                    />
                  ) : (
                    <Image
                      style={[
                        styles.profile,
                        {
                          // marginLeft: -10,
                          height: 35,
                          width: 35,
                          borderRadius: 35,
                        },
                      ]}
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" +
                          item?.user_accounts?.image_Profile,
                      }}
                    />
                  )}
                </View>
                <View style={{ marginLeft: 5, alignSelf: "center" }}>
                  <Text style={styles.textname1}>
                    {item?.user_accounts?.name != null
                      ? item?.user_accounts?.name
                      : item?.user_accounts?.username}
                  </Text>
                  {/* <Text style={styles.textaddess1}>{item.user_account}</Text> */}
                </View>
              </View>
              <View style={[styles.viewtime1, { borderLeftColor: "#444" }]}>
                <Text style={styles.texttime1}>time</Text>
                <Text style={styles.texttimer1}>
                  {(Math.floor(item?.running_Time) / 3600).toFixed(0)} hr :
                  {Math.floor((item?.running_Time % 3600) / 60).toFixed(0)} m :
                  {Math.floor((item?.running_Time % 3600) % 60).toFixed(0)} s
                  {/* {item.time} */}
                </Text>

                <Text style={styles.texttime1}>
                  {(item?.last_distance / 1000).toFixed(2)} km
                </Text>
              </View>
            </TouchableOpacity>
          ) : tab == "vip" && item?.user_accounts?.role == "VIP" ? (
            <TouchableOpacity
              onPress={async () => {
                const response = await apiservice({
                  path: "/friend/searchfriend/" + item?.user_accounts?.id,
                  method: "get",
                  token: token.accessToken,
                });

                if (response.status == 200) {
                  navigation.navigate("ProfileUser", {
                    response,
                    userfriend:
                      EVENT.filter((e) => {
                        return e?.friend_id == item?.user_accounts?.id;
                      }).length > 0,
                  });
                }
              }}
              style={[
                styles.ranking,
                {
                  backgroundColor:
                    item?.user_accounts?.role == "VIP" ? "#FCC81D" : "#FFFFFF",
                },
              ]}
            >
              <View style={{ flexDirection: "row", marginLeft: 20 }}>
                <Text
                  style={{
                    fontFamily: "Prompt-Regular",
                    fontSize: 16,
                    color: "#000",
                    alignSelf: "center",
                    marginLeft: -15,
                    marginRight: 5,
                  }}
                >
                  {index + 1}
                </Text>
                <View style={styles.profile}>
                  {item?.user_accounts?.image_Profile == null ? (
                    <Image
                      style={[
                        styles.profile,
                        { height: 35, width: 35, borderRadius: 35 },
                      ]}
                      source={{
                        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/userprofice.png",
                      }}
                    />
                  ) : (
                    <Image
                      style={[
                        styles.profile,
                        {
                          // marginLeft: -10,
                          height: 35,
                          width: 35,
                          borderRadius: 35,
                        },
                      ]}
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" +
                          item?.user_accounts?.image_Profile,
                      }}
                    />
                  )}
                </View>
                <View style={{ marginLeft: 5, alignSelf: "center" }}>
                  <Text style={styles.textname1}>
                    {item?.user_accounts?.name != null
                      ? item?.user_accounts?.name
                      : item?.user_accounts?.username}
                  </Text>
                  {/* <Text style={styles.textaddess1}>{item.user_account}</Text> */}
                </View>
              </View>
              <View style={[styles.viewtime1, { borderLeftColor: "#444" }]}>
                <Text style={styles.texttime1}>time</Text>
                <Text style={styles.texttimer1}>
                  {(Math.floor(item?.running_Time) / 3600).toFixed(0)} hr :
                  {Math.floor((item?.running_Time % 3600) / 60).toFixed(0)} m :
                  {Math.floor((item?.running_Time % 3600) % 60).toFixed(0)} s
                  {/* {item.time} */}
                </Text>

                <Text style={styles.texttime1}>
                  {(item?.last_distance / 1000).toFixed(2)} km
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            tab == "all" && (
              <TouchableOpacity
                onPress={async () => {
                  const response = await apiservice({
                    path: "/friend/searchfriend/" + item?.user_accounts?.id,
                    method: "get",
                    token: token.accessToken,
                  });

                  if (response.status == 200) {
                    navigation.navigate("ProfileUser", {
                      response,
                      userfriend:
                        EVENT.filter((e) => {
                          return e?.friend_id == item?.user_accounts?.id;
                        }).length > 0,
                    });
                  }
                }}
                style={[
                  styles.ranking,
                  {
                    backgroundColor:
                      item?.user_accounts?.role == "VIP"
                        ? "#FCC81D"
                        : "#FFFFFF",
                  },
                ]}
              >
                <View style={{ flexDirection: "row", marginLeft: 20 }}>
                  <Text
                    style={{
                      fontFamily: "Prompt-Regular",
                      fontSize: 16,
                      color: "#000",
                      alignSelf: "center",
                      marginLeft: -15,
                      marginRight: 5,
                    }}
                  >
                    {index + 1}
                  </Text>
                  <View style={styles.profile}>
                    {item?.user_accounts?.image_Profile == null ? (
                      <Image
                        style={[
                          styles.profile,
                          { height: 35, width: 35, borderRadius: 35 },
                        ]}
                        source={{
                          uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/userprofice.png",
                        }}
                      />
                    ) : (
                      <Image
                        style={[
                          styles.profile,
                          {
                            // marginLeft: -10,
                            height: 35,
                            width: 35,
                            borderRadius: 35,
                          },
                        ]}
                        source={{
                          uri:
                            "https://api.sosorun.com/api/imaged/get/" +
                            item?.user_accounts?.image_Profile,
                        }}
                      />
                    )}
                  </View>
                  <View style={{ marginLeft: 5, alignSelf: "center" }}>
                    <Text style={styles.textname1}>
                      {item?.user_accounts?.name != null
                        ? item?.user_accounts?.name
                        : item?.user_accounts?.username}
                    </Text>
                    {/* <Text style={styles.textaddess1}>{item.user_account}</Text> */}
                  </View>
                </View>
                <View style={[styles.viewtime1, { borderLeftColor: "#444" }]}>
                  <Text style={styles.texttime1}>time</Text>
                  <Text style={styles.texttimer1}>
                    {(Math.floor(item?.running_Time) / 3600).toFixed(0)} hr :
                    {Math.floor((item?.running_Time % 3600) / 60).toFixed(0)} m
                    :{Math.floor((item?.running_Time % 3600) % 60).toFixed(0)} s
                    {/* {item.time} */}
                  </Text>

                  <Text style={styles.texttime1}>
                    {(item?.last_distance / 1000).toFixed(2)} km
                  </Text>
                </View>
              </TouchableOpacity>
            )
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  view: {
    width: width,
    backgroundColor: "#393939",
  },
  viewrank: {
    width: width,
    height: 100,
    flexDirection: "row",
    paddingHorizontal: 20,
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#FFFFFF",
  },
  textrank: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
    alignSelf: "center",
  },
  textnum: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#fff",
    fontWeight: "500",
    alignSelf: "center",
  },
  viewmyrank: {
    width: width,
    height: 100,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  img: {
    width: 54,
    height: 54,
    alignSelf: "center",
  },
  textname: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#fff",
  },
  textname1: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
  },
  textaddess: {
    fontFamily: "Prompt-Regular",
    fontSize: 10,
    color: "#fff",
  },
  textaddess1: {
    fontFamily: "Prompt-Regular",
    fontSize: 10,
    color: "#000",
  },
  viewtime: {
    width: 110,
    height: 57,
    borderLeftWidth: 1,
    borderLeftColor: "#fff",
  },
  viewtime1: {
    width: 120,
    height: 40,
    borderLeftWidth: 1,
    borderLeftColor: "#fff",
    marginVertical: 5,
  },
  texttime: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#fff",
    alignSelf: "flex-end",
  },
  texttime1: {
    fontFamily: "Prompt-Regular",
    fontSize: 11,
    color: "#000",
    alignSelf: "flex-end",
  },
  texttimer: {
    fontFamily: "Prompt-Regular",
    fontSize: 10,
    color: "#fff",
    alignSelf: "flex-end",
  },
  texttimer1: {
    fontFamily: "Prompt-Regular",
    fontSize: 9,
    color: "#000",
    alignSelf: "flex-end",
  },
  ranking: {
    width: width,
    height: 50,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: 5,
  },
  profile: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#393939",
    justifyContent: "center",
    alignSelf: "center",
  },
});
