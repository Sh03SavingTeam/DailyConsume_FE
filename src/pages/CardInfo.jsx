import React, { useEffect, useState } from "react";
import "../styles/cardInfo.css";
import CardDeltePopUp from "../components/CustomPopUp";
import Header from "./../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function CardInfo(props) {
  const location = useLocation();

  useEffect(() => {
    console.log(location);
  }, [location]);

  useEffect(() => {
    axios({
      method: "get",
      url: "/api/card/memberCardList",
      params: {
        memberId: "abcd",
      },
    })
      .then((response) => {
        console.log(response.data);

        // 카드 목록을 상태에 저장
        const cardList = response.data;
        setCardList(cardList);

        // 첫 번째 항목을 기본값으로 설정
        if (cardList.length > 0) {
          setSelectedCard(cardList[0].cardName);
        }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const handleChange = (event) => {
    setSelectedCard(event.target.value);
  };

  //카드목록
  const [cardList, setCardList] = useState([]);

  //선택한 카드
  const [selectedCard, setSelectedCard] = useState("");

  const [popupOpen, setPopupOpen] = useState(false);

  const handleDeleteCard = async (e) => {
    e.preventfault();
  };

  // 예시 카드 데이터
  const cardNum = "1234 5678 9928 1029";

  const openPopUp = () => {
    setPopupOpen(true);
  };
  const closePopUp = () => {
    setPopupOpen(false);
  };
  const handleConfirmDelete = () => {
    //작업 수행

    //작업 수행 후 창 닫기
    closePopUp();
  };

  const navigate = useNavigate();
  const handleCardRegisterClick = () => {
    navigate("/home/cardregister");
  };

  return (
    <div class="card-container">
      <h2>등록 카드 목록 조회</h2>
      <select value={selectedCard} onChange={handleChange}>
        {cardList.map((card, index) => (
          <option key={index} value={card.card}>
            {card.cardNum}
          </option>
        ))}
      </select>
      {/* 카드명, 이미지 파일은 DB에서, 혜택들은 상세페이지 URL로 크롤링해서 가져온다. */}
      <h2>신한카드 Deep Dream</h2>
      <div>{cardNum}</div>
      <div class="card-wrapper">
        <img
          src="https://www.shinhancard.com/pconts/images/contents/card/plate/cdCheckBGNDC0s.png"
          alt="카드이미지"
          className="card-image"
        />
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
          onConfirm={handleConfirmDelete}
        >
          선택하신 카드를 삭제할까요?
        </CardDeltePopUp>
      </div>
    </div>
  );
}

export default CardInfo;
