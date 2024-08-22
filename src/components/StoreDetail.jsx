import React from "react";

function StoreDetail(props) {
    const {store, setStore} = props

    const exitClickHandler = () => {
        setStore(null)
    }

  return (
    <div className="store_detail_div">
      <div className="before_btn" onClick={exitClickHandler}>&#12296;</div>
      <img
        src={store.storeImg}
        alt={store.storeName}
      />
      <div className="detail_info">
        <div>
          <span>{store.storeName}</span>
          <span> 한식당</span>
        </div>
        <div>
          <span>★</span>
          <span>4.4</span>
          <span>방문자 리뷰 20</span>
        </div>
        <div>{store.storeAddr}</div>
      </div>
      <div className="detail_menu_area"></div>
    </div>
  );
}

export default StoreDetail;
