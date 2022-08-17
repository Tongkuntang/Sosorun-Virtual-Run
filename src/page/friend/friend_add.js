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
  ImageBackground,
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
import HeaderFree from "../components/headerfree";
import MainModal from "./component/modal";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { useIsFocused } from "@react-navigation/native";
import { apiservice } from "../../service/service";

const { width, height } = Dimensions.get("window");
export default function friend({ navigation }) {
  // หน้าค้นหาเพื่อน !!!
  const focus = useIsFocused();
  const [token, setToken] = useRecoilState(tokenState);
  const [search, setsearch] = useState("");
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useRecoilState(userState);
  const [data, setData] = useState([]);
  const [selectdata, setselectData] = useState("");
  // console.log("53", selectdata);
  const ID = parseInt(selectdata) - 100000;
  // console.log("55", ID);
  async function apiSearch(selectdata) {
    const response = await apiservice({
      path: "/friend/searchfriend/" + ID,
      method: "get",
      token: token.accessToken,
    });

    setsearch(selectdata);
    setData(response.data.data[0]);
    if (response.status == 200) {
      setVisible(!visible);
      navigation.navigate("ProfileUser", { response });
    }
  }

  useEffect(() => {
    const backAction = () => {
      setVisible(!visible);
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <HeaderFree navigation={navigation} />
        <Modal
          style={{ flex: 1, backgroundColor: "transparent" }}
          transparent={true}
          visible={visible}
          navigation={navigation}
          onRequestClose={() => {
            setVisible(!visible);
          }}
        >
          <View
            style={{
              width: width,
              height: height,
              backgroundColor: "#000000bb",
              alignItems: "center",
              alignSelf: "center",
              justifyContent: "center",
            }}
          >
            <ImageBackground
              source={{
                uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/bg.png",
              }}
              style={{
                width: width * 0.9,
                alignSelf: "center",
                borderRadius: 10,
                height: 350,
              }}
            >
              <Image
                source={{
                  uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/logo_sosorun.png",
                }}
                style={{
                  width: 250,
                  height: 50,
                  resizeMode: "contain",
                  alignSelf: "center",
                  justifyContent: "center",
                  marginTop: 20,
                }}
              />
              <Text
                style={{
                  fontFamily: "Prompt-Regular",
                  fontSize: 16,
                  color: "#393939",
                  alignSelf: "flex-end",
                  marginRight: 10,
                  marginTop: 10,
                }}
              >
                YOUR ID CODE
              </Text>
              <Text
                style={{
                  fontFamily: "Prompt-Regular",
                  fontSize: 16,
                  color: "#000000",
                  alignSelf: "flex-end",
                  marginRight: 10,
                  marginTop: 10,
                }}
              >
                {100000 + parseInt(user.id)}
              </Text>
              <View
                style={{
                  width: width * 0.5,
                  height: 40,
                  alignSelf: "center",
                  backgroundColor: "#FFFFFF",
                  borderRadius: 5,
                  marginTop: 20,
                  borderWidth: 1,
                  borderColor: "#393939",
                }}
              >
                <TextInput
                  style={{
                    width: width * 0.5,
                    height: 40,
                    justifyContent: "center",
                    borderRadius: 5,
                    fontSize: 14,
                    fontFamily: "Prompt-Regular",
                    color: "#A1949A",
                    justifyContent: "center",
                  }}
                  maxLength={6}
                  keyboardType={"number-pad"}
                  placeholder="ID CODE"
                  onChangeText={(text) => setselectData(text)}
                  defaultValue={search}
                  textAlign={"center"}
                />
                {/* <TouchableOpacity
                  onPress={() => {
                    navigation.navigate();
                  }}
                  style={{ alignSelf: "center" }}
                ></TouchableOpacity> */}
              </View>

              <TouchableOpacity
                onPress={async () => {
                  apiSearch(selectdata);
                }}
                style={{
                  alignSelf: "center",
                  backgroundColor: "#393939",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 100,
                  height: 50,
                  marginTop: 40,
                  borderRadius: 3,
                }}
              >
                <Text
                  style={{
                    fontFamily: "Prompt-Regular",
                    fontSize: 16,
                    color: "#FFFFFF",
                  }}
                >
                  ค้นหา
                </Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        </Modal>

        <Text
          style={{
            fontFamily: "Prompt-Regular",
            fontSize: 20,
            color: "#393939",
            marginLeft: 15,
            marginTop: 10,
          }}
        >
          ADD FRIEND
        </Text>
        <TouchableOpacity
          style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}
        >
          <Image
            source={{
              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/fb.png",
            }}
            style={{
              width: 50,
              height: 50,
              resizeMode: "contain",
              marginRight: 20,
              alignSelf: "center",
            }}
          />
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 16,
              color: "#393939",
              alignSelf: "center",
            }}
          >
            Add Facebook friend (cooming soon)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setVisible((val) => !val)}
          style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}
        >
          <Image
            source={{
              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/id.png",
            }}
            style={{
              width: 50,
              height: 50,
              resizeMode: "contain",
              marginRight: 20,
              alignSelf: "center",
            }}
          />
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 16,
              color: "#393939",
              alignSelf: "center",
            }}
          >
            Add ID Code running
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: "row", marginTop: 10, marginLeft: 10 }}
        >
          <Image
            source={{
              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/qr.png",
            }}
            style={{
              width: 50,
              height: 50,
              resizeMode: "contain",
              marginRight: 20,
              alignSelf: "center",
            }}
          />
          <Text
            style={{
              fontFamily: "Prompt-Regular",
              fontSize: 16,
              color: "#393939",
              alignSelf: "center",
            }}
          >
            Scan QR code (cooming soon)
          </Text>
        </TouchableOpacity>
        {/* <Text
          style={{
            fontFamily: "Prompt-Regular",
            fontSize: 16,
            color: "#393939",
            marginLeft: 15,
            marginTop: 10,
          }}
        >
          RECOMMEND
        </Text>
        <View>
          <FlatList
            data={DATA}
            style={{ backgroundColor: "white", width: width }}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => setVisible((val) => !val)}
                  style={{
                    width: width,
                    height: 80,
                    marginTop: 10,
                    paddingHorizontal: 10,
                    alignSelf: "center",
                    backgroundColor: "#FFFFFF",
                    justifyContent: "center",
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Image
                      source={item.imageURL}
                      style={{
                        width: 50,
                        height: 50,
                        alignSelf: "center",
                        justifyContent: "center",
                      }}
                    />

                    <View
                      style={{
                        marginLeft: 10,
                        alignSelf: "center",
                        width: width * 0.8,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          fontFamily: "Prompt-Regular",
                          color: "#434343",
                        }}
                      >
                        {item.title}
                      </Text>

                      <Text
                        style={{
                          fontFamily: "Prompt-Regular",
                          fontSize: 14,
                          color: "#434343",
                        }}
                      >
                        BKK,Thailand
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }}
          /> */}
        {/* </View> */}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
