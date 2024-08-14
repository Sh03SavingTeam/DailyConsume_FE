import React, { useState } from "react";
import Footer from "../components/Footer";
import "../styles/cardInfo.css";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CardDeltePopUp from "../components/CustomPopUp";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f3f4f7;
  min-height: 100vh;
`;

const Tabs = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const Tab = styled.div`
  padding: 10px 20px;
  border-radius: 20px;
  background-color: ${(props) => (props.active ? "#6A5ACD" : "#BFE6E1")};
  color: ${(props) => (props.active ? "#ffffff" : "#000000")};
  margin-right: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.active ? "#483D8B" : "#A0D6CF")};
  }
`;

const Card = styled.div`
  width: 350px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

const table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th,
  td {
    border: 1px solid #e3e6eb;
    padding: 10px;
    text-align: left;
  }

  th {
    background-color: #e0f7f1;
  }

  td {
    background-color: #f7fbfc;
  }

  td:last-child {
    text-align: center;
    cursor: pointer;
    color: red;
  }
`;

const AddButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #bfe6e1;
  color: #000000;
  border: none;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    background-color: #a0d6cf;
  }
`;

function AddressList(props) {
  const navigate = useNavigate();

  const handleAddrRegisterClick = () => {
    navigate("/MyPage/AddrRegister");
  };

  const [popupOpen, setPopupOpen] = useState(false);

  const openPopUp = () => {
    setPopupOpen(true);
  };

  const closePopUp = () => {
    setPopupOpen(false);
  };

  const handleCardRegisterClick = () => {
    navigate("/Home/CardRegister");
  };

  //백엔드에서 넘겨받는 데이터를 다음과 같이 리스트로 저장
  const data = [
    { label: "", address: "서울시 마포구 동교동" },
    { label: "직장", address: "서울시 서대문구 연남동" },
    { label: "거주지", address: "경기도 수원시 장안구 조원동" },
    { label: "", address: "경기도 평택시 팽성읍" },
  ];
  return (
    <div className="container">
      <div className="card-container">
        <Title>주소 목록</Title>
        <table>
          <thead>
            <tr>
              <th>별명</th>
              <th>주소</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.label}</td>
                <td>{item.address}</td>
                <button onClick={openPopUp}>✕</button>
                <CardDeltePopUp open={popupOpen} close={closePopUp}>
                  선택하신 주소를 삭제할까요?
                </CardDeltePopUp>
              </tr>
            ))}
          </tbody>
        </table>
        <AddButton onClick={handleAddrRegisterClick}>신규 주소 등록</AddButton>
      </div>

      <Footer />
    </div>
  );
}

export default AddressList;
