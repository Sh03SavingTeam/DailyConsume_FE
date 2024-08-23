import "../App.css";
import "../styles/ConsumeHistory.css";
import Footer from "../components/Footer";
import axios from 'axios';
import React, {useEffect, useState} from "react";

function ConsumeSet({ memberId }) {
  // 금액을 저장할 상태
  const [selectedAmount, setSelectedAmount] = useState("설정할 금액을 선택하세요.");

  // 금액 선택 시 호출되는 함수
  const handleSelect = (amount) => {
    setSelectedAmount(amount);
  };

  useEffect(() => {
    axios
    .get(`http://localhost:9999/mypage/mycardHistory?memberId=${memberId}`) // 스프링 서버의 엔드포인트로 수정 필요
    .then((response) => {
      const payAmounts = response.data.map((item) => item.payAmount);
      const percentage = response.data.map((item) => item.percentage);
      //setUserList(payAmounts); // payAmount 값을 상태로 저장
      //setUserPercentList(percentage);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}, []); 

  return (
    <div className="container con2">
      <div className="title center">
        <h2 className="set">💰주간소비금액💰 설정</h2>
        <p>1주간 사용할 금액을 설정해주세요.</p>
      </div>
      <div className="dropdown">
        <button className="dropbtn">{selectedAmount}</button>
        <div className="dropdown-content">
            <p onClick={() => handleSelect('100,000원')}>100,000원</p>
            <p onClick={() => handleSelect('150,000원')}>150,000원</p>
            <p onClick={() => handleSelect('200,000원')}>200,000원</p>
            <p onClick={() => handleSelect('250,000원')}>250,000원</p>
            <p onClick={() => handleSelect('300,000원')}>300,000원</p>
        </div>   
      </div>
      <button className="select">설정</button>
      <Footer />
    </div>
  );
}
export default ConsumeSet;
