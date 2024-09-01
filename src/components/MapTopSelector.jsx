import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/mapPage.css";

function MapTopSelector(props) {
  const { pageState } = props;
  const navigate = useNavigate();

  const clickHandler = (newPageState) => {
    // 페이지 상태에 따라 다른 경로로 이동
    if (newPageState === "recommend") {
      navigate("/map/recommend");
    } else if (newPageState === "history") {
      navigate("/map/payhistory");
    }
  };

  return (
    <div className="map_top_selector">
      <div
        className={pageState === "history" ? "top_selected" : ""}
        onClick={() => clickHandler("history")}
      >
        결제이력
      </div>
      <div
        className={pageState === "recommend" ? "top_selected" : ""}
        onClick={() => clickHandler("recommend")}
      >
        장소추천
      </div>
    </div>
  );
}

export default MapTopSelector;
