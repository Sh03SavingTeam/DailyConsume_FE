import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import "../styles/AmountListForDay.css";
import AmountDetail from "./AmountDetail"; // 상세보기 컴포넌트 추가

function AmountListForDay({ initialDay }) {
  const [day, setDay] = useState(initialDay);
  const [orderList, setOrderList] = useState([]);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isDetailVisible, setIsDetailVisible] = useState(false);
  const [weeklyBudget, setWeeklyBudget] = useState(null);

  useEffect(() => {
    setDay(initialDay);
  }, [initialDay]);

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
            memberId: "user01",
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
        myPayCheck: item.myPayCheck,
        type: item.myPayCheck === 1 ? "normal" : "suspicious",
      }));

      setOrderList(fetchedData);
    } catch (err) {
      setError("Failed to fetch data from server");
      console.error(err);
    }
  };

  const fetchWeeklyBudget = async () => {
    try {
      const formattedDate = moment(day, "YYYY년 MM월 DD일");
      const year = formattedDate.format("YYYY");
      const month = formattedDate.format("MM");
      const dayOfMonth = formattedDate.format("DD");

      const response = await axios.get(
        "http://localhost:9999/api/calendar/payweekly",
        {
          params: {
            memberId: "user01",
            year: year,
            month: month,
            day: dayOfMonth,
          },
        }
      );

      setWeeklyBudget(response.data);
    } catch (err) {
      setError("Failed to fetch weekly budget data");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrderList();
    fetchWeeklyBudget();
  }, [day]);

  useEffect(() => {
    return () => {
      setOrderList([]);
      setWeeklyBudget(null);
    };
  }, [initialDay]);

  const handleItemClick = (item) => {
    setSelectedItem({ ...item, memberId: "user01" });
    setIsDetailVisible(true);
  };

  const handleCloseDetail = () => {
    setIsDetailVisible(false);
    setSelectedItem(null);
    fetchOrderList();
  };

  const formattedDay = moment(day, "YYYY년 MM월 DD일").format("YY.MM.DD");

  return (
    <div className="amount-list">
      <div className="detail-item">
        <div className="weekly-budget">
          주간소비잔여금액 :{" "}
          {weeklyBudget
            ? `${weeklyBudget.잔여금액.toLocaleString()}원`
            : "Loading..."}
        </div>
      </div>
      <hr />
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
                <span className="amount">{item.amount.toLocaleString()}원</span>
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
    </div>
  );
}

export default AmountListForDay;
