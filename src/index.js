import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import MapPage from "./pages/MapPage";
import ReviewRegister from "./pages/ReviewRegister";
import CardRegister from "./pages/CardRegister";
import Home from "./pages/Home";
import MyPage from "./pages/MyPage";
import RankInfo from "./pages/RankInfo";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <div>
    <BrowserRouter>
      <Routes>
        <Route path="/Home/CardRegister" element={<CardRegister />}></Route>
        <Route path="/MapPage" element={<MapPage />}></Route>
        <Route path="/MapPage/ReviewReg" element={<ReviewRegister />}></Route>
        <Route path="/Home" element={<Home />}></Route>
        <Route path="/rank" element={<MyPage/>}></Route>
        <Route path="/rank/benefits/:memberId" element={<RankInfo/>}></Route>
       
      </Routes>
    </BrowserRouter>
  </div>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();