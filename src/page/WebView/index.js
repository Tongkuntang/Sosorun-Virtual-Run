import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import WebView from "react-native-webview";
import Headerdetail from "../components/headerdetail";

export default function index({ navigation, route }) {
  const url = route?.params?.url || "https://www.google.com";

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Headerdetail item={route?.params?.title} navigation={navigation} />
      <WebView
        source={{
          uri: url,
        }}
        startInLoadingState
        scalesPageToFit
        javaScriptEnabled
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}
