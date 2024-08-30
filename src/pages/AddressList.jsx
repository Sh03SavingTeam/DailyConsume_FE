import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import "../styles/cardInfo.css";
import "../App.css";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import CardDeltePopUp from "../components/CustomPopUp";
import DefaultAddrUpdatePopUp from "../components/CustomPopUp";
import axios from "axios";
import "../styles/addrList.css";
import { checkJWT } from "services/checkJWT";

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
  const [defaultAddrPopupOpen, setDefaultAddrPopupOpen] = useState(false); // 기본 주소 팝업 상태
  const [tempSelectedAddrId, setTempSelectedAddrId] = useState(null); // 임시로 선택된 주소

  //주소 목록
  const [addrList, setAddrList] = useState([]);

  const [selectedAddrId, setSelectedAddrId] = useState(null);
  const [memberId, setMemberId] = useState("");

  //삭제확인 팝업창 열기
  const openPopUp = (addrId) => {
    setSelectedAddrId(addrId);
    setPopupOpen(true);
  };

  //삭제확인 팝업창 닫기
  const closePopUp = () => {
    setPopupOpen(false);
  };

  const openDefaultAddrPopup = (addrId) => {
    setTempSelectedAddrId(addrId); // 임시로 선택된 주소 저장
    setDefaultAddrPopupOpen(true); // 기본 주소 팝업 열기
  };

  const closeDefaultAddrPopup = () => {
    setDefaultAddrPopupOpen(false); // 팝업 닫기
  };

  const handleConfirmDefaultAddrChange = () => {
    handleRadioChange(tempSelectedAddrId); // 기본 주소 변경
    closeDefaultAddrPopup(); // 팝업 닫기
    window.location.reload();
  };

  //삭제버튼 클릭 시 삭제 수행
  const handleConfirmDelete = () => {
    handleDeleteAddr();
    closePopUp();
  };

  //기본주소 변경 확인 시 수행
  const handleDefaultAddrUpdate = (addrId) => {
    handleRadioChange(addrId);
    closePopUp();
  };

  const location = useLocation();

  useEffect(() => {
    console.log(location);
  }, [location]);

  //memberId가 'abcd'인 주소 데이터 조회
  useEffect(() => {
    checkJWT("/api/member/memberSession", "get", null).then((response) => {
      console.log("JWT 확인 결과" + response.memberId);
      const fetchedMemberId = response.memberId;
      setMemberId(fetchedMemberId);

      axios({
        method: "get",
        url: "/api/address/addrList",
        params: {
          memberId: fetchedMemberId,
        },
      }).then((response) => {
        console.log(response.data);
        const addressList = response.data;
        setAddrList(addressList);

        // 기본 주소 설정: addr_default 값이 1인 항목
        const defaultAddress = addressList.find(
          (item) => item.addrDefault === 1
        );
        if (defaultAddress) {
          setSelectedAddrId(defaultAddress.addrId); // 기본 주소의 ID를 선택된 상태로 설정
        }
      });
    });

    // axios({
    //   method: "get",
    //   url: "/api/address/addrList",
    //   params: {
    //     memberId: "bih63879",
    //   },
    // }).then((response) => {
    //   console.log(response.data);
    //   const addressList = response.data;
    //   setAddrList(addressList);

    //   // 기본 주소 설정: addr_default 값이 1인 항목
    //   const defaultAddress = addressList.find((item) => item.addrDefault === 1);
    //   if (defaultAddress) {
    //     setSelectedAddrId(defaultAddress.addrId); // 기본 주소의 ID를 선택된 상태로 설정
    //   }
    // });
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
    window.location.reload();
  };

  // Radio 버튼 선택 처리
  const handleRadioChange = (addrId) => {
    //setSelectedAddrId(addrId);
    // 선택된 주소 ID 설정

    axios({
      method: "put",
      url: "/api/address/changeDefaultAddr",
      params: {
        memberId: memberId,
        addrId: addrId,
      },
    })
      .then(() => {
        // 기본 주소가 변경된 후 선택된 주소 상태를 업데이트
        setSelectedAddrId(addrId);

        // addrList에서 addrDefault 값을 업데이트
        setAddrList((prevList) =>
          prevList.map((item) =>
            item.addrId === addrId
              ? { ...item, addrDefault: 1 }
              : { ...item, addrDefault: 0 }
          )
        );
      })
      .catch((error) => {
        console.error("Failed to update default address:", error);
      });
    //window.location.reload();
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="card-container">
          {/* <Title>주소 목록</Title> */}
          <table>
            <thead>
              <tr>
                <th className="defaultSelectArea"></th>
                <th>별명</th>
                <th>주소</th>
                <th className="DeleteArea"></th>
              </tr>
            </thead>
            <tbody>
              {addrList.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div class="form_radio_btn">
                      <input
                        id={`addrSelectRadio_${item.addrId}`}
                        type="radio"
                        name="selectedAddr"
                        value={item.addrId}
                        checked={selectedAddrId === item.addrId} // 선택된 항목인지 확인
                        onChange={() => openDefaultAddrPopup(item.addrId)} // Radio 버튼 변경 처리
                      />
                      <label htmlFor={`addrSelectRadio_${item.addrId}`}>
                        {selectedAddrId === item.addrId ? "기본주소" : "선택"}
                      </label>
                    </div>
                  </td>
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

      {/* 기본 주소 팝업 */}
      <DefaultAddrUpdatePopUp
        open={defaultAddrPopupOpen}
        close={closeDefaultAddrPopup}
        onConfirm={handleConfirmDefaultAddrChange}
      >
        기본 주소를 변경하시겠습니까?
      </DefaultAddrUpdatePopUp>
    </div>
  );
}

export default AddressList;
