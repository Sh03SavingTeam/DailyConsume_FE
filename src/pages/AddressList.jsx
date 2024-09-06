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
import { Button } from "react-bootstrap";

const Title = styled.h2`
  margin-bottom: 20px;
  text-align: center;
`;

const AddButton = styled.button`
  display: block;
  width: 100%;
  text-align: center;
  padding: 10px 15px;
  margin-top: 15px;
  background-color: #3f51b5; /* Dark blue background for the button */
  color: white;
  border-radius: 15px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #2c3a8a; /* Darker blue on hover */
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
    navigate("/mypage", { state: { selectedTab: "address" } });
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
    navigate("/mypage", { state: { selectedTab: "address" } });
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
    <div className="main-content1">
      <div className="card-container1">
        {/* <Title>주소 목록</Title> */}
        <table>
          <tbody>
            {addrList.map((item, index) => (
              <tr key={index}>
                <td className="address-contents">{item.addrName}</td>
                <td className="address-contents">{item.addrDetail}</td>
                <td className="address-contents">
                  <div class="form_radio_btn">
                    <input
                      id={`addrSelectRadio_${item.addrId}`}
                      type="radio"
                      name="selectedAddr"
                      value={item.addrId}
                      checked={selectedAddrId === item.addrId} // 선택된 항목인지 확인
                      onChange={() => openDefaultAddrPopup(item.addrId)} // Radio 버튼 변경 처리
                    />
                    <label
                      className="addrSelectLabel"
                      htmlFor={`addrSelectRadio_${item.addrId}`}
                    >
                      {selectedAddrId === item.addrId
                        ? "기본 주소"
                        : "주소 선택"}
                    </label>
                  </div>
                </td>
                <td className="address-contents">
                  <button
                    className="delete-button"
                    onClick={() => openPopUp(item.addrId)}
                  >
                    삭제
                  </button>
                </td>
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
        <Button onClick={handleAddrRegisterClick} className="newAddressButton">
          + 신규 주소 등록
        </Button>
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
