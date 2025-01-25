import { authAPI } from "../config";

export type BannerFormData = {
  file_name: string,
  file_url: string,
  file: "",
  sort: string,
  createdAt?: string,
  status: boolean
}

// notice
export const getBannerList = async (page: number) => {
  return await authAPI.get(`/banner?page=${page || 0}&limit=10`);
};

export const getBannerInfo = async (id: number) => {
  return await authAPI.get(`/banner/admin/${id}`);
};

export const patchBanner = async (id: string, form: BannerFormData) => {
  return await authAPI.patch(`/banner/${id}`, form);
};

export const postBanner = async (form: BannerFormData) => {
  return await authAPI.post(`/banner`, form);
};

export const deleteBanner = async (id: number, data: { delete_status: boolean }) => {
  return await authAPI.delete(`/banner/${id}`, {
    data
  });
};