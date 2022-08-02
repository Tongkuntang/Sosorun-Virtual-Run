import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Platform,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Header from "../components/header";
import { Ionicons } from "@expo/vector-icons";
import Input from "./input";
import { DelImg, pickImage } from "../../action/actionImg";
import { useRecoilState, useRecoilValue } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { actionEditprofile, getActionUser } from "../../action/actionauth";
import { useIsFocused } from "@react-navigation/core";
import RNPickerSelect, { defaultStyles } from "react-native-picker-select";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const AddressThailand = require("../../address/address_thailand.json");

const { width, height } = Dimensions.get("window");
export default function index({ navigation }) {
  const token = useRecoilValue(tokenState);
  const isFocus = useIsFocused();
  const [user, setUser] = useRecoilState(userState);
  const [body, setbody] = useState({
    id: user.id,
    image_Profile: "",
    email: user.email,
    name: null,
    height: null,
    weight: null,
    tel: null,
    full_address: {},
    friends: null,
  });
  const [state, setstate] = useState({
    ShippingAddress: user.full_address.ShippingAddress,
    subDistrict: user.full_address.subDistrict,
  });
  const [address, setaddress] = useState(null);
  const [open, setOpen] = useState([]);

  useEffect(() => {
    getUser();
  }, [isFocus]);

  async function getUser() {
    const resonse = await getActionUser(token);
    if (resonse) {
      setUser(resonse.data);

      setbody({
        ...resonse.data,
        full_address:
          resonse.data.full_address != null ? resonse.data.full_address : {},
      });
    }
  }

  async function PickImg() {
    const response = await pickImage();
    setbody({ ...body, image_Profile: response.imageRefId });
  }

  if (user == null) {
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator color="#fff" />
      </View>
    );
  }
  const placeholder3 = {
    label: "ตำบล",
    value: null,
    color: "#777777",
  };
  async function getAddress(text) {
    let matchItems = AddressThailand.filter((address) => {
      const regex = new RegExp(`^${text}`, "gi");
      // console.log("<<<<<<<<<<<<<>>>>>>", address.zipcode);
      return address.zipcode.toString().includes(text);
    });

    if (matchItems.length > 50) {
      matchItems = [];
    }

    if (matchItems.length > 0) {
      setaddress(matchItems[0]);
      setOpen(
        matchItems.map((val) => ({ label: val.label, value: val.label }))
      );
    }
  }

  async function onInputChange(text) {
    const dada = await getAddress(text);
  }

  useEffect(() => {
    getAddress(user.full_address.postcode);
  }, []);

  return (
    <View style={styles.contalner}>
      <SafeAreaView />
      <KeyboardAwareScrollView
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
          flex: 1,
        }}
      >
        <Header onPress={() => navigation.goBack()} navigation={navigation} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          // style={{ marginBottom: 30 }}
        >
          <TouchableOpacity
            onPress={() => PickImg()}
            style={styles.viewproflie}
          >
            {body.image_Profile ? (
              <View>
                <Image
                  style={styles.img}
                  source={{
                    uri:
                      "https://api.sosorun.com/api/imaged/get/" +
                      body.image_Profile,
                  }}
                />
              </View>
            ) : (
              <Image
                style={styles.img}
                source={{
                  uri:
                    "https://api.sosorun.com/api/imaged/get/" +
                    body.image_Profile,
                }}
              />
            )}

            <Ionicons
              name="md-camera"
              size={24}
              color="black"
              style={styles.icon}
            />
          </TouchableOpacity>
          <View style={styles.margin}>
            <Text style={styles.text}>Name</Text>
            <Input
              defaultValue={body.name}
              onChangeText={(text) => setbody({ ...body, name: text })}
              placeholder="name"
            />
          </View>
          <View style={styles.margin}>
            <Text
              onChangeText={(text) => setbody({ ...body, height: text })}
              style={styles.text}
            >
              Height
            </Text>
            <Input
              maxLength={3}
              defaultValue={body.height}
              onChangeText={(text) => setbody({ ...body, height: text })}
              placeholder="000"
            />
          </View>
          <View style={styles.margin}>
            <Text style={styles.text}>Weight</Text>
            <Input
              maxLength={3}
              defaultValue={body.weight}
              onChangeText={(text) => setbody({ ...body, weight: text })}
              placeholder="00"
            />
          </View>
          <View style={styles.margin}>
            <Text style={styles.text}>Tel</Text>
            <Input
              maxLength={10}
              defaultValue={body.tel}
              onChangeText={(text) => setbody({ ...body, tel: text })}
              placeholder="023456789"
            />
          </View>
          <View style={styles.margin}>
            <Text style={styles.text}>Shipping Address</Text>
            <Input
              defaultValue={user.full_address.ShippingAddress}
              onChangeText={(text) =>
                setstate({
                  ...state,
                  ShippingAddress: text,
                })
              }
              placeholder="1 ม. 2"
            />
          </View>
          <View style={styles.margin}>
            <Text style={styles.text}>Postal Code</Text>
            <Input
              defaultValue={
                user.full_address.postcode != undefined
                  ? user.full_address.postcode.toString()
                  : ""
              }
              maxLength={5}
              onChangeText={onInputChange}
              placeholder="10000"
            />
          </View>
          <View style={styles.margin}>
            <Text style={styles.text}>Province</Text>

            <View
              style={{
                width: width * 0.8,
                height: 33,
                borderBottomWidth: 1,
                borderBottomColor: "#D1D1D1",
              }}
            >
              <Text style={[styles.text, { color: "#000000", marginTop: 5 }]}>
                {address != null
                  ? address.province
                  : user.full_address.province}
              </Text>
            </View>
          </View>
          <View style={styles.margin}>
            <Text style={styles.text}>District</Text>
            <View
              style={{
                width: width * 0.8,
                height: 33,
                borderBottomWidth: 1,
                borderBottomColor: "#D1D1D1",
              }}
            >
              <Text style={[styles.text, { color: "#000000", marginTop: 5 }]}>
                {address != null ? address.amphoe : user.full_address.district}
              </Text>
            </View>
          </View>
          <View style={styles.margin}>
            <Text style={styles.text}>subDistrict</Text>
            <RNPickerSelect
              value={state.subDistrict}
              placeholder={placeholder3}
              textInputProps={{ style: { fontFamily: "Prompt-Regular" } }}
              onValueChange={(selectSubDistrict) => {
                setstate({
                  ...state,
                  subDistrict: selectSubDistrict,
                });
              }}
              style={{
                inputAndroid: {
                  width: width * 0.8,
                  height: 33,
                  borderBottomWidth: 1,
                  borderBottomColor: "#00000060",
                  color: "#000000",
                  fontFamily: "Prompt-Regular",
                  alignSelf: "center",
                  paddingTop: 10,
                  zIndex: 999,
                  marginBottom: 10,
                },
              }}
              items={open}
            />
          </View>
          <TouchableOpacity
            onPress={async () => {
              const response = await actionEditprofile({
                body: {
                  ...body,
                  full_address: {
                    ShippingAddress: state.ShippingAddress,
                    province: address.province,
                    district: address.amphoe,
                    postcode: address.zipcode,
                    subDistrict: state.subDistrict,
                  },
                },
                token,
              });

              if (response.status == 200) {
                const getuser = await getActionUser(token);
                setUser(getuser.data);
                setTimeout(() => {
                  navigation.navigate("Account");
                }, 500);
              }
            }}
            style={styles.viewsave}
          >
            <Text style={styles.textsave}>SAVE</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAwareScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  contalner: {
    width: width,
    height: height,
  },
  viewproflie: {
    width: width * 0.2,
    height: height * 0.2,
    alignSelf: "center",
    marginTop: 10,
    justifyContent: "center",
  },
  img: {
    width: 101,
    height: 101,
    alignSelf: "center",
    borderRadius: 50.5,
  },
  icon: {
    alignSelf: "flex-end",
    marginTop: -20,
    zIndex: 999,
    marginRight: -10,
  },
  text: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
  },
  margin: {
    paddingHorizontal: width * 0.1,
    marginTop: 10,
    position: "relative",
  },
  viewsave: {
    width: width * 0.8,
    height: 55,
    alignSelf: "center",
    marginTop: 20,
    backgroundColor: "#FCC81D",
    borderRadius: 5,
    justifyContent: "center",
    marginBottom: 40,
  },
  textsave: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#000",
    fontWeight: "bold",
    alignSelf: "center",
  },
});
