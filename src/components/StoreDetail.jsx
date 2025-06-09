
function StoreDetail(props) {
  const {store, setStore} = props


  const exitClickHandler = () => {
      setStore(null)
  }

  function moneyComma(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
        <span>{store.storeCate}</span>
      </div>
      <div>
        <span>★</span>
        <span>4.4</span>
        <span>방문자 리뷰 20</span>
      </div>
      <div>{store.storeAddr}</div>
    </div>
    <div className="detail_menu_area">
      <div>메뉴</div>
      <div>
        <ul>
          {store.menus.map((menu,index) => (
            <li key = {menu.menuId}>
              <img src = {menu.menuImg} alt={menu.menuName}/>
              <div className="menu_info_area">
                <div>{menu.menuName}</div>
                <div>{moneyComma(menu.menuPrice)} 원</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);
}

export default StoreDetail;