import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Refund.css";
import axios from "axios";
import arrowImg from "../assets/arrow.png";
import { checkJWT } from "services/checkJWT";
import { showToast } from 'services/toast';
import ToastPortal from 'services/toast';

function Refund({ memberId }) {
  const [memberID, setMemberID] = useState("");

  const navigate = useNavigate();
  const [check, setCheck] = React.useState(false);
  const [text, setText] = useState("");
  const [warning, setWarning] = useState("");
  const [point, setPoint] = useState(0);
  const [account, setAccount] = useState("");

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

        // 2. 포인트 계정 데이터 불러오기
        fetchPointAccount(memberID);
      } catch (error) {
        console.error("There was an error!", error);
      }
    };

    // 데이터 가져오는 함수 호출
    fetchData();
  }, []); // 초기 렌더링 시 한 번만 실행되도록 빈 배열 설정

  //   useEffect(() => {
  //     checkJWT("/api/member/memberSession", "get", null)
  //       .then((resopnse) => {
  //         console.log("JWT 확인 결과" + resopnse.memberId);
  //         const memberID = resopnse.memberId;
  //         setMemberID(memberID);
  //       })
  //       .catch((error) => {
  //         console.error("There was an error!", error);
  //       });
  //   }, []);
  //   // 처음 데이터 받아오는 useEffect
  //   useEffect(() => {
  //     fetchPointAccount();
  //   }, []);

  // 뒤로 가기 버튼 클릭 시 이전 페이지로 이동
  const backClick = () => {
    navigate(-1); // Go back to the previous page
  };

  // 환급 동의 체크했는지 확인
  const handleRefundClick = (e) => {
    if (!check) {
      e.preventDefault(); // 버튼 클릭 시 페이지 이동 방지
      setWarning("환급 동의에 체크해주세요."); // 경고 메시지 설정
    } else {
      refundPoint(text);
    }
  };

  // 데이터 불러오는 함수
  const fetchPointAccount = async (memberID) => {
    try {
      const response = await axios.get(
        `/mypage/refund/${memberID}`
      );
      const data = response.data;

      setPoint(data.point);
      setAccount(data.account);
    } catch (error) {
      console.error("정보가 없습니다.", error);
    }
  };

  // 포인트 환급 함수
  const refundPoint = async (point) => {
    try {
      const response = await axios.put(
        `/mypage/refund/${memberID}?point=${point}`
      );
      console.log("환급 성공: ", response.data);
    } catch (error) {
      console.error("환급에 실패했습니다.", error);
    }
  };

  return (
    <div className="refund-container">
      <div className="refund-header">
        <h2>포인트 환급</h2>
        <a className="back-button" onClick={backClick}>
          &lt;
        </a>
      </div>
      <div className="refund-box">
        <div className="box-point">
          <p className="small">현재 포인트</p>
          <p>{point.toLocaleString()}P</p>
        </div>
        <div className="box-img">
          <img src={arrowImg} alt="" />
        </div>
        <div className="box-account">
          <p className="small">나의 계좌</p>
          <p>
            신한은행
            <br />
            {account}
          </p>
        </div>
      </div>
      <div className="refund-input">
        <input
          type="number"
          value={text}
          onChange={(e) => {
            const value = e.target.value;
            if (value === "" || (0 < value && value <= point)) {
              setText(value);
            } else{
              showToast("보유하신 포인트 이하로 입력해주세요.");
            }
          }}
        />
        P
      </div>
      <div className="refund-info">
        <ul>
          <li>1:1 비율로 1포인트가 1원으로 전환됩니다.</li>
          <li>
            환급 신청 후 포인트는 현금으로 실시간 전환되며,
            <br /> 이후 취소는 불가합니다.
          </li>
          <li>환급된 현금은 회원가입 시 입력한 계좌로 환급됩니다.</li>
          <li>환급 받을 계좌는 신한은행 계좌만 가능합니다.</li>
          <li>
            환급 완료 후 남은 포인트는 마이페이지에서
            <br /> 확인하실 수 있습니다.
          </li>
          <li>현금 환급 신청은 해당 앱에서만 가능합니다.</li>
        </ul>
      </div>
      <div className="refund-check">
        <label>
          <input
            type="checkbox"
            checked={check}
            onChange={() => setCheck((prevCheck) => !prevCheck)}
          />
          환급 동의 (전환 시 취소할 수 없습니다.)
        </label>
      </div>
      {warning && <p className="refund-warning">{warning}</p>}
      <div className="refund-button">
        <Link
          to={check ? "/MyPage/Refund/Confirm" : "#"}
          state={{ refundAmount: text }}
          onClick={handleRefundClick}
        >
          <button>나의 계좌로 포인트 환급</button>
        </Link>
      </div>
      <Footer />
    </div>
  );
}

export default Refund;
