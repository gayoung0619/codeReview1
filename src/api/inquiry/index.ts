import { authAPI } from "../config";

export type FaqFormData = {
  question: "",
  category: number,
  answer: ""
}

export type InquiryFormData = {
  title: "",
  details: "",
  category: "",
  name: "",
  phone: "",
  email: "",
  status: "",
  answer: ""
}

// FAQ
export const getFaqList = async (page: number) => {
    return await authAPI.get(`/faq?page=${page || 0}&limit=10`);
};

export const getFaqInfo = async (id: number) => {
  return await authAPI.get(`/faq/${id}`);
};

export const patchFaq = async (id: string, form: FaqFormData) => {
  return await authAPI.patch(`/faq/${id}`, form);
};

export const postFaq = async (form: FaqFormData) => {
  return await authAPI.post(`/faq`, form);
};

export const deleteFaq = async (id: number, data: { delete_status: boolean }) => {
  return await authAPI.delete(`/faq/${id}`, {
    data
  });
};

// 1:1
export const getInquiryList = async (page: number, category:string, keyword:string) => {
  return await authAPI.get(`/inquiry?page=${page || 0}&limit=10&category=${category}&keyword=${keyword}`);
};

export const getInquiryInfo = async (id: number) => {
  return await authAPI.get(`/inquiry/${id}`);
};

export const postInquiry = async () => {
  return await authAPI.post(`/inquiry`);
};

export const patchInquiryStatus = async (id: number, status: string) => {
  return await authAPI.patch(`/inquiry/${id}`, { status });
};