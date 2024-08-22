import React, { useEffect, useState } from "react";
import "../App.css";
import Footer from "../components/Footer";
import customMarker from "../assets/restaurant.png";

import axios from "axios";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import MapTopSelector from "../components/MapTopSelector";
import useKakaoLoader from "../services/useKakaoLoader";
import MapStoreList from "components/MapStoreList";
import MapSelectedStore from "components/MapSelectedStore";

function PayHistoryMap() {
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  const center = {
    lat: 33.450701,
    lng: 126.570667,
  };

  const [position, setPosition] = useState({
    lat: Number,
    lng: Number,
  });

  const [stores, setStores] = useState([]);
  const [store, setStore] = useState(null);

  const getRecommendStore = () => {
    // const geocoder = new window.kakao.maps.services.Geocoder();
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
    setStore(store);
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
      getRecommendStore();
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useKakaoLoader();

  return (
    <div className="app-container">
      <div className="main-content">
        <Map
          id="map"
          center={{ lat: location.latitude, lng: location.longitude }}
          style={{ width: "100%", aspectRatio: 9 / 16 }}
          level={3} // 지도의 확대 레벨
          onClick={mapClickHandler}
        >
          {stores.map((store, index) => (
            <MapMarker
              key={index}
              position={{ lat: store.storeLatX, lng: store.storeLonY }}
              image={{
                src: customMarker,
                size: {
                  width: 30,
                  height: 30,
                },
              }}
              title={store.storeName}
              onClick={() => markerClickHandler(store)}
            />
          ))}
          {store && (
            <div className="map-selected-store-container">
              <MapSelectedStore store={store} />
            </div>
          )}
        </Map>

        <MapTopSelector />
      </div>
      <Footer />
    </div>
  );
}

export default PayHistoryMap;
