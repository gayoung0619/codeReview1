import { authAPI } from "../config";

export type NoticeFormData = {
  title: string,
  details: string,
  status: boolean
}

export type PlatformFormData = {
  title: string,
  details: string
}

export type TrainingFormData = {
  title: string,
  category: string,
  open_date: string,
  time: string,
  url: string,
  file: string,
  thumbnails?: string,
  target: string[];
}

// notice
export const getNoticeList = async (page: number, search: string, keyword: string) => {
  return await authAPI.get(`/notice${search}?page=${page || 0}&limit=10&keyword=${keyword}`);
};

export const getNoticeInfo = async (id: number) => {
  return await authAPI.get(`/notice/${id}`);
};

export const patchNotice = async (id: string, form: NoticeFormData) => {
  return await authAPI.patch(`/notice/${id}`, form);
};

export const postNotice = async (form: NoticeFormData) => {
  return await authAPI.post(`/notice`, form);
};

export const deleteNotice = async (id: number, data: { delete_status: boolean }) => {
  return await authAPI.delete(`/notice/${id}`, {
    data
  });
};

// platform
export const getPlatformList = async (page: number, keyword: string) => {
  return await authAPI.get(`/platform?page=${page || 0}&limit=10&keyword=${keyword}`);
};

export const getPlatformInfo = async (id: number) => {
  return await authAPI.get(`/platform/${id}`);
};

export const patchPlatform = async (id: string, form: NoticeFormData) => {
  return await authAPI.patch(`/platform/${id}`, form);
};

export const postPlatform = async (form: NoticeFormData) => {
  return await authAPI.post(`/platform`, form);
};

export const deletePlatform = async (id: number, data: { delete_status: boolean }) => {
  return await authAPI.delete(`/platform/${id}`, {
    data
  });
};

// training
export const getTrainingList = async (page: number, category: number, keyword: string) => {
  return await authAPI.get(`/edu/admin?page=${page || 0}&limit=10&category=${category}&keyword=${keyword}`);
};

export const getTrainingInfo = async (id: number) => {
  return await authAPI.get(`/edu/${id}`);
};

export const patchTraining = async (id: string, form: TrainingFormData) => {
  return await authAPI.patch(`/edu/${id}`, form);
};

export const postTraining = async (form: TrainingFormData) => {
  return await authAPI.post(`/edu`, form);
};

export const deleteTraining = async (id: number, data: { delete_status: boolean }) => {
  return await authAPI.delete(`/edu/${id}`, {
    data
  });
};