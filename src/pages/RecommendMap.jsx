import React, { useEffect, useState } from "react";
import "../App.css";
import Footer from "../components/Footer";
import customMarker from "../assets/location_7.png";
import consumeMarker from "../assets/consumeMarker.png";
import peerMarker from "../assets/peerMarker.png";
import dayMarker from "../assets/dayMarker.png";
import fullMarker from "../assets/fullMarker.png";

import axios from "axios";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import MapTopSelector from "../components/MapTopSelector";
import useKakaoLoader from "../services/useKakaoLoader";
import MapStoreList from "components/MapStoreList";
import calendarIcon from "../assets/calendar.png";
import consumptionIcon from "../assets/consumption.png";
import robotIcon from "../assets/robot.png";
import happyIcon from "../assets/happy.png";
import Loading from "components/Loading";
import ScopeIcon from "../assets/scope.png";
import WeeklyIcon from "../assets/receive-money.png";
import { checkJWT } from "services/checkJWT";

function MapPage() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(false);
  const [position, setPosition] = useState({
    lat: Number,
    lng: Number,
  });

  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);

  const [isClicked, setIsClicked] = useState("");

  const [memberId, setMemberId] = useState(null);

  const currentGeo = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log(location);
        },
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  const clickPeerRecommend = () => {
    setLoading(true);
    currentGeo();
    axios({
      url:
        "/api/recommend/peer?lon=" +
        location.latitude +
        "&lat=" +
        location.longitude,
      method: "GET",
    })
      .then((res) => {
        console.log(res.data);
        setStores(res.data);
        setIsClicked("peer");
        setLoading(false);
      })
      .catch((error) => {
        console.log("에러: " + error);
        setLoading(false);
      });
  };

  const clickDaypatternRecommend = () => {
    setLoading(true);
    currentGeo();
    axios({
      url:
        "/api/recommend/daypattern?lon=" +
        location.latitude +
        "&lat=" +
        location.longitude,
      method: "GET",
    })
      .then((res) => {
        console.log(res.data);
        setStores(res.data);
        setIsClicked("day");
        setLoading(false);
      })
      .catch((error) => {
        console.log("에러: " + error);
        setLoading(false);
      });
  };

  const clickConsumeRecommend = () => {
    setLoading(true);
    currentGeo();
    axios({
      url:
        "/api/recommend/consume?lon=" +
        location.latitude +
        "&lat=" +
        location.longitude,
      method: "GET",
    })
      .then((res) => {
        console.log(res.data);
        setStores(res.data);
        setIsClicked("consume");
        setLoading(false);
      })
      .catch((error) => {
        console.log("에러: " + error);
        setLoading(false);
      });
  };

  const clickAllpatternRecommend = () => {
    setLoading(true);
    currentGeo();
    axios({
      url:
        "/api/recommend/all?lon=" +
        location.latitude +
        "&lat=" +
        location.longitude,
      method: "GET",
    })
      .then((res) => {
        console.log(res.data);
        setStores(res.data);
        setIsClicked("full");
        setLoading(false);
      })
      .catch((error) => {
        console.log("에러: " + error);
        setLoading(false);
      });
  };

  const getWeeklyConsumeStore = () => {
    weeklyConsume();
  };

  const weeklyConsume = () => {
    axios({
      url: "/api/recommend/weekly?memId=" + memberId,
      method: "GET",
    })
      .then((res) => {
        console.log(res.data);
        setStores(res.data);
      })
      .catch((error) => {
        console.log("에러: " + error);
      });
  };

  const getRecommendStore = () => {
    // const geocoder = new window.kakao.maps.services.Geocoder();
    currentGeo();
    axios({
      url: "/api/recommend/store",
      method: "GET",
    })
      .then((res) => {
        console.log(res.data);
        setStores(res.data);
        // 딜레이를 생성하는 함수
        // const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // const processStores = async (stores) => {
        //   for (let index = 0; index < stores.length; index++) {
        //     const store = stores[index];
        //     await delay(1000); // 1초 지연
        //     geocoder.addressSearch(store.storeAddr, function(result, status) {
        //       if (status === window.kakao.maps.services.Status.OK) {
        //         console.log("가맹점 코드:" + store.storeRegNum + "    y: " + result[0].y + " x: " + result[0].x);
        //         updateLatLon(store.storeRegNum, result[0].y, result[0].x)
        //       }
        //     });
        //   }
        // };

        // processStores(res.data);
      })
      .catch((error) => {
        console.log("에러: " + error);
      });
  };

  // const updateLatLon = (storeRegNum, y, x) => {
  //   axios({
  //     url: "/api/recommend/updateStore",
  //     method: "PUT",
  //     data: {"storeRegNum": storeRegNum, "storeLatX":y, "storeLonY": x }
  //   })
  //     .then((res) => {
  //       console.log(res.data);
  //     }).catch((error) => {
  //       console.log(error);
  //     })
  // }

  const markerClickHandler = (store, e) => {
    console.log(store);
    if (selectedStore != null) setSelectedStore(null);
    else setSelectedStore(store);
  };

  const searchDetailAddr = (lat, lng) => {
    const geocoder = new window.kakao.maps.services.Geocoder();

    geocoder.coord2Address(lng, lat, function (result, status) {
      if (status === window.kakao.maps.services.Status.OK) {
        // 도로명 주소가 있는 경우 출력
        if (result[0].road_address) {
          console.log(result[0].road_address.address_name);
        } else {
          // 도로명 주소가 없으면 지번 주소 출력
          console.log(result[0].address.address_name);
        }
      } else {
        console.error("주소 변환에 실패했습니다.");
      }
    });
  };

  const mapClickHandler = (_, mouseEvent) => {
    const latlng = mouseEvent.latLng;
    setPosition({
      lat: latlng.getLat(),
      lng: latlng.getLng(),
    });

    console.log(position);

    searchDetailAddr(latlng.getLat(), latlng.getLng());
  };

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
          console.log(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    checkAndFetchData();
  }, []);

  useKakaoLoader();

  const checkAndFetchData = async () => {
    try {
      const response = await checkJWT("/api/member/memberSession", "get", null);
      console.log("JWT 확인 결과: " + response.memberId);
      const memId = response.memberId;
      setMemberId(memId);
    } catch (error) {
      console.error("데이터 처리 중 오류 발생!" + error);
    }

    //결제 내역 가맹점 불러오기
  };

  return (
    <div className="container" style={{ height: "91svh", minHeight: "91svh" }}>
      {loading ? <Loading /> : null}
      <Map
        id="map"
        center={{ lat: location.latitude, lng: location.longitude }}
        style={{ width: "100%", aspectRatio: 9 / 16 }}
        level={3} // 지도의 확대 레벨
        onClick={mapClickHandler}
      >
        {/* 사용자 현재 위치 표시. PC 경우 다소 부정확함 */}
        <MapMarker
          position={{ lat: location.latitude, lng: location.longitude }}
        />

        {stores.map((store, index) => (
          <MapMarker
            key={index}
            position={{ lat: store.storeLatX, lng: store.storeLonY }}
            image={{
              src:
                isClicked === "consume"
                  ? consumeMarker
                  : isClicked === "peer"
                  ? peerMarker
                  : isClicked === "day"
                  ? dayMarker
                  : isClicked === "full"
                  ? fullMarker
                  : customMarker,
              size: {
                width: 30,
                height: 30,
              },
            }}
            title={store.storeName}
            onClick={() => markerClickHandler(store)}
          >
            {selectedStore &&
              selectedStore.storeRegNum === store.storeRegNum && (
                <div
                  className="marker_click_div"
                  style={{ padding: "10px", color: "#000" }}
                >
                  <img src={store.storeImg} />
                  <div className="marker_store_info">
                    <div>{store.storeName}</div>
                    <div>{store.cate}</div>
                    <div>{store.storeAddr}</div>
                  </div>
                </div>
              )}
          </MapMarker>
        ))}
      </Map>
      <MapTopSelector pageState="recommend" />
      <div className="marker_category_div">
        <div
          className={`consume-pattern ${
            isClicked === "consume" ? "consume" : ""
          }`}
          onClick={clickConsumeRecommend}
        >
          <img src={consumptionIcon} alt="calendarIcon" /> 소비 패턴
        </div>
        <div
          className={`peer-recommend ${isClicked === "peer" ? "peer" : ""}`}
          onClick={clickPeerRecommend}
        >
          <img src={happyIcon} alt="calendarIcon" /> 또래 추천
        </div>
        <div
          className={`day-consumption ${isClicked === "day" ? "day" : ""}`}
          onClick={clickDaypatternRecommend}
        >
          <img src={calendarIcon} alt="calendarIcon" /> 요일 소비
        </div>
        <div
          className={`full-recommend ${isClicked === "full" ? "full" : ""}`}
          onClick={clickAllpatternRecommend}
        >
          <img src={robotIcon} alt="calendarIcon" /> 통합 추천
        </div>
      </div>
      <div className="right_btn_div">
        <div onClick={currentGeo}>
          <img src={ScopeIcon} alt="currentGeoBtn" />
        </div>
        <div onClick={getWeeklyConsumeStore}>
          <img src={WeeklyIcon} alt="weekConsumeBtn" />
        </div>
      </div>

      <MapStoreList stores={stores} />

      <Footer />
    </div>
  );
}

export default MapPage;
