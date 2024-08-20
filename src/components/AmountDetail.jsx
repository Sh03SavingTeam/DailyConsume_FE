import React, { useEffect, useState } from 'react';
import "../styles/AmountDetail.css"; // 스타일 파일을 연결합니다.

function AmountDetail({ item, onClose }) {
    const [detail, setDetail] = useState(null);
    const [isNormal, setIsNormal] = useState(false); // 초기 상태를 이상으로 설정
    const [showContactModal, setShowContactModal] = useState(false); // 연락처 모달 표시 상태

    useEffect(() => {
        // 더미 데이터를 사용하여 상태 설정
        const dummyData = {
            icon: isNormal ? "https://path-to-normal-icon.png" : "https://path-to-alert-icon.png",
            company: "스타벅스코리아",
            amount: 6000,
            receiptNumber: "20240807NP97321943",
            category: "커피/음료",
            memo: "메모남기기",
            paymentMethod: "신한 마이 혜택 카드",
            paymentType: "일시불",
            paymentDate: "2024년 8월 7일 12:27:51 승인",
            product: "아이스 아메리카노 벤티",
            location: "서울 마포구 양화로 165",
            place: "스타벅스 홍대역점",
            totalAmount: "6,000원",
            remainingAmount: "앞으로 100,000원 남았습니다."
        };

        setDetail(dummyData);
    }, [isNormal]);

    const handleReportClick = () => {
        setShowContactModal(true);
    };

    const handleCloseModal = () => {
        setShowContactModal(false);
    };

    const handleNormalButtonClick = () => {
        setIsNormal(true);
        setShowContactModal(false); // 신고하기 모달이 떠 있으면 닫기
    };

    return (
        <div className="amount-detail">
            <div className="amount-detail-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{isNormal ? "상세 내역(정상)" : "상세 내역(이상)"}</h2>
                <div className="detail-header">
                    <div className="icon">
                        <img src={detail?.icon} alt="Icon" />
                    </div>
                    <div className="company-amount">
                        <p><strong>{detail?.company}</strong> {detail?.amount}원</p>
                        <p>결제 번호: {detail?.receiptNumber}</p>
                    </div>
                </div>
                <div className="details">
                    <div className="detail-item"><strong>카테고리:</strong> {detail?.category}</div>
                    <div className="detail-item"><strong>메모:</strong> {detail?.memo}</div>
                    <div className="detail-item"><strong>결제 수단:</strong> {detail?.paymentMethod}</div>
                    <div className="detail-item"><strong>결제 방법:</strong> {detail?.paymentType}</div>
                    <div className="detail-item important"><strong>결제 일자:</strong> {detail?.paymentDate}</div>
                    <div className="detail-item"><strong>결제 상품:</strong> {detail?.product}</div>
                    <div className="detail-item"><strong>결제 장소:</strong> {detail?.location} {detail?.place}</div>
                    <div className="detail-item total-amount"><strong>결제 금액:</strong> 총 {detail?.totalAmount}</div>
                    <hr />
                    <div className="detail-item weekly-budget"><strong>주간소비잔여금액:</strong> {detail?.remainingAmount}</div>
                    {!isNormal && (
                        <div className="warning-section">
                            <p>여기서 결제한게 맞으신가요?</p>
                            <div className="action-buttons">
                                <button className="normal-button" onClick={handleNormalButtonClick}>정상 처리</button>
                                <button className="report-button" onClick={handleReportClick}>신고하기</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showContactModal && (
                <div className="contact-modal">
                    <div className="contact-modal-content">
                        <button className="close-modal-button" onClick={handleCloseModal}>X</button>
                        <div className="contact-info">
                            <div className="contact-item">
                                <img src="https://path-to-headset-icon.png" alt="Customer Service" />
                                <p>고객센터 대표번호<br /><strong>1544-7000</strong></p>
                            </div>
                            <div className="contact-item">
                                <img src="https://path-to-card-icon.png" alt="Card Loss/Approval" />
                                <p>카드분실/승인 ARS<br /><strong>1544-7200</strong></p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AmountDetail;
