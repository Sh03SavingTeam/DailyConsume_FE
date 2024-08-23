import "../App.css";
import "../styles/ConsumeHistory.css";
import Footer from "../components/Footer";
import axios from "axios";
import React, { useState } from "react";

function ConsumeSet({ memberId }) {
  // 금액을 저장할 상태
  const [selectedAmount, setSelectedAmount] =
    useState("설정할 금액을 선택하세요.");
  // 금액 선택 시 호출되는 함수
  const handleSelect = (amount) => {
    setSelectedAmount(amount);
  };

  // 설정 버튼 클릭 시 호출되는 함수
  const handleSetAmount = () => {
    if (selectedAmount === "설정할 금액을 선택하세요.") {
      alert("금액을 선택해주세요.");
      return;
    } else {
      Test(selectedAmount);
    }
  };

  const Test = async (selectedAmount) => {
    try {
      const amount = selectedAmount.replace(/,/g, "").replace("원", "");
      const response = await axios.post(
        `http://localhost:9999/mypage/myweeklymoney?memberId=min&weeklyMoney=${amount}`
      );
      console.log(response.data);
    } catch (error) {
      console.error("실패", error);
    }
  };

  return (
    <div className="container con2">
      <div className="title center">
        <h2 className="set">💰주간소비금액💰 설정</h2>
        <p>1주간 사용할 금액을 설정해주세요.</p>
      </div>
      <div className="dropdown">
        <button className="dropbtn">{selectedAmount}</button>
        <div className="dropdown-content">
          <p onClick={() => handleSelect("100,000원")}>100,000원</p>
          <p onClick={() => handleSelect("150,000원")}>150,000원</p>
          <p onClick={() => handleSelect("200,000원")}>200,000원</p>
          <p onClick={() => handleSelect("250,000원")}>250,000원</p>
          <p onClick={() => handleSelect("300,000원")}>300,000원</p>
        </div>
      </div>
      <button className="select" onClick={handleSetAmount}>
        설정
      </button>
      <Footer />
    </div>
  );
}
export default ConsumeSet;
