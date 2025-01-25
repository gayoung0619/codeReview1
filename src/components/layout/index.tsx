import { Outlet } from "react-router-dom";
import Header from "./header.tsx";
import Sidebar from "./Sidebar";
import useSidebar from "../../hooks/useSidebar.ts";
import Authtoken from "../auth/authtoken.tsx";

const Index = () => {
  const { isOpenSideBar } = useSidebar();

  return (
    <Authtoken>
      <Sidebar />
      <div>
        <Header />
        <div
          style={{
            transition: "padding-left 0.3s ease-in-out",
            paddingTop: "64px",
            paddingLeft: !isOpenSideBar ? "280px" : "0",
          }}
        >
          {/*<Dashboard />*/}
          <Outlet />
        </div>
      </div>
    </Authtoken>
  );
};

export default Index;
