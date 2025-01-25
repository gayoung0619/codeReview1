import { AxiosResponse } from "axios";
import { authAPI } from "../config";

export type UserResponse = {
  userId: number;
  accessToken: string;
  refreshToken: string;
};

interface UserRequest {
  loginId: string;
  password: string;
}

export const authFetch = async (token: string) => {
  return await authAPI.get("/user/login", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const authPost = async (
  form: UserRequest,
): Promise<AxiosResponse<UserResponse>> => {
  return await authAPI.post("/user/signin", form);
};
