import React, { useCallback, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Drawer from "./drawer";
import Bib from "../page/bib/index";
import Bag from "../page/bag/indxx";
import Home from "../page/Home/index";
import Intro from "../page/intro/index";
import Login from "../page/login/index";
import Event from "../page/Event/index";
import Device from "../page/device/index";
import Ranking from "../page/Ranking/index";
import Account from "../page/account/index";
import Payment from "../page/payment/index";
import Continue from "../page/continue/index";
import RunLevel from "../page/runLevel/index";
import PayEvent from "../page/payEvent/index";
import PayStart from "../page/payStart/index";
import RunEvant from "../page/runEvent/index";
import FreePoint from "../page/freePoint/index";
import HomeEvent from "../page/Homeevent/index";
import Countdown from "../page/countdown/index";
import SendResults from "../page/sendOnRoad/index";
import SelectDevice from "../page/SelectDevice/index";

import WebView from "../page/WebView/index";
import RunMission from "../page/runMission/index";
import EventInfor from "../page/eventInfor/index";
import PremiumBib from "../page/preniumBib/index";
import TotalPrice from "../page/totalPrice/index";
import HistoryAll from "../page/historyAll/index";
import Editproflie from "../page/Editprofile/index";
import EventDetail from "../page/eventDetail/index";
import ProfileUser from "../page/profileUser/index";
import MissionDetail from "../page/missionDetail/index";
import PromateDetail from "../page/promateDeatil/index";
import ProfileFriend from "../page/profileFriend/index";
import Campaign from "../page/campaign/index";
import Notification from "../page/notification/notification";
import Friend from "../page/friend/friend";
import Friendaccetp from "../page/friend/friend_accept";
import Friendrequest from "../page/friend/friend_request";
import Friendadd from "../page/friend/friend_add";
import Discount from "../page/discount/discount";
import Achievement from "../page/achievement/achievement";
import Mission from "../page/achievement/mission";
import Eventac from "../page/achievement/event";
import Advance from "../page/achievement/advance";
import Coin from "../page/achievement/coin";
import Cat from "../page/achievement/cat";
import Flag from "../page/achievement/flag";
import Foodcode from "../page/discount/food_code";
import Succeed from "../page/succeed/index";
import { useRecoilValue } from "recoil";
import { tokenState } from "../reducer/reducer/reducer/Atom";
import Total from "../page/totalPrice/total";
import MissionInfo from "../page/eventInfor/mission";
import FromContinue from "../page/runMission/fromcontinue";
import MissionFrom from "../page/eventInfor/missionfrom";
import EditAdd from "../page/editadd/flat";
import EditAddra from "../page/editadd/editadd";
import MissionSucc from "../page/succeed/missionsucc";
import LevelScc from "../page/succeed/levelscc";
import Forget from "../page/login/forget";
import { AsyncStorage } from "react-native";
import messaging from "@react-native-firebase/messaging";

function App() {
  const Stack = createStackNavigator();
  const token = useRecoilValue(tokenState);

  useEffect(() => {
    requestUserPermission();
  }, []);

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      getFcmToken();
    }
  };

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      const notitoken = await AsyncStorage.setItem("notitoken", fcmToken);
    } else {
      console.log("Failed", "No token received");
    }
  };

  function screen() {
    return (
      <Stack.Navigator
        headerMode="none"
        initialRouteName="Home"
        screenOptions={{ gestureEnabled: false }}
      >
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Bib" component={Bib} />
        <Stack.Screen name="Bag" component={Bag} />
        <Stack.Screen name="Event" component={Event} />
        <Stack.Screen name="Device" component={Device} />
        <Stack.Screen name="Ranking" component={Ranking} />
        <Stack.Screen name="Account" component={Account} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="RunLevel" component={RunLevel} />
        <Stack.Screen name="PayEvent" component={PayEvent} />
        <Stack.Screen name="PayStart" component={PayStart} />
        <Stack.Screen name="RunEvant" component={RunEvant} />
        <Stack.Screen name="Continue" component={Continue} />
        <Stack.Screen name="FreePoint" component={FreePoint} />
        <Stack.Screen name="HomeEvent" component={HomeEvent} />
        <Stack.Screen name="Countdown" component={Countdown} />
        <Stack.Screen name="WebView" component={WebView} />
        <Stack.Screen name="RunMission" component={RunMission} />
        <Stack.Screen name="EventInfor" component={EventInfor} />
        <Stack.Screen name="PremiumBib" component={PremiumBib} />
        <Stack.Screen name="TotalPrice" component={TotalPrice} />
        <Stack.Screen name="HistoryAll" component={HistoryAll} />
        <Stack.Screen name="EventDetail" component={EventDetail} />
        <Stack.Screen name="ProfileUser" component={ProfileUser} />
        <Stack.Screen name="Editproflie" component={Editproflie} />
        <Stack.Screen name="MissionDetail" component={MissionDetail} />
        <Stack.Screen name="PromateDetail" component={PromateDetail} />
        <Stack.Screen name="ProfileFriend" component={ProfileFriend} />
        <Stack.Screen name="Notification" component={Notification} />
        <Stack.Screen name="Campaign" component={Campaign} />
        <Stack.Screen name="Friend" component={Friend} />
        <Stack.Screen name="Friendaccetp" component={Friendaccetp} />
        <Stack.Screen name="Friendrequest" component={Friendrequest} />
        <Stack.Screen name="Friendadd" component={Friendadd} />
        <Stack.Screen name="Discount" component={Discount} />
        <Stack.Screen name="Achievement" component={Achievement} />
        <Stack.Screen name="Mission" component={Mission} />
        <Stack.Screen name="Eventac" component={Eventac} />
        <Stack.Screen name="Advance" component={Advance} />
        <Stack.Screen name="Coin" component={Coin} />
        <Stack.Screen name="Cat" component={Cat} />
        <Stack.Screen name="Flag" component={Flag} />
        <Stack.Screen name="Foodcode" component={Foodcode} />
        <Stack.Screen name="Succeed" component={Succeed} />
        <Stack.Screen name="Total" component={Total} />
        <Stack.Screen name="MissionInfo" component={MissionInfo} />
        <Stack.Screen name="FromContinue" component={FromContinue} />
        <Stack.Screen name="MissionFrom" component={MissionFrom} />
        <Stack.Screen name="EditAdd" component={EditAdd} />
        <Stack.Screen name="EditAddra" component={EditAddra} />
        <Stack.Screen name="MissionSucc" component={MissionSucc} />
        <Stack.Screen name="LevelScc" component={LevelScc} />
        <Stack.Screen name="SelectDevice" component={SelectDevice} />
        <Stack.Screen name="SendResults" component={SendResults} />
      </Stack.Navigator>
    );
  }

  function ScreenLogin() {
    return (
      <Stack.Navigator
        headerMode="none"
        initialRouteName="Login"
        screenOptions={{ gestureEnabled: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Forget" component={Forget} />
        <Stack.Screen name="Intro" component={Intro} />
        <Stack.Screen name="WebView" component={WebView} />
      </Stack.Navigator>
    );
  }

  function DrawerStack() {
    return token.accessToken != undefined ? (
      <Drawer component={screen} />
    ) : (
      <ScreenLogin />
    );
  }
  //  function name(params) {

  //  }
  // useEffect(() => {
  //   const backAction = () => {
  //     Alert("12345");
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   // return () => backHandler.remove();
  // }, []);

  return <NavigationContainer>{DrawerStack()}</NavigationContainer>;
}

export default App;
