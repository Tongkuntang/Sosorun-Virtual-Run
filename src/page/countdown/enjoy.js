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
} from "react-native";
import Carousel from "react-native-snap-carousel";
import { useRecoilState } from "recoil";
import { getAllbanner, getBanNer } from "../../action/actionbanner";
import { tokenState, userState } from "../../reducer/reducer/reducer/Atom";
const { width, height } = Dimensions.get("window");
export default function enjoy() {
  const [token, setToken] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);
  const carouselRef = useRef();
  const [banner, setbanner] = useState([]);
  const [banner1, setbanner1] = useState([]);
  async function allbanner() {
    const getbanner = await getAllbanner(token);
    const page = getbanner.data[1].page;
    // console.log("36", page);
    // setbanner(getbanner.data);
    const getbanner1 = await getBanNer({ token, page: page });
    setbanner1(getbanner1.data[0].img_list);
    // console.log("39", getbanner1.data[0].img_list);
  }
  useEffect(() => {
    allbanner();
  }, [token]);

  return (
    <View style={styles.viewtext}>
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
                // resizeMode={"stretch"}
                style={styles.imgsup}
                // source={item.img}
                source={{
                  uri: "https://api.sosorun.com/api/imaged/get/" + item,
                }}
              />
            </View>
          );
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  viewtext: {
    backgroundColor: "#fff",
    height: height * 0.3,
  },
  textenjoy: {
    fontFamily: "Prompt-Regular",
    fontSize: 40,
    color: "#000",
    marginLeft: 5,
    fontWeight: "300",
  },
  textstart: {
    fontFamily: "Prompt-Regular",
    fontSize: 50,
    color: "#000",
    marginLeft: 5,
    fontWeight: "700",
    fontStyle: "italic",
  },
  textto: {
    fontFamily: "Prompt-Regular",
    fontSize: 30,
    color: "#000",
    marginLeft: 5,
  },
  imgsup: {
    width: width,
    height: height * 0.3,
  },
});
