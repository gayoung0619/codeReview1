import { authAPI } from "../config";

export type PushFormData = {
  template_preview: string;
};

// push
export const getPushList = async (page: number) => {
  return await authAPI.get(`/push?page=${page || 0}&limit=10`);
};

export const getPushInfo = async (id: number) => {
  return await authAPI.get(`/push/${id}`);
};
