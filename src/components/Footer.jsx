import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HomeOn from "../assets/HomeOn.png";
import HomeOff from "../assets/HomeOff.png";
import MapOff from "../assets/MapOff.png";
import MapOn from "../assets/MapOn.png";
import CalendarOff from "../assets/CalendarOff.png";
import CalendarOn from "../assets/CalendarOn.png";
import MyPageOff from "../assets/MyPageOff.png";
import MyPageOn from "../assets/MyPageOn.png";
import "../styles/Toast.css"

const Footer = () => {
  const [selectedButton, setSelectedButton] = useState("home");
  const navi = useNavigate();
  const location = useLocation(); // 현재 위치를 가져오기 위해 useLocation 사용

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleShowToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // 현재 URL 경로에 따라 상태 업데이트
  useEffect(() => {
    switch (location.pathname) {
      case "/":
        setSelectedButton("home");
        break;
      case "/map/payhistory":
      case "/map/recommend":
        setSelectedButton("map");
        break;
      case "/calendar":
        setSelectedButton("calendar");
        break;
      case "/MyPage":
      case "/MyPage/AddrRegister":
        setSelectedButton("mypage");
        break;
      default:
        setSelectedButton("");
    }
  }, [location.pathname]);

  const handleButtonClick = (buttonName, path) => {
    setSelectedButton(buttonName);
    navi(path);
  };

  const getButtonImage = (buttonName) => {
    switch (buttonName) {
      case "home":
        return selectedButton === "home" ? HomeOn : HomeOff;
      case "map":
        return selectedButton === "map" ? MapOn : MapOff;
      case "calendar":
        return selectedButton === "calendar" ? CalendarOn : CalendarOff;
      case "mypage":
        return selectedButton === "mypage" ? MyPageOn : MyPageOff;
      default:
        return HomeOff;
    }
  };

  return (
    <footer className="footer-container">
      <div className="bottom-navigation">
        <button
          onClick={() => handleButtonClick("home", "/")}
          className={selectedButton === "home" ? "selected" : ""}
        >
          <img src={getButtonImage("home")} alt="Home" />홈
        </button>
        <button
          onClick={() => handleButtonClick("map", "/map/payhistory")}
          className={selectedButton === "map" ? "selected" : ""}
        >
          <img src={getButtonImage("map")} alt="Map" />
          지도
        </button>
        <button
          onClick={() => handleButtonClick("calendar", "/calendar")}
          className={selectedButton === "calendar" ? "selected" : ""}
        >
          <img src={getButtonImage("calendar")} alt="Calendar" />
          캘린더
        </button>
        <button
          onClick={() => handleButtonClick("mypage", "/MyPage")}
          className={selectedButton === "mypage" ? "selected" : ""}
        >
          <img src={getButtonImage("mypage")} alt="My Page" />
          마이페이지
        </button>
      </div>
      {showToast && <div className="toast">{toastMessage}</div>}
    </footer>
  );
};

export default Footer;
