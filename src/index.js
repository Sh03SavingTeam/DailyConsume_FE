import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "./App.css";  // 전역 스타일로 불러오기
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
        <Route path="/Home/CardRegister" element={<CardRegister />}></Route>
        <Route path="/MapPage" element={<MapPage />}></Route>
        <Route path="/MapPage/ReviewReg" element={<ReviewRegister />}></Route>
        <Route path="/" element={<App />}></Route>
        <Route path="/ConsumeHistory" element={<ConsumeHistory />}></Route>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/MyPage/AddrList" element={<AddressList />}></Route>
        <Route path="/MyPage/AddrRegister" element={<AddressRegister />}></Route>
        <Route path="/Calendar" element={<Calendar />}></Route>
      </Routes>
    </BrowserRouter>
);

reportWebVitals();
