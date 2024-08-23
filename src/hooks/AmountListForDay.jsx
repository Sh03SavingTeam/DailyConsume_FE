import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import "../styles/AmountListForDay.css";
import AmountDetail from "./AmountDetail"; // 상세보기 컴포넌트 추가

function AmountListForDay({ initialDay }) {
  const [day, setDay] = useState(initialDay);
  const [orderList, setOrderList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목
  const [isDetailVisible, setIsDetailVisible] = useState(false); // 상세보기 표시 상태

  useEffect(() => {
    setDay(initialDay);
  }, [initialDay]);

  // fetchOrderList 함수 정의를 useEffect 외부로 이동
  const fetchOrderList = async () => {
    try {
      const formattedDate = moment(day, "YYYY년 MM월 DD일");
      const year = formattedDate.format("YYYY");
      const month = formattedDate.format("MM");
      const dayOfMonth = formattedDate.format("DD");

      const response = await axios.get(
        "http://localhost:9999/api/calendar/payhistory/daily",
        {
          params: {
            memberId: "user01", // 실제 로그인 사용자 ID로 변경
            day: dayOfMonth,
            month: month,
            year: year,
          },
        }
      );

      const fetchedData = response.data.map((item) => ({
        id: item.payId,
        time: moment(item.payDate).format("HH:mm:ss"),
        amount: item.payAmount,
        description: item.storeName || "Unknown Store",
        myPayCheck: item.myPayCheck, // 본인 결제 여부 추가
        type: item.myPayCheck === 1 ? "normal" : "suspicious", // 정상/이상 결제 구분
      }));

      setOrderList(fetchedData);
    } catch (err) {
      setError("Failed to fetch data from server");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrderList();
  }, [day]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  const formattedDay = moment(day, "YYYY년 MM월 DD일").format("YY.MM.DD");

  const handleItemClick = (item) => {
    setSelectedItem({ ...item, memberId: "user01" }); // memberId 추가
    setIsDetailVisible(true);
  };

  const handleCloseDetail = () => {
    setIsDetailVisible(false);
    setSelectedItem(null);
    fetchOrderList(); // 상세보기 닫을 때 목록 새로고침
  };

  return (
    <div className="amount-list">
      <div className="date-header">{formattedDay}</div>
      <ul>
        {orderList.length > 0 ? (
          orderList.map((item, index) => (
            <li
              key={index}
              className="amount-list-item"
              onClick={() => handleItemClick(item)}
            >
              <div
                className={`icon ${
                  item.type === "normal" ? "check-icon" : "warning-icon"
                }`}
              >
                {item.type === "normal" ? "✔️" : "!"}
              </div>
              <div className="item-details">
                <span className="time">{item.time}</span>
                <span className="amount">{item.amount}원</span>
                <span className="description">{item.description}</span>
              </div>
            </li>
          ))
        ) : (
          <li className="no-data">No data available for this date.</li>
        )}
      </ul>
      {isDetailVisible && selectedItem && (
        <AmountDetail item={selectedItem} onClose={handleCloseDetail} />
      )}
      <hr />
      <div className="detail-item weekly-budget">
        <strong>주간소비잔여금액:</strong>
      </div>
    </div>
  );
}

export default AmountListForDay;
