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
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { useIsFocused } from "@react-navigation/core";
import { apiservice } from "../../service/service";
import { getActionUser } from "../../action/actionauth";

const { width, height } = Dimensions.get("window");

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

export default function friend({ navigation }) {
  const [search, setsearch] = useState("");
  const isFocus = useIsFocused();
  const [user, setUser] = useRecoilState(userState);
  const [token, setToken] = useRecoilState(tokenState);

  async function apiCall() {
    const response = await getActionUser(token);
    setUser(response.data);
  }

  useEffect(() => {
    apiCall();
  }, [isFocus]);

  console.log("total_distance ", user.user_accounts.total_distance);

  return (
    <View style={styles.container}>
      <SafeAreaView />

      <FlatList
        data={DATA}
        numColumns={3}
        style={{
          backgroundColor: "white",
          width: width,
          alignSelf: "center",
          paddingHorizontal: 10,
        }}
        renderItem={({ item, index }) => {
          return (
            <View
              style={{
                alignSelf: "center",
                width: width * 0.3,
                height: 120,
                alignItems: "center",
                marginTop: 10,
                marginRight: 10,
                opacity:
                  user.user_accounts.total_distance >= item.distance ? 1 : 0.3,
              }}
            >
              <Image
                source={item.imageURL}
                style={{ width: 70, height: 70, resizeMode: "contain" }}
              />

              <Text
                style={{
                  fontFamily: "Prompt-Regular",
                  fontSize: 11,
                  color: "#000",
                }}
              >
                {item.name}
              </Text>
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
