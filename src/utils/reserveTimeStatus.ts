export const getTimeSlotLabel = (value: number): string | undefined => {
  const timeSlots = [
    { value: 1, label: "10:00 - 11:00" },
    { value: 2, label: "11:00 - 12:00" },
    { value: 3, label: "12:00 - 13:00" },
    { value: 4, label: "13:00 - 14:00" },
    { value: 5, label: "14:00 - 15:00" },
    { value: 6, label: "15:00 - 16:00" },
    { value: 7, label: "16:00 - 17:00" },
  ];

  const selectedSlot = timeSlots.find(slot => slot.value === value);
  return selectedSlot?.label;
};