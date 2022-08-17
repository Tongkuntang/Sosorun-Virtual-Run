import { useIsFocused } from "@react-navigation/core";
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
} from "react-native";
import { useRecoilState } from "recoil";
import { getallevent } from "../../action/actiongetall";
import { getallhistory } from "../../action/actionhistrory";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { apiservice } from "../../service/service";
import HeaderFree from "../components/headerfree";
const { width, height } = Dimensions.get("window");

export default function friend({ navigation }) {
  const [search, setsearch] = useState("");
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);
  const [DATA, setData] = useState([]);
  const [data, setdata] = useState([]);
  const isFocus = useIsFocused();
  const [evet, setevet] = useState([]);

  async function event() {
    const response = await apiservice({
      method: "Get",
      path: "/event/getAchievement",
      token: token.accessToken,
    });
    // console.log("response.data????????", response.data.data);
    if (response.status == 200) {
      setevet(
        response.data.data.filter((item) => {
          return item.Type == "EVENT";
        })
      );
    }
  }

  console.log("gethistory >> ", evet);

  useEffect(() => {
    event();
  }, [isFocus]);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <FlatList
        data={evet}
        // extraData={[data]}
        numColumns={3}
        style={{
          backgroundColor: "white",
          width: width,
          alignSelf: "center",
          paddingHorizontal: 10,
        }}
        renderItem={({ item, index }) => {
          return (
            <View>
              <TouchableOpacity
                disabled={!(item.last_distance >= item.total_distance)}
                onPress={() => {
                  navigation.navigate("Cat", {
                    ...item,
                    cal: item.Achievement.cal,
                  });
                }}
                style={{
                  height: 120,
                  resizeMode: "contain",
                  mwidth: width * 0.3,
                  justifyContent: "space-between",
                  alignSelf: "center",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    alignSelf: "center",
                    width: width * 0.3,
                    height: 120,
                    alignItems: "center",
                    marginTop: 10,
                    marginRight: 10,
                    opacity:
                      item.last_distance >= item.total_distance ? 1 : 0.3,
                  }}
                >
                  <Image
                    source={{
                      uri:
                        "https://api.sosorun.com/api/imaged/get/" +
                        item?.event_Listt?.Achievement,
                    }}
                    style={{ width: 70, height: 70, resizeMode: "contain" }}
                  />

                  <Text
                    style={{
                      fontFamily: "Prompt-Regular",
                      fontSize: 11,
                      color: "#434343",
                    }}
                  >
                    {item?.event_name}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
