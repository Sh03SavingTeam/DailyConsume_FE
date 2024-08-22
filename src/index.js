import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import "./App.css"; // 전역 스타일로 불러오기
import CardRegister from "./pages/CardRegister";
import Home from "./pages/Home";
import MapPage from "./pages/MapPage";
import RecommendMap from "./pages/RecommendMap";
import ReviewRegister from "./pages/ReviewRegister";
import reportWebVitals from "./reportWebVitals";

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
      <Route path="/map/recommend" element={<RecommendMap/>}></Route>

      {/* 캘린더 */}
      {/* <Route path="/calander" element={<Calendar />}></Route> */}

      {/* 마이페이지 */}
      {/* <Route path="/mypage/consumehistory" element={<ConsumeHistory />}></Route>
      <Route path="/mypage/addrlist" element={<AddressList />}></Route>
      <Route path="/mypage/addrregister" element={<AddressRegister />}></Route> */}
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
