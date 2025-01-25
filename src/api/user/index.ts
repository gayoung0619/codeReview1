import { authAPI } from "../config";

export type UserFormData = {
  loginId: string;
  name: string;
  password: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  business_number: string;
  industry: string;
  worker_number: string;
}

/** 유저리스트 */
export const getUserList = async (page: number, category: number) => {
  return await authAPI.get(`/user?page=${page || 0}&limit=10&category=${category}`);
};

/** 유저상세 */
export const getUserInfo = async (id: string) => {
  return await authAPI.get(`/user/${id}`);
};

export const deleteUser = async (id: string) => {
  return await authAPI.delete(`/user/${id}`, {
    data: { delete_status: true },
  });
};

export const patchUser = async (id: number, form: UserFormData) => {
  return await authAPI.patch(`/user/${id}`, form);
};
