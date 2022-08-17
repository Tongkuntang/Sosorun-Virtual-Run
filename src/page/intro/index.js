import React, { useEffect, useState } from "react";
import { View, Platform, Image, Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");
export default function index({ navigation }) {
  const [improve, setImprove] = useState(false);

  useEffect(() => {
    if (!improve) {
      const subscribe = setTimeout(() => {
        setImprove(true);
        // navigation.navigate("Login");
      }, 4000);
    }
    // return
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          marginTop: Platform.OS === "ios" ? 0 : 0,
        }}
      >
        <View style={{ backgroundColor: "#788995" }}>
          <Image
            // resizeMode={"stretch"}
            source={{
              uri: "https://ssr-project.s3.ap-southeast-1.amazonaws.com/sosorun.png",
            }}
            style={{ width: width, height: height }}
          />
        </View>
      </View>
    </View>
  );
}
