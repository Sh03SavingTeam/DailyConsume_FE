// logo.svg 파일을 import합니다.
import logo from "../logo.svg";
// React 라이브러리를 import합니다.
import React, { useEffect } from "react";
// App.css 파일을 import하여 스타일을 적용합니다.
import "../App.css";
// Footer 컴포넌트를 import합니다.
import Footer from "../components/Footer";
// Header 컴포넌트를 import합니다.
import Header from "../components/Header";
import Main from "../components/Main";

import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "../services/useKakaoLoader";

function MapPage() {
  useKakaoLoader();
  return (
    <div className="container">
      <Map
        id="map"
        center={{ lat: 33.5563, lng: 126.79581 }}
        style={{ width: "100%", height: "1100px" }}
        level={3} // 지도의 확대 레벨
      >
        <MapMarker position={{ lat: 33.55635, lng: 126.795841 }}>
          <div style={{ color: "#000" }}>Hello World!</div>
        </MapMarker>
      </Map>

      <Footer />
    </div>
  );
}

export default MapPage;
