const MenuList = [
  {
    title: "회원 관리",
    href: "/user",
  },
  {
    title: "배너 관리",
    href: "/banner",
  },
  {
    title: "예약 관리",
    href: "/reserve",
    subMenu: [
      { title: "시설예약", href: "/reserve/facility" },
      { title: "장비예약", href: "/reserve/equipment" },
    ],
  },
  {
    title: "게시판 관리",
    href: "/board",
    subMenu: [
      { title: "디지털훈련/트레이닝", href: "/board/training" },
      { title: "공지사항", href: "/board/notice" },
      { title: "플랫폼 소식", href: "/board/platform" },
    ],
  },
  {
    title: "문의 관리",
    href: "/inquiry",
    subMenu: [
      { title: "FAQ", href: "/inquiry/faq" },
      { title: "1:1문의", href: "/inquiry/inquiry" }
    ],
  },
  {
    title: "푸쉬 관리",
    href: "/talk",
    subMenu: [
      { title: "알림톡", href: "/push/talk" },
    ],
  }
];

export { MenuList };
