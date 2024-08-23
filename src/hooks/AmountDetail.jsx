import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/AmountDetail.css"; // 스타일 파일을 연결합니다.

function AmountDetail({ item, onClose }) {
  const [detail, setDetail] = useState(null);
  const [isNormal, setIsNormal] = useState(null); // 정상/이상 결제 여부
  const [showContactModal, setShowContactModal] = useState(false); // 연락처 모달 표시 상태

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        console.log("Requesting payment details for:", item.memberId, item.id); // 로그 추가
        const response = await axios.get(
          "http://localhost:9999/api/calendar/payhistory/detail",
          {
            params: {
              memberId: item.memberId, // item 객체에 memberId 포함
              payId: item.id,
            },
          }
        );

        console.log("Response data:", response.data); // 응답 데이터를 로그에 출력

        setDetail(response.data);
        setIsNormal(response.data.myPayCheck === 1);
      } catch (error) {
        console.error("Failed to fetch payment details", error);
      }
    };

    fetchDetail();
  }, [item]);

  const handleReportClick = () => {
    setShowContactModal(true);
  };

  const handleCloseModal = () => {
    setShowContactModal(false);
  };

  const handleNormalButtonClick = async () => {
    try {
      // 서버에 myPayCheck 값을 1로 업데이트 요청
      console.log("Sending update request with:", item.memberId, item.id);
      await axios.post("http://localhost:9999/api/calendar/payhistory/update", {
        memberId: item.memberId,
        payId: item.id,
        myPayCheck: 1,
      });

      // 상태를 정상으로 업데이트
      setIsNormal(true);
      setShowContactModal(false); // 신고하기 모달이 떠 있으면 닫기

      // 서버에서 갱신된 데이터를 가져와서 다시 렌더링
      console.log(
        "Fetching updated details for:",
        item.memberId,
        item.payId,
        item.myPayCheck
      );
      const response = await axios.get(
        "http://localhost:9999/api/calendar/payhistory/detail",
        {
          params: {
            memberId: item.memberId,
            payId: item.payId,
            myPayCheck: item.myPayCheck,
          },
        }
      );
      console.log("Updated response data:", response.data);

      setDetail(response.data);
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
            <img
              src={
                isNormal
                  ? "https://path-to-normal-icon.png"
                  : "https://path-to-alert-icon.png"
              }
              alt="Icon"
            />
          </div>
          <div className="company-amount">
            <p>
              <strong>{detail.storeName}</strong> {detail.payAmount}원
            </p>
            <p>결제 번호: {detail.receiptNumber || "N/A"}</p>
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
            <strong>결제 상품:</strong> {detail.menuName || "N/A"}
          </div>
          <div className="detail-item">
            <strong>결제 장소:</strong> {detail.storeName || "N/A"}
          </div>
          <div className="detail-item total-amount">
            <strong>결제 금액:</strong> 총 {detail.payAmount || "N/A"}원
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
              <div className="contact-item">
                <img
                  src="https://path-to-headset-icon.png"
                  alt="Customer Service"
                />
                <p>
                  고객센터 대표번호
                  <br />
                  <strong>1544-7000</strong>
                </p>
              </div>
              <div className="contact-item">
                <img
                  src="https://path-to-card-icon.png"
                  alt="Card Loss/Approval"
                />
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
