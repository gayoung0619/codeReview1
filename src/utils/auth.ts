import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { authFetch } from "../api/auth";

type AuthData = {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
};

export const useAuth = (): AuthData => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("TOKEN");
      setToken(storedToken);
    }
  }, [token]);
  const { data, isLoading, error } = useQuery({
    queryKey: ["authKey"],
    queryFn: () => authFetch(token ?? ""),
    enabled: !!token, // 토큰이 있을 때 요청을 보냄
  });

  const isAuthenticated: boolean = !!data; // 데이터가 있으면 인증됨

  return { isAuthenticated, isLoading, error };
};
