import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DeleteStorage, GetStorage } from "../../utils/storage.ts";

const AuthToken = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = GetStorage("isUser") || "";
    setToken(token);

    if (!token) {
      // 로컬 스토리지에서 TOKEN 제거
      DeleteStorage("isUser");
      DeleteStorage("userRefresh");
      navigate("/login");
    }
  }, [navigate]);

  return token ? children : null;
};

export default AuthToken;
