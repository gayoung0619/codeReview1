import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import { MenuList } from "./MenuList.tsx";
import logo from "/src/assets/logo.png";
import useSidebar from "../../hooks/useSidebar.ts";

const Sidebar = () => {
  const { isOpenSideBar, setIsOpenSidBar } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  // 각 메뉴의 열림/닫힘 상태를 관리
  const [openMenus, setOpenMenus] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (isOpenSideBar) {
      return setIsOpenSidBar(false);
    }
    if (!isOpenSideBar) {
      return setIsOpenSidBar(true);
    }
  }, []);

  const handleToggle = (index: number) => {
    setOpenMenus((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return (
      <SidebarStyle
          style={{
            transform: !isOpenSideBar ? "translate(0)" : "translate(-280px)",
          }}
      >
        <div>
          <NavLink to="/banner">
            <img src={logo} alt="어반이스트 로고" width={171} />
          </NavLink>
        </div>

        <div>
          <UlWrapper>
            {MenuList.map((menu, index) => (
                <li
                    key={index}
                    style={{
                      backgroundColor: currentPath.includes(menu.href) ? "#EBF2FF" : "",
                    }}
                >
                  <div
                      onClick={() => menu.subMenu && handleToggle(index)} // 2차 메뉴가 있을 때만 토글
                      style={{ cursor: menu.subMenu ? "pointer" : "default" }}
                  >
                    {menu.subMenu ? (
                        // 2차 메뉴가 있는 경우 NavLink 제거
                        <NavLink to="#">{menu.title}</NavLink>
                    ) : (
                        // 2차 메뉴가 없는 경우 NavLink로 이동 가능
                        <NavLink to={menu.href}>{menu.title}</NavLink>
                    )}
                  </div>
                  {menu.subMenu && openMenus[index] && (
                      <ul>
                        {menu.subMenu.map((sub, subIndex) => (
                            <li
                                key={subIndex}
                            >
                              <NavLink to={sub.href}>{sub.title}</NavLink>
                            </li>
                        ))}
                      </ul>
                  )}
                </li>
            ))}
          </UlWrapper>

        </div>
      </SidebarStyle>
  );
};

const SidebarStyle = styled.div`
  background-color: #FFFFFF;
  width: 280px;
  height: 100vh;
  color: #001655;
  position: fixed;
  top: 0;
  left: 0;
  transition: transform 0.3s ease-in-out;

  > div:first-of-type {
    padding: 32px 0 0 34px;
  }

  > div:nth-of-type(2) {
    padding-top: 46px;
  }
`;

const UlWrapper = styled.ul`
  display: flex;
  flex-direction: column;
  li {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 10px 0;
    font-weight: 700;

    > div {
      padding: 10px 30px;
    }

    ul {
      padding-left: 40px;
      margin-top: 5px;

      li {
        font-weight: 500;
        padding: 10px 0;
      }
    }
  }

  a {
    text-decoration: none;
    color: inherit;
    &:hover {
      color: #0056b3;
    }
  }
`;

export default Sidebar;
