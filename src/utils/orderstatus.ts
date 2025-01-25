type KeyValue = {
  key?: string;
  value: number;
  label: string;
};
export const orderStatusOptions: KeyValue[] = [
  { value: 11, label: "입금확인" },
  { value: 12, label: "결제완료" },
  { value: 13, label: "배송중" },
  { value: 14, label: "배송완료" },
  { value: 15, label: "구매확정" },

  { value: 21, label: "취소요청" },
  { value: 22, label: "취소처리중" },
  { value: 23, label: "취소완료" },

  { value: 31, label: "교환요청" },
  { value: 32, label: "교환수거중" },
  { value: 33, label: "교환수거완료" },
  { value: 34, label: "교환재배송중" },
  { value: 35, label: "교환완료" },
  { value: 36, label: "교환보류" },
  { value: 37, label: "교환거부" },

  { value: 41, label: "반품요청" },
  { value: 42, label: "반품완료" },
];
export const DELIVERY_COMPANY: KeyValue[] = [
  {
    value: 1,
    label: "직배송",
  },
  {
    value: 2,
    label: "경동",
  },
];
export const DELIVERY_STATUS: KeyValue[] = [
  {
    value: 1,
    label: "배송",
  },
  {
    value: 2,
    label: "교환수거",
  },
  {
    value: 3,
    label: "교환재배송",
  },
  {
    value: 4,
    label: "반품",
  },
];
