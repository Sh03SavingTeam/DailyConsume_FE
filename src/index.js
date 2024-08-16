import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MapPage from "./pages/MapPage";
import ReviewRegister from "./pages/ReviewRegister";
import CardRegister from "./pages/CardRegister";
import ConsumeHistory from "./pages/ConsumeHistory";
import Home from "./pages/Home";
import AddressList from "./pages/AddressList";
import AddressRegister from "./pages/AddressRegister";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>
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

        {/* 마이페이지 */}
        <Route
          path="/mypage/consumehistory"
          element={<ConsumeHistory />}
        ></Route>
        <Route path="/mypage/addrlist" element={<AddressList />}></Route>
        <Route
          path="/mypage/addrregister"
          element={<AddressRegister />}
        ></Route>
      </Routes>
    </BrowserRouter>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
