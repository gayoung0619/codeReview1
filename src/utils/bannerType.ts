export const getTypeBanner = (typeValue: number) => {
  if (!typeValue) return "";

  switch (typeValue) {
    case 1:
      return "main";
    case 2:
      return "product";
    case 3:
      return "firpit";
    case 4:
      return "pergola";
    case 5:
      return "service";
    case 6:
      return "collab";
    default:
      return "";
  }
};
