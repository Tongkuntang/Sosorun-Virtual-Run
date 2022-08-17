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
import { useRecoilState } from "recoil";
import { tokenState } from "../../reducer/reducer/reducer/Atom";
import { useIsFocused } from "@react-navigation/native";
import { getfriendreq, getreqfriend } from "../../action/actionfriend";
const { width, height } = Dimensions.get("window");
export default function friend({ navigation }) {
  // รอเพื่อนตอบรับ
  const [token, setToken] = useRecoilState(tokenState);
  const focus = useIsFocused();
  const [data, setdata] = useState([]);
  async function allstate() {
    const getstate = await getreqfriend(token);
    setdata(getstate.data.data);
    // console.log("39", getstate.data.data);
  }
  useEffect(() => {
    allstate();
  }, [token, focus]);

  const [search, setsearch] = useState("");
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
        FRIEND REQUEST
      </Text>
      <View>
        <FlatList
          data={data}
          renderItem={({ item, index }) => {
            console.log("131", item);
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
                    {item.img_friend == null ? (
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
                            item.img_friend,
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
                    {item.useraccounts.name == null ? (
                      <Text
                        style={{
                          fontSize: 20,
                          fontFamily: "Prompt-Regular",
                          color: "#434343",
                          alignSelf: "center",
                          marginLeft: 30,
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
                          marginLeft: 30,
                        }}
                      >
                        {item.useraccounts.name}
                      </Text>
                    )}
                  </View>
                  <Text
                    style={{
                      fontFamily: "Prompt-Regular",
                      fontSize: 20,
                      color: "#FFC000",
                      alignSelf: "center",
                    }}
                  >
                    รอตอบรับ
                  </Text>
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
