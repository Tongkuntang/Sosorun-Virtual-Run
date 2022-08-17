import React from "react";
import { View, Text } from "react-native";

export function timeformet(params) {
  if (params.toString().length == 0) {
    return "00";
  } else if (params.toString().length == 1) {
    return "0" + params;
  } else {
    return params;
  }
}
