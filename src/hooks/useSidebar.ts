import { useRecoilState } from "recoil";
import sidebarState from "../app/layout";

const useSidebar = () => {
  const [isOpenSideBar, setIsOpenSidBar] = useRecoilState(sidebarState);
  const toggleSideBar = () => setIsOpenSidBar(!isOpenSideBar);

  return { isOpenSideBar, toggleSideBar, setIsOpenSidBar };
};

export default useSidebar;
