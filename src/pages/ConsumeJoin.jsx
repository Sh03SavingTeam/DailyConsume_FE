import "../App.css";
import "../styles/ConsumeHistory.css";
import Footer from "../components/Footer";
//import axios from 'axios';
import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AWS from "aws-sdk";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function ConsumeJoin(props) {
  const location = useLocation();
  const navigate = useNavigate(); // useNavigate 사용

  //회원 객체
  const [member, setMember] = useState({
    memberId: "",
    memberPw: "",
    memberName: "",
    memberGender: "Male",
    memberBirth: new Date(),
    memberAccount: "",
    pointAmount: 0,
    memberImg: "",
    rankId: 1,
  });

  // 이미지 파일 및 미리보기 URL 상태 관리
  const [selectedImage, setSelectedImage] = useState(null); // 실제 파일을 저장할 상태
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 URL 저장 상태

  // 파일 변경 처리 함수
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // 업로드한 파일 정보
    if (file) {
      setSelectedImage(file); // 파일 상태 업데이트
      const imageUrl = URL.createObjectURL(file); // 파일을 미리보기용 URL로 변환
      setPreviewUrl(imageUrl); // 미리보기 URL 저장
    }
  };

  //선택한 성별
  const [gender, setGender] = useState("Male");

  useEffect(() => {
    setMember((prevState) => ({
      ...prevState,
      memberGender: gender,
    }));
  }, [gender]);

  const handleChange = (e) => {
    setMember({ ...member, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (event) => {
    const selectedGender = event.target.value; // 선택된 성별 값을 가져옴

    setMember((prevState) => ({
      ...prevState,
      memberGender: selectedGender, // 즉시 성별 업데이트
    }));

    setGender(selectedGender); // 별도의 성별 상태 업데이트
  };

  const getFileName = () => {
    return `memberimg_${member.memberId}.jpg`;
  };

  const uploadToS3 = async (filename, fileBlob) => {
    // AWS S3 설정
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_ACCESS_REGION,
    });

    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: "shinhands3rd-project2",
        Key: "MemberIMG/" + filename,
        Body: fileBlob,
      },
    });

    // 업로드가 완료될 때까지 대기
    await upload.promise();
    console.log("업로드 완료:", filename);

    // 업로드가 완료되면 memberImg에 파일명을 설정
    setMember((prevState) => ({
      ...prevState,
      memberImg: filename,
    }));
  };

  //회원 등록 버튼
  const handleRegisterMember = async (e) => {
    e.preventDefault(); // 기본 폼 제출 방지

    if (!selectedImage) {
      console.log("이미지가 선택되지 않았습니다.");
      return;
    }

    const filename = getFileName();
    console.log("파일명:", filename);

    // 이미지 업로드 완료 대기
    await uploadToS3(filename, selectedImage);

    // 이미지 파일 이름이 설정된 member 객체 전송
    axios({
      method: "post",
      url: "api/member/memberRegister",
      data: member,
    })
      .then((res) => {
        console.log("회원가입 성공:", res);
        navigate("/Login");
      })
      .catch((error) => {
        console.error("회원가입 실패:", error);
      });
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <h2 className="set">회원가입</h2>
        <div className="col-xl-6">
          <div className="form-group mb-3 row">
            <label className="col-lg-4 col-form-label" htmlFor="val-userphoto">
              프로필사진<span className="text-danger">*</span>
            </label>
            <div className="col-lg-6">
            <label htmlFor="profileImgUpload" className="img-upload">
            🧷업로드
            </label>
              <input
                id="profileImgUpload"
                type="file"
                accept="image/*"
                name="memberImg"
                className="profileRegImg"
                onChange={handleImageChange}
              />
            </div>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="이미지 미리보기"
                style={{ width: "100px", height: "auto", marginTop: "10px" }}
              />
            )}
          </div>
          <div className="form-group mb-3 row">
            <label className="col-lg-4 col-form-label" htmlFor="val-username">
              아이디<span className="text-danger">*</span>
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
              비밀번호<span className="text-danger">*</span>
            </label>
            <div className="col-lg-6">
              <input
                type="password"
                name="memberPw"
                className="form-control"
                required
                placeholder="Enter a User Password.."
                onChange={handleChange}
              />
            </div>
          </div>
          {/* <div className="form-group mb-3 row">
            <label className="col-lg-4 col-form-label" htmlFor="val-password">
              비밀번호확인<span className="text-danger">*</span>
            </label>
            <div className="col-lg-6">
              <input
                type="password"
                name="memberPw"
                className="form-control"
                required
                placeholder="Enter a User Password.."
                onChange={handleChange}
              />
            </div>
          </div> */}
          <div className="form-group mb-3 row">
            <label className="col-lg-4 col-form-label" htmlFor="val-username">
              회원이름<span className="text-danger">*</span>
            </label>
            <div className="col-lg-6">
              <input
                type="text"
                name="memberName"
                className="form-control"
                required
                placeholder="Enter a User Name.."
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group mb-3 row">
            <label className="col-lg-4 col-form-label" htmlFor="val-userbirth">
              생년월일<span className="text-danger">*</span>
            </label>
            <div name="memberBirth" className="col-lg-6">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker className="datepicker-custom"/>
              </LocalizationProvider>
            </div>
          </div>
          <div className="form-group mb-3 row">
            <label className="col-lg-4 col-form-label" htmlFor="val-userbirth">
              성별<span className="text-danger">*</span>
            </label>
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="memberGender"
                  value="Male"
                  checked={gender === "Male"}
                  onChange={handleGenderChange}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="memberGender"
                  value="Female"
                  checked={gender === "Female"}
                  onChange={handleGenderChange}
                />
                Female
              </label>
            </div>
          </div>
          <div className="form-group mb-3 row">
            <label
              className="col-lg-4 col-form-label"
              htmlFor="val-useraccount"
            >
              계좌번호<span className="text-danger">*</span>
            </label>
            <div className="col-lg-6">
              <input
                type="text"
                name="memberAccount"
                className="form-control"
                required
                placeholder="Enter a User Account.."
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <button type="submit" className="select" onClick={handleRegisterMember}>
          회원가입
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default ConsumeJoin;
