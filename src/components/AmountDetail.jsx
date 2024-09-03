import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AmountDetail.css"; // 스타일 파일을 연결합니다.
import bakery from "../assets/bakery.png";
import meatRestaurant from "../assets/meatRestaurant.png";
import wine from "../assets/wine.png";
import coffee from "../assets/coffee.png";
import japaneseFood from "../assets/japaneseFood.png";
import pizza from "../assets/pizza.png";
import diningRoom from "../assets/diningRoom.png";

function AmountDetail({ item, onClose }) {
  const [detail, setDetail] = useState(null);
  const [isNormal, setIsNormal] = useState(null); // 정상/이상 결제 여부
  const [showContactModal, setShowContactModal] = useState(false); // 연락처 모달 표시 상태

  useEffect(() => {
    //const fetchDetail = async () => {
    console.log("Requesting payment details for:", item.memberId, item.id); // 로그 추가
    axios
      .get("/api/calendar/payhistory/detail", {
        params: {
          memberId: item.memberId, // item 객체에 memberId 포함
          payId: item.id,
        },
      })
      .then((response) => {
        console.log("Response data:", response.data); // 응답 데이터를 로그에 출력

        setDetail(response.data);
        setIsNormal(response.data.myPayCheck === 1);
      })
      .catch((error) => {});
    //fetchDetail();
  }, [item]);

  const handleReportClick = () => {
    setShowContactModal(true);
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
  };

  const handleNormalButtonClick = async () => {
    try {
      // 서버에 myPayCheck 값을 1로 업데이트 요청 (PUT 요청)
      const response = await axios.put("/api/calendar/payhistory/update", {
        memberId: item.memberId,
        payId: item.id,
        myPayCheck: 1,
      });

      // 상태를 정상으로 업데이트
      setIsNormal(true);
      setShowContactModal(false); // 신고하기 모달이 떠 있으면 닫기

      // 업데이트 후 목록을 새로고침
      onClose(); // AmountListForDay로 돌아가면서 목록을 새로고침
    } catch (error) {
      console.error("Failed to update payment status", error);
    }
  };

  if (!detail) {
    return <div>Loading...</div>; // 로딩 중일 때 표시
  }

  // 결제 일자와 시간을 '년, 월, 일, 시:분:초' 형식으로 포맷팅
  const formattedDateTime = new Date(detail.payDate).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });

  const handleCustomerServiceClick = () => {
    // 고객센터 버튼을 클릭했을 때 동작할 함수
    window.location.href = "tel:1544-7000"; // 전화 걸기 기능
  };
  const handleCardLossClick = () => {
    // 카드분실/승인 ARS 버튼을 클릭했을 때 동작할 함수
    window.location.href = "tel:1544-7200"; // 전화 걸기 기능
  };

  // 카테고리에 따른 이미지 URL 매핑
  const categoryIcons = {
    육류: meatRestaurant,
    고기요리: meatRestaurant,
    돼지고기구이: meatRestaurant,
    카페: coffee,
    디저트: coffee,
    와인바: wine,
    술집: wine,
    피자: pizza,
    빵집: bakery,
    횟집: japaneseFood,
    일식집: japaneseFood,
    음식점: diningRoom,
    한식: diningRoom,
    중국집: diningRoom,
    종합분식: diningRoom,
    포장마차: diningRoom,
    게요리: diningRoom,
    정보없음: diningRoom,
    중식당: diningRoom,
    양꼬치: diningRoom,
    샌드위치: diningRoom,
    장어: diningRoom,
    스파게티: diningRoom,
    카레: diningRoom,
    오뎅: diningRoom,
    아귀찜: diningRoom,
    멕시코: diningRoom,
    만두: diningRoom,
    브런치: diningRoom,
    칼국수: diningRoom,
    이자카야: diningRoom,
    곱창: diningRoom,
    막국수: diningRoom,
    스페인음식: diningRoom,
    두부요리: diningRoom,
    토스트: diningRoom,
    기사식당: diningRoom,
    주꾸미요리: diningRoom,
    "바(BAR)": diningRoom,
    이탈리아음식: diningRoom,
    베트남음식: diningRoom,
    도시락: diningRoom,
    일식튀김: japaneseFood,
    스테이크: diningRoom,
    인도음식: diningRoom,
    홍차전문점: diningRoom,
    아이스크림: diningRoom,
    찌개: diningRoom,
    요리주점: diningRoom,
    백반: diningRoom,
    족발: diningRoom,
    일식당: japaneseFood,
    생선구이: japaneseFood,
    브런치카페: coffee,
    샤브샤브: diningRoom,
    오리요리: diningRoom,
    전: diningRoom,
    찜닭: diningRoom,
    햄버거: diningRoom,
    감자탕: diningRoom,
    다이어트: diningRoom,
    국밥: diningRoom,
    분식: diningRoom,
    돈가스: diningRoom,
    매운탕: diningRoom,
    아시아음식: diningRoom,
    베이커리: bakery,
    일식: japaneseFood,
    닭발: diningRoom,
    해물: diningRoom,
    우동: diningRoom,
    닭갈비: diningRoom,
    // 기타 카테고리
    기타: diningRoom,
  };

  // 카테고리에 맞는 이미지 선택
  const iconSrc =
    categoryIcons[detail.consumeCategory] || categoryIcons["기타"];

  const generateReceiptNumber = () => {
    if (!detail) return "N/A";
    const date = new Date(detail.payDate);
    const YYMMDD = `${date.getFullYear().toString().slice(-2)}${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}`;
    return `${YYMMDD}${detail.menuId || "000"}${detail.payId || "000"}`;
  };

  // AmountDetail.jsx에서 데이터를 렌더링하는 부분
  return (
    <div className="amount-detail">
      <div className="amount-detail-content">
        <button className="close-button" onClick={onClose}>
          X
        </button>
        <h2>{isNormal ? "상세 내역(정상)" : "상세 내역(이상)"}</h2>
        <div className="detail-header">
          <div className="icon">
            <img src={iconSrc} alt="Category Icon" />
          </div>
          <div className="company-amount">
            <p>결제 번호: {generateReceiptNumber() || "N/A"}</p>
          </div>
        </div>
        <div className="details">
          <div className="detail-item">
            <strong>카테고리:</strong> {detail.consumeCategory || "N/A"}
          </div>
          <div className="detail-item">
            <strong>결제 수단:</strong> {detail.cardName || "N/A"}
          </div>
          <div className="detail-item important">
            <strong>결제 일자:</strong> {formattedDateTime}
          </div>
          <div className="detail-item">
            <strong>결제 장소:</strong> {detail.storeName || "N/A"}
          </div>
          <div className="detail-item total-amount">
            <strong>결제 금액:</strong> 총{" "}
            {detail.payAmount?.toLocaleString() || "N/A"}원
          </div>

          {!isNormal && (
            <div className="warning-section">
              <p>여기서 결제한게 맞으신가요?</p>
              <div className="action-buttons">
                <button
                  className="normal-button"
                  onClick={handleNormalButtonClick}
                >
                  정상 처리
                </button>
                <button className="report-button" onClick={handleReportClick}>
                  신고하기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      {showContactModal && (
        <div className="contact-modal">
          <div className="contact-modal-content">
            <button className="close-modal-button" onClick={handleCloseModal}>
              X
            </button>
            <div className="contact-info">
              <div
                className="contact-item"
                onClick={handleCustomerServiceClick}
              >
                <img src="/call-teller.png" alt="Customer Service" />
                <p>
                  고객센터 대표번호
                  <br />
                  <strong>1544-7000</strong>
                </p>
              </div>
              <div className="contact-item" onClick={handleCardLossClick}>
                <img src="/card-icon.png" alt="Card Loss/Approval" />
                <p>
                  카드분실/승인 ARS
                  <br />
                  <strong>1544-7200</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AmountDetail;
