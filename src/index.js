import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css"; // 전역 스타일로 불러오기
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MapPage from "./pages/MapPage";
import RecommendMap from "./pages/RecommendMap";
import ReviewRegister from "./pages/ReviewRegister";
import CardRegister from "./pages/CardRegister";
import ConsumeHistory from "./pages/ConsumeHistory";
import ConsumeCompare from "./pages/ConsumeCompare";
import ConsumeSet from "./pages/ConsumeSet";
import ConsumeLogin from "./pages/ConsumeLogin";
import ConsumeJoin from "./pages/ConsumeJoin";

import Home from "./pages/Home";
import AddressList from "./pages/AddressList";
import AddressRegister from "./pages/AddressRegister";
import Calendar from "./pages/Calendar";
import PayHistoryMap from "./pages/PayHistoryMap";
import DiscountInfo from "./pages/DiscountInfo";
import Point from "./pages/Point";
import Refund from "./pages/Refund";
import Refundconfirm from "./pages/RefundConfirm";
import MyPage from "./pages/MyPage";
import RankInfo from "./pages/RankInfo";
import MypageMain from "pages/MypageMain";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      <Route path="/Calendar" element={<Calendar />}></Route>

      {/* 홈 */}
      <Route path="/home" element={<Home />}></Route>
      <Route path="/home/cardregister" element={<CardRegister />}></Route>

      {/* 지도 */}
      <Route path="/map" element={<MapPage />}></Route>
      <Route path="/map/reviewregister" element={<ReviewRegister />}></Route>
      <Route path="/map/recommend" element={<RecommendMap />}></Route>
      <Route path="/map/payhistory" element={<PayHistoryMap />}></Route>

      {/* 마이페이지 */}
      <Route path="/mypage" element={<MypageMain memberId='min'/>}></Route>
      <Route path="/mypage/addrlist" element={<AddressList />}></Route>
      <Route path="/mypage/addrregister" element={<AddressRegister />}></Route>

      <Route path="/mypage/consumehistory" element={<ConsumeHistory memberId='min'/> }></Route>
      <Route path="/mypage/consumecompare" element={<ConsumeCompare memberId='min'/> }></Route>
      <Route path="/mypage/consumeset" element={<ConsumeSet memberId="min"/> }></Route>

      <Route path="/Login" element={<ConsumeLogin />}></Route>
      <Route path="/Join" element={<ConsumeJoin />}></Route>

      <Route
        path="/MyPage/DiscountInfo"
        element={<DiscountInfo memberId="jeongin" />}
      ></Route>
      <Route
        path="/MyPage/Point"
        element={<Point memberId="jeongin" />}
      ></Route>
      <Route
        path="/MyPage/Refund"
        element={<Refund memberId="jeongin" />}
      ></Route>
      <Route path="/MyPage/Refund/Confirm" element={<Refundconfirm />}></Route>

      <Route path="/rank/AddrList" element={<AddressList />}></Route>
      <Route path="/rank" element={<MyPage/>}></Route>
      <Route path="/rank/benefits/:memberId" element={<RankInfo/>}></Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
