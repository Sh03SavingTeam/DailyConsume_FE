import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import "../styles/MyPage.css";
import CharacterImage1 from "../assets/Character1.png";
import CharacterImage2 from "../assets/Character2.png";
import CharacterImage3 from "../assets/Character3.png";
import CharacterImage4 from "../assets/Character4.png";
import axios from "axios";
import RankInfo from "./RankInfo";
import RankerCalendar from "./RankerCalendar";
import { checkJWT } from "services/checkJWT";

function MyPage(props) {
  const date = new Date();
  const month = date.getMonth() + 1;
  const [rankInfo, setRankInfo] = useState(null);
  const [rankingList, setRankingList] = useState([]);
  const [arankingList, setArankingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisable, setIsVisable] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  //회원 객체
  const [memberId, setMemberId] = useState("");
  const viewRankClickHandler = () => {
    setIsVisable((prevState) => !prevState);
  };

  //   useEffect(() => {
  //     checkJWT("/api/member/memberSession", "get", null)
  //       .then((resopnse) => {
  //         console.log("JWT 확인 결과" + resopnse.memberId);
  //         const memberID = resopnse.memberId;
  //         setMemberId(memberID);
  //       })
  //       .catch((error) => {
  //         console.error("There was an error!", error);
  //       });
  //   }, []);

  //   useEffect(() => {
  //     axios
  //       .get(`http://localhost:9999/rank/${memberId}`)
  //       .then((response) => {
  //         setRankInfo(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching rank info:", error);
  //       });
  //   }, [memberId]);

  //   useEffect(() => {
  //     axios
  //       .get(`http://localhost:9999/rank/ranking`)
  //       .then((response) => {
  //         setRankingList(response.data);
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching ranking list:", error);
  //         setError(error);
  //         setLoading(false);
  //       });
  //   }, []);

  //   useEffect(() => {
  //     axios
  //       .get(`http://localhost:9999/rank/aranking/${memberId}`)
  //       .then((response) => {
  //         setArankingList(response.data);
  //         setLoading(false);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching ranking list:", error);
  //         setError(error);
  //         setLoading(false);
  //       });
  //   }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. JWT 확인
        const jwtResponse = await checkJWT(
          "/api/member/memberSession",
          "get",
          null
        );
        console.log("JWT 확인 결과: " + jwtResponse.memberId);
        const memberID = jwtResponse.memberId;
        setMemberId(memberID);

        // 2. 회원별 Rank 정보 가져오기
        const rankResponse = await axios.get(
          `http://localhost:9999/rank/${memberID}`
        );
        setRankInfo(rankResponse.data);

        // 3. 전체 Ranking 리스트 가져오기
        const rankingResponse = await axios.get(
          `http://localhost:9999/rank/ranking`
        );
        setRankingList(rankingResponse.data);

        // 4. A Ranking 리스트 가져오기
        const arankingResponse = await axios.get(
          `http://localhost:9999/rank/aranking/${memberID}`
        );
        setArankingList(arankingResponse.data);

        // 모든 요청이 성공하면 로딩 상태 해제
        setLoading(false);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
        setError(error);
        setLoading(false); // 에러 발생 시에도 로딩 상태 해제
      }
    };

    // 데이터 가져오는 함수 호출
    fetchData();
  }, []); // 초기 렌더링 시 한 번만 실행되도록 의존성 배열은 빈 배열로 설정

  if (!rankInfo) {
    return <div>Loading...</div>;
  }

  const totalAmount = rankInfo.amount + rankInfo.nextAmount;
  const percent = (rankInfo.amount / totalAmount) * 100;

  const rankImages = {
    1: CharacterImage1,
    2: CharacterImage2,
    3: CharacterImage3,
    4: CharacterImage4,
  };

  const getRankImage = (rankId) => {
    return rankImages[rankId] || CharacterImage1;
  };

  const renderRankImage = () => {
    return (
      <img
        src={getRankImage(rankInfo.rankId)}
        alt={`Rank ${rankInfo.rankId}`}
        className="rank-image"
      />
    );
  };

  // 소비패턴 보러가기를 클릭했을 때 처리하는 함수
  const handleConsumptionPatternClick = (memberId) => {
    setSelectedMemberId(memberId); // 선택된 memberId 설정
  };

  return (
    <div className="rank-main-container">
      <div className="rank-container">
        <div className="character-container">
          <div className="character-image">{renderRankImage()}</div>
          <div className="rank-id">{rankInfo.rankName}</div>
        </div>
        <div className="rank-info-container">
          <div className="rank-info1">{rankInfo.memberName} 님의</div>
          <div className="rank-info2">
            {month}월 등급 {rankInfo.rankName}
          </div>
          <div className="rank-info4">
            누적 점수 <span className="rank-score">{rankInfo.amount}</span>
          </div>
          <div className="rank-info3">
            다음 등급까지{" "}
            <span className="highlight">{rankInfo.nextAmount}</span> 남았어요
          </div>

          <div className="progress mb-4" style={{ height: "18px" }}>
            <div
              className="progress-bar bg-inverse progress-animated"
              style={{ width: `${percent}%`, height: "18px" }}
              role="progressbar"
            >
              <span className="sr-only">{percent}%</span>
            </div>
          </div>

          <div className="rank-info5" onClick={viewRankClickHandler}>
            등급별 혜택 보러가기
          </div>
        </div>
      </div>
      <div className="list-container">
        <div className="text-wrap">전체 랭킹</div>
        {loading ? (
          <div>Loading rankings...</div>
        ) : error ? (
          <div>Error loading rankings: {error.message}</div>
        ) : (
          rankingList.map((item, index) => (
            <div key={item.memberId} className="list-item">
              <div className="item-image">
                <img
                  src={getRankImage(item.rankId)}
                  alt={`RankLv${index + 1}`}
                  className="item-rank-image"
                />
              </div>
              <div className="item-info">
                <div className="item-info1">
                  <span className="rank-count">{item.rankNum}위</span>{" "}
                  {item.memberName} 님
                </div>
                <div className="item-info2-wrap">
                  <div className="item-info2">
                    누적점수{" "}
                    <span className="highlight2">{item.totalAmount}점</span>
                  </div>
                  <div
                    className="info-link"
                    onClick={() => handleConsumptionPatternClick(item.memberId)}
                  >
                    소비패턴 보러가기
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

        <div className="text-wrap">주소지 주변 랭킹</div>
        {loading ? (
          <div>Loading rankings...</div>
        ) : error ? (
          <div>Error loading address rankings: {error.message}</div>
        ) : (
          arankingList.map((item) => (
            <div key={item.memberId} className="list-item">
              <div className="item-image">
                <img
                  src={getRankImage(item.rankId)}
                  alt={`RankLv${item.rankNum}`}
                  className="item-rank-image"
                />
              </div>
              <div className="item-info">
                <div className="item-info1">
                  <span className="rank-count">{item.rankNum}위</span>{" "}
                  {item.memberName} 님 {"("}
                  {item.addrDetail}
                  {")"}
                </div>
                <div className="item-info2-wrap">
                  <div className="item-info2">
                    누적점수{" "}
                    <span className="highlight2">{item.totalAmount}점</span>
                  </div>
                  <div
                    className="info-link"
                    onClick={() => handleConsumptionPatternClick(item.memberId)}
                  >
                    소비패턴 보러가기
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
      {isVisable && <RankInfo setIsVisable={setIsVisable} />}
      {selectedMemberId && <RankerCalendar memberId={selectedMemberId} />}
    </div>
  );
}

export default MyPage;
