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
  FlatList,
  TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import HeaderFree from "../components/headerfree";
import { useIsFocused } from "@react-navigation/native";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  tokenState,
  userState,
  lans,
} from "../../reducer/reducer/reducer/Atom";
import { actionMyfriend, getfriendreq } from "../../action/actionfriend";
import Friendrequest from "./friend_request";
import Friendaccetp from "./friend_accept";
const { width, height } = Dimensions.get("window");

export default function friend({ navigation }) {
  // โชว์รายชื่อเพื่อน
  const focus = useIsFocused();
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setuser] = useRecoilState(userState);
  console.log("1111", user);
  const [page, setpage] = useState(0);
  const [state, setstate] = useState("");
  const [data, setdata] = useState([]);
  const lan = useRecoilValue(lans);
  async function allstate() {
    const getstate = await actionMyfriend({ token, uid: user.id });
    if (getstate.status == 200) {
      setstate(getstate.data.data);
    }
  }

  async function allstateACC() {
    const getstate = await getfriendreq(token);
    if (getstate.status == 200) {
      setdata(getstate.data.data);
    }
  }
  // console.log("43", state);
  useEffect(() => {
    allstate();
  }, [token, focus]);

  const [search, setsearch] = useState("");
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <HeaderFree navigation={navigation} />
        <View
          style={{
            flexDirection: "row",
            width: width,
            justifyContent: "space-between",
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              setpage(0);
            }}
            style={{
              borderBottomColor: page == 0 ? "#000000" : "",
              borderBottomWidth: page == 0 ? 1 : 0,
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 16,
                color: page == 0 ? "#393939" : "#DBDBDB",
                alignSelf: "center",
              }}
            >
              {lan == "en" ? "FRIENDS" : "เพื่อน"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setpage(1);
            }}
            style={{
              borderBottomColor: page == 1 ? "#000000" : "",
              borderBottomWidth: page == 1 ? 1 : 0,
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 16,
                color: page == 1 ? "#393939" : "#DBDBDB",
                alignSelf: "center",
              }}
            >
              {lan == "en" ? "ACCEPT" : "ยืนยันเพื่อน"}
            </Text>
            {data?.length > 0 && (
              <View
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: "#ff0000",
                  borderRadius: 15,
                }}
              />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setpage(2);
            }}
            style={{
              borderBottomColor: page == 2 ? "#000000" : "",
              borderBottomWidth: page == 2 ? 1 : 0,
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 16,
                color: page == 2 ? "#393939" : "#DBDBDB",
                alignSelf: "center",
              }}
            >
              {lan == "en" ? "REQUEST" : "คำขอเป็นเพื่อน"}
            </Text>
          </TouchableOpacity>
        </View>

        {page == 0 && (
          <View>
            <View
              style={{
                flexDirection: "row",
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  width: width * 0.85,
                  height: 40,
                  alignSelf: "center",
                  backgroundColor: "#E4E4E470",
                  borderRadius: 5,
                  flexDirection: "row",
                  marginTop: 10,
                  paddingHorizontal: 5,
                }}
              >
                <FontAwesome
                  name="search"
                  size={24}
                  color="#E4E4E4"
                  style={{ alignSelf: "center", marginRight: 100 }}
                />
                <TextInput
                  style={{
                    width: width * 0.5,
                    height: 40,
                    justifyContent: "center",
                    borderRadius: 5,
                    fontSize: 14,
                    fontFamily: "Prompt-Regular",
                    color: "#A1949A",
                    alignItems: "center",
                  }}
                  placeholder={lan == "en" ? "SEARCH" : "ค้นหา"}
                  onChangeText={(search) => setsearch(search)}
                  defaultValue={search}
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Friendadd");
                }}
                style={{ alignSelf: "center", marginLeft: 10 }}
              >
                <Image
                  source={{
                    uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/add_friend.png",
                  }}
                  style={{ width: 30, height: 30, resizeMode: "contain" }}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 16,
                color: "#393939",
                marginLeft: 15,
                marginTop: 10,
              }}
            >
              {lan == "en" ? "FRIENDS" : "เพื่อน"}
            </Text>
            <View>
              <FlatList
                data={state}
                style={{ backgroundColor: "white", width: width }}
                renderItem={({ item, index }) => {
                  console.log("img_friend", item);
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("ProfileFriend", { item });
                      }}
                      style={{
                        width: width,
                        height: 80,
                        marginTop: 10,
                        paddingHorizontal: 10,
                        alignSelf: "center",
                        backgroundColor: "#FFFFFF",
                        justifyContent: "center",
                      }}
                    >
                      <View style={{ flexDirection: "row" }}>
                        {item.img_uid == null ? (
                          <Image
                            style={{
                              width: 70,
                              height: 70,
                              borderRadius: 35,
                            }}
                            source={{
                              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/userprofice.png",
                            }}
                          />
                        ) : (
                          <Image
                            style={{
                              width: 70,
                              height: 70,
                              borderRadius: 35,
                              // backgroundColor: "#FF0000",
                              // alignSelf: "center",
                              // justifyContent: "center",
                            }}
                            source={{
                              uri:
                                "https://api.sosorun.com/api/imaged/get/" +
                                item?.useraccounts?.image_Profile?.replace(
                                  ".png",
                                  ""
                                ),
                            }}
                          />
                        )}

                        <View
                          style={{
                            justifyContent: "center",
                          }}
                        >
                          {item.useraccounts.name == null ? (
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: "Prompt-Regular",
                                color: "#434343",
                                alignSelf: "center",
                                marginLeft: 20,
                              }}
                            >
                              {item.useraccounts.username}
                            </Text>
                          ) : (
                            <Text
                              style={{
                                fontSize: 20,
                                fontFamily: "Prompt-Regular",
                                color: "#434343",
                                alignSelf: "center",
                                marginLeft: 20,
                              }}
                            >
                              {item.useraccounts.name}
                            </Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        )}
        {page == 1 && <Friendaccetp navigation={navigation} />}
        {page == 2 && <Friendrequest />}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
