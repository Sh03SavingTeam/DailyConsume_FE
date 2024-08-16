import React, { useState } from "react";
import Footer from "../components/Footer";
import "../styles/cardInfo.css";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import CardDeltePopUp from "../components/CustomPopUp";

const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
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
