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
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { getallevent, getmyeventid } from "../../action/actiongetall";
import moment from "moment";
import { apiservice } from "../../service/service";
const { width, height } = Dimensions.get("window");
export default function page1({ onPress, navigation }) {
  const [token, setToken] = useRecoilState(tokenState);
  const [Visible, setVisible] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const datauser = user.user_accounts;
  const [event, setevent] = useState([]);

  async function allevent() {
    const response = await apiservice({
      method: "Get",
      path: "/event/getAchievement",
      token: token.accessToken,
    });

    if (response.status == 200) {
      const getevent = await getallevent(token);
      const rep = response.data.data
        .filter((i) => {
          return i.Type == "EVENT" && i.event_id;
        })
        .map((e) => {
          return e.event_id;
        });
      const getmy = await getmyeventid({ token, uid: user.id });

      setevent(
        token?.role == "VIP"
          ? getevent.data?.filter(
              (item) =>
                getmy?.data?.filter((e) => item.id == e.event_id).length > 0
            )
          : getevent.data
      );
    }
  }
  useEffect(() => {
    allevent();
  }, [token]);

  return (
    <View>
      <ScrollView>
        <FlatList
          data={event}
          extraData={datauser}
          ListFooterComponent={<View style={{ height: 50 }} />}
          renderItem={({ item }) => {
            return (
              <View>
                {item.status == "Active" ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("EventDetail", { item })}
                    style={[styles.touch, { minHeight: 150 }]}
                  >
                    <View style={styles.view}>
                      <Text style={[styles.texthead, { width: width * 0.65 }]}>
                        {item.titel}
                      </Text>
                      <View>
                        <Text style={styles.textlimid}>เข้าร่วมได้</Text>
                        <Image
                          source={{
                            uri:
                              "https://api.sosorun.com/api/imaged/get/" +
                              item?.Achievement,
                          }}
                          style={[
                            styles.img,
                            { position: "absolute", top: 65 },
                          ]}
                        />
                      </View>
                    </View>
                    <Text style={styles.texttime}>ระยะเวลา</Text>
                    <Text style={[styles.texttime, { marginBottom: 5 }]}>
                      ตั้งแต่วันที่ {moment(item.startDate).format("DD")} -{" "}
                      {moment(item.expireDate).format("DD/MMMM/YYYY")}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("EventDetail", { item })}
                    style={styles.touch}
                  >
                    <View style={styles.view}>
                      <Text style={styles.texthead}>{item.titel}</Text>
                      <Text style={styles.textlimid1}>ซื้อล่วงหน้า</Text>
                    </View>
                    <Text style={styles.texttime}>ระยะเวลา</Text>
                    <Text style={[styles.texttime, { marginBottom: 5 }]}>
                      ตั้งแต่วันที่ {moment(item.startDate).format("DD")} -{" "}
                      {moment(item.expireDate).format("DD/MMMM/YYYY")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          }}
        />
      </ScrollView>
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
    color: "#0E8536",
  },
  textlimid1: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#EB0B0B",
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
  },
  img: {
    width: 76,
    height: 76,
    marginTop: -30,
  },
});
