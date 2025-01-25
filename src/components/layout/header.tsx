import { AppBar, Box, Button, IconButton, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import useSidebar from "../../hooks/useSidebar.ts";
import { DeleteStorage } from "../../utils/storage.ts";

const Header = () => {
  const { isOpenSideBar, toggleSideBar } = useSidebar();
  const navigate = useNavigate();
  const onLogOut = () => {
    // 로컬 스토리지에서 TOKEN 제거
    DeleteStorage("isUser");
    DeleteStorage("userRefresh");

    // 로그아웃 후 로그인 페이지로 리디렉션
    navigate("/login");
  };
  return (
    <DashboardNavbarRoot
      sx={{
        left: !isOpenSideBar ? 280 : 0,
        width: !isOpenSideBar ? "calc(100% - 280px)" : "100%",
        transition: "left 0.3s ease-in-out, width 0.3s ease-in-out", // 부드러운 전환을 위한 트랜지션
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          minHeight: 64,
          left: 0,
          px: 2,
        }}
      >
        <IconButton onClick={toggleSideBar}>
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Button
          onClick={onLogOut}
          size="small"
          variant="outlined"
          sx={{ mr: 2 }}
          color="error"
        >
          로그아웃
        </Button>
      </Toolbar>
    </DashboardNavbarRoot>
  );
};

const DashboardNavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));

export default Header;
