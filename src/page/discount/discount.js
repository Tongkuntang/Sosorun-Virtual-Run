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
} from "react-native";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import HeaderFree from "../components/headerfree";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
import { useIsFocused } from "@react-navigation/core";
import { apiservice } from "../../service/service";
import { getalldiscount_list, getdiscount_list } from "../../action/actiondis";
import { getActionUser } from "../../action/actionauth";

const { width, height } = Dimensions.get("window");

export default function friend({ navigation }) {
  const [search, setsearch] = useState("");
  const [user, setUser] = useRecoilState(userState);
  const [page, setpage] = useState(0);
  const focus = useIsFocused();
  const [token, setKoen] = useRecoilState(tokenState);
  const [all, setall] = useState([]);
  const [food, setfood] = useState([]);
  const [computer, setcomputer] = useState([]);
  const [room, setroom] = useState([]);
  const [elec, setelec] = useState([]);

  async function getalldiscount() {
    const getall = await getalldiscount_list(token);
    console.log("62", getall);
    // getall.map((item) => {
    //   const res = await apiservice({
    //     path: "",
    //   });
    // });

    setall(
      getall.filter((i) => {
        return i.last_code > 0;
      })
    );

    const getfood = await getdiscount_list({
      token,
      category_name: "Food",
    });
    console.log(getfood);
    setfood(
      getfood.filter((i) => {
        return i.last_code > 0;
      })
    );
    const getComputer = await getdiscount_list({
      token,
      category_name: "Computer",
    });
    setcomputer(
      getComputer.filter((i) => {
        return i.last_code > 0;
      })
    );
    const getRoom = await getdiscount_list({
      token,
      category_name: "Room",
    });
    setroom(
      getRoom.filter((i) => {
        return i.last_code > 0;
      })
    );
    const getelce = await getdiscount_list({
      token,
      category_name: "Electric",
    });
    setelec(
      getelce.filter((i) => {
        return i.last_code > 0;
      })
    );
    // console.log(getfood);
  }

  useEffect(() => {
    getalldiscount();
  }, [focus, token]);

  useEffect(() => {
    getUser();
  }, [page, focus]);

  async function getUser() {
    const resonse = await getActionUser(token);
    setUser(resonse.data);
  }

  if (user == null) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="#fff" size={"large"} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <HeaderFree navigation={navigation} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View
            style={{
              flexDirection: "row",
              borderBottomColor: "#F8CA36",
              borderBottomWidth: 3,
              marginLeft: 10,
            }}
          >
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

            {user.name == null ? (
              <Text style={styles.textna}>{user.username}</Text>
            ) : (
              <Text style={styles.textna}>{user.name}</Text>
            )}
          </View>

          <View style={styles.view}>
            <View style={{ flexDirection: "row" }}>
              <FontAwesome5 name="running" size={24} color="#5BC3FF" />
              <Text style={styles.textbold}>
                {user.user_accounts.wallet.cal != undefined
                  ? user.user_accounts.wallet.cal
                  : 0}
              </Text>
            </View>
            <View style={styles.view1}>
              <Image
                source={{
                  uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
                }}
                style={styles.imgpoint}
              />
              <Text style={styles.textbold}>
                {user.user_accounts.wallet.gold != undefined
                  ? user.user_accounts.wallet.gold
                  : 0}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "center",
            marginTop: 10,
          }}
        >
          <View
            style={{
              width: width * 0.9,
              height: 40,
              alignSelf: "center",
              backgroundColor: "#E4E4E470",
              borderRadius: 5,
              flexDirection: "row",
              marginTop: 10,
              paddingHorizontal: 5,
            }}
          >
            <FontAwesome
              name="search"
              size={24}
              color="#000000"
              style={{ alignSelf: "center", marginRight: 10 }}
            />
            <TextInput
              style={{
                width: width * 0.8,
                height: 40,
                justifyContent: "center",
                borderRadius: 5,
                fontSize: 14,
                fontFamily: "Prompt-Regular",
                color: "#A1949A",
              }}
              placeholder="SEARCH"
              onChangeText={(search) => setsearch(search)}
              defaultValue={search}
            />
          </View>
        </View>
        <Text
          style={{
            fontFamily: "Prompt-Regular",
            fontSize: 16,
            color: "#393939",
            marginLeft: 15,
            marginTop: 10,
          }}
        >
          Categories
        </Text>
        <View
          style={{
            flexDirection: "row",
            width: width,
            justifyContent: "space-between",
            paddingHorizontal: 20,
            marginTop: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => setpage(0)}
            style={{
              borderBottomColor: page == 0 ? "#000000" : "#393939",
              borderBottomWidth: page == 0 ? 1 : 0,
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 16,
                color: page == 0 ? "#393939" : "#DBDBDB",
                alignSelf: "center",
              }}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setpage(1)}
            style={{
              borderBottomColor: page == 1 ? "#000000" : "#393939",
              borderBottomWidth: page == 1 ? 1 : 0,
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 16,
                color: page == 1 ? "#393939" : "#DBDBDB",
                alignSelf: "center",
              }}
            >
              Food
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setpage(2)}
            style={{
              borderBottomColor: page == 2 ? "#000000" : "#393939",
              borderBottomWidth: page == 2 ? 1 : 0,
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 16,
                color: page == 2 ? "#393939" : "#DBDBDB",
                alignSelf: "center",
              }}
            >
              Computer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setpage(3)}
            style={{
              borderBottomColor: page == 3 ? "#000000" : "#393939",
              borderBottomWidth: page == 3 ? 1 : 0,
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 16,
                color: page == 3 ? "#393939" : "#DBDBDB",
                alignSelf: "center",
              }}
            >
              Room
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setpage(4)}
            style={{
              borderBottomColor: page == 4 ? "#000000" : "#393939",
              borderBottomWidth: page == 4 ? 1 : 0,
            }}
          >
            <Text
              style={{
                fontFamily: "Prompt-Regular",
                fontSize: 16,
                color: page == 4 ? "#393939" : "#DBDBDB",
                alignSelf: "center",
              }}
            >
              Electric
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ height: height * 0.65 }}>
          {page == 0 && (
            <FlatList
              data={all}
              numColumns={2}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Foodcode", item)}
                    style={{
                      width: width * 0.5,
                      marginTop: 20,
                      alignSelf: "center",
                      backgroundColor: "#FFFFFF",
                      justifyContent: "center",
                      paddingHorizontal: 5,
                      // height: height * 0.3,
                      justifyContent: "space-between",
                    }}
                  >
                    <Image
                      style={{
                        width: width * 0.48,
                        height: 100,
                        alignSelf: "center",
                      }}
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" +
                          item.img_content,
                      }}
                    />
                    <Text style={[styles.textbold1, { marginLeft: 0 }]}>
                      {item.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        // alignSelf: "flex-end",
                        fontFamily: "Prompt-Regular",
                        fontSize: 12,
                        color: "#000",
                        marginVertical: 5,
                      }}
                    >
                      {item.description}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "#FBC71C",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignSelf: "center" }}
                        >
                          <FontAwesome5
                            name="running"
                            size={12}
                            color="#5BC3FF"
                            style={{ alignSelf: "center" }}
                          />
                          <Text style={styles.textbold1}>
                            {item.condition.cal}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "#FBC71C",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignSelf: "center" }}
                        >
                          <Image
                            source={{
                              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
                            }}
                            style={styles.imgpoint2}
                          />
                          <Text style={styles.textbold1}>
                            {item.condition.gold}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          justifyContent: "center",
                          backgroundColor: "#393939",
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Prompt-Regular",
                            fontSize: 18,
                            color: "#FBC71C",
                            marginLeft: 10,
                          }}
                        >
                          ใช้สิทธิ์
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        alignSelf: "flex-end",
                        fontFamily: "Prompt-Regular",
                        fontSize: 8,
                        color: "#000",
                        marginTop: 10,
                      }}
                    >
                      สิทธิ์ที่เหลืออยู่ {item.last_code} สิทธิ์
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
          {page == 1 && (
            <FlatList
              data={food}
              numColumns={2}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Foodcode", item)}
                    style={{
                      width: width * 0.5,
                      marginTop: 20,
                      alignSelf: "center",
                      backgroundColor: "#FFFFFF",
                      justifyContent: "center",
                      paddingHorizontal: 5,
                      // height: height * 0.3,
                      justifyContent: "space-between",
                    }}
                  >
                    <Image
                      style={{
                        width: width * 0.48,
                        height: 100,
                        alignSelf: "center",
                      }}
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" +
                          item.img_content,
                      }}
                    />
                    <Text style={[styles.textbold1, { marginLeft: 0 }]}>
                      {item.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        // alignSelf: "flex-end",
                        fontFamily: "Prompt-Regular",
                        fontSize: 12,
                        color: "#000",
                        marginVertical: 5,
                      }}
                    >
                      {item.description}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "#FBC71C",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignSelf: "center" }}
                        >
                          <FontAwesome5
                            name="running"
                            size={12}
                            color="#5BC3FF"
                            style={{ alignSelf: "center" }}
                          />
                          <Text style={styles.textbold1}>
                            {item.condition.cal}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "#FBC71C",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignSelf: "center" }}
                        >
                          <Image
                            source={{
                              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.png",
                            }}
                            style={styles.imgpoint2}
                          />
                          <Text style={styles.textbold1}>
                            {item.condition.gold}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          justifyContent: "center",
                          backgroundColor: "#393939",
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Prompt-Regular",
                            fontSize: 18,
                            color: "#FBC71C",
                            fontWeight: "bold",
                            marginLeft: 10,
                          }}
                        >
                          ใช้สิทธิ์
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        alignSelf: "flex-end",
                        fontFamily: "Prompt-Regular",
                        fontSize: 8,
                        color: "#000",
                        marginTop: 10,
                      }}
                    >
                      สิทธิ์ที่เหลืออยู่ {item.last_code} สิทธิ์
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
          {page == 2 && (
            <FlatList
              data={computer}
              numColumns={2}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Foodcode", item)}
                    style={{
                      width: width * 0.5,
                      marginTop: 20,
                      alignSelf: "center",
                      backgroundColor: "#FFFFFF",
                      justifyContent: "center",
                      paddingHorizontal: 5,
                      // height: height * 0.3,
                      justifyContent: "space-between",
                    }}
                  >
                    <Image
                      style={{
                        width: width * 0.48,
                        height: 100,
                        alignSelf: "center",
                      }}
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" +
                          item.img_content,
                      }}
                    />
                    <Text style={[styles.textbold1, { marginLeft: 0 }]}>
                      {item.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        // alignSelf: "flex-end",
                        fontFamily: "Prompt-Regular",
                        fontSize: 12,
                        color: "#000",
                        marginVertical: 5,
                      }}
                    >
                      {item.description}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "#FBC71C",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignSelf: "center" }}
                        >
                          <FontAwesome5
                            name="running"
                            size={12}
                            color="#5BC3FF"
                            style={{ alignSelf: "center" }}
                          />
                          <Text style={styles.textbold1}>
                            {item.condition.cal}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "#FBC71C",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignSelf: "center" }}
                        >
                          <Image
                            source={{
                              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.pn",
                            }}
                            style={styles.imgpoint2}
                          />
                          <Text style={styles.textbold1}>
                            {item.condition.gold}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          justifyContent: "center",
                          backgroundColor: "#393939",
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Prompt-Regular",
                            fontSize: 14,
                            color: "#FBC71C",
                            fontWeight: "500",
                            marginLeft: 10,
                          }}
                        >
                          ใช้สิทธิ์
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        alignSelf: "flex-end",
                        fontFamily: "Prompt-Regular",
                        fontSize: 10,
                        color: "#000",
                        marginTop: 10,
                      }}
                    >
                      สิทธิ์ที่เหลืออยู่ {item.last_code} สิทธิ์
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
          {page == 3 && (
            <FlatList
              data={room}
              numColumns={2}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Foodcode", item)}
                    style={{
                      width: width * 0.5,
                      marginTop: 20,
                      alignSelf: "center",
                      backgroundColor: "#FFFFFF",
                      justifyContent: "center",
                      paddingHorizontal: 5,
                      // height: height * 0.3,
                      justifyContent: "space-between",
                    }}
                  >
                    <Image
                      style={{
                        width: width * 0.48,
                        height: 100,
                        alignSelf: "center",
                      }}
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" +
                          item.img_content,
                      }}
                    />
                    <Text style={[styles.textbold1, { marginLeft: 0 }]}>
                      {item.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        // alignSelf: "flex-end",
                        fontFamily: "Prompt-Regular",
                        fontSize: 12,
                        color: "#000",
                        marginVertical: 5,
                      }}
                    >
                      {item.description}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "#FBC71C",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignSelf: "center" }}
                        >
                          <FontAwesome5
                            name="running"
                            size={12}
                            color="#5BC3FF"
                            style={{ alignSelf: "center" }}
                          />
                          <Text style={styles.textbold1}>
                            {item.condition.cal}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "#FBC71C",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignSelf: "center" }}
                        >
                          <Image
                            source={{
                              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.pn",
                            }}
                            style={styles.imgpoint2}
                          />
                          <Text style={styles.textbold1}>
                            {item.condition.gold}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={{
                          width: "33%",
                          height: 30,
                          justifyContent: "center",
                          backgroundColor: "#393939",
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Prompt-Regular",
                            fontSize: 18,
                            color: "#FBC71C",
                            fontWeight: "bold",
                            marginLeft: 10,
                          }}
                        >
                          ใช้สิทธิ์
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={{
                        alignSelf: "flex-end",
                        fontFamily: "Prompt-Regular",
                        fontSize: 8,
                        color: "#000",
                        marginTop: 10,
                      }}
                    >
                      สิทธิ์ที่เหลืออยู่ {item.last_code} สิทธิ์
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
          {page == 4 && (
            <FlatList
              data={elec}
              numColumns={2}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => navigation.navigate("Foodcode", item)}
                    style={{
                      width: width * 0.5,
                      marginTop: 20,
                      alignSelf: "center",
                      backgroundColor: "#FFFFFF",
                      justifyContent: "center",
                      paddingHorizontal: 5,
                      // height: height * 0.3,
                      justifyContent: "space-between",
                    }}
                  >
                    <Image
                      style={{
                        width: width * 0.48,
                        height: 100,
                        alignSelf: "center",
                      }}
                      source={{
                        uri:
                          "https://api.sosorun.com/api/imaged/get/" +
                          item.img_content,
                      }}
                    />
                    <Text style={[styles.textbold1, { marginLeft: 0 }]}>
                      {item.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        // alignSelf: "flex-end",
                        fontFamily: "Prompt-Regular",
                        fontSize: 12,
                        color: "#000",
                        marginVertical: 5,
                      }}
                    >
                      {item.description}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "#FBC71C",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignSelf: "center" }}
                        >
                          <FontAwesome5
                            name="running"
                            size={12}
                            color="#5BC3FF"
                            style={{ alignSelf: "center" }}
                          />
                          <Text style={styles.textbold1}>
                            {item.condition.cal}
                          </Text>
                        </View>
                      </View>
                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: "#FBC71C",
                          justifyContent: "center",
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignSelf: "center" }}
                        >
                          <Image
                            source={{
                              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/Group.pn",
                            }}
                            style={styles.imgpoint2}
                          />
                          <Text style={styles.textbold1}>
                            {item.condition.gold}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          width: "33%",
                          height: 30,
                          justifyContent: "center",
                          backgroundColor: "#393939",
                          borderRadius: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: "Prompt-Regular",
                            fontSize: 18,
                            color: "#FBC71C",
                            fontWeight: "bold",
                            marginLeft: 10,
                          }}
                        >
                          ใช้สิทธิ์
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={{
                        alignSelf: "flex-end",
                        fontFamily: "Prompt-Regular",
                        fontSize: 8,
                        color: "#000",
                        marginTop: 10,
                      }}
                    >
                      สิทธิ์ที่เหลืออยู่ {item.last_code} สิทธิ์
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: "#fff",
  },
  imgpro: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: "center",
    marginLeft: 5,
    marginBottom: 3,
  },
  textna: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    marginLeft: 5,
    alignSelf: "center",
    maxWidth: width * 0.35,
  },
  imgpoint: {
    width: 30,
    height: 30,
  },
  imgpoint1: {
    width: 25,
    height: 25,
  },
  imgpoint2: {
    width: 15,
    height: 15,
    alignSelf: "center",
  },
  textbold: {
    fontFamily: "Prompt-Regular",
    fontSize: 22,
    color: "#000",
    fontWeight: "bold",
    marginLeft: 10,
  },
  textbold1: {
    fontFamily: "Prompt-Regular",
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
    marginLeft: 10,
  },
  view: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginVertical: 10,
  },
  view1: {
    flexDirection: "row",
    marginHorizontal: 20,
  },
});
