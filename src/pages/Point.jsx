import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import "../styles/Point.css";
import searchIcon from '../assets/search1.png';
import moreIcon from '../assets/more.png';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function Point({ memberId }){

    const navigate = useNavigate();

    const [pointHistories, setPointHistories] = useState([]);
    const [totalPoint, setTotalPoint] = useState(0);
    const [historyCount, setHistoryCount] = useState(0);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // 데이터 불러오는 함수
    const fetchPointHistories = async (page) => {
    try {
        const response = await axios.get(`http://localhost:9999/mypage/point/${memberId}?page=${page}`);
        const data = response.data;

        setPointHistories((prev) => [...prev, ...data.pointHistories]); // 기존 내역에 새로 불러온 내역을 추가
        setTotalPoint(data.totalPoint);
        setHistoryCount(data.historyCount);

        // 다음 페이지가 있는지 여부를 결정
        if (data.pointHistories.length === 0 || pointHistories.length + data.pointHistories.length >= data.historyCount) {
            setHasMore(false);
        }
    } catch (error) {
        console.error("포인트 내역이 없습니다.", error);
        }   
    };

    // 첫 번째 페이지를 불러오는 useEffect
    useEffect(() => {
        fetchPointHistories(page);
    }, [page]);

    // 더보기 버튼 클릭 시 다음 페이지로
    const loadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    // 뒤로 가기 버튼 클릭 시 이전 페이지로 이동
    const backClick = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
    <div className="point-container">
        {/* <div className="point-header">
            <h2>포인트</h2>
            <a className="back-button" onClick={backClick}>&lt;</a>
        </div> */}

        <div className="balance">
            <Link to='/MyPage/Refund'><button>환급받기</button></Link>
            <p>{totalPoint !== null ? totalPoint.toLocaleString() : '0'}P</p>
        </div>

        <div className="history-title">
            <span>포인트 내역</span>
            <button className="filter-button">
                <img src={searchIcon} alt="Search Icon" className="search-icon" />
                조회 조건 설정
        </button>
        </div>
        <div className="history-list">
        {pointHistories.map((history, index) => {

            const isPositive = history.divNum === 0;
            const className = `amount ${isPositive ? 'positive' : 'negative'}`;
            const amountSign = isPositive ? '+' : '-';
            return(
            <div className="history-item" key={index}>
            <div className="description">{history.cmt}</div>
            <div className="history-item-right">
                    <div className={`amount ${className}`}>{amountSign} {history.amount !== null && history.amount !== undefined ? history.amount.toLocaleString() : '0'}P</div>
                    <div className="date">{history.pointRegDate}</div>
            </div>
        </div>
            );
        })}
        </div>

        <div className="more-button">
        {hasMore && (
            <button onClick={loadMore}>더보기 <img src={moreIcon} alt="more Icon" className="more-icon" /></button>
        )}
        </div>
         <Footer />
    </div>
    );
}

export default Point;