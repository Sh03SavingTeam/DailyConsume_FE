import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import axios from "axios";
import Footer from "../components/Footer";
import "../App.css";
import "../styles/Calendar.css";
import AmountListForDay from "../hooks/AmountListForDay";

const CustomCalendar = () => {
  const [nowDate, setNowDate] = useState(moment().format("YYYY년 MM월 DD일"));
  const [currentMonth, setCurrentMonth] = useState(moment().format("M월"));
  const [amountList, setAmountList] = useState([]);
  const [weeklyAchievements, setWeeklyAchievements] = useState([]); // 새로운 상태 추가

  // 사용자의 memberId를 동적으로 받아오는 함수
  const getMemberId = () => {
    return "user01"; // 실제 로그인 상태에서 받아온 사용자 ID를 반환해야 함
  };

  // 서버에서 일별 결제 내역을 가져오는 함수
  const fetchAmountList = async (month, memberId) => {
    try {
      const response = await axios.get("/api/calendar/payhistory", {
        params: { month, memberId },
      });
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

  // 서버에서 주간 달성 여부를 가져오는 함수
  const fetchWeeklyAchievements = async (month, memberId) => {
    try {
      const response = await axios.get("/api/calendar/weeklyConsume/month", {
        params: { month, memberId },
      });
      console.log(response.data);
      setWeeklyAchievements(response.data);
    } catch (error) {
      console.error("Failed to fetch weekly achieve data from server", error);
    }
  };

  useEffect(() => {
    console.log(amountList);
  }, [amountList]);

  useEffect(() => {
    const memberId = getMemberId();
    const month = moment().format("MM");
    fetchAmountList(month, memberId);
    fetchWeeklyAchievements(month, memberId); // 주간 달성 여부 데이터도 함께 로드
  }, []);

  const handleDateChange = (date) => {
    setNowDate(moment(date).format("YYYY년 MM월 DD일"));
    const memberId = getMemberId();
    const month = moment(date).format("MM");
    fetchAmountList(month, memberId);
    fetchWeeklyAchievements(month, memberId); // 선택한 날짜에 대한 주간 달성 여부도 함께 로드
  };

  const handleMonthChange = ({ activeStartDate }) => {
    const newMonth = moment(activeStartDate).format("MM");
    setCurrentMonth(moment(activeStartDate).format("M월"));
    const memberId = getMemberId();
    fetchAmountList(newMonth, memberId);
    fetchWeeklyAchievements(newMonth, memberId); // 월이 변경될 때 주간 달성 여부도 함께 로드
  };

  const f_formatDay = (locale, date) => {
    const currentDay = moment(date).format("YYYY/MM/DD");

    const filterData = amountList.filter((data) => data.day === currentDay);

    const achievementsForDay = weeklyAchievements.filter((achievement) => {
      console.log(
        moment(achievement["종료일"]).format("YYYY-MM-DD"),
        currentDay
      );
      return moment(achievement["종료일"]).format("YYYY/MM/DD") === currentDay;
    });

    return (
      <div className="calendar-info">
        <span>{moment(date).format("D")}</span>
        {filterData.length > 0 && (
          <div>
            <span className="calendar-count">{filterData.length}건</span>
            <span className="calendar-amount">
              {filterData
                .reduce((sum, item) => sum + item.amount, 0)
                .toLocaleString()}
            </span>
          </div>
        )}
        {achievementsForDay.map((achievement, index) => {
          console.log("Achievement:", achievement);
          return (
            <img
              key={index}
              src={
                achievement["달성여부"] === "1"
                  ? "../assets/RabbitComplete.png"
                  : ""
              }
              className="calanderRabbit-style"
              alt="Weekly Achievement"
            />
          );
        })}
      </div>
    );
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

export default CustomCalendar;
