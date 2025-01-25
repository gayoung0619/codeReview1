import { authAPI } from "../config";

export type FacilityFormData = {
  facilityId?: number;
  name: string;
  company: string;
  phone: string;
  birth: string;
  email: string;
  facility: {
    name: string;
  };
  userCount: string;
  reserveDate: string;
  reservationTime: string;
  detail: string;
  userId?: number;
};

export type EquipmentFormData = {
  name: string;
  company: string;
  phone: string;
  birth: string;
  email: string;
  equipment: {
    name: string;
  };
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  count: number;
  detail: string;
};

// 시설
export const getFacilityList = async (
  page: number,
  category: string,
  keyword: string,
  formattedStartDate: string,
  formattedEndDate: string,
  sort: string,
) => {
  return await authAPI.get(
    `/facility-reserve/admin?page=${
      page || 0
    }&limit=10&category=${category}&keyword=${keyword}&startDate=${formattedStartDate}&endDate=${formattedEndDate}&sort=${sort}`
  );
};

export const getFacilityInfo = async (id: number) => {
  return await authAPI.get(`/facility-reserve/${id}`);
};

export const patchFacilityStatus = async (id: number, status: string) => {
  return await authAPI.patch(`/facility-reserve/${id}`, { status });
};

// 장비
export const getEquipmentList = async (
  page: number,
  category: string,
  keyword: string,
  formattedStartDate: string,
  formattedEndDate: string
) => {
  return await authAPI.get(
    `/equipment-reserve/list?page=${
      page || 0
    }&limit=10&category=${category}&keyword=${keyword}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`
  );
};

export const getEquipmentInfo = async (id: number) => {
  return await authAPI.get(`/equipment-reserve/${id}`);
};

export const patchEquipmentStatus = async (id: number, status: string) => {
  return await authAPI.patch(`/equipment-reserve/${id}`, { status });
};
