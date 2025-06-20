import React, { useEffect, useState, useRef } from "react";
import "../styles/cardInfo.css";
import CardDeltePopUp from "../components/CustomPopUp";
import Header from "./../components/Header";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { checkJWT } from "services/checkJWT";

function CardInfo(props) {
  const [memberId, setMemberId] = useState("");
  const [cardList, setCardList] = useState([]);
  const [selectedCardNum, setSelectedCardNum] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [cardName, setCardName] = useState("");
  const [cardImgUrl, setCardImgurl] = useState("");
  const [cardInfo, setCardInfo] = useState(null);
  const [benefits, setBenefits] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const cardListRef = useRef(null);

  useEffect(() => {
    console.log(location);
  }, [location]);

  useEffect(() => {
    checkJWT("/api/member/memberSession", "get", null)
      .then((response) => {
        console.log("JWT 확인 결과" + response.memberId);
        axios({
          method: "get",
          url: "/api/card/memberCardList",
          params: {
            memberId: response.memberId,
          },
        })
          .then((response) => {
            const userCards = response.data;
            axios
              .get("/api/card/getAllCardInfo")
              .then((res) => {
                const allCards = res.data;

              const mergedList = userCards.map((userCard) => {
                const matchedCard = allCards.find(
                  (card) => card.cardName === userCard.cardName
                );
                return {
                  ...userCard,
                  cardImgUrl: matchedCard
                    ? matchedCard.cardImgUrl
                    : "/default-card-image.jpg",
                  cardType: matchedCard ? matchedCard.cardType : "Unknown",
                  cardPageUrl: matchedCard ? matchedCard.cardPageUrl : "#",
                };
              });
              setCardList(mergedList);

              // Automatically select the first card if available
              if (mergedList.length > 0) {
                const firstCardNum = mergedList[0].cardNum;
                setSelectedCardNum(firstCardNum);
                handleCardSelection(firstCardNum);
              }

              console.log(mergedList);
            });
          })
          .catch((error) => {
            console.error("카드 목록 가져오기 실패", error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const container = cardListRef.current;
      const containerWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;
      const cards = Array.from(container.children);

      let closestCard = null;
      let closestOffset = Infinity;

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const offset = Math.abs(cardCenter - containerWidth / 2);

        if (offset < closestOffset) {
          closestOffset = offset;
          closestCard = card;
        }
      });

      if (closestCard) {
        const cardNum = closestCard.getAttribute("data-cardnum");
        if (cardNum !== selectedCardNum) {
          setSelectedCardNum(cardNum);
          handleCardSelection(cardNum);
        }
      }
    };

    const container = cardListRef.current;
    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [selectedCardNum]);

  const handleCardSelection = (cardNum) => {
    axios({
      method: "get",
      url: "/api/card/getCardInfo",
      params: {
        cardNum: cardNum,
      },
    })
      .then((response) => {
        console.log(response.data);
        // 데이터 유효성 검사 추가
        if (!response.data || Object.keys(response.data).length === 0) {
          console.error("No card data available");
          // 필요하다면 여기에 사용자에게 알리는 로직을 추가할 수 있습니다.
          return; // 데이터가 없으므로 여기서 함수 종료
        }
        const { cardName, cardImgUrl } = response.data;
        setCardName(cardName);
        setCardImgurl(cardImgUrl);
        setCardInfo(response.data);

        axios({
          method: "get",
          url: "/api/card/getCardBenefit",
          params: {
            cardName: cardName,
          },
        })
          .then((response) => {
            // 카드 혜택 데이터에 대한 유효성 검사
            if (!response.data || Object.keys(response.data).length === 0) {
              console.error("No benefits data available");
              // 필요하다면 여기에 사용자에게 알리는 로직을 추가할 수 있습니다.
              return; // 데이터가 없으므로 여기서 함수 종료
            }
            setBenefits(response.data);
          })
          .catch((error) => {
            // 혜택 데이터 요청 실패 시 처리
            console.error("Error fetching card benefits:", error);
          });
      })
      .catch((error) => {
        // 카드 정보 요청 실패 시 처리
        console.error("Error fetching card information:", error);
      });
  };

  const handleDeleteCard = async () => {
    axios({
      method: "delete",
      url: "/api/card/delete",
      params: {
        cardNum: selectedCardNum,
      },
    }).then((response) => {
      setCardList((prevCards) =>
        prevCards.filter((card) => card.cardNum !== selectedCardNum)
      );
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
    handleDeleteCard();
    closePopUp();
  };

  const handleCardRegisterClick = () => {
    navigate("/home/cardregister");
  };

  return (
    <div className="card-container">
      <h2 className="bold-sebang card-title-size">카드 목록 조회</h2>
      <div className="card-list-wrapper">
        <div className="card-list" ref={cardListRef}>
          {cardList.length > 0 ? (
            cardList.map((card, index) => (
              <div
                key={card.cardNum}
                className={`membercard ${
                  selectedCardNum === card.cardNum ? "selected" : ""
                }`}
                data-cardnum={card.cardNum}
              >
                <img
                  src={
                    card.cardImgUrl
                      ? `https://www.shinhancard.com${card.cardImgUrl}`
                      : "/default-card-image.jpg"
                  }
                  alt="카드이미지"
                  className="card-image"
                />
              </div>
            ))
          ) : (
            <div className="membercard">
              <img
                src="/default-card-image.jpg"
                alt="기본 카드 이미지"
                className="card-image"
              />
            </div>
          )}
        </div>
      </div>
      <div className="card-number-size">{selectedCardNum}</div>
      <h2 className="card-title-name">{cardName}</h2>

      <div className="benefits-list">
        {benefits.length > 0 ? (
          benefits.map((benefit) => (
            <div key={benefit.benefitId}>{benefit.benefit}</div>
          ))
        ) : (
          <div>등록하신 카드가 없습니다</div>
        )}
      </div>
      <div className="cardinfo-button-container">
        <button className="action-button" onClick={handleCardRegisterClick}>
          카드 등록
        </button>
        {cardList.length > 0 && (
          <button className="action-button" onClick={openPopUp}>
            카드 삭제
          </button>
        )}
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
