import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getallmission } from "../../action/actiongetall";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { useRecoilState } from "recoil";
import moment from "moment";
import { apiservice } from "../../service/service";
import { autolize_Lv } from "../../json/utils";
import { useIsFocused } from "@react-navigation/core";
const { width, height } = Dimensions.get("window");
export default function page0({ onPress, navigation }) {
  const [token, setToken] = useRecoilState(tokenState);
  const [Visible, setVisible] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const datauser = user.user_accounts;

  const [event, setevent] = useState([]);
  const focus = useIsFocused();
  async function allmission() {
    const response = await apiservice({
      method: "Get",
      path: "/event/getAchievement",
      token: token.accessToken,
    });
    if (response.status == 200) {
      const rep = response.data.data
        .filter((i) => {
          return i.Type == "MISSION" && i.mission_id;
        })
        .map((e) => {
          return e.mission_id;
        });
      const getevent = await getallmission(token);
      if (getevent.status == 200) {
        setevent(getevent.data.data);
      }
    }
  }

  useEffect(() => {
    allmission();
  }, [token, focus]);

  return (
    <View style={{ flex: 1 }}>
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
          <LinearGradient
            colors={["#FCC81D", "#EFD98F", "#EEE6CB", "#C29709"]}
            style={styles.backgroundmodal}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 32,
                color: "#000",
                textAlign: "center",
                paddingHorizontal: 10,
                marginVertical: 30,
              }}
            >
              คุณไม่สามารถเข้าร่วม รายการนี้ได้ เนื่องจาก ไม่ตรงตามเงื่อนไข
            </Text>
            <TouchableOpacity
              onPress={() => setVisible(!Visible)}
              style={styles.touchmodal}
            >
              <Text style={styles.go}>ตกลง</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
      <FlatList
        data={event}
        extraData={datauser}
        ListFooterComponent={<View style={{ height: 50 }} />}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                if (
                  autolize_Lv(user.user_accounts.total_distance).lv ==
                  item.request_ranking
                ) {
                  navigation.navigate("MissionDetail", { item });
                } else if (
                  autolize_Lv(user.user_accounts.total_distance).lv >=
                  item.request_ranking
                ) {
                  navigation.navigate("MissionDetail", { item });
                } else {
                  setVisible(true);
                }
              }}
              style={[styles.touch]}
            >
              <View style={styles.view}>
                <View style={{ width: width * 0.7, marginLeft: 10 }}>
                  <Text style={styles.texthead}>{item.titel}</Text>
                </View>
                <View
                  style={{
                    width: width * 0.3,
                    right: -10,
                    position: "absolute",
                  }}
                >
                  {autolize_Lv(parseInt(user.user_accounts.total_distance)).lv <
                  item.request_ranking ? (
                    <LinearGradient
                      colors={["#FF1C69", "#D91C1C"]}
                      style={styles.viewlimid}
                    >
                      <Text style={styles.textlimid}>
                        LV {item.request_ranking} ขึ้นไป
                      </Text>
                    </LinearGradient>
                  ) : (
                    <LinearGradient
                      colors={["#F2F6F8", "#DBDBDB"]}
                      style={styles.viewlimid}
                    >
                      <Text style={styles.textlimid}>
                        LV {item.request_ranking} ขึ้นไป
                      </Text>
                    </LinearGradient>
                  )}
                </View>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Text style={[styles.textdetail, { width: width * 0.65 }]}>
                  {item.discription}
                </Text>
              </View>
              <View style={styles.view}>
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.texttime}>ระยะเวลา</Text>
                  <Text style={styles.texttime}>
                    ตั้งแต่วันที่ {moment(item.startDate).format("DD")} -{" "}
                    {moment(item.expireDate).format("DD/MMMM/YYYY")}
                  </Text>
                </View>

                <Image
                  source={{
                    uri:
                      "https://api.sosorun.com/api/imaged/get/" +
                      item?.Achievement,
                  }}
                  style={styles.img}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  texthead: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#000",
  },
  textlimid: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    alignSelf: "center",
  },
  textdetail: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
  },
  texttime: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
  },
  viewlimid: {
    width: 96,
    height: 30,
    justifyContent: "center",
  },
  touch: {
    paddingHorizontal: 20,
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#44444450",
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    width: width * 0.98,
    alignSelf: "center",
  },
  img: {
    width: 76,
    height: 76,
    marginTop: -30,
  },
  backgroundmodal: {
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
});
