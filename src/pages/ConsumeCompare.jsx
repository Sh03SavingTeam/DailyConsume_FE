import "../App.css";
import "../styles/ConsumeHistory.css";
import Footer from "../components/Footer";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function ConsumeCompare({ memberId }) {
  let [userList, setUserList] = useState([]);
  let [peerList, setPeerList] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:9999/mypage/mycardHistory?memberId=${memberId}`)
      .then((response) => {
        const payAmounts = response.data.map((item) => item.payAmount);
        setUserList(payAmounts);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:9999/mypage/peercardHistory?memberId=${memberId}`)
      .then((response) => {
        const payAmounts = response.data.payHistories.map(
          (item) => item.payAmount
        );
        setPeerList(payAmounts);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const differenceList = peerList
    .map((value, index) => {
      const difference = value - userList[index];
      return difference >= 0 ? difference : 0;
    })
    .filter((index) => index !== null);

  return (
    <div className="container con2">
      <div className="point-header">
      <Link to="/mypage" state={{selectedTab: 'analysis'}}>
        <button className="back-button">&lt;</button>
      </Link>
      </div>
      <div className="title">
        <h2 className="set">또래보다 아껴 썼어요!</h2>
      </div>
      <hr />
      <div className="card-list">
        {differenceList[0] > 0 && (
          <div className="card">
            <div className="card-header">
              <div className="savings">
                🍚 식비 {differenceList[0].toLocaleString()}원{" "}
                <span className="highlight">절약</span>
              </div>
            </div>
            <div className="card-content">
              <div className="my-expense">
                <p>내 소비</p>
                <p className="amount my">{userList[0].toLocaleString()}원</p>
              </div>
              <div className="peer-expense">
                <p>또래 소비</p>
                <p className="amount">{peerList[0].toLocaleString()}원</p>
              </div>
            </div>
          </div>
        )}
        {differenceList[1] > 0 && (
          <div className="card">
            <div className="card-header">
              <div className="savings">
                🚌 교통비 {differenceList[1].toLocaleString()}원{" "}
                <span className="highlight">절약</span>
              </div>
            </div>
            <div className="card-content">
              <div className="my-expense">
                <p>내 소비</p>
                <p className="amount my">{userList[1].toLocaleString()}원</p>
              </div>
              <div className="peer-expense">
                <p>또래 소비</p>
                <p className="amount">{peerList[1].toLocaleString()}원</p>
              </div>
            </div>
          </div>
        )}
        {differenceList[2] > 0 && (
          <div className="card">
            <div className="card-header">
              <div className="savings">
                🛍️ 온라인쇼핑비 {differenceList[2].toLocaleString()}원{" "}<span className="highlight">절약</span>
              </div>
            </div>
            <div className="card-content">
              <div className="my-expense">
                <p>내 소비</p>
                <p className="amount my">{userList[2].toLocaleString()}원</p>
              </div>
              <div className="peer-expense">
                <p>또래 소비</p>
                <p className="amount">{peerList[2].toLocaleString()}원</p>
              </div>
            </div>
          </div>
        )}
        {differenceList[3] > 0 && (
          <div className="card">
            <div className="card-header">
              <div className="savings">
                🍿 문화/여가비 {differenceList[3].toLocaleString()}원{" "}<span className="highlight">절약</span>
              </div>
            </div>
            <div className="card-content">
              <div className="my-expense">
                <p>내 소비</p>
                <p className="amount my">{userList[3].toLocaleString()}원</p>
              </div>
              <div className="peer-expense">
                <p>또래 소비</p>
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
