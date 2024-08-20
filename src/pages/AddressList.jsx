import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import "../styles/cardInfo.css";
import "../App.css";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import CardDeltePopUp from "../components/CustomPopUp";
import axios from "axios";
import "../styles/addrList.css";

const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

const AddButton = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #303473;
  color: #ffffff;
  border: none;
  cursor: pointer;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  &:hover {
    background-color: #a0d6cf;
  }
`;

function AddressList(props) {
  const navigate = useNavigate();

  const handleAddrRegisterClick = () => {
    navigate("/mypage/addrregister");
  };

  const [popupOpen, setPopupOpen] = useState(false);

  //주소 목록
  const [addrList, setAddrList] = useState([]);

  const [selectedAddrId, setSelectedAddrId] = useState(null);

  //삭제확인 팝업창 열기
  const openPopUp = (addrId) => {
    setSelectedAddrId(addrId);
    setPopupOpen(true);
  };

  //삭제확인 팝업창 닫기
  const closePopUp = () => {
    setPopupOpen(false);
  };

  //삭제버튼 클릭 시 삭제 수행
  const handleConfirmDelete = () => {
    handleDeleteAddr();
    closePopUp();
  };

  const location = useLocation();

  useEffect(() => {
    console.log(location);
  }, [location]);

  //memberId가 'abcd'인 주소 데이터 조회
  useEffect(() => {
    axios({
      method: "get",
      url: "/api/address/addrList",
      params: {
        memberId: "abcd",
      },
    }).then((response) => {
      console.log(response.data);
      const addressList = response.data;
      setAddrList(addressList);
    });
  }, []);

  const handleDeleteAddr = () => {
    if (selectedAddrId) {
      axios({
        method: "delete",
        url: "/api/address/addrDelete",
        params: {
          addrId: selectedAddrId,
        },
      }).then(() => {
        // After deletion, fetch the updated list
        setAddrList((prevList) =>
          prevList.filter((item) => item.addrId !== selectedAddrId)
        );
        closePopUp();
      });
    }
  };

  return (
    <div className="app-container">
      <div className="main-content">
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
              {addrList.map((item, index) => (
                <tr key={index}>
                  <td>{item.addrName}</td>
                  <td>{item.addrDetail}</td>
                  <button
                    className="deleteButton"
                    onClick={() => openPopUp(item.addrId)}
                  >
                    ✕
                  </button>
                  <CardDeltePopUp
                    open={popupOpen}
                    close={closePopUp}
                    onConfirm={handleConfirmDelete}
                  >
                    선택하신 주소를 삭제할까요?
                  </CardDeltePopUp>
                </tr>
              ))}
            </tbody>
          </table>
          <AddButton onClick={handleAddrRegisterClick}>
            신규 주소 등록
          </AddButton>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AddressList;
