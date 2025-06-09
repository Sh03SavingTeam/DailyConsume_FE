import axios from "axios";
import React, { useState } from "react";
import StoreDetail from "./StoreDetail";

function MapStoreList(props) {
  const { stores } = props;
  const [isVisible, setIsVisible] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const showClickHandler = () => {
    setIsVisible(!isVisible);
  };

  const storeClickHandler = (event) => {
    const storeRegNum = event.currentTarget.dataset.storeregnum;
    console.log(storeRegNum);

    axios({
      url: "/api/recommend/detail?storeRegNum=" + storeRegNum,
      method: "GET",
    })
      .then((res) => {
        console.log(res.data);
        setSelectedStore(res.data);
      })
      .catch((error) => {
        console.log("에러: " + error);
      });
  };

  return (
    <div className="show_store_list_div">
      <div className="show_store_btn" onClick={showClickHandler}>
        {isVisible ? "지도 보기" : "목록 보기"}
      </div>
      <div className={`store_list_area ${isVisible ? "open" : "closed"}`}>
        {stores.map((store, index) => (
          <div
            key={index}
            className="store_area"
            data-storeregnum={store.storeRegNum}
            onClick={storeClickHandler}
          >
            <img src={store.storeImg} alt={store.storeName} />
            <div className="store_info">
              <div>{store.storeName}</div>
              <div>{store.cate}</div>
              <div>{store.storeAddr}</div>
            </div>
          </div>
        ))}
      </div>
      {selectedStore && (
        <StoreDetail store={selectedStore} setStore={setSelectedStore} />
      )}
    </div>
  );
}

export default MapStoreList;
