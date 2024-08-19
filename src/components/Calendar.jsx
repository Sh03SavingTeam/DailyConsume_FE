import React, {useEffect, useState} from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "../App.css";
import "../styles/Calendar.css";
import AmountListForDay from "./AmountListForDay";
const CustomCalendar = ({ onChange, value }) => {
    const [nowDate, setNowDate] = useState("날짜");
    const [amountList, setAmountList] = useState([]);

    useEffect(() => {
        // 서버에서 데이터 받아오기
        axios({
            url: "http://localhost:9999/",
            method: "GET",
        })
            .then((response) => {
                // 서버에서 받아온 데이터를 amountList 상태로 설정
                setAmountList(response.data);
            })
            .catch((error) => {
                console.error("데이터를 가져오는 데 실패했습니다.", error);  // 콘솔 로그 추가
            });
    }, []); // 빈 배열을 전달하여 컴포넌트가 마운트될 때만 실행

    const handleDateChange = (e) => {
        console.log(e);
        setNowDate(moment(e).format("YYYY년 MM월 DD일"));
    };
    const f_formatDay = (locale, date) => {
        let currentDay = moment(date).format("YYYY/MM/DD");
        let filterData = amountList.filter((data) => data.day === currentDay);
        if (filterData.length > 0)
            return moment(date).format(`DD ${filterData[0].amount}`);
        return moment(date).format("DD" );
    };
    // const changeHandler = () => {
    //     navi("/login");
    // };
    return (
        <div className="container">
            <div className="calendar-container">
                <Calendar
                    onChange={handleDateChange}
                    value={value}
                    formatDay={f_formatDay}
                />
            </div>
            {nowDate && <AmountListForDay day = {nowDate}/>}
            <Footer/>
        </div>

    );
};
export default CustomCalendar;