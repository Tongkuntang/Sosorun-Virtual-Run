import AsyncStorage from "@react-native-async-storage/async-storage";

import { atom } from "recoil";
import { recoilPersist } from "./recoil-persist";
const { persistAtom } = recoilPersist({
  key: "recoil-persist",
  storage: AsyncStorage,
});

<<<<<<< HEAD
export const n_devices = atom({
  key: "n_devices",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const lans = atom({
  key: "lans",
  default: "en",
  effects_UNSTABLE: [persistAtom],
});

=======
>>>>>>> parent of 645d93e (update)
export const tokenState = atom({
  key: "token",
  default: {},
  effects_UNSTABLE: [persistAtom],
});

export const deviceIndex = atom({
  key: "deviceIndex",
  default: 0,
});

export const deviceRegis = atom({
  key: "deviceRegis",
  default: {},
});

export const userState = atom({
  key: "user",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
export const Authen = atom({
  key: "auth",
  default: {
    auth: false,
  },
  effects_UNSTABLE: [persistAtom],
});

export const LvState = atom({
  key: "lvstate",
  default: null,
  effects_UNSTABLE: [persistAtom],
});
// export const CheckLogin = atom({
//   key: "user",
//   default: "User",
//   effects_UNSTABLE: [persistAtom],
// });

// export const CheckVETE = atom({
//   key: "VETE",
//   default: "VETE",
//   effects_UNSTABLE: [persistAtom],
// });
