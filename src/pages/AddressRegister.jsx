import React, { useCallback, useEffect, useState } from "react";
import Footer from "../components/Footer";
import "../styles/cardRegistration.css";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";

function AddressRegister(props) {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState(""); // 시군구를 저장하는 상태
  const [nickname, setNickname] = useState(""); // 별명을 저장하는 상태

  const navigate = useNavigate(); // useNavigate 사용

  //DB에 저장할 주소 객체
  const [dbAddress, setDbaddress] = useState({
    addrName: "별명예시",
    addrDetail: "주소예시",
    memberId: "abcd",
    addrDefault: 0,
  });

  const handleRegisterAddr = async (e) => {
    e.preventDefault();

    // 주소 객체 업데이트
    const updatedDbAddress = {
      ...dbAddress,
      addrName: nickname,
      addrDetail: district, // 별명을 addrDetail로 저장
    };

    axios({
      method: "post",
      url: "/api/address/addrRegister",
      data: updatedDbAddress,
    });

    navigate("/mypage/addrlist");
  };

  const extractDistrict = (fullAddress) => {
    // 주소를 공백으로 나누기
    const addressParts = fullAddress.split(" ");

    // 시군구를 추출하기 위해 여러 패턴을 고려
    const districtPatterns = ["시", "군", "구"];

    // 시군구를 저장할 배열
    const districtParts = [];
    for (let i = 0; i < addressParts.length; i++) {
      const part = addressParts[i];
      // 패턴 중 하나가 포함된 경우 시군구로 추정
      if (districtPatterns.some((pattern) => part.includes(pattern))) {
        districtParts.push(part);
      }
    }
    // 배열을 합쳐서 시군구로 반환
    console.log(districtParts);
    return districtParts.join(" ");
  };

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
                const fullAddress = result[0].address.address_name;
                setAddress(result[0].address.address_name);
                setDistrict(extractDistrict(fullAddress));
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

  useEffect(() => {
    console.log(nickname);
  }, [nickname]);

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="card-registration">
          <h2>신규 주소 등록</h2>
          <button className="capture-button" onClick={handleGetLocationClick}>
            현재 위치
          </button>
          {/* <div className="form-group">
            <label for="card-number">
              주소 <span class="required">*</span>
            </label>
            <input
              className="input"
              type="text"
              id="card-number"
              placeholder=""
              value={address}
              onChange={(e) => setNickname(e.target.value)} // 사용자 수정을 허용
              required
            />
          </div> */}
          <form className="card-form">
            <div className="form-group">
              <label htmlFor="district">
                주소(시군구)<span className="required">*</span>
              </label>
              <input
                className="input"
                type="text"
                id="district"
                placeholder="현재 위치 버튼을 눌러주세요"
                value={district}
                readOnly
                required
              />
            </div>
            <div className="form-group">
              <label for="nickname">
                별명 <span class="required">*</span>
              </label>
              <input
                className="input"
                type="text"
                id="nickname"
                placeholder="별명을 입력해주세요"
                required
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="submit-button"
              onClick={handleRegisterAddr}
            >
              등록하기
            </button>
          </form>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default AddressRegister;
