import axios from "axios";
import React, { useState } from "react";
import "../styles/MapSelectedStore.css"; // 스타일을 import 합니다.
import { useLocation, useNavigate } from "react-router-dom";

function MapSelectedStore(props) {
  const { store } = props;
  const [selectedStore, setSelectedStore] = useState(null);
  const navigate = useNavigate();

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

  const registerReview = ({ store }) => {
    navigate("/map/reviewregister", {
      state: {
        storename: `${store.storeName}`,
        bizNum: `${store.storeRegNum}`,
      },
    });
  };

  return (
    <div
      className="store_area"
      data-storeregnum={store.storeRegNum}
      onClick={storeClickHandler}
    >
      <img src={store.storeImg} alt={store.storeName} />
      <div className="store_info">
        <div>{store.storeName}</div>
        <div>음식점 &gt; 한식</div>
        <div>{store.storeAddr}</div>
        <button onClick={() => registerReview({ store })}>리뷰 작성하기</button>
      </div>
      {selectedStore && (
        <div className="store_detail">
          {/* StoreDetail 컴포넌트를 여기에 넣을 수 있습니다 */}
          <p>{selectedStore.storeDetail}</p>
        </div>
      )}
    </div>
  );
}

export default MapSelectedStore;
