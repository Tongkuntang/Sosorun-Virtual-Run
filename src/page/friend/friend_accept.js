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
  Modal,
  FlatList,
  ScrollView,
  Share,
  TextInput,
} from "react-native";
import {
  FontAwesome5,
  Fontisto,
  FontAwesome,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import HeaderFree from "../components/headerfree";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  tokenState,
  userState,
  lans,
} from "../../reducer/reducer/reducer/Atom";
import {
  actionAcceptFriend,
  actionMyfriend,
  Delfriend,
  getfriendreq,
} from "../../action/actionfriend";
import { useIsFocused } from "@react-navigation/native";
import { getActionUser } from "../../action/actionauth";

const { width, height } = Dimensions.get("window");
export default function friend({ navigation }) {
  // ตอบรับเพื่อน
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setuser] = useRecoilState(userState);
  const focus = useIsFocused();
  const [data, setdata] = useState([]);
  const lan = useRecoilValue(lans);

  async function allstate() {
    const getstate = await getfriendreq(token);
    if (getstate.status == 200) {
      setdata(getstate.data.data);
    }
  }

  useEffect(() => {
    allstate();
  }, [token, focus]);

  const [body1, setbody1] = useState({
    id: "",
    status: "Accepted",
  });

  const [body, setbody] = useState({
    id: "",
  });

  return (
    <View style={styles.container}>
      <Text
        style={{
          fontFamily: "Prompt-Regular",
          fontSize: 16,
          color: "#393939",
          marginLeft: 15,
          marginTop: 10,
        }}
      >
        {lan == "en" ? "ACCEPT FRIEND REQUEST" : "ยืนยันคำขอเป็นเพื่อน"}
      </Text>
      <View>
        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            console.log(">>>>>>>>", item);
            return (
              <View
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
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    {item.user_accounts.image_Profile == null ? (
                      <Image
                        source={{
                          uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/userprofice.png",
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          alignSelf: "center",
                          justifyContent: "center",
                          borderRadius: 35,
                        }}
                      />
                    ) : (
                      <Image
                        source={{
                          uri:
                            "https://api.sosorun.com/api/imaged/get/" +
                            item.user_accounts.image_Profile,
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          alignSelf: "center",
                          justifyContent: "center",
                          borderRadius: 35,
                        }}
                      />
                    )}
                    {item.user_accounts.name == null ? (
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: "Prompt-Regular",
                          color: "#434343",
                          alignSelf: "center",
                          marginLeft: 30,
                        }}
                      >
                        {item.user_accounts.username}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: "Prompt-Regular",
                          color: "#434343",
                          alignSelf: "center",
                          marginLeft: 30,
                        }}
                      >
                        {item.user_accounts.name}
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignSelf: "center" }}>
                      <TouchableOpacity
                        onPress={async () => {
                          let data2 = {
                            ...body1,
                            id: item.id,
                          };
                          const response = await actionAcceptFriend({
                            body1: data2,
                            token,
                          });
                          console.log("216", response);
                          if (response.status == 200) {
                            const getstate = await getfriendreq(token);
                            setdata(getstate.data.data);
                            if (getstate.status == 200) {
                              const get = await actionMyfriend({
                                token,
                                uid: user.id,
                              });
                              console.log("::::", get);
                            }
                          }
                        }}
                        style={{
                          backgroundColor: "#393939",
                          width: 80,
                          height: 25,
                          marginRight: 10,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 3,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Prompt-Regular",
                            fontSize: 14,
                            color: "#FFFFFF",
                          }}
                        >
                          ยืนยัน
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          let data1 = {
                            ...body,
                            id: item.friend_id,
                          };

                          const response = await Delfriend({
                            body: data1,
                            token,
                          });

                          if (response.status == 200) {
                            const getstate = await getfriendreq(token);
                          }
                          navigation.goBack("");
                        }}
                        style={{
                          backgroundColor: "#393939",
                          width: 80,
                          height: 25,
                          marginRight: 10,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 3,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Prompt-Regular",
                            fontSize: 14,
                            color: "#FFFFFF",
                          }}
                        >
                          ลบ
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: "#fff",
  },
});
