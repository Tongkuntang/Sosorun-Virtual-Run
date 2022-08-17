import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Menu1 from "../page/Menu1/index";
const DrawerStack = createDrawerNavigator();

export default function drawer({ component, navigation }) {
  return (
    <DrawerStack.Navigator
      edgeWidth={0}
      drawerStyle={{
        width: "80%",
      }}
      headerMode="none"
      initialRouteName={"home"}
      drawerContent={(props) => <Menu1 {...props} />}
    >
      <DrawerStack.Screen name="home" component={component} />
    </DrawerStack.Navigator>
  );
}
