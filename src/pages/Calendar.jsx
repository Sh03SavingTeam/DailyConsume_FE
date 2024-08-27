import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import axios from "axios";
import Footer from "../components/Footer";
import "../App.css";
import "../styles/Calendar.css";
import AmountListForDay from "../hooks/AmountListForDay";
import RabbitCompleteImage from "../assets/RabbitComplete.png"; // 이미지 파일 import
import RabbitFail from "../assets/RabbitFail.png";
import RabbitEmpty from "../assets/RabbitEmpty.png";
const CustomCalendar = () => {
  const [nowDate, setNowDate] = useState(moment().format("YYYY년 MM월 DD일"));
  const [currentMonth, setCurrentMonth] = useState(moment().format("M월"));
  const [amountList, setAmountList] = useState([]);
  const [weeklyAchievements, setWeeklyAchievements] = useState([]);

  const getMemberId = () => "m001"; // 실제 로그인 상태에서 받아온 사용자 ID를 반환해야 함

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
      console.error("Failed to fetch data from server", error);
      setAmountList([]);
    }
  };
  const fetchWeeklyAchievements = async (month, memberId) => {
    try {
      const response = await axios.get("/api/calendar/weeklyConsume/month", {
        params: { month, memberId },
      });
      setWeeklyAchievements(response.data || []); // 데이터를 배열로 설정
    } catch (error) {
      console.error("Failed to fetch weekly achieve data from server", error);
      setWeeklyAchievements([]); // 에러가 발생하면 빈 배열로 설정
    }
  };
  useEffect(() => {
    const memberId = getMemberId();
    const month = moment().format("MM");
    fetchAmountList(month, memberId);
    fetchWeeklyAchievements(month, memberId);
  }, []);
  const handleDateChange = (date) => {
    setNowDate(moment(date).format("YYYY년 MM월 DD일"));
    const memberId = getMemberId();
    const month = moment(date).format("MM");
    fetchAmountList(month, memberId);
    fetchWeeklyAchievements(month, memberId);
  };
  const handleMonthChange = ({ activeStartDate }) => {
    const newMonth = moment(activeStartDate).format("MM");
    setCurrentMonth(moment(activeStartDate).format("M월"));
    const memberId = getMemberId();
    fetchAmountList(newMonth, memberId);
    fetchWeeklyAchievements(newMonth, memberId);
  };
  const f_formatDay = (locale, date) => {
    const currentDay = moment(date).format("YYYY/MM/DD");
    const filterData = amountList.filter((data) => data.day === currentDay);
    const achievementsForDay = (weeklyAchievements || []).filter(
      (achievement) => {
        return (
          moment(achievement["종료일"]).format("YYYY/MM/DD") === currentDay
        );
      }
    );
    return (
      <div className="calendar-info">
        <span>
          {achievementsForDay.map((achievement, index) => (
            <img
              key={index}
              src={
                achievement["달성여부"] === "1"
                  ? RabbitCompleteImage
                  : RabbitFail
              }
              className="calanderRabbit-style"
              alt="Weekly Achievement"
            />
          ))}
          {moment(date).format("D")}
        </span>
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
      </div>
    );
  };
  return (
    <div className="app-container">
      <h1> 소비 캘린더 </h1>
      <div className="main-content">
        <div className="calendar-container">
          {/* <h2 className="month-title">{currentMonth}</h2> */}
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
