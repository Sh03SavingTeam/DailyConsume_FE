import "../App.css";
import Footer from "../components/Footer";
import "../styles/cardRegistration.css";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function ConsumeLogin(props) {
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate 사용

  //로그인 데이터 객체
  const [loginInfo, setLoginInfo] = useState({
    memberId: "",
    memberPw: "",
  });
  // 에러 메시지 상태
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setLoginInfo({ ...loginInfo, [e.target.name]: e.target.value });
  };

  const handleMemberLogin = (e) => {
    e.preventDefault();

    axios({
      method: "post",
      url: "api/member/memberLogin",
      data: {
        memberId: loginInfo.memberId,
        memberPw: loginInfo.memberPw,
      },
      withCredentials: true, // 쿠키를 포함하여 세션 유지
    })
      .then((res) => {
        console.log(res);
        // JWT 토큰이 성공적으로 반환되면 저장
        if (res.data.token) {
          // JWT 토큰을 localStorage에 저장
          localStorage.setItem("token", res.data.token);

          // 이후 원하는 페이지로 이동
          navigate("/");
        } else {
          setErrorMessage("로그인 실패. 아이디 또는 비밀번호를 확인하세요.");
        }
      })
      .catch((error) => {
        console.error("로그인 중 오류 발생:", error);
      });
  };

  const handleMemberRegister = () => {
    navigate("/Join");
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="card-registration">
          <h2 className="cardRegtitle">하루소비</h2>

          <form className="card-form">
            <div className="form-group">
              <label htmlFor="val-username">
                아이디
                <span className="required">*</span>
              </label>
              <input
                type="text"
                name="memberId"
                className="pwStyle"
                required
                placeholder="Enter a User ID.."
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="val-password">
                비밀번호
                <span className="required">*</span>
              </label>
              <input
                type="password"
                name="memberPw"
                //className="form-control"
                className="pwStyle"
                required
                placeholder="Enter a User Password.."
                onChange={handleChange}
              />
            </div>
            <button className="submit-button" onClick={handleMemberLogin}>
              로그인
            </button>
            <button className="submit-button" onClick={handleMemberRegister}>
              회원가입
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ConsumeLogin;
