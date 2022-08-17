import { useIsFocused } from "@react-navigation/native";
import React, { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
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
import { timeformet } from "../components/test";
const { width, height } = Dimensions.get("window");
export default function time({
  distance,
  cal,
  clear,
  setchick,
  setClear,
  resume,
  setResume,
}) {
  const [timecal, setTime] = useState(0);
  // console.log("timecal", timecal);
  const isFocus = useIsFocused();
  let Clear = useRef();

  useEffect(() => {
    Clear.current = setInterval(() => {
      setTime((val) => val + 1);
    }, 1000);
    setClear(Clear.current);
    if (!isFocus) {
      clearInterval(Clear.current);
    }
  }, [isFocus]);

  useEffect(() => {
    if (resume) {
      setResume(false);
      Clear.current = setInterval(() => {
        setTime((val) => val + 1);
      }, 1000);
      setClear(Clear.current);
    }
  }, [resume]);

  var h = timeformet(Math.floor(timecal / 3600));
  var m = timeformet(Math.floor((timecal % 3600) / 60));
  var s = timeformet(Math.floor((timecal % 3600) % 60));

  function formatTime(params) {
    let Ans = params.toString();
    if (Ans.length == 1) {
      return "0" + Ans;
    } else {
      return Ans;
    }
  }

  return (
    <View>
      <Text style={styles.textRun}>Time</Text>
      <Text style={styles.numRum}>
        {formatTime(h)}:{formatTime(m)}:{formatTime(s)}
      </Text>
      <View style={styles.line} />
      <Text style={styles.textRun}>Distance</Text>
      <Text style={styles.numRum1}>{distance.toFixed(2)}</Text>
      <View style={styles.line} />
      <View style={{ flexDirection: "row" }}>
        <View style={styles.viewspeed}>
          <Text style={styles.textRun}>Speed</Text>
          <Text style={styles.numRum}>{(distance / timecal).toFixed(2)}</Text>
        </View>
        <View style={styles.viewcalories}>
          <Text style={styles.textRun}>Calories</Text>
          <Text style={styles.numRum}>{cal.toFixed(2)}</Text>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  viewcalories: {
    width: width * 0.5,
    height: 80,
    borderLeftWidth: 0.25,
    borderLeftColor: "#707070",
    borderBottomWidth: 0.5,
    borderBottomColor: "#707070",
    justifyContent: "center",
  },
  textRun: {
    fontFamily: "Prompt-Regular",
    fontSize: 16,
    color: "#000",
    alignSelf: "center",
    marginTop: 5,
  },
  numRum: {
    fontFamily: "Prompt-Regular",
    fontSize: 20,
    color: "#000",
    alignSelf: "center",
    marginBottom: 5,
  },
  numRum1: {
    fontFamily: "Prompt-Regular",
    fontSize: 48,
    color: "#000",
    alignSelf: "center",
    marginBottom: 5,
  },
  line: {
    width: width,
    borderBottomWidth: 0.5,
    borderBottomColor: "#707070",
  },
  viewspeed: {
    width: width * 0.5,
    height: 80,
    borderRightWidth: 0.25,
    borderRightColor: "#707070",
    borderBottomWidth: 0.5,
    borderBottomColor: "#707070",
    justifyContent: "center",
  },
  bottompause: {
    width: width * 0.98,
    height: 55,
    backgroundColor: "#393939",
    borderRadius: 5,
    justifyContent: "center",
    alignSelf: "center",
    marginTop: 10,
  },
  textpause: {
    fontFamily: "Prompt-Regular",
    fontSize: 24,
    color: "#fff",
    alignSelf: "center",
  },
});
