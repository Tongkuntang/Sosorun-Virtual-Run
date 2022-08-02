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
  BackHandler,
  KeyboardAvoidingView,
  TextInput,
  Alert,
} from "react-native";
import Headerdetail from "../components/headerdetail";
import Input from "./input";
import { FontAwesome } from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import WebView from "react-native-webview";
import { apiservice } from "../../service/service";
import { logPushNotificationOpenAsync, setUserIDAsync } from "expo-facebook";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import { KeyboardAvoidingScrollView } from "react-native-keyboard-avoiding-scroll-view";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { actionEditprofile, getActionUser } from "../../action/actionauth";
import { updatebib } from "../../action/actionbib";
import { useIsFocused } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
const AddressThailand = require("../../address/address_thailand.json");
const { width, height } = Dimensions.get("window");
export default function index({ navigation, route }) {
  const dataEV = route.params.dataEV;
  const price = route.params.price;
  const [BIB, setBIB] = useState(route.params.BIB);
  const premium = route.params.premium;
  const [dot1, setdot1] = useState(null);
  const [dot2, setdot2] = useState(null);
  const [dot, setdot] = useState(true);
  const [id, setId] = useState(0);
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);
  const full = user.user_accounts.storage.full_add;
  const le = user.user_accounts.storage.full_add.length;
  const [address1, setaddress1] = useState(true);
  const [modalVisible, setmodalVisible] = useState(false);
  const [vat, setvat] = useState(false);
  const [modalVisible2, setmodalVisible2] = useState(false);
  const [num, setnum] = useState(0);
  const [address, setaddress] = useState(null);
  const [open, setOpen] = useState([]);
  console.log(user);
  const [state2, setstate2] = useState(user.user_accounts.full_address);
  const [state3, setstate3] = useState(user.user_accounts.full_address);
  const focus = useIsFocused();
  const charec = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "o",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
  ];

  function formatBib(params) {
    if (params.length == 4) {
      return params;
    } else if (params.length == 3) {
      return "0" + params;
    } else if (params.length == 2) {
      return "00" + params;
    } else if (params.length == 1) {
      return "000" + params;
    }
  }

  async function postbib_event(params, numb) {
    const check = await apiservice({
      path: "/event/postbib_event",
      method: "post",
      body: {
        event_id: dataEV.id,
        bib: premium
          ? formatBib(parseInt(params).toString())
          : formatBib((parseInt(params) + 1).toString()),
        number: params + 1,
        char: premium ? charec[numb + 1] : BIB[0],
      },
      token: token.accessToken,
    });

    if (check.status == 200) {
      const resposne = await apiservice({
        path: "/event/postjoinEvent",
        method: "post",
        body: {
          event_id: dataEV.id,
          img_event: dataEV.img_title,
          event_name: dataEV.titel,
          Type: "EVENT",
          uid: user.id,
          total_distance: dataEV.distance[0] * 1000,
          last_distance: 0,
          reward_Info: dataEV.reward,
          fullAddress: state2,
          fullAddress_vat: state3,
          chack_vat: vat,
          tracking: "",
          bib:
            (premium ? charec[numb + 1] : BIB[0]) +
            (premium
              ? formatBib(parseInt(params).toString())
              : formatBib((parseInt(params) + 1).toString())),
          biburl: premium ? dataEV.img_bibPremium : dataEV.img_bibbasic,
          pay_status: route.params.totalssprice,
          VIP_Status: route.params.premium,
        },
        token: token.accessToken,
      });

      if (resposne.status == 200) {
        const upbib = await updatebib({
          body1: { event_id: dataEV.id },
          token,
        });
        setBIB(
          (premium ? charec[numb + 1] : BIB[0]) +
            (premium
              ? formatBib(parseInt(params).toString())
              : formatBib((parseInt(params) + 1).toString()))
        );
        setId(resposne.data.data.id);
        setmodalVisible2(false);
        setmodalVisible(true);
      } else {
        postbib_event(
          premium
            ? formatBib(parseInt(params).toString())
            : formatBib((parseInt(params) + 1).toString()),
          parseInt(numb) + 1
        );
      }
    } else {
      postbib_event(
        premium
          ? formatBib(parseInt(params).toString())
          : formatBib((parseInt(params) + 1).toString()),
        parseInt(numb) + 1
      );
    }
  }
  console.log("distance", dataEV.distance);
  async function onNavigationStateChange(params) {
    if (params.url.includes("chillpay/postpayment_result")) {
      if (num == 0) {
        setnum({ num: num + 1 });
        const check = await apiservice({
          path: "/event/postbib_event",
          method: "post",
          body: {
            event_id: dataEV.id,
            bib: BIB.replace(BIB[0], ""),
            number: parseInt(BIB.replace(BIB[0], "")),
            char: BIB[0],
          },
          token: token.accessToken,
        });

        if (check.status == 200) {
          const resposne = await apiservice({
            path: "/event/postjoinEvent",
            method: "post",
            body: {
              event_id: dataEV.id,
              img_event: dataEV.img_title,
              event_name: dataEV.titel,
              Type: "EVENT",
              uid: user.id,
              total_distance: dataEV.distance * 1000,
              last_distance: 0,
              reward_Info: dataEV.reward,
              fullAddress: state2,
              fullAddress_vat: state3,
              chack_vat: vat,
              tracking: "",
              bib: BIB,
              biburl: premium ? dataEV.img_bibPremium : dataEV.img_bibbasic,
              pay_status: route.params.totalssprice,
              VIP_Status: route.params.premium,
            },
            token: token.accessToken,
          });

          if (resposne.status == 200) {
            const upbib = await updatebib({
              body1: { event_id: dataEV.id },
              token,
            });
            setId(resposne.data.data.id);
            setmodalVisible2(false);
            setmodalVisible(true);
          } else {
            postbib_event(parseInt(BIB.replace(BIB[0], "")), 0);
          }
        } else {
          postbib_event(parseInt(BIB.replace(BIB[0], "")), 0);
        }
      }
    }
  }

  const [body, setbody] = useState({
    ShippingAddress: "",
    province: "",
    district: "",
    postcode: "",
    subDistrict: "",
    name: "",
    telnum: "",
  });

  const placeholder3 = {
    label: "",
    value: null,
    color: "#777777",
  };
  async function getAddress(text) {
    if (text.length == 5) {
      let matchItems = AddressThailand.filter((address) => {
        const regex = new RegExp(`^${text}`, "gi");

        return address.zipcode.toString().includes(text);
      });

      if (matchItems.length > 50) {
        matchItems = [];
      } else if (matchItems.length < 50 && matchItems.length > 0) {
        setbody((val) => ({
          ...val,
          province: matchItems[0].province,
          district: matchItems[0].amphoe,
          postcode: matchItems[0].zipcode,
        }));

        setaddress(matchItems[0]);
        setOpen(
          matchItems.map((val) => ({ label: val.label, value: val.label }))
        );
      }
    }
  }

  async function onInputChange(text) {
    const dada = await getAddress(text);
  }

  useEffect(() => {
    getAddress();
  }, []);

  useEffect(() => {
    usesss();
  }, [focus]);

  useEffect(() => {
    console.log("เข้านะ");
    setstate2(user.full_address);
  }, [user]);

  async function usesss() {
    const getuser = await getActionUser(token);
    setUser(getuser.data);
  }

  useEffect(() => {
    const backAction = () => {};
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <KeyboardAwareScrollView>
        <View
          style={{
            marginTop: Platform.OS === "ios" ? 0 : 0,
          }}
        >
          <Headerdetail item={dataEV.titel} navigation={navigation} />
          <ScrollView>
            <Modal
              animationType="none"
              transparent={true}
              visible={modalVisible2}
              onRequestClose={() => {
                setmodalVisible2(!modalVisible2);
              }}
            >
              <SafeAreaView />
              <WebView
                source={{
                  // uri: url,
                  html: `<!DOCTYPE html>
                <html>
                <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Payment Demo</title>
                </head>
                <body>
                <form id="payment-form" action="https://sandbox-cdnv3.chillpay.co/Payment/" method="post" role="form" class="form-horizontal">
                <modernpay:widget id="modernpay-widget-container" 
                data-merchantid="M032746" data-amount="${route.params.price}00" data-orderno="00000001" data-customerid="123456" 
                data-mobileno="0889999999" data-clientip="183.89.110.23" data-routeno="1" data-currency="764" 
                data-description="Sosorun Payment" data-apikey="4wSW26BJzRMQbNRAlosseuin4FooeUNEtk4Fd6bjubedQ7X8rZgIKezL09MSWcaO">
                </modernpay:widget>
                <button type="submit" id="btnSubmit" value="Submit" class="btn">Payment</button>
                </form>
                <script async src="https://sandbox-cdnv3.chillpay.co/js/widgets.js?v=1.00" charset="utf-8"></script>
                </body>
                </html>,`,
                }}
                onNavigationStateChange={onNavigationStateChange}
                startInLoadingState
                scalesPageToFit
                javaScriptEnabled
                style={{ flex: 1 }}
              />
            </Modal>
            <Modal
              animationType="none"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setmodalVisible(!modalVisible);
              }}
            >
              <View style={styles.containermodal}>
                <View style={styles.viewmodal}>
                  <View style={styles.rediusbig}>
                    <View style={styles.rediusmid}>
                      <View style={styles.rediussmall}>
                        <Image
                          source={{
                            uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Path12.png",
                          }}
                          style={styles.imgredius}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.viewtext}>
                    <Text style={styles.textmpdal}>
                      Payment Process is done successfully
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setmodalVisible(!modalVisible);
                      navigation.navigate("PayStart", {
                        dataEV,
                        price,
                        BIB,
                        premium,
                        id,
                      });
                    }}
                    style={{ alignSelf: "center" }}
                  >
                    <Text style={styles.textconti}>Continue</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
            {address1 ? (
              <View style={styles.background}>
                <View style={styles.view}>
                  <Text style={styles.textaddess}>เลือกที่อยู่ในการจัดส่ง</Text>
                  <TouchableOpacity
                    onPress={() => setaddress1(false)}
                    // style={styles.touchput}
                  >
                    <Text style={styles.textput}>+ เพิ่มที่อยู่</Text>
                  </TouchableOpacity>
                </View>
                {user.full_address.ShippingAddress == null ? (
                  <Text></Text>
                ) : (
                  <View style={styles.viewaddess}>
                    <View style={styles.viewin}>
                      <View style={styles.viewsmall}>
                        {dot !== true ? (
                          <TouchableOpacity
                            onPress={() => {
                              setstate2(user.full_address);
                              setdot(true);
                              setdot1(null);
                            }}
                          >
                            <FontAwesome
                              name="circle-o"
                              size={24}
                              color="black"
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            onPress={() => {
                              setdot(false);
                              setdot1(null);
                            }}
                          >
                            <Image
                              source={{
                                uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/dot.png",
                              }}
                              style={{ width: 20, height: 20 }}
                            />
                          </TouchableOpacity>
                        )}
                        <View style={{ marginLeft: 10 }}>
                          <Text style={styles.textdetailaddess}>
                            {user.name}
                          </Text>
                          <Text style={styles.textdetailaddess}>
                            {user.full_address.ShippingAddress}{" "}
                            {user.full_address.district}{" "}
                            {user.full_address.subDistrict}{" "}
                            {user.full_address.province}{" "}
                            {user.full_address.postcode}
                          </Text>
                          <Text style={styles.textdetailaddess}>
                            {user.tel}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate("EditAddra", { dataEV });
                        }}
                      >
                        <Text style={styles.textdetailaddess}>แก้ไข</Text>
                      </TouchableOpacity>
                    </View>
                    {dot !== true ? (
                      <View />
                    ) : (
                      <TouchableOpacity style={styles.touch}>
                        <Text style={styles.texttouch}>ที่อยู่ในการจัดส่ง</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                <View>
                  <FlatList
                    data={full}
                    renderItem={({ item, index }) => {
                      return (
                        <View style={styles.viewaddess}>
                          <View style={styles.viewin}>
                            <View style={styles.viewsmall}>
                              {dot1 != index ? (
                                <TouchableOpacity
                                  onPress={() => {
                                    setdot1(index);
                                    setdot(false);
                                    setstate2(item);
                                  }}
                                >
                                  <FontAwesome
                                    name="circle-o"
                                    size={24}
                                    color="black"
                                  />
                                </TouchableOpacity>
                              ) : (
                                <TouchableOpacity
                                  onPress={() => {
                                    setdot1(null);
                                    setstate2(user.user_accounts.full_address);
                                  }}
                                >
                                  <Image
                                    source={{
                                      uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/dot.png",
                                    }}
                                    style={{ width: 20, height: 20 }}
                                  />
                                </TouchableOpacity>
                              )}
                              <View style={{ marginLeft: 10 }}>
                                <Text style={styles.textdetailaddess}>
                                  {item.name}
                                </Text>
                                <Text style={styles.textdetailaddess}>
                                  {item.ShippingAddress} {item.district}{" "}
                                  {item.subDistrict} {item.province}{" "}
                                  {item.postcode}
                                </Text>
                                <Text style={styles.textdetailaddess}>
                                  {item.telnum}
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              onPress={() => {
                                navigation.navigate("EditAdd", {
                                  item,
                                  index,
                                  full,
                                  dataEV,
                                });
                              }}
                            >
                              <Text style={styles.textdetailaddess}>แก้ไข</Text>
                            </TouchableOpacity>
                          </View>
                          {dot1 != index ? (
                            <View />
                          ) : (
                            <TouchableOpacity style={styles.touch}>
                              <Text style={styles.texttouch}>
                                ที่อยู่ในการจัดส่ง
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      );
                    }}
                  />
                </View>
                <View style={styles.view}>
                  <TouchableOpacity
                    onPress={() => setvat((val) => !val)}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Image
                      resizeMode="contain"
                      style={{ width: 25, height: 25, marginRight: 10 }}
                      source={
                        vat
                          ? require("../../img/radio-on-button.png")
                          : require("../../img/rec.png")
                      }
                    />
                    <Text style={styles.textaddess}>ใบกำกับภาษี</Text>
                  </TouchableOpacity>
                </View>
                {vat && (
                  <View>
                    <TextInput
                      placeholder="เลขที่ใบกำกับ"
                      defaultValue={state3?.text}
                      onChangeText={(text) =>
                        setstate3((val) => ({ ...val, text }))
                      }
                      style={{
                        width: width * 0.9,
                        backgroundColor: "#fff",
                        alignSelf: "center",
                        height: 40,
                        paddingHorizontal: 15,
                      }}
                    />
                    <FlatList
                      data={full}
                      renderItem={({ item, index }) => {
                        return (
                          <View style={styles.viewaddess}>
                            <View style={styles.viewin}>
                              <View style={styles.viewsmall}>
                                {dot2 != index ? (
                                  <TouchableOpacity
                                    onPress={() => {
                                      setdot2(index);
                                      setstate3((val) => ({ ...val, ...item }));
                                    }}
                                  >
                                    <FontAwesome
                                      name="circle-o"
                                      size={24}
                                      color="black"
                                    />
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    onPress={() => {
                                      setdot2(null);
                                      setstate3((val) => ({
                                        ...val,
                                        ...full?.[0],
                                      }));
                                    }}
                                  >
                                    <Image
                                      source={{
                                        uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/dot.png",
                                      }}
                                      style={{ width: 20, height: 20 }}
                                    />
                                  </TouchableOpacity>
                                )}
                                <View style={{ marginLeft: 10 }}>
                                  <Text style={styles.textdetailaddess}>
                                    {item.name}
                                  </Text>
                                  <Text style={styles.textdetailaddess}>
                                    {item.ShippingAddress} {item.district}{" "}
                                    {item.subDistrict} {item.province}{" "}
                                    {item.postcode}
                                  </Text>
                                  <Text style={styles.textdetailaddess}>
                                    {item.telnum}
                                  </Text>
                                </View>
                              </View>
                              <TouchableOpacity
                                onPress={() => {
                                  navigation.navigate("EditAdd", {
                                    item,
                                    index,
                                    full,
                                    dataEV,
                                  });
                                }}
                              >
                                <Text style={styles.textdetailaddess}>
                                  แก้ไข
                                </Text>
                              </TouchableOpacity>
                            </View>
                            {dot1 != index ? (
                              <View />
                            ) : (
                              <TouchableOpacity style={styles.touch}>
                                <Text style={styles.texttouch}>
                                  ที่อยู่ในการจัดส่ง
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      }}
                    />
                  </View>
                )}
                <TouchableOpacity
                  disabled={!state2}
                  onPress={async () => {
                    if (route.params.totalssprice == 0) {
                      if (num == 0) {
                        setnum({ num: num + 1 });
                        const check = await apiservice({
                          path: "/event/postbib_event",
                          method: "post",
                          body: {
                            event_id: dataEV.id,
                            bib: BIB.replace(BIB[0], ""),
                            number: parseInt(BIB.replace(BIB[0], "")),
                            char: BIB[0],
                          },
                          token: token.accessToken,
                        });

                        if (check.status == 200) {
                          const resposne = await apiservice({
                            path: "/event/postjoinEvent",
                            method: "post",
                            body: {
                              event_id: dataEV.id,
                              img_event: dataEV.img_title,
                              event_name: dataEV.titel,
                              Type: "EVENT",
                              uid: user.id,
                              total_distance: dataEV.distance[0] * 1000,
                              last_distance: 0,
                              reward_Info: dataEV.reward,
                              fullAddress: state2,
                              fullAddress_vat: state3,
                              chack_vat: vat,
                              tracking: "",
                              bib: BIB,
                              biburl: premium
                                ? dataEV.img_bibPremium
                                : dataEV.img_bibbasic,
                              pay_status: route.params.totalssprice,
                              VIP_Status: route.params.premium,
                            },
                            token: token.accessToken,
                          });

                          if (resposne.status == 200) {
                            const upbib = await updatebib({
                              body1: { event_id: dataEV.id },
                              token,
                            });
                            setId(resposne.data.data.id);
                            setmodalVisible2(false);
                            setmodalVisible(true);
                          } else {
                            postbib_event(parseInt(BIB.replace(BIB[0], "")), 0);
                          }
                        } else {
                          postbib_event(parseInt(BIB.replace(BIB[0], "")), 0);
                        }
                      }
                    } else {
                      setmodalVisible2(true);
                    }
                  }}
                  style={styles.touchtrue}
                >
                  <Text style={styles.texttrue}>ตกลง</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.background, { height: height }]}>
                <View style={styles.view}>
                  <Text style={styles.textaddess}>เลือกที่อยู่ในการจัดส่ง</Text>

                  <TouchableOpacity
                    onPress={async () => {
                      if (body.name.length == 0) {
                        Alert.alert("กรุณาใส่ชื่อ");
                        return;
                      }
                      if (body.telnum.length == 0) {
                        Alert.alert("กรุณาใส่เบอร์โทร");
                        return;
                      }

                      let full_address = {
                        ShippingAddress: body.ShippingAddress,
                        province: address.province,
                        district: address.amphoe,
                        postcode: address.zipcode,
                        subDistrict: body.subDistrict,
                        name: body.name,
                        telnum: body.telnum,
                      };
                      const response = await actionEditprofile({
                        body: {
                          storage: {
                            ...user.user_accounts.storage,
                            full_add:
                              user.user_accounts.storage.full_add.concat(
                                full_address
                              ),
                          },
                          id: user.id,
                        },
                        token,
                      });
                      if (response.status == 200) {
                        const getuser = await getActionUser(token);
                        setUser(getuser.data);
                      }
                      setaddress1(true);
                    }}
                    style={[styles.touchput, { marginLeft: 70 }]}
                  >
                    <Text style={styles.textput}>ยืนยัน</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      setaddress1(true);
                    }}
                    style={styles.touchput}
                  >
                    <Text style={styles.textput}>ยกเลิก</Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.textadd}>ชื่อ นามสกุล</Text>
                <Input
                  onChangeText={(text) => {
                    setbody({ ...body, name: text });
                  }}
                  defaultValue={body.name}
                  placeholder=" "
                />
                <Text style={styles.textadd}>ที่อยู่</Text>
                <Input
                  onChangeText={(text) => {
                    setbody({ ...body, ShippingAddress: text });
                  }}
                  defaultValue={body.ShippingAddress}
                  placeholder=" "
                />
                <Text style={styles.textadd}>รหัสไปรษณีย์</Text>
                <Input
                  maxLength={5}
                  onChangeText={onInputChange}
                  defaultValue={body.postcode.toString()}
                  placeholder=" "
                />
                <Text style={styles.textadd}>จังหวัด</Text>
                <View
                  style={{
                    width: width * 0.9,
                    height: 50,
                    paddingLeft: 10,
                    backgroundColor: "#fff",
                    alignSelf: "center",
                    marginVertical: 10,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        fontFamily: "Prompt-Regular",
                        color: "#393939",
                        marginTop: 5,
                      },
                    ]}
                  >
                    {address != null && address.province}
                  </Text>
                </View>

                <Text style={styles.textadd}>อำเภอ</Text>
                <View
                  style={{
                    width: width * 0.9,
                    height: 50,
                    paddingLeft: 10,
                    backgroundColor: "#fff",
                    alignSelf: "center",
                    marginVertical: 10,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={[
                      styles.text,
                      {
                        fontFamily: "Prompt-Regular",
                        color: "#393939",
                        marginTop: 5,
                      },
                    ]}
                  >
                    {address != null && address.amphoe}
                  </Text>
                </View>
                <Text style={styles.textadd}>ตำบล</Text>
                {Platform.OS === "ios" ? (
                  <RNPickerSelect
                    placeholder={placeholder3}
                    onValueChange={(selectSubDistrict) => {
                      setbody({
                        ...body,
                        subDistrict: selectSubDistrict,
                      });
                    }}
                    value={body.subDistrict}
                    style={{
                      inputIOS: {
                        width: width * 0.9,
                        height: 50,
                        paddingLeft: 10,
                        backgroundColor: "#fff",
                        alignSelf: "center",
                        marginTop: 10,
                        color: "#000",
                      },
                    }}
                    Icon={() => {
                      return (
                        <AntDesign
                          name="caretdown"
                          size={15}
                          color="black"
                          style={{ marginLeft: -50, marginTop: 25 }}
                        />
                      );
                    }}
                    items={open}
                  />
                ) : (
                  <RNPickerSelect
                    placeholder={placeholder3}
                    onValueChange={(selectSubDistrict) => {
                      setbody({
                        ...body,
                        subDistrict: selectSubDistrict,
                      });
                    }}
                    value={body.subDistrict}
                    style={{
                      inputAndroid: {
                        width: width * 0.9,
                        height: 50,
                        paddingLeft: 10,
                        backgroundColor: "#fff",
                        alignSelf: "center",
                        marginTop: 10,
                        color: "#000",
                      },
                    }}
                    Icon={() => {
                      return (
                        <AntDesign
                          name="caretdown"
                          size={15}
                          color="black"
                          style={{ marginLeft: -50, marginTop: 25 }}
                        />
                      );
                    }}
                    items={open}
                  />
                )}

                <Text style={styles.textadd}>เบอร์โทรศัพท์</Text>
                <Input
                  maxLength={10}
                  defaultValue={body.telnum}
                  onChangeText={(text) => {
                    setbody({ ...body, telnum: text });
                  }}
                  placeholder=" "
                />
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
  },
  background: {
    width: width,
    // height: height,
    backgroundColor: "#FBC71C",
  },
  view: {
    width: width,
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingHorizontal: 20,
  },
  viewin: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  viewsmall: {
    width: width * 0.7,
    flexDirection: "row",
    // justifyContent: "space-between",
  },
  textaddess: {
    fontFamily: "Prompt-Regular",
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
    marginVertical: 10,
  },
  textccard: {
    fontFamily: "Prompt-Regular",
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
  },
  textput: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    borderBottomWidth: 0.5,
    borderBottomColor: "#00000050",
    marginVertical: 10,
  },
  viewaddess: {
    width: width * 0.9,
    height: height * 0.15,
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 10,
  },
  viewpay: {
    width: width * 0.9,
    height: height * 0.22,
    alignSelf: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
    justifyContent: "space-between",
  },
  textdetailaddess: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#757575",
  },
  texttouch: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#fff",
    alignSelf: "center",
  },
  touch: {
    width: 105,
    height: 30,
    backgroundColor: "#393939",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "flex-end",
    // marginTop: -15,
    position: "absolute",
    bottom: 10,
    right: 10,
  },
  touchtrue: {
    width: width * 0.9,
    height: 48,
    borderRadius: 5,
    backgroundColor: "#393939",
    alignSelf: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: height * 0.15,
  },
  texttrue: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#fff",
    fontWeight: "500",
    alignSelf: "center",
  },
  containermodal: {
    flex: 1,
    backgroundColor: "#000000bb",
    justifyContent: "center",
  },
  viewmodal: {
    alignSelf: "center",
    justifyContent: "center",
  },
  rediusbig: {
    width: 156,
    height: 156,
    backgroundColor: "#FCC81D19",
    borderRadius: 78,
    alignSelf: "center",
    justifyContent: "center",
  },
  rediusmid: {
    width: 140,
    height: 140,
    backgroundColor: "#FCC81D35",
    borderRadius: 70,
    alignSelf: "center",
    justifyContent: "center",
  },
  rediussmall: {
    width: 124,
    height: 124,
    backgroundColor: "#FCC81D",
    borderRadius: 62,
    alignSelf: "center",
    justifyContent: "center",
  },
  imgredius: {
    width: 44,
    height: 36,
    alignSelf: "center",
  },
  viewtext: {
    width: width * 0.35,
    marginVertical: 20,
    alignSelf: "center",
  },
  textmpdal: {
    fontFamily: "Prompt-Regular",
    fontSize: 15,
    color: "#fff",
    textAlign: "center",
  },
  textconti: {
    fontFamily: "Prompt-Regular",
    fontSize: 17,
    color: "#FCC81D",
    borderBottomWidth: 1,
    borderBottomColor: "#FCC81D",
  },
  textadd: {
    fontFamily: "Prompt-Regular",
    fontSize: 15,
    color: "#000",
    fontWeight: "500",
    marginTop: 10,
    marginLeft: 20,
  },
});
