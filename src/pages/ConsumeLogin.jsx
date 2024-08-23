import "../App.css";
import "../styles/ConsumeHistory.css";
import Footer from "../components/Footer";
//import axios from 'axios';
import React from "react";

function ConsumeLogin(props) {
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
            <input type="text" className="form-control" required placeholder="Enter a User ID.." />
          </div>
        </div>
        <div className="form-group mb-3 row">
          <label className="col-lg-4 col-form-label" htmlFor="val-password">
            비밀번호
            <span className="text-danger">*</span>
          </label>
          <div className="col-lg-6">
            <input type="text" className="form-control" required placeholder="Enter a User Password.." />
          </div>
        </div>
        <button className="select">로그인</button>
        <button className="select">회원가입</button>


      </div>
      <Footer />
    </div>
  );
}

export default ConsumeLogin;
