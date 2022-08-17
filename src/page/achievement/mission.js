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
  FlatList,
} from "react-native";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { apiservice } from "../../service/service";
import HeaderFree from "../components/headerfree";
import { getallhistory, getHistrory } from "../../action/actionhistrory";
import { getallmission } from "../../action/actiongetall";
import { useIsFocused } from "@react-navigation/core";
import { logPushNotificationOpenAsync } from "expo-facebook";
import EventAS from "./event";
import UuLv from "./advance";
const { width, height } = Dimensions.get("window");

export default function friend({ navigation }) {
  const [token, settoken] = useRecoilState(tokenState);
  const [evet, setevet] = useState([]);
  const [events, setevent] = useState([]);
  const [data, setdata] = useState([]);
  const isFocus = useIsFocused();
  const [user, setuser] = useRecoilState(userState);
  const [page, setpage] = useState(0);
  const [historyGet, sethistoryGet] = useState("");
  async function allevent() {
    // const getevent = await getallevent(token);
    const response = await apiservice({
      path: "/event/getmyEvent/" + user.id,
      token: token.accessToken,
    });
    if (response.status == 200) {
      setdata(
        response.data.data.filter(
          (item) => item.Type == "MISSION" && item.status == true
        )
      );
      setevent(response.data.data);
      // setdata(response.data.data);
    }
  }
  // console.log("data", data);

  async function event() {
    const response = await apiservice({
      method: "Get",
      path: "/event/getAchievement",
      token: token.accessToken,
    });

    if (response.status == 200) {
      setevet(
        response.data.data.filter((item) => {
          return item.Type == "MISSION";
        })
      );
    }
  }

  useEffect(() => {
    allevent();
    event();
  }, [token, isFocus]);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <HeaderFree navigation={navigation} />
      </View>
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
            // navigation.navigate("Mission");
          }}
          style={{
            borderBottomColor: page == 0 ? "#000000" : "#fff",
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
            ภารกิจ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setpage(1);
            // navigation.navigate("Eventac");
          }}
          style={{
            borderBottomColor: page == 1 ? "#000000" : "#fff",
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
            เวอร์ชวล
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setpage(2);
            // navigation.navigate("Advance");
          }}
          style={{
            borderBottomColor: page == 2 ? "#000000" : "#fff",
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
            เลื่อนขั้น
          </Text>
        </TouchableOpacity>
      </View>

      {page == 0 && (
        <View>
          <FlatList
            data={evet}
            style={{ backgroundColor: "white", width: width }}
            renderItem={({ item, index }) => {
              // console.log(">>>>>>>>>>>>>>>>>", item);
              return (
                <View>
                  {
                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate("Coin", {
                          item,
                        });
                        // }
                      }}
                      style={{
                        alignSelf: "center",
                        width: width,
                        height: 100,
                        flexDirection: "row",
                        paddingHorizontal: 10,
                        borderBottomWidth: 1,
                        borderBottomColor: "#E5DFDF",
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={{
                          uri:
                            "https://api.sosorun.com/api/imaged/get/" +
                            item.img_event,
                        }}
                        style={{
                          width: 70,
                          height: 70,
                          resizeMode: "contain",
                          marginRight: 10,
                        }}
                      />
                      <View>
                        <Text
                          style={{
                            fontFamily: "Prompt-Regular",
                            fontSize: 16,
                            color: "black",
                          }}
                        >
                          {item.event_name}
                        </Text>
                        <Text
                          style={{
                            fontFamily: "Prompt-Regular",
                            fontSize: 14,
                            color: "#black",
                          }}
                        >
                          {/* {item.event_List.discription} */}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  }
                </View>
              );
            }}
          />
        </View>
      )}
      {page == 1 && <EventAS navigation={navigation} />}
      {page == 2 && <UuLv navigation={navigation} />}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
