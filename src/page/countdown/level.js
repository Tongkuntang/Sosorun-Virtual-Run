import React, { useEffect, useRef, useState } from "react";
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
import { useRecoilState, useRecoilValue } from "recoil";
import { getActionUser } from "../../action/actionauth";
import { getAllbanner, getBanNer } from "../../action/actionbanner";
import { autolize_Lv, nextautolize_Lv } from "../../json/utils";
import {
  lans,
  LvState,
  tokenState,
  userState,
} from "../../reducer/reducer/reducer/Atom";
import Carousel from "react-native-snap-carousel";
import { apiservice } from "../../service/service";
const { width, height } = Dimensions.get("window");
export default function level() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useRecoilState(tokenState);
  const carouselRef = useRef();
  const [lvstate, setlvstate] = useState(null);
  const [banner, setbanner] = useState([]);
  const [banner1, setbanner1] = useState([]);
  const lan = useRecoilValue(lans);

  async function allbanner() {
    const getbanner = await getAllbanner(token);
    const page = getbanner.data[2].page;

    const getbanner1 = await getBanNer({ token, page: page });
    setbanner1(getbanner1.data[0].img_list);
  }
  useEffect(() => {
    allbanner();
  }, [token]);
  useEffect(() => {
    getUser();
  }, []);

  async function uplevel(users) {
    const d_arr = [
      10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150, 160,
      170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300,
    ];

    const response = await apiservice({
      path: "/event/getchackrank",
      method: "get",
      token: token.accessToken,
    });

    if (response.status == 200) {
      const lv = autolize_Lv(parseInt(users.user_accounts.total_distance)).lv;

      const checl_list = d_arr?.map((e) => {
        if (e < lv) {
          if (
            response.data.data?.filter((el) => {
              return (
                el?.mission_List?.request_ranking == e &&
                el?.total_distance <= el?.last_distance
              );
            })?.length > 0
          ) {
            return {
              lv: e,
              status: true,
            };
          } else {
            return {
              lv: e,
              status: false,
            };
          }
        }
      });

      for (
        let index = 0;
        index < checl_list?.filter((e) => e).length;
        index++
      ) {
        const data = checl_list?.filter((e) => e);
        if (data?.[index]?.status == false) {
          setlvstate(data?.[index]?.lv);
          return;
        }
      }
    }
  }

  async function getUser() {
    const useracc = await getActionUser(token);

    setUser(useracc.data);
    uplevel(useracc.data);
  }

  if (user == null) {
    return <View />;
  }

  return (
    <View>
      <View style={styles.view}>
        <View>
          <Text style={styles.textlv}>
            Lv
            <Text style={styles.text}>
              {
                autolize_Lv(
                  parseInt(
                    lvstate
                      ? parseInt(lvstate * 2000) - 2000
                      : parseInt(user.user_accounts.total_distance)
                  )
                ).lv
              }
            </Text>
          </Text>
          <Text style={styles.textrank}>
            {lan == "en" ? "Rank" : "ระดับ"} :{" "}
            {
              autolize_Lv(
                parseInt(
                  lvstate
                    ? parseInt(lvstate * 2000) - 2000
                    : parseInt(user.user_accounts.total_distance)
                )
              ).rank
            }{" "}
            Class
          </Text>
        </View>
        <Image
          // resizeMode={"stretch"}
          source={
            autolize_Lv(
              parseInt(
                lvstate
                  ? parseInt(lvstate * 2000) - 2000
                  : parseInt(user.user_accounts.total_distance)
              )
            ).grid
          }
          style={{ width: 90, height: 98 }}
        />
      </View>
      <View style={styles.linelevel}>
        <View
          style={[
            styles.linelevelrank,
            {
              width:
                width *
                ((parseInt(user.user_accounts.total_distance) /
                  nextautolize_Lv(parseInt(user.user_accounts.total_distance))
                    .exp) *
                  0.93),
            },
          ]}
        />
      </View>
      <View style={{ paddingHorizontal: 15, marginTop: 5 }}>
        <Text style={styles.textpoint}>
          {(parseInt(user.user_accounts.total_distance) / 1000).toFixed(2)}/
          {nextautolize_Lv(parseInt(user.user_accounts.total_distance)).exp /
            1000}{" "}
          {lan == "en" ? "km" : "กม."}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  textlv: {
    fontFamily: "Prompt-Regular",
    fontSize: 50,
    color: "#FCC81D",
    marginRight: 10,
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 50,
    color: "#393939",
  },
  textrank: {
    fontFamily: "Prompt-Regular",
    fontSize: 33,
    color: "#393939",
  },
  linelevel: {
    width: width * 0.93,
    height: 5,
    backgroundColor: "#000000",
    marginTop: 30,
    marginHorizontal: 10,
    alignSelf: "center",
  },
  linelevelrank: {
    width: width * 0.4,
    height: 4.5,
    backgroundColor: "#F8CA36",
    alignSelf: "flex-start",
  },
  textpoint: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#393939",
  },
  imgsup: {
    width: width,
    height: height * 0.2,
    marginTop: 20,
  },
});
