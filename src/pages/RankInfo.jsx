import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import "../styles/MyPage.css";
import CharacterImage1 from "../assets/Character1.png";
import CharacterImage2 from "../assets/Character2.png";
import CharacterImage3 from "../assets/Character3.png";
import CharacterImage4 from "../assets/Character4.png";
import axios from "axios";

function RankInfo({ setIsVisable }) {
  const date = new Date();
  const month = date.getMonth() + 1;
  const [rankInfo, setRankInfo] = useState(null);
  const [selectedRank, setSelectedRank] = useState(null);
  const memberId = "m002";

  const clickPrevHandler = () => {
    setIsVisable((prevState) => !prevState);
  };

    useEffect(() => {
        axios.get(`/rank/benefits/${memberId}`)
            .then(response => {
                setRankInfo(response.data); 
                setSelectedRank(response.data.rankName);
            })
            .catch(error => {
                console.error("Error fetching rank info:", error);
            });
    }, [memberId]);

  if (!rankInfo) {
    return <div>Loading...</div>;
  }

  const handleRankClick = (rankName) => {
    setSelectedRank(rankName);
  };

  const renderBenefitInfo = () => {
    if (selectedRank === "거지토순이") {
      return (
        <>
          <div className="rank-name"> 📌 거지토순이 등급</div>
          <div className="rank-standard">
            {" "}
            기준 | 직전 1개월 등급 점수 0점 이상 20점 미만
          </div>
          <div className="rank-benefit-info"> 혜택 | 1,000 포인트 지급 </div>
        </>
      );
    }
    if (selectedRank === "새싹토순이") {
      return (
        <>
          <div className="rank-name"> 📌 새싹토순이 등급</div>
          <div className="rank-standard">
            {" "}
            기준 | 직전 1개월 등급 점수 20점 이상 40점 미만
          </div>
          <div className="rank-benefit-info"> 혜택 | 2,000 포인트 지급 </div>
        </>
      );
    }
    if (selectedRank === "당근토순이") {
      return (
        <>
          <div className="rank-name"> 📌 당근토순이 등급</div>
          <div className="rank-standard">
            {" "}
            기준 | 직전 1개월 등급 점수 40점 이상 60점 미만
          </div>
          <div className="rank-benefit-info"> 혜택 | 3,000 포인트 지급 </div>
        </>
      );
    }
    if (selectedRank === "부자토순이") {
      return (
        <>
          <div className="rank-name"> 📌 부자토순이 등급</div>
          <div className="rank-standard">
            {" "}
            기준 | 직전 1개월 등급 점수 60점 이상
          </div>
          <div className="rank-benefit-info"> 혜택 | 5,000 포인트 지급 </div>
        </>
      );
    }
  };

  return (
    <div className="rinfo-container sec_container">
      <div className="prev-btn" onClick={clickPrevHandler}>
        &lt;
      </div>
      <div className="benefit-container">
        <div className="benefit-rank-info">
          <span className="b-info-item1">{rankInfo.memberName}님의</span>
          <span className="b-info-item2">
            {month}월 등급 {rankInfo.rankName}
          </span>
        </div>
        {/* 
                <div className="benefit-button-container">
                    <button className='benefit-btn'>
                        혜택 포인트 받기
                    </button>
                </div>*/}
      </div>
      <div className="rankinfo-container">
        <div
          className={`rank1-container ${
            selectedRank === "거지토순이" ? "selected" : ""
          }`}
          onClick={() => handleRankClick("거지토순이")}
        >
          <div className="characterImg1">
            <img
              src={CharacterImage1}
              alt="RabbitLv1"
              className="benefit-rank-image1"
            />
          </div>
          <div className="rank-name1">거지토순이</div>
          <div className="rank-range1">점수 0 ~ 19</div>
        </div>
        <div
          className={`rank2-container ${
            selectedRank === "새싹토순이" ? "selected" : ""
          }`}
          onClick={() => handleRankClick("새싹토순이")}
        >
          <div className="characterImg2">
            <img
              src={CharacterImage2}
              alt="2"
              className="benefit-rank-image2"
            />
          </div>
          <div className="rank-name2">새싹토순이</div>
          <div className="rank-range2">점수 20 ~ 39</div>
        </div>
        <div
          className={`rank3-container ${
            selectedRank === "당근토순이" ? "selected" : ""
          }`}
          onClick={() => handleRankClick("당근토순이")}
        >
          <div className="characterImg3">
            <img
              src={CharacterImage3}
              alt="3"
              className="benefit-rank-image3"
            />
          </div>
          <div className="rank-name3">당근토순이</div>
          <div className="rank-range3">점수 40 ~ 59</div>
        </div>
        <div
          className={`rank4-container ${
            selectedRank === "부자토순이" ? "selected" : ""
          }`}
          onClick={() => handleRankClick("부자토순이")}
        >
          <div className="characterImg4">
            <img
              src={CharacterImage4}
              alt="4"
              className="benefit-rank-image4"
            />
          </div>
          <div className="rank-name4">부자토순이</div>
          <div className="rank-range4">점수 60 이상</div>
        </div>
      </div>
      <div className="benefit-info-container">{renderBenefitInfo()}</div>
      <div className="footer-info">
        <span className="footer-title">등급안내</span>
        <span>
          ▪️ 매월 1일, 최근 1개월 등급 점수 기준으로 새로운 회원 등급이
          부여됩니다.
        </span>
        <span>▪️ 새로운 등급은 앱 사용 이벤트에 한하여 부여됩니다.</span>
        <span>
          ▪️ 이벤트란 주간소비 설정금액 달성, 첫 카드등록, 출석체크, 지출비교 를
          말합니다.
        </span>
        <span>
          ▪️ 회원 등급별 혜택과 기준은 내부 사정에 의하여 향후 변경될 수
          있습니다.
        </span>
        <span>
          ▪️ 등급 혜택은 본 페이지에서 '혜택 포인트 받기' 버튼을 통해 받으실 수
          있습니다.
        </span>
        <span>▪️ 받은 혜택은 포인트 페이지에서 확인하실 수 있습니다. </span>
      </div>
      <Footer />
    </div>
  );
}

export default RankInfo;
