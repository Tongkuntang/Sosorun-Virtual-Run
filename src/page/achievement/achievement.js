import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import HeaderFree from "../components/headerfree";
import { apiservice } from "../../service/service";
import { useRecoilValue } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";

const { width, height } = Dimensions.get("window");

export default function friend({ navigation }) {
  const [search, setsearch] = useState("");
  const [data, setdata] = useState([]);
  const token = useRecoilValue(tokenState);
  const user = useRecoilValue(userState);
  const DATA = [
    {
      imageURL: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/D/1.png",
      },
      distance: 0,
      name: "ภารกิจเลื่อนยศ ระดับ1",
    },
    {
      imageURL: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/D/10.png",
      },
      distance: 18000,
      name: "ภารกิจเลื่อนยศ ระดับ2",
    },
    {
      imageURL: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/D/20.png",
      },
      distance: 38000,

      name: "ภารกิจเลื่อนยศ ระดับ3",
    },
    {
      distance: 58000,
      imageURL: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/D/30.png",
      },
      name: "ภารกิจเลื่อนยศ ระดับ4",
    },
    {
      imageURL: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/D/40.png",
      },
      distance: 78000,
      name: "ภารกิจเลื่อนยศ ระดับ5",
    },
    {
      imageURL: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/D/50.png",
      },
      distance: 98000,
      name: "ภารกิจเลื่อนยศ ระดับ6",
    },
    {
      imageURL: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/60.png",
      },
      distance: 118000,
      name: "ภารกิจเลื่อนยศ ระดับ7",
    },
    {
      imageURL: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/70.png",
      },
      distance: 138000,
      name: "ภารกิจเลื่อนยศ ระดับ8",
    },
    {
      imageURL: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/80.png",
      },
      distance: 158000,
      name: "ภารกิจเลื่อนยศ ระดับ9",
    },
    {
      imageURL: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/90.png",
      },
      distance: 178000,
      name: "ภารกิจเลื่อนยศ ระดับ10",
    },
    {
      imageURL: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/100.png",
      },
      distance: 198000,
      name: "ภารกิจเลื่อนยศ ระดับ11",
    },
    {
      imageURL: {
        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/rank/110.png",
      },
      distance: 218000,
      name: "ภารกิจเลื่อนยศ ระดับ12",
    },
  ];

  async function event() {
    const response = await apiservice({
      method: "Get",
      path: "/event/getAchievement",
      token: token.accessToken,
    });

    if (response.status == 200) {
      setdata(response.data.data);
    }
  }

  useEffect(() => {
    event();
  }, [token]);

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
      <Text
        style={{
          fontFamily: "Prompt-Regular",
          fontSize: 16,
          color: "#393939",
          marginLeft: 15,
          marginTop: 10,
        }}
      >
        ACHIEVEMENT
      </Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Mission");
        }}
        style={{
          height: 50,
          backgroundColor: "#E4E4E4",
          paddingHorizontal: 20,
          justifyContent: "space-between",
          flexDirection: "row",
          marginTop: 5,
        }}
      >
        <Text
          style={{
            fontFamily: "Prompt-Regular",
            fontSize: 16,
            color: "#393939",
            alignSelf: "center",
          }}
        >
          EVENT
        </Text>
        {data.length +
          DATA.filter(
            (item) => user.user_accounts.total_distance > item.distance
          ).length >
          0 && (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 15,
              width: 30,
              height: 30,
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 16,
                color: "#393939",
              }}
            >
              {data.length +
                DATA.filter(
                  (item) => user.user_accounts.total_distance > item.distance
                ).length}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          height: 50,
          backgroundColor: "#E4E4E4",
          paddingHorizontal: 20,
          marginTop: 20,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Prompt-Regular",
            fontSize: 16,
            color: "#393939",
          }}
        >
          CHALLENGES
        </Text>
      </TouchableOpacity>
      {/* <TouchableOpacity
        style={{
          height: 50,
          backgroundColor: "#E4E4E4",
          paddingHorizontal: 20,
          marginTop: 20,
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontFamily: "Prompt-Regular",
            fontSize: 16,
            color: "#393939",
          }}
        >
          LEVEL
        </Text>
      </TouchableOpacity> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
