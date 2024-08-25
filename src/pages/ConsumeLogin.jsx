import "../App.css";
import "../styles/ConsumeHistory.css";
import Footer from "../components/Footer";
//import axios from 'axios';
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
          //navigate("/home");
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
    <div className="container con2">
      <div className="title">
        <h2 className="set">하루소비 로그인</h2>
        <p>하루소비에 오신 것을 환영합니다. </p>
        <p>아래 정보를 입력하여 로그인하세요.</p>
      </div>
      <div className="col-xl-6">
        <div className="form-group mb-3 row">
          <label className="col-lg-4 col-form-label" htmlFor="val-username">
            아이디
            <span className="text-danger">*</span>
          </label>
          <div className="col-lg-6">
            <input
              type="text"
              name="memberId"
              className="form-control"
              required
              placeholder="Enter a User ID.."
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group mb-3 row">
          <label className="col-lg-4 col-form-label" htmlFor="val-password">
            비밀번호
            <span className="text-danger">*</span>
          </label>
          <div className="col-lg-6">
            <input
              type="text"
              name="memberPw"
              className="form-control"
              required
              placeholder="Enter a User Password.."
              onChange={handleChange}
            />
          </div>
        </div>
        <button className="select" onClick={handleMemberLogin}>
          로그인
        </button>
        <button className="select" onClick={handleMemberRegister}>
          회원가입
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default ConsumeLogin;
