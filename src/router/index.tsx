import { Route, Routes } from "react-router-dom";

import Layout from "../components/layout";
import LoginPage from "../login/login.tsx";

import UserPage from "../pages/user";
import UserDetail from "../pages/user/detail/index.tsx";

import BannerPage from "../pages/banner";

import EquipmentPage from "../pages/reserve/equipment";
import FacilityPage from "../pages/reserve/facility";

import TrainingPage from "../pages/board/tranining";

import NoticePage from "../pages/board/notice";
import NoticeDetailPage from "../pages/board/notice/detail";


import PlatformPage from "../pages/board/platform";

import FaqPage from "../pages/inquiry/faq";
import FaqDetailPage from "../pages/inquiry/faq/detail";
import FaqCreatePage from "../pages/inquiry/faq/create";
import InquiryPage from "../pages/inquiry/inquiry";
import InquiryDetailPage from "../pages/inquiry/inquiry/detail";
import InquiryCreatePage from "../pages/inquiry/inquiry/create";

import PushPage from "../pages/push/talk";
import EquipmentDetail from "../pages/reserve/equipment/detail";
import FacilityDetail from "../pages/reserve/facility/detail";
import NoticeCreatePage from "../pages/board/notice/create";
import PlatformDetailPage from "../pages/board/platform/detail";
import PlatformCreatePage from "../pages/board/platform/create";
import TrainingDetailPage from "../pages/board/tranining/detail";
import TrainingCreatePage from "../pages/board/tranining/create";
import BannerDetailPage from "../pages/banner/detail";
import BannerCreatePage from "../pages/banner/create";
import PushDetailPage from "../pages/push/talk/detail";

const RoutesComponent = () => {
  return (
      <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route path="/user" element={<UserPage />} />
            <Route path="/user/:id" element={<UserDetail />} />

            <Route path="/banner" element={<BannerPage />} />
            <Route path="/banner/:id" element={<BannerDetailPage />} />
            <Route path="/banner/create" element={<BannerCreatePage />} />

            <Route path="/reserve/equipment" element={<EquipmentPage />} />
            <Route path="/reserve/equipment/:id" element={<EquipmentDetail />} />
            <Route path="/reserve/facility" element={<FacilityPage />} />
            <Route path="/reserve/facility/:id" element={<FacilityDetail />} />

            <Route path="/board/training" element={<TrainingPage />} />
            <Route path="/board/training/:id" element={<TrainingDetailPage />} />
            <Route path="/board/training/create" element={<TrainingCreatePage />} />

            <Route path="/board/notice" element={<NoticePage />} />
            <Route path="/board/notice/:id" element={<NoticeDetailPage />} />
            <Route path="/board/notice/create" element={<NoticeCreatePage />} />

            <Route path="/board/platform" element={<PlatformPage />} />
            <Route path="/board/platform/:id" element={<PlatformDetailPage />} />
            <Route path="/board/platform/create" element={<PlatformCreatePage />} />

            <Route path="/inquiry/faq" element={<FaqPage />} />
            <Route path="/inquiry/faq/detail/:id" element={<FaqDetailPage />} />
            <Route path="/inquiry/faq/create" element={<FaqCreatePage />} />

            <Route path="/inquiry/inquiry" element={<InquiryPage />} />
            <Route path="/inquiry/inquiry/detail/:id" element={<InquiryDetailPage />} />
            <Route path="/inquiry/inquiry/create" element={<InquiryCreatePage />} />

            <Route path="/push/talk" element={<PushPage />} />
            <Route path="/push/talk/:id" element={<PushDetailPage />} />

          </Route>
      </Routes>
  );
};

export default RoutesComponent;
