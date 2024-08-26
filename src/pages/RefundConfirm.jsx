import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import checkImg from "../assets/check.png"
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Refundconfirm.css";

function Refundconfirm(){

    const navigate = useNavigate();
    const location = useLocation();
    const refundAmount = location.state.refundAmount;

    // 뒤로 가기 버튼 클릭 시 이전 페이지로 이동
    const backClick = () => {
        navigate(-1); // Go back to the previous page
    };

    return(
        <div className="confirm-container">
            <div className="confirm-header">
                <h2>포인트 환급 완료</h2>
                <a className="back-button" onClick={backClick}>&lt;</a>
            </div>
            <div className="confirm-img">
                <img src={checkImg} alt=""/>
                <p>포인트를 현금으로 전환 완료</p>
            </div>
            <div className="confirm-point">
                <p className="point-text">포인트</p>
                <p className="point-number">-{Number(refundAmount).toLocaleString()}P</p>
            </div>
            <hr/>
            <div className="confirm-cash">
                <p className="cash-text">현금</p>
                <p className="cash-number">+{Number(refundAmount).toLocaleString()}원</p>
            </div>
            <div className="confirm-button">
                <Link to="/MyPage"><button>확인</button></Link>
            </div>
            <Footer />
        </div>
    );
}

export default Refundconfirm;