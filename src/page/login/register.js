import React, { useState, useEffect } from "react";
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
  Linking,
} from "react-native";
import { actionregister, getActionUser } from "../../action/actionauth";
import Input from "./textinput";
import * as Google from "expo-google-app-auth";
import * as Facebook from "expo-facebook";
import { LinearGradient } from "expo-linear-gradient";
import * as AppleAuthentication from "expo-apple-authentication";
import { useRecoilState } from "recoil";
import {
  Authen,
  tokenState,
  userState,
} from "../../reducer/reducer/reducer/Atom";
import { apiservice } from "../../service/service";
const { width, height } = Dimensions.get("window");
export default function register({ navigation, setpage }) {
  const [token, setToken] = useRecoilState(tokenState);
  const [auth, setAuth] = useRecoilState(Authen);
  const [user, setUser] = useRecoilState(userState);
  const [modal1, setmodal1] = useState(false);
  const [modal, setmodal] = useState(false);
  const [body, setbody] = useState({
    Type: "EMAIL",
    role: "USER",
    username: "",
    password: "",
    email: "",
  });
  const [page, setPage] = useState(false);

  async function logInfacebook() {
    if (Platform.OS == "ios") {
      try {
        const { type, token } = await Facebook.logInWithReadPermissionsAsync({
          permissions: ["public_profile", "email"],
        });

        if (type === "success") {
          // Get the user's name using Facebook's Graph API
          const profile = await fetch(
            `https://graph.facebook.com/me?fields=birthday,email,name,picture&access_token=${token}`
          );
          const public_profile = await profile.json();
          console.log(public_profile);
          const response = await apiservice({
            method: "post",
            path: "/authen/facebook",
            body: {
              telephoneNo: null,
              fullname: public_profile.name,
              email: public_profile.email,
              password: public_profile.id,
              gender: null,
              birthday: null,
              username: public_profile.id,
              Type: "FACEBOOK",
            },
          });

          if (response.status == 200) {
            const getuser = await getActionUser(response.data);
            const data = getuser.data;
            if (!data?.link) {
              setmodal1(true);
              return;
            }
            if (data.height == null) {
              setmodal(true);
              setTokenvisible(response.data);
            } else {
              setAuth({
                auth: true,
              });
              setUser(data);
              setToken(response.data);
            }
          } else {
            setTimeout(() => {}, 300);
          }
        } else {
          // type === 'cancel'
        }
      } catch ({ message }) {
        alert(`Facebook Login Error: ${message}`);
      }
    } else {
      Linking.openURL("https://api.sosorun.com/api/authen/auth/facebook");
    }
  }

  async function logInApple() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const key = credential.identityToken.split(".")[1];
      setTimeout(async () => {
        // signed in
        const response = await apiservice({
          method: "post",
          path: "/authen/Apple",
          body: {
            telephoneNo: null,
            image_Profile: null,
            fullname: credential.user,
            email: credential.user,
            password: "1232131231",
            gender: null,
            birthday: null,
            username: credential.user,
            Type: "APPLE",
          },
        });
        if (response.status == 200) {
          setToken(response.data);
          setTimeout(() => {
            navigation.navigate("Home");
          }, 300);
        } else {
          setTimeout(() => {
            RBSheets.current.open();
          }, 300);
        }
      }, 300);
    } catch (e) {
      if (e.code === "ERR_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
      }
    }
  }
  const emailValid =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  function errors({ value, type }) {
    if (type == "email") {
      return emailValid.test(value);
    }
  }

  useEffect(() => {
    const onReceiveURL = async ({ url }) => {
      const re = url.split("=");

      const tokens = {
        accessToken: re[1].replace("?refreshToken", ""),
        refreshToken: re[2].replace("?role", ""),
        role: re[3].split("?sawadeeja")[0],
      };
      const getuser = await getActionUser(tokens);
      const data = getuser.data;
      if (data.height == null) {
        setmodal(true);
        setTokenvisible(tokens);
      } else {
        setAuth({
          auth: true,
        });
        setUser(data);
        setToken(tokens);
      }
    };
    Linking.addEventListener("url", onReceiveURL);
  }, []);

  return (
    <View style={styles.background}>
      <Modal
        animationType="none"
        transparent={true}
        visible={modal1}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setmodal1(!modal1);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000bb",
            justifyContent: "center",
          }}
        >
          <LinearGradient
            colors={["#FCC81D", "#EFD98F", "#EEE6CB", "#C29709"]}
            style={styles.backgroundmodal}
          >
            <Text
              style={[styles.go, { color: "#000" }, { textAlign: "center" }]}
            >
              กรุณายืนยัน EMAIL เพื่อเข้าสู่ระบบ
            </Text>

            <TouchableOpacity
              onPress={() => {
                setmodal1(!modal1);
                setTimeout(() => {
                  setpage(0);
                }, 300);
              }}
              style={styles.touchmodal}
            >
              <Text style={styles.go}>ตกลง</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
      <Modal
        animationType="none"
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setmodal(!modal);
        }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#000000bb",
            justifyContent: "center",
          }}
        >
          <LinearGradient
            colors={["#FCC81D", "#EFD98F", "#EEE6CB", "#C29709"]}
            style={styles.backgroundmodal}
          >
            <Text
              style={[styles.go, { color: "#000" }, { textAlign: "center" }]}
            >
              Username หรือ Email {"\n"} นี้มีผู้ใช้งานแล้วในระบบ
            </Text>

            <TouchableOpacity
              onPress={() => {
                setmodal(!modal);
              }}
              style={styles.touchmodal}
            >
              <Text style={styles.go}>ตกลง</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
      <View style={{ height: height * 0.3, justifyContent: "space-between" }}>
        <Input
          onChangeText={(text) => setbody({ ...body, username: text })}
          icon={"user"}
          placeholder="User name"
          autoCapitalize="none"
        />
        <Input
          onChangeText={(text) => setbody({ ...body, email: text })}
          icon={"Email"}
          placeholder="Email address"
          autoCapitalize="none"
        />
        {body.email != "" && !errors({ value: body.email, type: "email" }) && (
          <Text
            style={{
              fontFamily: "Prompt-Medium",
              color: "red",
              fontSize: 14,
              marginTop: 10,
            }}
          >
            รูปแบบของอีเมลไม่ถูกต้อง
          </Text>
        )}
        <Input
          secureTextEntry={true}
          onChangeText={(text) => setbody({ ...body, password: text })}
          icon={"lock"}
          placeholder="Password"
          autoCapitalize="none"
        />
      </View>

      <View
        onPress={async () => {
          const response = await actionregister(body);
          if (response) {
            setmodal1(!modal1);
          }
        }}
        style={[
          styles.touchlogin,
          {
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "transparent",
            justifyContent: "flex-start",
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => setPage((val) => !val)}
          style={[
            styles.touch,
            {
              backgroundColor: page ? "#FCC81D" : "#fff",
            },
          ]}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("WebView", {
              url: "http://www.sosorun.com/?page_id=107",
              title: "ยอมรับเงื่อนไขและข้อตกลง",
            });
          }}
        >
          <Text style={[styles.textlogin, { color: "#393939" }]}>
            ยอมรับเงื่อนไขและข้อตกลง
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.background1}>
        <TouchableOpacity
          onPress={async () => {
            const response = await actionregister(body);
            if (response) {
              setmodal1(!modal1);
            }
          }}
          style={styles.touchlogin}
        >
          <Text style={styles.textlogin}>สมัครสมาชิก</Text>
        </TouchableOpacity>
        <View style={styles.viewline}>
          <View style={styles.line} />
          <Text style={styles.textline}>หรือ</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.viewtouch}>
          <TouchableOpacity
            onPress={async () => {
              // First- obtain access token from Expo's Google API
              const { type, accessToken, user } = await Google.logInAsync({
                iosClientId: `634243433412-5qavjf5d8mkocnfgdt13q8lstl5086tv.apps.googleusercontent.com`,
                androidClientId: `634243433412-htpft3vdnlqa08do03va59ntcbasn5rn.apps.googleusercontent.com`,
                androidStandaloneAppClientId: `634243433412-htpft3vdnlqa08do03va59ntcbasn5rn.apps.googleusercontent.com`,
                iosStandaloneAppClientId: `634243433412-5qavjf5d8mkocnfgdt13q8lstl5086tv.apps.googleusercontent.com`,
              });
              // if (type === "success") {
              // Then you can use the Google REST API
              const response = await apiservice({
                method: "post",
                path: "/authen/Google",
                body: {
                  telephoneNo: null,
                  image_Profile: user.photoUrl,
                  fullname: user.name,
                  email: user.email,
                  password: user.id,
                  gender: null,
                  birthday: null,
                  username: user.givenName,
                  Type: "GOOGLE",
                },
              });
              if (response.status == 200) {
                setToken(response.data);
                setTimeout(() => {
                  navigation.navigate("Home");
                }, 300);
              } else {
                setTimeout(() => {
                  setValidText(
                    "EMAIL มีการใช้ลงทะเบียนในรูปแบบอื่นกรุณาเข้าสู่ระบบช่องทางอื่น"
                  );
                  RBSheets.current.open();
                }, 300);
              }
              // }
            }}
            style={styles.touchh}
          >
            <Image
              resizeMode={"stretch"}
              source={{
                uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/search.png",
              }}
              style={styles.img}
            />
          </TouchableOpacity>

          {Platform.OS == "ios" && (
            <TouchableOpacity onPress={logInApple} style={styles.touchh}>
              <Image
                resizeMode={"stretch"}
                source={{
                  uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/apple-black-logo.png",
                }}
                style={styles.img1}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity onPress={logInfacebook} style={styles.touchh}>
            <Image
              resizeMode={"stretch"}
              source={{
                uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/facebook.png",
              }}
              style={styles.img}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  background: {
    width: width,
    height: height,
    backgroundColor: "#FCC81D",
    paddingHorizontal: width * 0.1,
  },
  background1: {
    alignSelf: "center",
    marginLeft: -7,
    marginTop: 50,
    height: height * 0.25,
    justifyContent: "space-between",
  },
  touchlogin: {
    width: width * 0.8,
    height: 50,
    backgroundColor: "#393939",
    borderRadius: 10,
    justifyContent: "center",
  },
  textlogin: {
    fontFamily: "Prompt-Regular",
    color: "#fff",
    fontSize: 13,
    alignSelf: "center",
  },
  viewline: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  line: {
    width: width * 0.3,
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    opacity: 0.25,
    marginTop: 20,
  },
  textline: {
    fontFamily: "Prompt-Regular",
    color: "#393939",
    fontSize: 11,
    alignSelf: "center",
    marginBottom: -15,
  },
  viewtouch: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  touchh: {
    width: width * 0.2,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
  },
  texttouch: {
    fontFamily: "Prompt-Regular",
    color: "#393939",
    fontSize: 13,
    alignSelf: "center",
    marginLeft: 10,
  },
  img: {
    width: 27,
    height: 27,
    alignSelf: "center",
  },
  img1: {
    width: 30,
    height: 30,
    alignSelf: "center",
  },
  backgroundmodal: {
    width: width * 0.9,
    alignSelf: "center",
    marginVertical: height * 0.15,
    padding: 20,
    borderRadius: 10,
  },
  touchmodal: {
    width: width * 0.6,
    height: 48,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 20,
    backgroundColor: "#393939",
    borderRadius: 5,
  },
  go: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    color: "#fff",
    alignSelf: "center",
  },
  touch: {
    width: 26,
    height: 26,
    borderRadius: 13,
    zIndex: 99,
    borderWidth: 5,
    borderColor: "#EEEEEE",
    marginRight: 10,
  },
});
