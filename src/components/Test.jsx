import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import './test.css'; // 여기에 필요한 스타일을 정의할 것입니다.

const Header = () => (
    <header className="app-header">
        <h1>소비 캘린더</h1>
        <div className="header-icons">
            <span>신한 마이 카드</span>
            <i className="bell-icon"></i> {/* 벨 아이콘 */}
        </div>
    </header>
);

const CustomCalendar = ({ onChange, value }) => {
    const [amountList] = useState([
        { day: "2024/08/05", amount: 5300 },
        { day: "2024/08/06", amount: 4300 },
        { day: "2024/08/07", amount: 11900 },
    ]);

    const f_formatDay = (locale, date) => {
        let currentDay = moment(date).format("YYYY/MM/DD");
        let filterData = amountList.filter((data) => data.day === currentDay);
        if (filterData.length > 0)
            return moment(date).format(`D ${filterData[0].amount}`);
        return moment(date).format("D");
    };

    return (
        <div className="calendar-container">
            <Calendar
                onChange={onChange}
                value={value}
                formatDay={f_formatDay}
            />
        </div>
    );
};

const TransactionList = ({ date }) => {
    const transactions = [
        { time: "12:27:51", amount: "-6,000원", place: "스타벅스 홍대역점" },
        { time: "12:27:51", amount: "-5,900원", place: "antz옆 편의점" }
    ];

    return (
        <div className="transaction-list">
            <h2>{date}</h2>
            {transactions.map((transaction, index) => (
                <div className="transaction" key={index}>
                    <span className="circle"></span>
                    <span className="transaction-time">{transaction.time}</span>
                    <span className="transaction-amount">{transaction.amount}</span>
                    <span className="transaction-place">{transaction.place}</span>
                </div>
            ))}
        </div>
    );
};

const FooterNavigation = () => (
    <footer className="footer-navigation">
        <div className="nav-item">홈</div>
        <div className="nav-item">지도</div>
        <div className="nav-item">캘린더</div>
        <div className="nav-item">마이페이지</div>
    </footer>
);

const Test = () => {
    const [date, setDate] = useState(new Date());

    return (
        <div className="app-container">
            <Header />
            <CustomCalendar onChange={setDate} value={date} />
            <TransactionList date={moment(date).format('YYYY.MM.DD')} />
            <FooterNavigation />
        </div>
    );
};

export default Test;
