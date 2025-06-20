import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";  
import "react-calendar/dist/Calendar.css";  
import moment from "moment";  
import axios from "axios";  
import Footer from "../components/Footer";  
import "../App.css";  
import "../styles/RankCalendar.css";  
import RabbitCompleteImage from "../assets/RabbitComplete.png";  
import RabbitFail from "../assets/RabbitFail.png";
import RankAmountListForDay from "components/RankAmountListForDay";
// import { checkJWT } from "services/checkJWT";

const RankerCalendar = ({ memberId, onBack }) => { 
  const [nowDate, setNowDate] = useState(moment().format("YYYY년 MM월 DD일"));
  const [currentMonth, setCurrentMonth] = useState(moment().format("M월"));
  const [amountList, setAmountList] = useState([]);
  const [weeklyAchievements, setWeeklyAchievements] = useState([]);
  // const [memberId2, setMemberId2] = useState("");
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
      setWeeklyAchievements(response.data || []);
    } catch (error) {
      console.error("Failed to fetch weekly achieve data from server", error);
      setWeeklyAchievements([]);
    }
  };

  // useEffect(() => {
  //   checkJWT("/api/member/memberSession", "get", null)
  //     .then((resopnse) => {
  //       console.log("JWT 확인 결과" + resopnse.memberId);
  //       const memberId2 = resopnse.memberId;
  //       setMemberId2(memberId2);

  //         const month = moment().format("MM");
  //         fetchAmountList(month, memberId);
  //         fetchWeeklyAchievements(month, memberId);
  //       })
  //       .catch((error) => {
  //         console.error("There was an error!", error);
  //       });
  // }, [memberId]);


  useEffect(() => {
    const month = moment().format("MM");
    fetchAmountList(month, memberId);
    fetchWeeklyAchievements(month, memberId);
  }, [memberId]);

  const handleDateChange = (date) => {
    setNowDate(moment(date).format("YYYY년 MM월 DD일"));
    const month = moment(date).format("MM");
    fetchAmountList(month, memberId);
    fetchWeeklyAchievements(month, memberId);
  };

  const handleMonthChange = ({ activeStartDate }) => {
    const newMonth = moment(activeStartDate).format("MM");
    setCurrentMonth(moment(activeStartDate).format("M월"));
    fetchAmountList(newMonth, memberId);
    fetchWeeklyAchievements(newMonth, memberId);
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      if (date.getDay() === 0) { // 일요일
        return "sunday-tile";
      }
      if (date.getDay() === 6) { // 토요일
        return "saturday-tile";
      }
    }
    return null;
  };

  const f_formatDay = (locale, date) => {
    const currentDay = moment(date).format("YYYY/MM/DD");
    const filterData = amountList.filter((data) => data.day === currentDay);
    const achievementsForDay = (weeklyAchievements || []).filter(
      (achievement) => moment(achievement["종료일"]).format("YYYY/MM/DD") === currentDay
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

  const formatShortWeekday = (locale, date) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days[date.getDay() === 0 ? 6 : date.getDay() - 1];
  };

  const formatMonthYear = (locale, date) => {
    return moment(date).format("YYYY. MM");
  };

  return (
    <div className="app-container2">
      <div className="prev-btn2" onClick={onBack}>&lt;</div> {/* onBack 사용 */}
      <div className="main-content">
        <div className="calendar-container">
          <Calendar
            onChange={handleDateChange}
            value={moment(nowDate, "YYYY년 MM월 DD일").toDate()}
            formatDay={f_formatDay}
            onActiveStartDateChange={handleMonthChange}
            tileClassName={tileClassName}
            locale="en-GB"
            formatShortWeekday={formatShortWeekday}
            formatMonthYear={formatMonthYear}
          />
          <hr className="calendar-divider" />
          <RankAmountListForDay initialDay={nowDate} paramMember={memberId} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RankerCalendar;
