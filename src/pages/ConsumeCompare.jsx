import "../App.css";
import "../styles/ConsumeHistory.css";
import Footer from "../components/Footer";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkJWT } from "services/checkJWT";

function ConsumeCompare({ memberId, contentRef }) {
  const navigate = useNavigate();
  const [memberID, setMemberID] = useState("");

  let [userList, setUserList] = useState([]);
  let [peerList, setPeerList] = useState([]);

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
        setMemberID(memberID);

        // 2. My Card History 가져오기
        const myCardHistoryResponse = await axios.get(
          `/mypage/mycardHistory?memberId=${memberID}`
        );
        const userPayAmounts = myCardHistoryResponse.data.map(
          (item) => item.payAmount
        );
        setUserList(userPayAmounts);

        // 3. Peer Card History 가져오기
        const peerCardHistoryResponse = await axios.get(
          `/mypage/peercardHistory?memberId=${memberID}`
        );
        const peerPayAmounts = peerCardHistoryResponse.data.payHistories.map(
          (item) => item.payAmount
        );
        setPeerList(peerPayAmounts);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    // 데이터 가져오는 함수 호출
    fetchData();

    scrollTopFunc();
  }, []); // 초기 렌더링 시 한 번만 실행되도록 의존성 배열은 빈 배열로 설정

  const scrollTopFunc = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  // useEffect(() => {
  //   checkJWT("/api/member/memberSession", "get", null)
  //     .then((resopnse) => {
  //       console.log("JWT 확인 결과" + resopnse.memberId);
  //       const memberID = resopnse.memberId;
  //       setMemberID(memberID);
  //     })
  //     .catch((error) => {
  //       console.error("There was an error!", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`/mypage/mycardHistory?memberId=${memberID}`)
  //     .then((response) => {
  //       const payAmounts = response.data.map((item) => item.payAmount);
  //       setUserList(payAmounts);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`/mypage/peercardHistory?memberId=${memberID}`)
  //     .then((response) => {
  //       const payAmounts = response.data.payHistories.map(
  //         (item) => item.payAmount
  //       );
  //       setPeerList(payAmounts);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);

  const differenceList = peerList
    .map((value, index) => {
      const difference = value - userList[index];
      return difference >= 0 ? difference : 0;
    })
    .filter((index) => index !== null);

  return (
    <div className="container con2">
      <div className="point-header2">
        <Link to="/mypage" state={{ selectedTab: "analysis" }}>
          <button className="back-button2">&lt;</button>
        </Link>
      </div>
      <div className="title-compare">
        <h3 className="t">또래보다 아껴 썼어요!</h3>
      </div>
      <div className="cardList">
        {differenceList[0] > 0 && (
          <div className="card">
            <div className="card-header">
              <div className="savings">🍚 식비 {differenceList[0].toLocaleString()}원{" "}<span className="highlight">절약</span></div>
            </div>
            <div className="card-content">
              <div className="my-expense">
                <p className="p-num">내 소비</p>
                <p className="amount my">{userList[0].toLocaleString()}원</p>
              </div>
              <div className="peer-expense">
                <p className="p-num">또래 소비</p>
                <p className="amount">{peerList[0].toLocaleString()}원</p>
              </div>
            </div>
          </div>
        )}
        {differenceList[1] > 0 && (
          <div className="card">
            <div className="card-header">
              <div className="savings">🚌 교통비 {differenceList[1].toLocaleString()}원{" "}<span className="highlight">절약</span></div>
            </div>
            <div className="card-content">
              <div className="my-expense">
                <p className="p-num">내 소비</p>
                <p className="amount my">{userList[1].toLocaleString()}원</p>
              </div>
              <div className="peer-expense">
                <p className="p-num">또래 소비</p>
                <p className="amount">{peerList[1].toLocaleString()}원</p>
              </div>
            </div>
          </div>
        )}
        {differenceList[2] > 0 && (
          <div className="card">
            <div className="card-header">
              <div className="savings">🛍️ 온라인쇼핑비 {differenceList[2].toLocaleString()}원{" "}<span className="highlight">절약</span></div>
            </div>
            <div className="card-content">
              <div className="my-expense">
                <p className="p-num">내 소비</p>
                <p className="amount my">{userList[2].toLocaleString()}원</p>
              </div>
              <div className="peer-expense">
                <p className="p-num">또래 소비</p>
                <p className="amount">{peerList[2].toLocaleString()}원</p>
              </div>
            </div>
          </div>
        )}
        {differenceList[3] > 0 && (
          <div className="card">
            <div className="card-header">
              <div className="savings">🍿 문화/여가비 {differenceList[3].toLocaleString()}원{" "}<span className="highlight">절약</span></div>
            </div>
            <div className="card-content">
              <div className="my-expense">
                <p className="p-num">내 소비</p>
                <p className="amount my">{userList[3].toLocaleString()}원</p>
              </div>
              <div className="peer-expense">
                <p className="p-num">또래 소비</p>
                <p className="amount">{peerList[3].toLocaleString()}원</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
export default ConsumeCompare;
