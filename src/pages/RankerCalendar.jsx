import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import axios from "axios";
import Footer from "../components/Footer";
import "../App.css";
import "../styles/Calendar.css";
import AmountListForDay from "../hooks/AmountListForDay";
import { checkJWT } from "services/checkJWT";

const RankerCalendar = ({ memberId }) => {
  const [memberID, setMemberID] = useState("");
  const [nowDate, setNowDate] = useState(moment().format("YYYY년 MM월 DD일"));
  const [currentMonth, setCurrentMonth] = useState(moment().format("M월"));
  const [amountList, setAmountList] = useState([]);

  // 서버에서 데이터를 가져오는 함수
  const fetchAmountList = async (month, memberId) => {
    try {
      const response = await axios.get(
        "http://localhost:9999/api/calendar/payhistory",
        {
          params: { month, memberId },
        }
      );
      const fetchedData = response.data.map((item) => ({
        day: moment(item.payDate).format("YYYY/MM/DD"),
        amount: item.payAmount,
      }));
      setAmountList(fetchedData);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log("No data found for this month");
        setAmountList([]); // 데이터를 초기화하거나 에러 메시지 출력
      } else {
        console.error("Failed to fetch data from server", error);
      }
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. JWT 확인
        const jwtResponse = await checkJWT(
          "/api/member/memberSession",
          "get",
          null
        );
        console.log("JWT 확인 결과: " + jwtResponse.memberId);
        const memberID = jwtResponse.memberId;
        setMemberID(memberID);

        // 2. 현재 월 구하고 Amount 리스트 가져오기
        const month = moment().format("MM");
        fetchAmountList(month, memberID);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    // 데이터를 가져오는 함수 호출
    fetchData();
  }, []); // 초기 렌더링 시 한 번만 실행되도록 빈 배열 설정

  // useEffect(() => {
  //   checkJWT("/api/member/memberSession", "get", null)
  //     .then((resopnse) => {
  //       console.log("JWT 확인 결과" + resopnse.memberId);
  //       const memberID = resopnse.memberId;
  //       setMemberID(memberID);
  //     })
  //     .catch((error) => {
  //       console.error("There was an error!", error);
  //     });
  // }, []);
  // useEffect(() => {
  //   const month = moment().format("MM");
  //   fetchAmountList(month, memberID);
  // }, [memberID]);

  const handleDateChange = (date) => {
    setNowDate(moment(date).format("YYYY년 MM월 DD일"));
    const month = moment(date).format("MM");
    fetchAmountList(month, memberID);
  };

  const handleMonthChange = ({ activeStartDate }) => {
    const newMonth = moment(activeStartDate).format("MM");
    setCurrentMonth(moment(activeStartDate).format("M월"));
    fetchAmountList(newMonth, memberID);
  };

  const f_formatDay = (locale, date) => {
    const currentDay = moment(date).format("YYYY/MM/DD");
    const filterData = amountList.filter((data) => data.day === currentDay);

    if (filterData.length > 0) {
      const totalAmount = filterData.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      return (
        <div className="calendar-info">
          <img
            src="/RabbitComplete.png"
            className="calanderRabbit-style"
            alt="Complete"
          />
          <span>{moment(date).format("D")}</span>
          <span className="calendar-count">{filterData.length}건</span>
          <span className="calendar-amount">
            {totalAmount.toLocaleString()}
          </span>
        </div>
      );
    } else {
      return moment(date).format("D");
    }
  };

  return (
    <div className="app-container">
      <h1> 소비 캘린더 </h1>
      <div className="main-content">
        <div className="calendar-container">
          <h2 className="month-title">{currentMonth}</h2>
          <Calendar
            onChange={handleDateChange}
            value={moment(nowDate, "YYYY년 MM월 DD일").toDate()}
            formatDay={f_formatDay}
            onActiveStartDateChange={handleMonthChange}
          />
          <hr className="calendar-divider" />
          <AmountListForDay initialDay={nowDate} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RankerCalendar;
