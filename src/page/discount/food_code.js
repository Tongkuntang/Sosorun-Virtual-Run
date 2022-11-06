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
  ScrollView,
} from "react-native";
import Barcode from "@kichiyaki/react-native-barcode-generator";
import QRCode from "react-native-qrcode-generator";
import { FontAwesome5 } from "@expo/vector-icons";
import HeaderFree from "../components/headerfree";
import CountDown from "react-native-countdown-component";
import { LinearGradient } from "expo-linear-gradient";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { useIsFocused } from "@react-navigation/core";
import { getchackdatediscount } from "../../action/actiondis";
import moment from "moment";
import { apiservice } from "../../service/service";

const { width, height } = Dimensions.get("window");

export default function friend({ navigation, route }) {
  const item = route.params;
  const [modal, setModal] = useState(false);
  const [select, setelect] = useState(0);

  const [user, setUser] = useRecoilState(userState);
  const focus = useIsFocused();
  const countss = parseInt(
    parseInt(
      moment(item.code_using.click_date).add(15, "minutes").valueOf() -
        moment().utcOffset("+0000").add(7, "hour").valueOf()
    ) / 1000
  );
  console.log("::::", countss);
  const [token, settoken] = useRecoilState(tokenState);
  const [date, setdate] = useState();
  const [code, setcode] = useState();

  async function getdiscount() {
    const getall = await getchackdatediscount({ token, discount_id: item.id });
    setdate(getall);
  }

  useEffect(() => {
    getdiscount();
  }, [focus, token]);
  return (
    <View style={styles.container}>
      <SafeAreaView />
      <ScrollView
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <HeaderFree navigation={navigation} />
        <Modal
          animationType="none"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setnum(0);
            setModal(!modal);
          }}
        >
          <View
            style={{
              width: width,
              height: height,
              backgroundColor: "#000000bb",
              justifyContent: "center",
            }}
          >
            <LinearGradient
              colors={["#FCC81D", "#EFD98F", "#EEE6CB", "#C29709"]}
              style={styles.backgroundmodal}
            >
              <Text style={styles.textmodal}>code</Text>

              <Text style={[styles.textmodal1, { marginVertical: 20 }]}>
                {code != undefined && code}
              </Text>
              <TouchableOpacity
                onPress={async () => {
                  navigation.navigate("Discount");
                  // setModal(!modal);
                }}
                style={styles.touchmodal}
              >
                <Text style={styles.go}>ตกลง</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>
        <Image
          source={{
            uri: "https://api.sosorun.com/api/imaged/get/" + item.img_content,
          }}
          style={{ width: width, height: 200, alignSelf: "center" }}
        />
        {item.img_logo == null ? (
          <Image
            source={{
              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/logo.gif",
            }}
            style={{
              width: 70,
              height: 70,
              alignSelf: "center",
              marginTop: -30,
              borderRadius: 20,
            }}
          />
        ) : (
          <Image
            source={{
              uri: "https://api.sosorun.com/api/imaged/get/" + item.img_logo,
            }}
            style={{
              width: 70,
              height: 70,
              alignSelf: "center",
              marginTop: -30,
              borderRadius: 20,
            }}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <Text
            style={[
              styles.text,
              { color: "#000", fontSize: 22, alignSelf: "center" },
            ]}
          >
            {item.name}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 10,
          }}
        >
          <Text style={[styles.text, { color: "#000" }]}>
            {item.description}
          </Text>
        </View>

        <Text
          style={{
            fontFamily: "Prompt-Regular",
            fontSize: 14,
            color: "#000000",
            alignSelf: "center",
            paddingHorizontal: 10,
          }}
        >
          {item.details}
        </Text>

        <View style={styles.view}>
          <View style={{ flexDirection: "row" }}>
            <FontAwesome5 name="running" size={24} color="#5BC3FF" />
            <Text style={styles.textbold}>{user.user_accounts.wallet.cal}</Text>
          </View>
          <View style={styles.view1}>
            <Image
              source={{
                uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
              }}
              style={styles.imgpoint}
            />
            <Text style={styles.textbold}>
              {user.user_accounts.wallet.gold}
            </Text>
          </View>
        </View>
        {item.code_using.click_date == undefined ||
          (moment(item.code_using.click_date).add(15, "minutes").valueOf() <
            moment().utcOffset("+0000").add(7, "hour").valueOf() && (
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 18,
                color: "#000000",
                marginLeft: 10,
                marginVertical: 5,
              }}
            >
              เลือก POINT ที่ต้องการจะแลกสิทธิ์
            </Text>
          ))}
        {item.code_using.click_date != undefined &&
          moment(item.code_using.click_date).add(15, "minutes").valueOf() >
            moment().utcOffset("+0000").add(7, "hour").valueOf() && (
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 18,
                color: "#000000",
                marginLeft: 10,
                marginVertical: 5,
              }}
            >
              แลกสิทธิ์สำเร็จ
            </Text>
          )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
            marginVertical: 5,
          }}
        >
          {item.code_using.click_date == undefined && (
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 14,
                color: "#000000",
              }}
            >
              จำนวนที่แลกสิทธิ์ได้
            </Text>
          )}
          {item.code_using.click_date != undefined &&
            moment(item.code_using.click_date).add(15, "minutes").valueOf() >
              moment().utcOffset("+0000").add(7, "hour").valueOf() && (
              <Text
                style={{
                  fontFamily: "Prompt-Regular",
                  fontSize: 14,
                  color: "#000000",
                }}
              >
                ระยะเวลาที่เหลือก่อนจะหมดอายุ
              </Text>
            )}
          {item.code_using.click_date == undefined && (
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 14,
                color: "#000000",
              }}
            >
              1 ครั้ง
            </Text>
          )}
          {item.code_using.click_date != undefined &&
            moment(item.code_using.click_date).add(15, "minutes").valueOf() >
              moment().utcOffset("+0000").add(7, "hour").valueOf() && (
              <View style={{ top: -10 }}>
                <CountDown
                  until={
                    parseInt(
                      moment(item.code_using.click_date)
                        .add(15, "minutes")
                        .valueOf() -
                        moment().utcOffset("+0000").add(7, "hour").valueOf()
                    ) / 1000
                  }
                  running={true}
                  onFinish={() => {}}
                  size={17}
                  digitStyle={{
                    backgroundColor: "#FFF",
                  }}
                  digitTxtStyle={{
                    right: 8,
                    color: "#000",
                    fontSize: 14,
                    fontFamily: "Prompt-Regular",
                  }}
                  timeLabelStyle={{
                    position: "absolute",
                    color: "000",
                    fontWeight: "bold",
                    right: 7,
                    fontSize: 14,
                    fontFamily: "Prompt-Regular",
                  }}
                  separatorStyle={{ fontSize: 14, color: "#000" }}
                  timeToShow={["H", "M", "S"]}
                  timeLabels={{ h: "hr", m: "m", s: "s" }}
                  showSeparator
                />
              </View>
            )}
        </View>
        {item.code_using.click_date == undefined && (
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 14,
              color: "#000000",
              paddingHorizontal: 10,
            }}
          >
            (เมื่อกดแลกสิทธิ์แล้ว จะมีระยะเวลาจำกัดในการใช้)
          </Text>
        )}
        {item.code_using.click_date == undefined ||
          (moment(item.code_using.click_date).add(15, "minutes").valueOf() <
            moment().utcOffset("+0000").add(7, "hour").valueOf() && (
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 14,
                color: "#000000",
                marginLeft: 10,
                marginVertical: 5,
              }}
            >
              (เมื่อกดแลกสิทธิ์แล้ว จะมีระยะเวลาจำกัดในการใช้ 15 นาที)
            </Text>
          ))}
        {item.code_using.click_date == undefined ||
        moment(item.code_using.click_date).add(15, "minutes").valueOf() <
          moment().utcOffset("+0000").add(7, "hour").valueOf() ? (
          <View />
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 25,
              marginBottom: 25,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setelect(0);
              }}
            >
              <Text
                style={{
                  fontFamily: "Prompt-Regular",
                  fontSize: 16,
                  color: select == 0 ? "#FFC300" : "#000000",
                }}
              >
                Code
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setelect(1);
              }}
            >
              <Text
                style={{
                  fontFamily: "Prompt-Regular",
                  fontSize: 16,
                  color: select == 1 ? "#FFC300" : "#000000",
                }}
              >
                Barcode
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setelect(2);
              }}
            >
              <Text
                style={{
                  fontFamily: "Prompt-Regular",
                  fontSize: 16,
                  color: select == 2 ? "#FFC300" : "#000000",
                }}
              >
                Qrcode
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {item.code_using.click_date == undefined ||
        moment(item.code_using.click_date).add(15, "minutes").valueOf() <
          moment().utcOffset("+0000").add(7, "hour").valueOf() ? (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 10,
              marginTop: 20,
              marginBottom: 20,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: 100,
                  height: 34.8,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "#FBC71C",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    alignItems: "center",
                    marginRight: 10,
                  }}
                >
                  <FontAwesome5
                    name="running"
                    size={24}
                    color="#5BC3FF"
                    style={{ alignSelf: "center" }}
                  />
                  <Text style={styles.textbold1}>{item.condition.cal}</Text>
                </View>
              </View>
              <View
                style={{
                  width: 100,
                  height: 34.8,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: "#FBC71C",
                  justifyContent: "center",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignSelf: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={{
                      uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
                    }}
                    style={styles.imgpoint2}
                  />
                  <Text style={styles.textbold1}>{item.condition.gold}</Text>
                </View>
              </View>
            </View>

            {parseInt(user.user_accounts.wallet.gold) >=
              parseInt(item.condition.gold) &&
            parseInt(user.user_accounts.wallet.cal) >=
              parseInt(item.condition.cal) &&
            parseInt(user.user_accounts.wallet.daimond || 0) >=
              parseInt(item.condition.daimond || 0) ? (
              <TouchableOpacity
                disabled={
                  item.code_using.click_date != undefined &&
                  moment(item.code_using.click_date).add(1, "days").valueOf() >
                    moment().utcOffset("+0000").add(7, "hour").valueOf()
                }
                onPress={async () => {
                  const response = await apiservice({
                    method: "get",
                    path:
                      "/freepoint/getcodeBydiscount_id/" +
                      item.id +
                      "?click_date=" +
                      Date(Date.now()),
                    token: token.accessToken,
                  });
                  if (response.status == 200) {
                    setcode(response.data.code);
                  }
                  const responses = await apiservice({
                    method: "put",
                    path: "/user/update_wallet",
                    body: {
                      gold: item.condition.gold,
                      daimond: item.condition.daimond,
                      cal: item.condition.cal,
                    },
                    token: token.accessToken,
                  });

                  setModal(true);
                }}
                style={{
                  width: 120,
                  height: 30,
                  justifyContent: "center",
                  backgroundColor: "#393939",
                  borderRadius: 5,
                  opacity:
                    item.code_using.click_date != undefined &&
                    moment(item.code_using.click_date)
                      .add(1, "days")
                      .valueOf() >
                      moment().utcOffset("+0000").add(7, "hour").valueOf()
                      ? 0.3
                      : 1,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Prompt-Regular",
                    fontSize: 13,
                    color: "#FBC71C",
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  แลก
                </Text>
              </TouchableOpacity>
            ) : (
              <View
                style={{
                  width: 120,
                  height: 30,
                  justifyContent: "center",
                  backgroundColor: "#39393950",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Prompt-Regular",
                    fontSize: 13,
                    color: "#fffc",
                    fontWeight: "bold",
                    alignSelf: "center",
                  }}
                >
                  แลก
                </Text>
              </View>
            )}
            {/* )} */}
          </View>
        ) : select == 0 ? (
          <View
            style={{
              alignSelf: "center",
              borderWidth: 1,
              borderRadius: 50,
              width: width * 0.5,
              alignItems: "center",
              paddingVertical: 5,
              borderColor: "#FFC300",
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 16,
                color: "#000000",
              }}
            >
              {item.code_using.code}
            </Text>
          </View>
        ) : select == 1 ? (
          <View
            style={{
              alignSelf: "center",
              borderWidth: 0,
              borderRadius: 50,
              width: width * 0.5,
              alignItems: "center",
              paddingVertical: 5,
              borderColor: "#FFC300",
            }}
          >
            <Barcode
              format="CODE39"
              value={item.code_using.code}
              text={item.code_using.code}
              style={{ marginBottom: 40 }}
              maxWidth={Dimensions.get("window").width / 2}
            />
          </View>
        ) : (
          <View
            style={{
              alignSelf: "center",
              borderWidth: 0,
              borderRadius: 50,
              width: width * 0.5,
              alignItems: "center",
              paddingVertical: 5,
              borderColor: "#FFC300",
            }}
          >
            <QRCode
              value={item.code_using.code}
              size={200}
              bgColor="black"
              fgColor="white"
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000000",
    paddingHorizontal: 10,
  },
  imgpoint2: {
    width: 30,
    height: 30,
    alignSelf: "center",
  },
  textbold1: {
    fontFamily: "Prompt-Regular",
    fontSize: 18,
    color: "#000",
    fontWeight: "bold",
    marginLeft: 10,
  },
  view: {
    flexDirection: "row",

    margin: 10,
  },
  view1: {
    flexDirection: "row",
    marginHorizontal: 20,
  },
  imgpoint: {
    width: 30,
    height: 30,
  },

  textbold: {
    fontFamily: "Prompt-Regular",
    fontSize: 22,
    color: "#000",
    fontWeight: "bold",
    marginLeft: 10,
  },
  backgroundmodal: {
    width: width * 0.9,
    alignSelf: "center",
    padding: 20,
    justifyContent: "space-between",
    borderRadius: 10,
  },
  imgmodal: {
    width: 222,
    height: 222,
    alignSelf: "center",
    marginVertical: 10,
  },
  touchmodal: {
    width: width * 0.6,
    height: 48,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 10,
    backgroundColor: "#393939",
    borderRadius: 5,
  },
  go: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#fff",
    alignSelf: "center",
  },
  textmodal: {
    fontFamily: "Prompt-Regular",
    fontSize: 48,
    color: "#000",
    alignSelf: "center",
    fontWeight: "800",
  },
  textmodal1: {
    fontFamily: "Prompt-Regular",
    fontSize: 32,
    color: "#000",
    alignSelf: "center",
    fontWeight: "800",
  },
});
