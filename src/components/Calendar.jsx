import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import Footer from "./Footer";
import "../App.css";
import "../styles/Calendar.css";
import AmountListForDay from "./AmountListForDay";

const CustomCalendar = () => {
    const [nowDate, setNowDate] = useState(moment().format("YYYY년 MM월 DD일")); // 현재 날짜를 기본값으로 설정
    const [currentMonth, setCurrentMonth] = useState(moment().format("M월"));
    const [amountList, setAmountList] = useState([
        { day: "2024/08/01", amount: 1000 },
        { day: "2024/08/02", amount: 2000 },
        { day: "2024/08/12", amount: 3000 },
        { day: "2024/08/22", amount: 4000 },
    ]);

    const handleDateChange = (date) => {
        setNowDate(moment(date).format("YYYY년 MM월 DD일"));
    };

    const handleMonthChange = ({ activeStartDate }) => {
        setCurrentMonth(moment(activeStartDate).format("M월"));
    };

    const f_formatDay = (locale, date) => {
        let currentDay = moment(date).format("YYYY/MM/DD");
        let filterData = amountList.filter((data) => data.day === currentDay);

        if (filterData.length > 0) {
            return (
                <div className="calendar-info">
                    <span>{moment(date).format("D")}</span>
                    <span className="calendar-count">{filterData.length}건</span>
                    <span className="calendar-amount">{filterData[0].amount}원</span>
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
                        value={moment(nowDate, "YYYY년 MM월 DD일").toDate()} // 날짜를 Date 객체로 변환하여 Calendar에 전달
                        formatDay={f_formatDay}
                        onActiveStartDateChange={handleMonthChange}
                    />
                    <hr className="calendar-divider" />
                    <AmountListForDay initialDay={nowDate} /> {/* 선택한 날짜를 AmountListForDay에 전달 */}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CustomCalendar;
