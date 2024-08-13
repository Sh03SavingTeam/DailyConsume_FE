import React, { useState } from "react";
import "../styles/cardInfo.css";
import CardDeltePopUp from "../components/CustomPopUp";
import Header from "./../components/Header";
import { useNavigate } from "react-router-dom";

function CardInfo(props) {
  const [popupOpen, setPopupOpen] = useState(false);

  const openPopUp = () => {
    setPopupOpen(true);
  };
  const closePopUp = () => {
    setPopupOpen(false);
  };
  const navigate = useNavigate();
  const handleCardRegisterClick = () => {
    navigate("/Home/CardRegister");
  };

  return (
    <div class="card-container">
      {/* 카드명, 이미지 파일은 DB에서, 혜택들은 상세페이지 URL로 크롤링해서 가져온다. */}
      <h2>신한카드 Deep Dream</h2>
      <div>1234 5678 9928 1029</div>
      <div class="card-wrapper">
        <button class="changecard-button">Before</button>

        <img
          src="https://www.shinhancard.com/pconts/images/contents/card/plate/cdCheckBGNDC0s.png"
          className="card-image"
        />
        <button class="changecard-button">After</button>
      </div>

      <div>해외 이용 수수료 면제</div>
      <div>더라운지 본인 무료 입장</div>
      <div>해외 대중교통 1% 결제일 할인</div>

      <div class="button-container">
        <button class="action-button" onClick={handleCardRegisterClick}>
          신규 카드 등록
        </button>
        <button class="action-button" onClick={openPopUp}>
          카드 삭제
        </button>
        <CardDeltePopUp
          open={popupOpen}
          close={closePopUp}
          header="PopUp Heading"
        >
          카드를 삭제할까요?
        </CardDeltePopUp>
      </div>
    </div>
  );
}

export default CardInfo;
