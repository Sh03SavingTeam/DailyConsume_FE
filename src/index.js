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
import RankInfo from "./pages/RankInfo";
import MypageMain from "pages/MypageMain";
import Attendance from "components/Attendance";
import MyPage from "pages/MyPage";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <BrowserRouter>
        <Routes>
            {/* 홈 */}
            <Route path="/" element={<Home />}></Route>
            <Route path="/home/cardregister" element={<CardRegister />}></Route>

            {/* 지도 */}
            <Route path="/map" element={<MapPage />}></Route>
            <Route path="/map/reviewregister" element={<ReviewRegister />}></Route>
            <Route path="/map/recommend" element={<RecommendMap />}></Route>
            <Route path="/map/payhistory" element={<PayHistoryMap />}></Route>

            {/*캘린더*/}
            <Route path="/calendar" element={<Calendar />}></Route>

            {/* 마이페이지 */}
            <Route path="/mypage" element={<MypageMain memberId="min"/>}></Route>
            <Route path="/mypage/addrlist" element={<AddressList />}></Route>
            <Route path="/mypage/addrregister" element={<AddressRegister />}></Route>

            <Route path="/mypage/consumehistory" element={<ConsumeHistory memberId="min"/> }></Route>
            <Route path="/mypage/consumecompare" element={<ConsumeCompare memberId="min"/> }></Route>
            <Route path="/mypage/consumeset" element={<ConsumeSet memberId="min"/> }></Route>

            <Route path="/login" element={<ConsumeLogin />}></Route>
            <Route path="/join" element={<ConsumeJoin />}></Route>

            <Route path="/myPage/discountinfo" element={<DiscountInfo memberId="min" />}></Route>
            <Route path="/mypage/point" element={<Point memberId="min" />}></Route>
            <Route path="/mypage/refund" element={<Refund memberId="min" />}></Route>
            <Route path="/mypage/refund/confirm" element={<Refundconfirm />}></Route>

            <Route path="/rank/addrList" element={<AddressList />}></Route>
            <Route path="/rank" element={<MyPage/>}></Route>
            <Route path="/rank/benefits/:memberId" element={<RankInfo/>}></Route>
            <Route path="/attendanceTest/:memberId" element={<Attendance/>}></Route>
        </Routes>
    </BrowserRouter>
);

reportWebVitals();
