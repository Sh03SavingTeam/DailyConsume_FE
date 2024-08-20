import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./App.css"; // 전역 스타일로 불러오기
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MapPage from "./pages/MapPage";
import ReviewRegister from "./pages/ReviewRegister";
import CardRegister from "./pages/CardRegister";
import ConsumeHistory from "./pages/ConsumeHistory";
import Home from "./pages/Home";
import AddressList from "./pages/AddressList";
import AddressRegister from "./pages/AddressRegister";
import Calendar from "./components/Calendar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}></Route>
      {/* 홈 */}
      <Route path="/home" element={<Home />}></Route>
      <Route path="/home/cardregister" element={<CardRegister />}></Route>

      {/* 지도 */}
      <Route path="/map" element={<MapPage />}></Route>
      <Route path="/map/reviewregister" element={<ReviewRegister />}></Route>

      {/* 캘린더 */}
      <Route path="/calander" element={<Calendar />}></Route>

      {/* 마이페이지 */}
      <Route path="/mypage/consumehistory" element={<ConsumeHistory />}></Route>
      <Route path="/mypage/addrlist" element={<AddressList />}></Route>
      <Route path="/mypage/addrregister" element={<AddressRegister />}></Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
