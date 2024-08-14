import React, { useEffect, useState } from "react";
import "../App.css";
import Footer from "../components/Footer";

import { Map, MapMarker } from "react-kakao-maps-sdk";
import MapTopSelector from "../components/MapTopSelector";
import useKakaoLoader from "../services/useKakaoLoader";

function MapPage() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);

  const center = {
    // 지도의 중심좌표
    lat: 33.450701,
    lng: 126.570667,
  };

  const mapClickHandler = (_, mouseEvent) => {
    const latlng = mouseEvent.latLng;
    setPosition({
      lat: latlng.getLat(),
      lng: latlng.getLng(),
    });
  };

  const [position, setPosition] = useState({
    lat: Number,
    lng: Number,
  });

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

  return (
    <div className="container">
      <Map
        id="map"
        center={{ lat: location.latitude, lng: location.longitude }}
        style={{ width: "100%", aspectRatio: 9 / 16 }}
        level={3} // 지도의 확대 레벨
        onClick={mapClickHandler}
      >
        <MapMarker position={position ?? center} />
      </Map>
      <MapTopSelector />
      <div id="clickLatlng">
        {position &&
          `클릭한 위치의 위도는 ${position.lat} 이고, 경도는 ${position.lng} 입니다`}
      </div>
      <Footer />
    </div>
  );
}

export default MapPage;
