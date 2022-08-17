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
import { getLV } from "../../action/actionLV";
import { autolize_Lv } from "../../json/utils";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
const { width, height } = Dimensions.get("window");
export default function point({ item, onPress }) {
  const [user, setUser] = useRecoilState(userState);

  if (autolize_Lv(parseInt(user.user_accounts.total_distance)).lv >= item.lv) {
    return (
      <View>
        <TouchableOpacity onPress={onPress} style={styles.view}>
          <View style={styles.viewtap}>
            <Text style={styles.textlv}>LV {item.lv}</Text>
            <Text style={styles.text}>
              คุณได้เลื่อนระดับสำเร็จแล้ว กดที่เหรียญเพื่อรับรางวัล
            </Text>
          </View>
          <TouchableOpacity onPress={onPress} style={styles.touch}>
            <Image
              source={{
                uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
              }}
              style={styles.img}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  } else {
    return <View></View>;
  }
}
const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.8,
    paddingHorizontal: width * 0.1,
  },
  viewtap: {
    width: width * 0.8,
    height: 45,
    backgroundColor: "#393939",
    borderRadius: 6,
    alignSelf: "center",
    marginTop: 10,
    paddingLeft: 20,
  },
  textlv: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    color: "#fff",
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 10,
    color: "#fff",
  },
  touch: {
    zIndex: 99,
    marginLeft: -40,
    justifyContent: "center",
    marginTop: 5,
  },
  img: {
    width: 65,
    height: 65,
    alignSelf: "center",
  },
});
