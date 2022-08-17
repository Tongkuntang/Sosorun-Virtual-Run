import AsyncStorage from "@react-native-async-storage/async-storage";
import { atom } from "recoil";
import { recoilPersist } from "./recoil-persist";
const { persistAtom } = recoilPersist({
  key: "recoil-persist", // this key is using to store data in local storage
  storage: AsyncStorage, // configurate which stroage will be used to store the data
});


export const checkUser = atom({
  key: "user",
  default: "User",
  effects_UNSTABLE: [persistAtom],
});

export const checkAdmin = atom({
  key: "admin",
  default: "Admin",
  effects_UNSTABLE: [persistAtom],
});



export const Type = atom({
  key: "Type",
  default: false,
  effects_UNSTABLE: [persistAtom],
});


