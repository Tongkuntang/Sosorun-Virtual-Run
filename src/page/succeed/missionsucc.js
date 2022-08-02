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
  Modal,
  FlatList,
  ScrollView,
  Share,
  BackHandler,
} from "react-native";
import {
  FontAwesome5,
  Fontisto,
  FontAwesome,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Headerdetail from "../components/headerdetail";
import { LinearGradient } from "expo-linear-gradient";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { getresultsrunning, getsucceed } from "../../action/actionhistrory";
import { getAllbanner, getBanNer } from "../../action/actionbanner";
import Carousel from "react-native-snap-carousel";
import { actionEditwal } from "../../action/actionauth";
import ViewShot from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import * as ImageManipulator from "expo-image-manipulator";
import { useIsFocused } from "@react-navigation/core";
import { timeformet } from "../components/test";
const { width, height } = Dimensions.get("window");
export default function missionsucc({ navigation, route }) {
  const viewShot = useRef();
  const [modal, setModal] = useState(false);
  const [state, setstate] = useState(false);
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);
  const [story, setstory] = useState({});
  const focus = useIsFocused();

  async function history() {
    const gethistory = await getsucceed(token);
    console.log("gethistory", gethistory);
    if (gethistory.status == 200) {
      setstory(gethistory.data.data[0]);
    }
  }
  const carouselRef = useRef();
  const [banner, setbanner] = useState([]);
  const [banner1, setbanner1] = useState([]);

  async function allbanner() {
    const getbanner = await getAllbanner(token);
    const page = getbanner.data[0].page;
    setbanner(getbanner.data);
    const getbanner1 = await getBanNer({ token, page: "pageevent" });
    setbanner1(getbanner1.data[0].img_list);
  }
  const onShare = async () => {
    try {
      viewShot.current.capture().then(async (uri) => {
        const response = await ImageManipulator.manipulateAsync(uri, [], {
          base64: true,
        });
        const shareOptions = {
          title: "Share file",
          url: "data:image/png;base64," + response.base64, // places a base64 image here our your file path
          failOnCancel: false,
        };
        if (Platform.OS == "ios") {
          Share.share({
            url: uri,
          });
          // setBorder(true);
        } else {
          const ShareResponse = await Sharing.shareAsync(uri, shareOptions);
          // setBorder(true);
        }
      });
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    history();
    allbanner();
  }, [token, focus]);

  useEffect(() => {
    const backAction = () => {
      setVisible(!visible);
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
  }, []);

  if (story.reward_Info == undefined) {
    return <View />;
  }

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <Headerdetail
          goBack={() => {
            navigation.navigate("Event");
          }}
          item={story.event_name}
          navigation={navigation}
        />
        <Modal
          animationType="none"
          transparent={true}
          visible={modal}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModal(!modal);
          }}
        >
          <View style={styles.containermodal}>
            <LinearGradient
              colors={["#FCC81D", "#EFD98F", "#EEE6CB", "#C29709"]}
              style={styles.backgroundmodal}
            >
              {state ? (
                <View>
                  <Text style={styles.textcat1}>รางวัลที่ได้รับ</Text>

                  <View
                    style={{
                      flexDirection: "row",
                      alignSelf: "center",
                      width: width * 0.5,
                      justifyContent: "space-between",
                      marginTop: 10,
                    }}
                  >
                    {story.reward_Info != undefined && (
                      <Image
                        source={{
                          uri:
                            "https://api.sosorun.com/api/imaged/get/" +
                            story?.reward_Info?.shirtList?.toString(),
                        }}
                        style={{ width: 60, height: 60, alignSelf: "center" }}
                      />
                    )}
                    <Image
                      source={{
                        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group2835.png",
                      }}
                      style={{ width: 54, height: 49, alignSelf: "center" }}
                    />
                    <Image
                      source={{
                        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
                      }}
                      style={{ width: 54, height: 54, alignSelf: "center" }}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={async () => {
                      // const response = await actionEditwal({
                      //   body: {
                      //     gold: story?.reward_Info?.coin || 0,
                      //   },
                      //   token,
                      // });
                      setModal(!modal);
                      navigation.navigate("Event");
                    }}
                    style={styles.touchmodal}
                  >
                    <Text style={styles.go}>OK</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <View style={styles.viewheader}>
                    {user.image_Profile == null ? (
                      <Image
                        style={styles.imgpro}
                        source={{
                          uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/userprofice.png",
                        }}
                      />
                    ) : (
                      <Image
                        style={styles.imgpro}
                        source={{
                          uri:
                            "https://api.sosorun.com/api/imaged/get/" +
                            user.image_Profile,
                        }}
                      />
                    )}
                    <View style={{ marginLeft: 10 }}>
                      <View style={styles.viewicon}>
                        <FontAwesome5 name="user-alt" size={20} color="#000" />
                        {user.name == null ? (
                          <Text style={styles.textna}>{user.username}</Text>
                        ) : (
                          <Text style={styles.textna}>{user.name}</Text>
                        )}
                      </View>
                      <View style={styles.viewicon}>
                        <FontAwesome5
                          name="map-marker-alt"
                          size={20}
                          color="#000"
                        />

                        <Text style={styles.textaddress}>
                          {user.full_address.district},
                          {user.full_address.province}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Text style={styles.textcat}>{story.event_name}</Text>
                  <Image
                    style={styles.imgcat}
                    source={{
                      uri:
                        "https://api.sosorun.com/api/imaged/get/" +
                        (route?.params?.dataEV?.mission_List?.Achievement ||
                          route?.params?.dataEV?.Achievement),
                    }}
                  />
                  <Text style={styles.textpit}>ขอแสดงความยินดี</Text>
                  <Text style={styles.textcom}>
                    คุณได้ทำภารกิจสำเร็จเรียบร้อยแล้ว
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setstate(true);
                    }}
                    style={styles.touchmodal}
                  >
                    <Text style={styles.go}>ยืนยัน</Text>
                  </TouchableOpacity>
                </View>
              )}
            </LinearGradient>
          </View>
        </Modal>

        <View
          style={{ width: width, height: height, backgroundColor: "#FBC71C" }}
        >
          <Text style={styles.texttime}>
            {timeformet(Math.floor(story.running_Time / 3600))} :{" "}
            {timeformet(Math.floor((story.running_Time % 3600) / 60))} :{" "}
            {timeformet(Math.floor((story.running_Time % 3600) % 60))}{" "}
          </Text>
          <View style={styles.viewtext}>
            <View style={styles.viewsmall}>
              <Text style={styles.text1}>ระยะทางทั้งหมด</Text>
              <Text style={styles.text2}>
                {(story.total_distance / 1000).toFixed(2)} กม.
              </Text>
            </View>
            <View style={styles.viewsmall}>
              <Text style={styles.text1}>ระยะทางที่ทำได้</Text>
              <Text style={styles.text2}>
                {(story.last_distance / 1000).toFixed(2)} กม.
              </Text>
            </View>
            <View style={styles.viewsmall}>
              <Text style={styles.text1}>ระดับความสำเร็จ</Text>
              <Text style={styles.text2}>
                {(
                  (story.last_distance / 1000 / (story.total_distance / 1000)) *
                  100
                ).toFixed(2)}{" "}
                %
              </Text>
            </View>
          </View>
          <View style={styles.view}>
            <Text style={styles.text3}>
              {"    "}ความเร็วเฉลี่ย{" "}
              {((story.total_distance / story.running_Time) * 3.6).toFixed(2)}{" "}
              กม. / ชม.
            </Text>
          </View>

          <TouchableOpacity onPress={onShare} style={[styles.bottompause]}>
            <Text style={styles.textpause}>แชร์</Text>
          </TouchableOpacity>
          <TouchableOpacity
            // disabled
            onPress={() => setModal(true)}
            style={[styles.bottompause]}
          >
            <Text style={styles.textpause}>ความสำเร็จ</Text>
          </TouchableOpacity>
          <Carousel
            ref={carouselRef}
            data={banner1}
            sliderWidth={Dimensions.get("window").width}
            itemWidth={Math.round(width * 1)}
            autoplay
            loop
            inactiveSlideScale={1}
            renderItem={({ item, index }) => {
              // console.log("129", item);
              return (
                <View>
                  <Image
                    style={{
                      width: width,
                      height: height * 0.24,
                      marginTop: 20,
                    }}
                    source={{
                      uri: "https://api.sosorun.com/api/imaged/get/" + item,
                    }}
                    // style={{ backgroundColor: "red" }}
                    // style={{ marginLeft: -width * 0.22, marginTop: -width * 0.2 }}
                  />
                </View>
              );
            }}
          />
        </View>
      </View>
      <ViewShot
        ref={(ref) => (viewShot.current = ref)}
        options={{ format: "png", quality: 0.9 }}
        style={styles.containermodal}
      >
        <LinearGradient
          colors={["#FCC81D", "#EFD98F", "#EEE6CB", "#C29709"]}
          style={[styles.backgroundmodal, { width: width }]}
        >
          <View>
            <View style={styles.viewheader}>
              {user.image_Profile == null ? (
                <Image
                  style={styles.imgpro}
                  source={{
                    uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/userprofice.png",
                  }}
                />
              ) : (
                <Image
                  style={styles.imgpro}
                  source={{
                    uri:
                      "https://api.sosorun.com/api/imaged/get/" +
                      user.image_Profile,
                  }}
                />
              )}
              <View style={{ marginLeft: 10 }}>
                <View style={styles.viewicon}>
                  <FontAwesome5 name="user-alt" size={20} color="#000" />
                  {user.name == null ? (
                    <Text style={styles.textna}>{user.username}</Text>
                  ) : (
                    <Text style={styles.textna}>{user.name}</Text>
                  )}
                </View>
                <View style={styles.viewicon}>
                  <FontAwesome5 name="map-marker-alt" size={20} color="#000" />
                  <Text style={styles.textaddress}>
                    {user.full_address.district},{user.full_address.province}
                  </Text>
                </View>
              </View>
            </View>
            <Text style={styles.textcat}>{story.event_name}</Text>
            <Image
              style={styles.imgcat}
              source={{
                uri:
                  "https://api.sosorun.com/api/imaged/get/" +
                  (route?.params?.dataEV?.mission_List?.Achievement ||
                    route?.params?.dataEV?.Achievement),
              }}
            />
            <Text style={styles.textpit}>ขอแสดงความยินดี</Text>
            <Text style={styles.textcom}>
              คุณได้ทำภารกิจสำเร็จเรียบร้อยแล้ว
            </Text>
          </View>
        </LinearGradient>
      </ViewShot>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  texttime: {
    fontFamily: "Prompt-Regular",
    fontSize: 48,
    color: "#000",
    alignSelf: "center",
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
  },
  text3: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
  },
  styletouch: {
    width: 126,
    height: 28,
    backgroundColor: "#fff",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
  },
  viewtext: {
    flexDirection: "row",
    width: width,
    paddingHorizontal: 10,
    justifyContent: "space-between",
    marginVertical: 15,
  },
  viewsmall: {
    width: width * 0.28,
    alignSelf: "center",
    justifyContent: "space-between",
    height: height * 0.1,
  },
  text1: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
    alignSelf: "center",
  },
  text2: {
    fontFamily: "Prompt-Regular",
    fontSize: 18,
    color: "#000",
    alignSelf: "center",
  },
  bottompause: {
    width: width * 0.98,
    height: 55,
    backgroundColor: "#393939",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  textpause: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#fff",
    alignSelf: "center",
  },
  containermodal: {
    width: width,
    height: height,
    backgroundColor: "#000000bb",
    justifyContent: "center",
  },
  backgroundmodal: {
    width: width * 0.9,
    alignSelf: "center",
    padding: 20,
    justifyContent: "space-between",
    borderRadius: 10,
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewheader: {
    flexDirection: "row",

    width: width * 0.5,
  },
  imgpro: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf: "center",
    marginHorizontal: 5,
  },
  viewicon: {
    flexDirection: "row",
    textAlign: "center",
    margin: 3,
  },
  textname: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    marginLeft: 10,
    alignSelf: "center",
  },
  textna: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    marginLeft: 5,
    alignSelf: "center",
  },
  textaddress: {
    fontFamily: "Prompt-Regular",
    fontSize: 12,
    color: "#000",
    marginLeft: 5,
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
  textcat: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    color: "#000",
    marginTop: 5,
    fontWeight: "bold",
  },
  imgcat: {
    width: width * 0.35,
    height: 160,
    alignSelf: "center",
    marginVertical: 30,
  },
  textpit: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    color: "#000",
    marginTop: 5,
    alignSelf: "center",
    fontWeight: "bold",
  },
  textcom: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    color: "#000",
    marginTop: 5,
    alignSelf: "center",
    marginBottom: 15,
  },
  textcat1: {
    fontFamily: "Prompt-Regular",
    fontSize: 32,
    color: "#000",
    marginTop: 5,
    fontWeight: "bold",
    alignSelf: "center",
  },
  imgcat1: {
    width: width * 0.85,
    height: 100,
    alignSelf: "center",
    marginVertical: 20,
  },
  viewprice: {
    flexDirection: "row",
    paddingHorizontal: 50,
    justifyContent: "space-between",
    width: width,
    height: height * 0.15,
  },
  touch: {
    justifyContent: "center",
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
