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
import ConsumeCompare from "./pages/ConsumeCompare";
import ConsumeSet from "./pages/ConsumeSet";
import ConsumeLogin from "./pages/ConsumeLogin";
import ConsumeJoin from "./pages/ConsumeJoin";

import Home from "./pages/Home";
import AddressList from "./pages/AddressList";
import AddressRegister from "./pages/AddressRegister";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/Home/CardRegister" element={<CardRegister />}></Route>
        <Route path="/MapPage" element={<MapPage />}></Route>
        <Route path="/MapPage/ReviewReg" element={<ReviewRegister />}></Route>
        <Route path="/" element={<App />}></Route>
        <Route path="/ConsumeHistory" element={<ConsumeHistory memberId="min"/> }></Route>
        <Route path="/ConsumeCompare" element={<ConsumeCompare memberId="min"/> }></Route>
        <Route path="/ConsumeSet" element={<ConsumeSet memberId="min"/> }></Route>
        <Route path="/Login" element={<ConsumeLogin />}></Route>
        <Route path="/Join" element={<ConsumeJoin />}></Route>
        <Route path="/ConsumeHistory" element={<ConsumeHistory />}></Route>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/MyPage/AddrList" element={<AddressList />}></Route>
        <Route
          path="/MyPage/AddrRegister"
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
