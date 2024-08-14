import React, { useCallback, useState } from "react";
import Footer from "../components/Footer";
import "../styles/cardInfo.css";

function AddressRegister(props) {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("");

  const handleGetLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          setLocation(newLocation);

          // Kakao API를 위치 정보를 얻은 후에 호출
          if (window.kakao && window.kakao.maps) {
            const geocoder = new window.kakao.maps.services.Geocoder();

            const coord = new window.kakao.maps.LatLng(
              newLocation.latitude,
              newLocation.longitude
            );

            const callback = function (result, status) {
              if (status === window.kakao.maps.services.Status.OK) {
                setAddress(result[0].address.address_name);
              }
            };

            geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
          }
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
  };

  return (
    <div className="container">
      <p>
        Latitude: {location.latitude} <br />
        Longitude: {location.longitude}
      </p>
      <div className="card-container">
        <h2>신규 주소 등록</h2>
        <button onClick={handleGetLocationClick}>현재 위치</button>
        <div class="form-group">
          <label for="address">
            주소 <span class="required">*</span>
          </label>
          <input
            type="text"
            id="address"
            placeholder=""
            value={address}
            //onChange={(e) => setAddress(e.target.value)} // 사용자 수정을 허용
            required
          />
        </div>
        <div class="form-group">
          <label for="card-number">
            별명 <span class="required">*</span>
          </label>
          <input type="text" id="card-number" placeholder="거주지" required />
        </div>
        <button>등록하기</button>
      </div>

      <Footer />
    </div>
  );
}

export default AddressRegister;
