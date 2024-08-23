import "../App.css";
import "../styles/ConsumeHistory.css";
import Footer from "../components/Footer";
import axios from 'axios';
import React, { useState } from "react";
import { useEffect } from "react";


function ConsumeCompare({ memberId }) {
  let [userList, setUserList] = useState([]);
  let [peerList, setPeerList] = useState([]);
  let [age, setAge] = useState(0);
  let [currentMonth, setCurrentMonth] = useState(0);
  let [userPayment, setUserPayment] = useState(0);
  let [peerPayment, setPeerPayment] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:9999/mypage/mycardHistory?memberId=${memberId}`) // 스프링 서버의 엔드포인트로 수정 필요
      .then((response) => {
        const payAmounts = response.data.map((item) => item.payAmount);
        setUserList(payAmounts); // payAmount 값을 상태로 저장

      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // 빈 배열은 컴포넌트가 처음 렌더링될 때만 useEffect 실행을 의미

  useEffect(() => {
    axios
      .get(`http://localhost:9999/mypage/peercardHistory?memberId=${memberId}`) // 스프링 서버의 엔드포인트로 수정 필요
      .then((response) => {
        const payAmounts = response.data.payHistories.map(
          (item) => item.payAmount
        );
        setAge(response.data.age);
        setCurrentMonth(response.data.currentMonth);
        setPeerList(payAmounts); // payAmount 값을 상태로 저장
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // userList가 업데이트될 때마다 합계 계산
  useEffect(() => {
    const totalUserPayment = userList.reduce((acc, curr) => acc + curr, 0);
    setUserPayment(totalUserPayment);
  }, [userList]);

  // peerList가 업데이트될 때마다 합계 계산
  useEffect(() => {
    const totalPeerPayment = peerList.reduce((acc, curr) => acc + curr, 0);
    setPeerPayment(totalPeerPayment);
  }, [peerList]);

  return (
    <div className="container con2">
      <div className="title">
        <h2 className="set">💎{memberId}님💎 또래보다 아껴 썼어요!</h2>
      </div>
      <hr />
      <div className="card">
        <div className="card-header">
          <div className="savings">🍚 식비 25,231원 <span className="highlight">절약</span></div>
        </div>
        <div className="card-content">
        <div className="my-expense">
            <p>내 소비</p>
            <p className="amount my">38,200원</p>
          </div>
          <div className="peer-expense">
            <p>또래 소비</p>
            <p className="amount">155,500원</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="savings">🚌 교통비 25,231원 <span className="highlight">절약</span></div>
        </div>
        <div className="card-content">
          <div className="my-expense">
            <p>내 소비</p>
            <p className="amount my">38,200원</p>
          </div>
          <div className="peer-expense">
            <p>또래 소비</p>
            <p className="amount">155,500원</p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="savings">🛍️ 온라인쇼핑비 25,231원 <span className="highlight">절약</span></div>
        </div>
        <div className="card-content">
          <div className="my-expense">
            <p>내 소비</p>
            <p className="amount my">38,200원</p>
          </div>
          <div className="peer-expense">
            <p>또래 소비</p>
            <p className="amount">155,500원</p>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-header">
          <div className="savings">🍿 문화/여가비 25,231원 <span className="highlight">절약</span></div>
        </div>
        <div className="card-content">
          <div className="my-expense">
            <p>내 소비</p>
            <p className="amount my">38,200원</p>
          </div>
          <div className="peer-expense">
            <p>또래 소비</p>
            <p className="amount">155,500원</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default ConsumeCompare;
