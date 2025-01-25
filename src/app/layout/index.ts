import { atom } from "recoil";

const sidebarState = atom({
  key: "sideBarState",
  default: true,
});

export default sidebarState;
