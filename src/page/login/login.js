import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Platform,
  Linking,
} from "react-native";
import { requestMultiple, PERMISSIONS } from "react-native-permissions";
import GoogleFit, { Scopes } from "react-native-google-fit";
import {
  actionEditprofile,
  authActionLogin,
  getActionUser,
} from "../../action/actionauth";
import Input from "./textinput";
import { useRecoilState } from "recoil";
import {
  Authen,
  tokenState,
  userState,
} from "../../reducer/reducer/reducer/Atom";
import * as Facebook from "expo-facebook";
import * as Google from "expo-google-app-auth";
import * as AppleAuthentication from "expo-apple-authentication";
import { LinearGradient } from "expo-linear-gradient";
import { apiservice } from "../../service/service";
import { set } from "react-native-reanimated";
const { width, height } = Dimensions.get("window");

export default function register({ navigation, lan }) {
  const [token, setToken] = useRecoilState(tokenState);
  const [tokenvisible, setTokenvisible] = useState(null);
  const [ValidText, setValidText] = useState("");
  const [modal, setmodal] = useState(false);
  const [modal1, setmodal1] = useState(false);
  const [auth, setAuth] = useRecoilState(Authen);
  const [user, setUser] = useRecoilState(userState);
  const [email, setemail] = useState();
  const [body1, setbody1] = useState({
    username: "",
    password: "",
  });

  const [body, setbody] = useState({
    id: "",
    height: null,
    weight: null,
  });

  useEffect(() => {
    callapi();
  }, []);

  async function callapi() {
    await Facebook.initializeAsync({
      appId: "4546397128744940",
    });
    await Facebook.logOutAsync();
  }

  async function login() {
    if (body1.username.length > 0 && body1.password.length > 0) {
      const Login = await authActionLogin(body1);
      setemail(Login);
      const getuser = await getActionUser(Login);
      const data = getuser.data;

      if (Login.link == null) {
        setmodal1(true);
      } else if (data.height == null) {
        setmodal(true);
        setTokenvisible(Login);
      } else {
        setAuth({
          auth: true,
        });
        setUser(data);
        setToken(Login);
      }
    }
  }

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

  useEffect(() => {
    if (Platform.OS == "android") {
      requestMultiple([
        PERMISSIONS.ANDROID.ACTIVITY_RECOGNITION,
        PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.RECORD_AUDIO,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ]).then((statuses) => {});
      const options = {
        scopes: [
          Scopes.FITNESS_ACTIVITY_READ,
          Scopes.FITNESS_ACTIVITY_WRITE,
          Scopes.FITNESS_BODY_READ,
          Scopes.FITNESS_BODY_WRITE,
          Scopes.FITNESS_LOCATION_WRITE,
          Scopes.FITNESS_LOCATION_READ,
        ],
      };

      GoogleFit.authorize(options).then((authResult) => {
        GoogleFit.startRecording((callback) => {
          console.log(callback);
        });
      });
    } else {
      requestMultiple([
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        PERMISSIONS.IOS.MOTION,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        PERMISSIONS.IOS.CAMERA,
      ]).then((statuses) => {});
    }
  }, []);

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
            username: "apple" + credential.user.split(".")[0],
            Type: "APPLE",
          },
        });
        // console.log(response);
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
          setTimeout(() => {
            // RBSheets.current.open();
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

  return (
    <View style={styles.background}>
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
            <Text style={[styles.go, { color: "#000" }]}>
              {lan == "en"
                ? "Please fill out the information for accurate calculations. "
                : "กรุณากรอกข้อมูลเพื่อความแม่นยำในการคำนวณ"}
            </Text>
            <TextInput
              keyboardType={"number-pad"}
              placeholder={lan == "en" ? "weight" : "นํ้าหนัก"}
              onChangeText={(text) => setbody({ ...body, weight: text })}
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              keyboardType={"number-pad"}
              placeholder={lan == "en" ? "height" : "ส่วนสูง"}
              onChangeText={(text) => setbody({ ...body, height: text })}
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              placeholder={lan == "en" ? "gender" : "เพศ"}
              onChangeText={(text) => setbody({ ...body, gender: text })}
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              placeholder={lan == "en" ? "age" : "อายุ"}
              onChangeText={(text) => setbody({ ...body, birthday: text })}
              style={styles.input}
              autoCapitalize="none"
            />
            <TouchableOpacity
              disabled={
                body.height == null ||
                body.weight == null ||
                body.weight == "" ||
                body.weight == ""
              }
              onPress={async () => {
                const getuser = await getActionUser(tokenvisible);
                let ID = { ...body, id: getuser.id };
                const response = await actionEditprofile({
                  body: ID,
                  token: tokenvisible,
                });

                if (response.status == 200) {
                  setmodal(!modal);
                  setTimeout(() => {
                    setToken(tokenvisible);
                  }, 500);
                }
              }}
              style={
                body.height == null ||
                body.weight == null ||
                body.weight == "" ||
                body.weight == ""
                  ? styles.touchdismodal
                  : styles.touchmodal
              }
            >
              <Text style={styles.go}>{lan == "en" ? "Ok" : "ตกลง"}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
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
              {lan == "en"
                ? "Please verify your email"
                : "กรุณายืนยัน EMAIL เพื่อเข้าสู่ระบบ"}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setmodal1(!modal1);
              }}
              style={styles.touchmodal}
            >
              <Text style={styles.go}>{lan == "en" ? "Ok" : "ตกลง"}</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
      <View style={{ height: height * 0.3 }}>
        <Input
          onChangeText={(text) => setbody1({ ...body1, username: text })}
          icon={"user"}
          placeholder={lan == "en" ? "Username" : "บัญชีผู้ใช้"}
          autoCapitalize="none"
        />
        <Input
          onChangeText={(text) => setbody1({ ...body1, password: text })}
          icon={"lock"}
          placeholder={lan == "en" ? "Password" : "รหัสผ่าน"}
          autoCapitalize="none"
          secureTextEntry
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Forget");
          }}
          style={{
            height: 35,
            justifyContent: "center",
            alignItems: "flex-end",
            alignSelf: "flex-end",
          }}
        >
          <Text style={[styles.textlogin, { color: "#000" }]}>
            {lan == "en" ? "Forget password?" : "ลืมรหัสผ่าน?"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.background1}>
        <TouchableOpacity onPress={login} style={styles.touchlogin}>
          <Text style={styles.textlogin}>
            {lan == "en" ? "Sign in" : "เข้าสู่ระบบ"}
          </Text>
        </TouchableOpacity>
        <View style={styles.viewline}>
          <View style={styles.line} />
          <Text style={styles.textline}>{lan == "en" ? "Or" : "หรือ"}</Text>
          <View style={styles.line} />
        </View>
        <View style={styles.viewtouch}>
          <TouchableOpacity
            onPress={async () => {
              if (Platform.OS == "ios") {
                // First- obtain access token from Expo's Google API
                const { type, accessToken, user } = await Google.logInAsync({
                  iosClientId: `197447765241-90budiq3gj15ujn2vnf0m3u09meq4h02.apps.googleusercontent.com`,
                  androidClientId: `634243433412-htpft3vdnlqa08do03va59ntcbasn5rn.apps.googleusercontent.com`,
                  androidStandaloneAppClientId: `634243433412-htpft3vdnlqa08do03va59ntcbasn5rn.apps.googleusercontent.com`,
                  iosStandaloneAppClientId: `197447765241-90budiq3gj15ujn2vnf0m3u09meq4h02.apps.googleusercontent.com`,
                });
                // if (type === "success") {
                // Then you can use the Google REST API
                const response = await apiservice({
                  method: "post",
                  path: "/authen/Google",
                  body: {
                    telephoneNo: null,
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
                  setTimeout(() => {
                    setValidText(
                      "EMAIL มีการใช้ลงทะเบียนในรูปแบบอื่นกรุณาเข้าสู่ระบบช่องทางอื่น"
                    );
                    // RBSheets.current.open();
                  }, 300);
                }
              } else {
                Linking.openURL("https://api.sosorun.com/api/authen/gg");
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
  touchdismodal: {
    width: width * 0.6,
    height: 48,
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 20,
    backgroundColor: "#393939",
    borderRadius: 5,
    opacity: 0.3,
  },
  go: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    color: "#fff",
    alignSelf: "center",
  },
  input: {
    width: width * 0.8,
    height: 50,
    fontFamily: "Prompt-Regular",
    color: "#393939",
    paddingLeft: 40,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
  },
});
