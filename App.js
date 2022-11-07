// import React, { useState, useEffect, useCallback } from "react";
// import {
//   Alert,
//   BackHandler,
//   StyleSheet,
//   Text,
//   View,
//   TextInput,
//   NativeAppEventEmitter,
//   StatusBar,
//   LogBox,
// } from "react-native";
// import Routes from "./src/routes";
// import AppLoading from "expo-app-loading";
// import { useFonts } from "expo-font";
// import { Audio } from "expo-av";
// import { RecoilRoot } from "recoil";
// import * as SplashScreen from "expo-splash-screen";

// LogBox.ignoreAllLogs();

// export default function App() {
//   const [appIsReady, setAppIsReady] = useState(false);
//   const [sound, setSound] = useState(null);
//   let [fontsLoaded] = useFonts({
//     "Prompt-Regular": require("./assets/fonts/Prompt-Regular.ttf"),
//     "Prompt-Medium": require("./assets/fonts/Prompt-Medium.ttf"),
//     "Prompt-Bold": require("./assets/fonts/Prompt-Bold.ttf"),
//   });

//   async function playSound() {
//     const { sound } = await Audio.Sound.createAsync(
//       require("./assets/sosorun.mp3")
//     );
//     setSound(sound);

//     await sound.playAsync();
//     setTimeout(async () => {
//       await sound.stopAsync();
//     }, 4000);
//   }

//   React.useEffect(() => {
//     if (Text.defaultProps == null) Text.defaultProps = {};
//     Text.defaultProps.allowFontScaling = false;
//     if (TextInput.defaultProps == null) TextInput.defaultProps = {};
//     TextInput.defaultProps.allowFontScaling = false;
//     playSound();

//     return sound
//       ? () => {
//           // console.log("Unloading Sound");
//           sound.unloadAsync();
//         }
//       : undefined;
//   }, []);

//   const syncOptions = ["StepCount", "HeartRate", "Workout"];

//   syncOptions.forEach((option) => {
//     NativeAppEventEmitter.addListener(`healthKit:${option}:setup:failure`, () =>
//       console.log(option, "setup failure")
//     );

//     NativeAppEventEmitter.addListener(`healthKit:${option}:setup:success`, () =>
//       console.log(option, "setup success")
//     );

//     NativeAppEventEmitter.addListener(`healthKit:${option}:new`, () =>
//       // queryForAppleHealth(true)
//       console.log(option, "triggered new")
//     );

//     NativeAppEventEmitter.addListener(`healthKit:${option}:failure`, () =>
//       console.log(option, "triggered failure")
//     );
//   });

//   useEffect(() => {
//     async function prepare() {
//       try {
//         await SplashScreen.preventAutoHideAsync();
//         await new Promise((resolve) => setTimeout(resolve, 2000));
//       } catch (e) {
//         console.warn(e);
//       } finally {
//         // Tell the application to render
//         setAppIsReady(true);
//       }
//     }

//     prepare();
//   }, []);

//   const onLayoutRootView = useCallback(async () => {
//     if (appIsReady) {
//       await SplashScreen.hideAsync();
//     }
//   }, [appIsReady]);

//   if (!appIsReady) {
//     return null;
//   }

//   if (!fontsLoaded) {
//     return <AppLoading />;
//   } else {
//     return (
//       <RecoilRoot>
//         <View style={styles.container} onLayout={onLayoutRootView}>
//           <StatusBar backgroundColor="#ccc" />
//           <Routes />
//         </View>
//       </RecoilRoot>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     fontFamily: "Prompt-Regular",
//   },
// });

import { View, Text } from "react-native";
import React from "react";

export default function App() {
  return (
    <View>
      <Text>App</Text>
    </View>
  );
}
