import "../App.css";
import "../styles/ConsumeHistory.css";
import Footer from "../components/Footer";
//import axios from 'axios';
import React from "react";

function ConsumeJoin(props) {
  return (
    <div className="container con2">
      <div className="title">
        <h2 className="set">하루소비 회원가입</h2>
        <p>아래 정보를 입력해주세요.</p>
      </div>
      <div className="col-xl-6">
        <div className="form-group mb-3 row">
          <label className="col-lg-4 col-form-label" htmlFor="val-userphoto">
            프로필사진<span className="text-danger">*</span>
          </label>
          <div className="col-lg-6">
            <input type="text" className="form-control" required placeholder="Enter a User Photo.."/>
          </div>
        </div>
        <div className="form-group mb-3 row">
          <label className="col-lg-4 col-form-label" htmlFor="val-username">
            아이디<span className="text-danger">*</span>
          </label>
          <div className="col-lg-6">
            <input type="text" className="form-control" required placeholder="Enter a User ID.."/>
          </div>
        </div>
        <div className="form-group mb-3 row">
          <label className="col-lg-4 col-form-label" htmlFor="val-password">
            비밀번호<span className="text-danger">*</span>
          </label>
          <div className="col-lg-6">
            <input type="password" className="form-control" required placeholder="Enter a User Password.." />
          </div>
        </div>
        <div className="form-group mb-3 row">
          <label className="col-lg-4 col-form-label" htmlFor="val-password">
            비밀번호확인<span className="text-danger">*</span>
          </label>
          <div className="col-lg-6">
            <input type="password" className="form-control" required placeholder="Enter a User Password.." />
          </div>
        </div>
        <div className="form-group mb-3 row">
          <label className="col-lg-4 col-form-label" htmlFor="val-username">
            회원이름<span className="text-danger">*</span>
          </label>
          <div className="col-lg-6">
            <input type="text" className="form-control" required placeholder="Enter a User Name.." />
          </div>
        </div>
        <div className="form-group mb-3 row">
          <label className="col-lg-4 col-form-label" htmlFor="val-userbirth">
            생년월일<span className="text-danger">*</span>
          </label>
          <div className="col-lg-6">
            <input type="text" className="form-control" required placeholder="Enter a User Birth.." />
          </div>
        </div>
        <div className="form-group mb-3 row">
          <label className="col-lg-4 col-form-label" htmlFor="val-userbirth">
            성별<span className="text-danger">*</span>
          </label>
          <div className="col-lg-6">
            <input type="text" className="form-control" required placeholder="Enter a User Gender.." />
          </div>
        </div>
        <div className="form-group mb-3 row">
          <label className="col-lg-4 col-form-label" htmlFor="val-useraccount">
            계좌번호<span className="text-danger">*</span>
          </label>
          <div className="col-lg-6">
            <input type="text" className="form-control" required placeholder="Enter a User Account.." />
          </div>
        </div>
        
      </div>
      <button className="select">회원가입</button>
      <Footer />
    </div>
  );
}

export default ConsumeJoin;
