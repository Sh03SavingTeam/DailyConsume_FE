// logo.svg 파일을 import합니다.
import logo from "../logo.svg";
// React 라이브러리를 import합니다.
import React, { useState, useEffect } from "react";
// App.css 파일을 import하여 스타일을 적용합니다.
import "../App.css";
// Footer 컴포넌트를 import합니다.
import Footer from "../components/Footer";
// Header 컴포넌트를 import합니다.
import Header from "../components/Header";
import Main from "../components/Main";

import { Map, MapMarker } from "react-kakao-maps-sdk";
import useKakaoLoader from "../services/useKakaoLoader";
import MapTopSelector from "../components/MapTopSelector";

function MapPage() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          setError(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  useKakaoLoader();

  // 사용자의 결제이력을 가져와 다음과 같이 리스트 생성
  const positions = [
    {
      title: "카카오",
      latlng: { lat: 33.450705, lng: 126.570677 },
    },
    {
      title: "생태연못",
      latlng: { lat: 33.450936, lng: 126.569477 },
    },
    {
      title: "텃밭",
      latlng: { lat: 33.450879, lng: 126.56994 },
    },
    {
      title: "근린공원",
      latlng: { lat: 33.451393, lng: 126.570738 },
    },
    {
      title: "GPS위치",
      latlng: { lat: location.latitude, lng: location.longitude },
    },
  ];
  return (
    <div className="container">
      <p>
        Latitude: {location.latitude} <br />
        Longitude: {location.longitude}
      </p>
      <Map
        id="map"
        center={{ lat: location.latitude, lng: location.longitude }}
        style={{ width: "100%", aspectRatio: 9 / 16 }}
        level={3} // 지도의 확대 레벨
      >
        {positions.map((position, index) => (
          <MapMarker
            key={`${position.title}-${position.latlng}`}
            position={position.latlng} // 마커를 표시할 위치
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 마커이미지의 주소입니다
              size: {
                width: 24,
                height: 35,
              }, // 마커이미지의 크기입니다
            }}
            title={position.title} // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
          />
        ))}
      </Map>

      <Footer />
    </div>
  );
}

export default MapPage;
