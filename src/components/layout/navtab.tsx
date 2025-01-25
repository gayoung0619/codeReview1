import { Box } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function NavTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname.split("/")[1];
  const [activeTab, setActiveTab] = useState(`/${pathname}`);

  useEffect(() => {
    setActiveTab(`/${pathname}`);
  }, [pathname]);

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
    navigate(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        role="navigation"
        sx={{
          px: 3,
          backgroundColor: "#fff",
          borderTop: "1px solid #E5E7EB",
          cursor: "pointer",
        }}
      >
        <Tab label="업체관리" value="/store-entry-application" />
        <Tab label="기업관리" value="/corporate" />
        <Tab label="계약관리" value="/contract" />
        <Tab label="고객관리" value="/customer" />
      </Tabs>
    </Box>
  );
}
