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
} from "react-native";
import Headerdetail from "../components/headerdetail";
import Input from "../payment/input";
import { FontAwesome } from "@expo/vector-icons";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { apiservice } from "../../service/service";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import { actionEditprofile, getActionUser } from "../../action/actionauth";
import { AntDesign } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const AddressThailand = require("../../address/address_thailand.json");
const { width, height } = Dimensions.get("window");
export default function editadd({ navigation, route }) {
  const dataEV = route.params.dataEV;
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);
  const [address, setaddress] = useState(null);
  const [open, setOpen] = useState([]);
  console.log("open0", open);
  const [state, setstate] = useState({
    ShippingAddress: user.full_address.ShippingAddress,
    subDistrict: user.full_address.subDistrict,
    province: user.full_address.province,
    district: user.full_address.district,
    postcode: user.full_address.postcode,
  });
  console.log("state", state.subDistrict);
  const [body, setbody] = useState({
    id: user.id,
    name: user.name,
    tel: user.tel,
    full_address: state,
  });
  console.log("body", body);

  const placeholder3 = {
    label: "",
    value: null,
    color: "#777777",
  };
  async function getAddress(text) {
    if (text.toString().length == 5) {
      let matchItems = AddressThailand.filter((address) => {
        const regex = new RegExp(`^${text}`, "gi");

        return address.zipcode.toString().includes(text);
      });

      if (matchItems.length > 50) {
        matchItems = [];
      }

      if (matchItems.length > 0) {
        setstate((val) => ({
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
    getAddress(user.full_address.postcode);
  }, []);
  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <SafeAreaView />
        <View
          style={{
            marginTop: Platform.OS === "ios" ? 0 : 0,
          }}
        >
          <Headerdetail item={dataEV.titel} navigation={navigation} />
          <ScrollView>
            <KeyboardAvoidingView>
              <View style={[styles.background, { height: height * 1.2 }]}>
                <View style={styles.view}>
                  <Text style={styles.textaddess}>เลือกที่อยู่ในการจัดส่ง</Text>
                  <TouchableOpacity
                    onPress={async () => {
                      let full = {
                        ...body,
                        full_address: state,
                      };
                      const response = await actionEditprofile({
                        body: full,
                        token,
                      });

                      if (response.status == 200) {
                        const getuser = await getActionUser(token);
                        setUser(getuser.data);
                        navigation.goBack();
                      }
                    }}
                    style={[styles.touchput, { marginLeft: 70 }]}
                  >
                    <Text style={styles.textput}>ยืนยัน</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={async () => {
                      navigation.goBack();
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
                    setstate({ ...state, ShippingAddress: text });
                  }}
                  defaultValue={body.full_address.ShippingAddress}
                  placeholder=" "
                />
                <Text style={styles.textadd}>รหัสไปรษณีย์</Text>
                <Input
                  maxLength={5}
                  onChangeText={onInputChange}
                  defaultValue={body.full_address.postcode.toString()}
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
                    {address != null
                      ? address.province
                      : user.full_address.province}
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
                    {address != null
                      ? address.amphoe
                      : user.full_address.district}
                  </Text>
                </View>
                <Text style={styles.textadd}>ตำบล</Text>
                {Platform.OS === "ios" ? (
                  <RNPickerSelect
                    placeholder={placeholder3}
                    onValueChange={(selectSubDistrict) => {
                      setstate({
                        ...state,
                        subDistrict: selectSubDistrict,
                      });
                    }}
                    value={body.full_address.subDistrict}
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
                      setstate({
                        ...state,
                        subDistrict: selectSubDistrict,
                      });
                    }}
                    value={body.full_address.subDistrict}
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
                  defaultValue={body.tel}
                  onChangeText={(text) => {
                    setbody({ ...body, tel: text });
                  }}
                  placeholder=" "
                />
              </View>
            </KeyboardAvoidingView>
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
    height: height,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: width * 0.9,
    height: 50,
    paddingLeft: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginTop: 10,
    color: "#000",
    zIndex: 99,
  },
  inputAndroid: {
    width: width * 0.9,
    height: 50,
    paddingLeft: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
    marginTop: 10,
    color: "#000",
    zIndex: 99,
  },
});
