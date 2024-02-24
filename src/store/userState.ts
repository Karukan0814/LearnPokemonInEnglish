import React from "react";
import { atom } from "recoil";
import { UserInfo } from "../types/UserInfo";
import { recoilPersist } from "recoil-persist";
import { useResetRecoilState } from "recoil";

const { persistAtom } = recoilPersist({
  key: "recoil-persist", // this key is using to store data in local storage
  storage: localStorage, // configurate which stroage will be used to store the data
});

export const userState = atom<UserInfo>({
  key: "userState",
  default: { userId: "", userName: "" },
  effects_UNSTABLE: [persistAtom],
});
