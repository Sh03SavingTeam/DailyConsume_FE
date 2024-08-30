import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";  // React-Calendar 라이브러리 import
import "react-calendar/dist/Calendar.css";  // React-Calendar의 기본 스타일 import
import moment from "moment";  // 날짜/시간 관리 라이브러리인 moment.js import
import axios from "axios";  // HTTP 요청을 위한 axios 라이브러리 import
import Footer from "../components/Footer";  // Footer 컴포넌트 import
import "../App.css";  // 전체 애플리케이션 스타일 import
import "../styles/Calendar.css";  // Calendar 관련 커스텀 스타일 import
import AmountListForDay from "../hooks/AmountListForDay";  // 특정 날짜에 대한 금액 리스트 컴포넌트 import
import RabbitCompleteImage from "../assets/RabbitComplete.png";  // 달성한 경우의 이미지 import
import RabbitFail from "../assets/RabbitFail.png";  // 실패한 경우의 이미지 import
import { checkJWT } from "services/checkJWT";  // JWT 체크를 위한 서비스 함수 import

const CustomCalendar = () => {
  // 상태 선언: memberId, 현재 날짜(nowDate), 현재 월(currentMonth), 금액 리스트(amountList), 주간 달성률(weeklyAchievements)
  const [memberId, setMemberId] = useState("");
  const [nowDate, setNowDate] = useState(moment().format("YYYY년 MM월 DD일"));
  const [currentMonth, setCurrentMonth] = useState(moment().format("M월"));
  const [amountList, setAmountList] = useState([]);
  const [weeklyAchievements, setWeeklyAchievements] = useState([]);

  // 특정 월에 대한 금액 리스트 데이터를 서버에서 가져오는 함수
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

  // 특정 월에 대한 주간 달성 데이터를 서버에서 가져오는 함수
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

  // 컴포넌트가 처음 마운트될 때 JWT를 확인하고, 데이터를 가져오는 useEffect
  useEffect(() => {
    checkJWT("/api/member/memberSession", "get", null)
        .then((response) => {
          console.log("JWT 확인 결과" + response.memberId);
          const memberId = response.memberId;
          setMemberId(memberId);

          const month = moment().format("MM");
          fetchAmountList(month, memberId);
          fetchWeeklyAchievements(month, memberId);
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
  }, [memberId]);  // memberId가 변경될 때마다 실행

  // 날짜가 변경될 때 호출되는 함수, 해당 날짜의 데이터를 가져옴
  const handleDateChange = (date) => {
    setNowDate(moment(date).format("YYYY년 MM월 DD일"));
    const month = moment(date).format("MM");
    fetchAmountList(month, memberId);
    fetchWeeklyAchievements(month, memberId);
  };

  // 월이 변경될 때 호출되는 함수, 해당 월의 데이터를 가져옴
  const handleMonthChange = ({ activeStartDate }) => {
    const newMonth = moment(activeStartDate).format("MM");
    setCurrentMonth(moment(activeStartDate).format("M월"));
    fetchAmountList(newMonth, memberId);
    fetchWeeklyAchievements(newMonth, memberId);
  };

  // 달력의 특정 날짜 타일에 클래스 이름을 추가하여 스타일을 변경하기 위한 함수
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      if (date.getDay() === 0) { // 일요일
        return 'sunday-tile';
      }
      if (date.getDay() === 6) { // 토요일
        return 'saturday-tile';
      }
    }
    return null;
  };

  // 각 날짜에 대해 표시할 내용을 커스터마이징하는 함수
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

  // 달력의 요일 이름을 커스터마이징하는 함수 (월요일부터 시작)
  const formatShortWeekday = (locale, date) => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // 요일 반환 (월요일부터 시작)
  };

  // 달력의 월과 년도를 "YYYY. MM" 형식으로 표시하기 위한 함수
  const formatMonthYear = (locale, date) => {
    return moment(date).format("YYYY. MM");  // YYYY. MM 형식으로 변환
  };

  // 메인 렌더링 부분: 달력과 주간 소비 내역을 보여줌
  return (
      <div className="app-container">
        <div className="main-content">
          <div className="calendar-container">
            <Calendar
                onChange={handleDateChange}  // 날짜 변경 핸들러
                value={moment(nowDate, "YYYY년 MM월 DD일").toDate()}  // 현재 날짜 설정
                formatDay={f_formatDay}  // 날짜 커스터마이징 핸들러
                onActiveStartDateChange={handleMonthChange}  // 월 변경 핸들러
                tileClassName={tileClassName}  // 타일 클래스 이름 지정
                locale="en-GB"  // 주를 월요일부터 시작하게 설정
                formatShortWeekday={formatShortWeekday} // 요일 이름 커스터마이징
                formatMonthYear={formatMonthYear}  // 월과 년도 형식 커스터마이징
            />
            <hr className="calendar-divider" />
            {/* 해당 날짜의 금액 리스트 표시*/}
            <AmountListForDay initialDay={nowDate} />
          </div>
        </div>
        {/*하단의 Footer 컴포넌트*/}
        <Footer />
      </div>
  );
};

export default CustomCalendar;  // CustomCalendar 컴포넌트를 export
