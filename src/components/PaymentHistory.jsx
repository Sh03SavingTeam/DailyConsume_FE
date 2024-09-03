import axios from "axios";
import { useEffect, useState } from "react";
import "../styles/Home.css";

function PaymentHistory(props) {
  const [payHistoryList, setPayHistoryList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    getPayHistory();
  }, []);

  const getPayHistory = () => {
    axios({
      url: "/api/home/payhistory?memId=m002",
      method: "GET",
    })
      .then((res) => {
        console.log(res.data);
        setPayHistoryList(res.data);
        console.log(payHistoryList);
      })
      .catch((error) => {
        console.log("에러: " + error);
      });
  };

  const formatPayDate = (payDate) => {
    const date = new Date(payDate);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}.${day}`;
  };

  const formatPayTime = (payDate) => {
    const date = new Date(payDate);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatAmout = (amount) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
};

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 5);
  };

  return (
    <div className="pay_history_area">
      <div className="ph_top">
        <span className="bold-sebang"> 최근이용내역</span>
      </div>
      <div className="ph_list_area">
        {payHistoryList.length > 0 ? (
          payHistoryList.slice(0, visibleCount).map((payHistory, idx) => (
            <div className="history_info" key={idx}>
              <div className="history_top">
                <p>{payHistory.storeName}</p>
                <p>{formatAmout(payHistory.payAmount)}원</p>
              </div>
              <div className="history_bottom">
                <p>
                  <span>{formatPayDate(payHistory.payDate)}</span> 
                  <span>{formatPayTime(payHistory.payDate)}</span> | 일시불
                </p>
              </div>
            </div>
          ))
        ) : (
          <div>최근 이용내역이 존재하지 않습니다.</div>
        )}
        {visibleCount < payHistoryList.length && (
          <div className="more_btn" onClick={handleShowMore}>더보기 &darr;</div>
        )}
      </div>
    </div>
  );
}

export default PaymentHistory;
