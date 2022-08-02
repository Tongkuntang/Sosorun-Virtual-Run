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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { getalllevel, getallmission } from "../../action/actiongetall";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { autolize_Lv } from "../../json/utils";
import { getsucceed } from "../../action/actionhistrory";
// import { logPushNotificationOpenAsync } from "expo-facebook";
const { width, height } = Dimensions.get("window");
export default function page2({ onPress, navigation }) {
  const [token, setToken] = useRecoilState(tokenState);
  const [Visible, setVisible] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const datauser = user.user_accounts;

  const [event, setevent] = useState([]);
  // console.log(datauser.Lv);
  async function alllevel() {
    const gethistory = await getsucceed(token);
    const IT = gethistory.data.data
      .filter((i) => {
        return i.Type == "UP" && i.mission_id;
      })
      .map((e) => {
        return e.mission_id;
      });
    const getevent = await getalllevel(token);
    if (getevent.status == 200) {
      setevent(
        getevent.data.data.filter((item) => {
          return (
            item.id != IT[0] &&
            item.id != IT[1] &&
            item.id != IT[2] &&
            item.id != IT[4] &&
            item.id != IT[5] &&
            item.id != IT[6]
          );
        })
      );
    }
  }
  useEffect(() => {
    alllevel();
  }, [token]);
  return (
    <View>
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
        data={event.filter((item) => {
          return (
            item.request_ranking ==
            autolize_Lv(user.user_accounts.total_distance).lv
          );
        })}
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
                  navigation.navigate("PromateDetail", { item });
                } else if (
                  autolize_Lv(user.user_accounts.total_distance).lv >
                  item.request_ranking
                ) {
                  navigation.navigate("PromateDetail", { item });
                } else {
                  setVisible(true);
                }
              }}
              style={styles.touch}
            >
              <View style={styles.view}>
                <View style={{ width: width * 0.6 }}>
                  <Text style={styles.texthead}>{item.titel}</Text>
                  <Text style={styles.textdetail}>{item.discription}</Text>
                </View>
                <Image
                  source={{
                    uri:
                      "https://api.sosorun.com/api/imaged/get/" +
                      item?.Achievement,
                  }}
                  style={{ width: 70, height: 78 }}
                />
              </View>
              <View
                style={[styles.deside, { alignItems: "flex-end", bottom: 10 }]}
              >
                <LinearGradient
                  colors={["#F2F6F8", "#DBDBDB"]}
                  style={[styles.viewlimid]}
                >
                  <Text style={styles.textlimid}>
                    LV {item.request_ranking} ขึ้นไป
                  </Text>
                </LinearGradient>
                <View>
                  <Text style={[styles.texthead, { alignSelf: "center" }]}>
                    {item.distance}
                  </Text>
                  <LinearGradient
                    colors={["#F2F6F8", "#DBDBDB"]}
                    style={[styles.viewlimid, { width: 55, height: 24 }]}
                  >
                    <Text style={styles.textlimid}>กม</Text>
                  </LinearGradient>
                </View>
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
    // width: 96,
    height: 30,
    justifyContent: "center",
    paddingHorizontal: 5,
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
  },
  img: {
    width: 76,
    height: 76,
    marginTop: -30,
  },
  deside: {
    marginBottom: 10,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
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
