import React, { useEffect, useState } from "react";
import "../styles/cardInfo.css";
import CardDeltePopUp from "../components/CustomPopUp";
import Header from "./../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function CardInfo(props) {
  //카드목록
  const [cardList, setCardList] = useState([]);

  //선택한 카드
  const [selectedCard, setSelectedCard] = useState("");

  const [popupOpen, setPopupOpen] = useState(false);

  const [cardName, setCardName] = useState("");
  const [cardImgUrl, setCardImgurl] = useState("");

  const [cardInfo, setCardInfo] = useState(null);
  const [benefits, setBenefits] = useState([]); // 혜택 목록 상태 추가

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
        // if (cardList.length > 0) {
        //   setSelectedCard(cardList[0].cardNum);
        // }
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, []);

  const handleChange = (event) => {
    const selectedCardNum = event.target.value; // 선택된 카드 번호를 직접 가져옴

    if (selectedCardNum === "") {
      // "카드를 선택해주세요"를 선택했을 때 초기화
      setSelectedCard("");
      setCardName("");
      setCardImgurl("");
      setCardInfo(null);
      setBenefits([]);
      return;
    }

    setSelectedCard(selectedCardNum); // 상태 업데이트
    axios({
      method: "get",
      url: "/api/card/getCardInfo",
      params: {
        cardNum: selectedCardNum,
      },
    }).then((response) => {
      console.log(response.data);

      // cardName만 추출하여 상태로 저장
      const { cardName } = response.data;
      setCardName(cardName);

      // cardName만 추출하여 상태로 저장
      const { cardImgUrl } = response.data;
      setCardImgurl(cardImgUrl);

      console.log(cardName + " " + cardImgUrl);

      // 응답 데이터를 통째로 상태에 저장
      setCardInfo(response.data);

      console.log("Extracted cardInfo:", cardInfo);

      axios({
        method: "get",
        url: "/api/card/getCardBenefit",
        params: {
          cardName: cardName,
        },
      }).then((response) => {
        console.log(response.data);
        setBenefits(response.data); // 혜택 목록 상태 업데이트
      });
    });
  };

  const handleDeleteCard = async () => {
    axios({
      method: "delete",
      url: "/api/card/delete",
      params: {
        cardNum: selectedCard,
      },
    }).then((response) => {
      setCardList((prevCards) =>
        prevCards.filter((card) => card.cardNum !== selectedCard)
      );
      // 삭제 후 첫 번째 카드로 선택 변경
      // if (cardList.length > 0) {
      //   setSelectedCard(cardList[0].cardNum);
      // } else {
      //   setSelectedCard(""); // 카드가 없을 경우 선택 초기화
      // }
      window.location.reload();
    });
  };

  const openPopUp = () => {
    setPopupOpen(true);
  };
  const closePopUp = () => {
    setPopupOpen(false);
  };
  const handleConfirmDelete = () => {
    //작업 수행
    handleDeleteCard();
    //작업 수행 후 창 닫기
    closePopUp();
  };

  const navigate = useNavigate();
  const handleCardRegisterClick = () => {
    navigate("/home/cardregister");
  };

  return (
    <div class="card-container">
      <h2>카드 목록 조회</h2>
      <select value={selectedCard} onChange={handleChange}>
        <option value="">카드를 선택해주세요</option> {/* 기본 옵션 추가 */}
        {cardList.map((card, index) => (
          <option key={index} value={card.cardNum}>
            {card.cardNum}
          </option>
        ))}
      </select>
      {/* 카드명, 이미지 파일은 DB에서, 혜택들은 상세페이지 URL로 크롤링해서 가져온다. */}
      <h2>{cardName}</h2>
      <div>{selectedCard}</div>
      <div class="card-wrapper">
        <img
          src={
            cardImgUrl
              ? `https://www.shinhancard.com${cardImgUrl}`
              : "/default-card-image.jpg"
          }
          alt="카드이미지"
          className="card-image"
        />
      </div>

      {/* 혜택 목록을 렌더링 */}
      <div className="benefits-list">
        {benefits.length > 0 ? (
          benefits.map((benefit) => (
            <div key={benefit.benefitId}>{benefit.benefit}</div>
          ))
        ) : (
          <div>카드를 선택해주세요...</div>
        )}
      </div>
      <div class="button-container">
        <button class="action-button" onClick={handleCardRegisterClick}>
          카드 등록
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
