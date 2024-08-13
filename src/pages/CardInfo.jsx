import React from "react";
import "../styles/cardInfo.css";

function CardInfo(props) {
  return (
    <div class="card-container">
      {/* 카드명, 이미지 파일은 DB에서, 혜택들은 상세페이지 URL로 크롤링해서 가져온다. */}
      <h2>신한카드 Deep Dream</h2>
      <div>1234 5678 9928 1029</div>
      <div class="card-wrapper">
        <button>before</button>

        <img
          src="https://www.shinhancard.com/pconts/images/contents/card/plate/cdCheckBGNDC0s.png"
          alt="Card Image"
          class="card-image"
        />
        <button>After</button>
      </div>

      <div>해외 이용 수수료 면제</div>
      <div>더라운지 본인 무료 입장</div>
      <div>해외 대중교통 1% 결제일 할인</div>

      <div class="button-container">
        <button class="action-button">신규 카드 등록</button>
        <button class="action-button">카드 삭제</button>
      </div>
    </div>
  );
}

export default CardInfo;
