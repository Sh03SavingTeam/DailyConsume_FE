import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import { Camera } from "react-camera-pro";
import "../styles/cardRegistration.css";
import AWS from "aws-sdk";
import { useLocation } from "react-router-dom";
import { Call } from "@mui/icons-material";
import axios from "axios";
import { Col, Row, Form, Button, InputGroup } from "react-bootstrap";

function CardRegister(props) {
  const location = useLocation();

  // 로컬 스토리지에서 ACCESS TOKEN 가져오기
  const accessToken = localStorage.getItem("ACCESS_TOKEN");

  useEffect(() => {
    console.log(location);
  }, [location]);

  //카드 객체
  const [memberCard, setMemberCard] = useState({
    card_num: "",
    expiration_date: "",
    cvc: "",
  });

  const handleChange = (e) => {
    setMemberCard({ ...memberCard, [e.target.name]: e.target.value });
  };

  //카메라용
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);

  const takePicture = () => {
    const photo = cameraRef.current.takePhoto();
    setImage(photo);
    //const blob = dataURLtoBlob(photo);
    return photo;
  };

  const getFileName = () => {
    const timestamp = Date.now();
    return `cardimg_${timestamp}.jpg`;
  };

  const uploadToServer = (filename, photo) => {
    const formData = new FormData();
    formData.append("file", dataURLtoBlob(photo), filename);

    fetch("http://localhost:5000/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log("Uploaded file path:", data.filePath))
      .catch((error) => console.error("Error:", error));
  };

  const uploadToS3 = (filename, fileBlob) => {
    //AWS S3 설정
    AWS.config.update({
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
      region: process.env.REACT_APP_AWS_ACCESS_REGION,
    });

    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: "shinhands3rd-project2",
        Key: "CardIMG/" + filename,
        Body: fileBlob,
      },
    });
    upload.promise().then(console.log("업로드"));
  };

  const handleTakePhoto = () => {
    const photoBlob = takePicture();
    const fileName = getFileName();
    uploadToS3(fileName, photoBlob);
    //uploadToServer(fileName, photoBlob);
  };

  const handleRegisterCard = async (e) => {
    e.preventDefault();

    // try {
    //   const response = await axios.post(
    //     "http://localhost:9999/card/cardRegister",
    //     memberCard,
    //     {
    //       headers: {
    //         "X-CSRF-TOKEN": accessToken, // 서버에서 받은 CSRF 토큰
    //       },
    //     }
    //   );
    //   console.log(response);
    // } catch (error) {
    //   console.error("카드 등록 오류:", error);
    // }

    axios({
      method: "post",
      url: "http://localhost:9999/api/card/cardRegister",
      data: memberCard,
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
  };

  return (
    <div className="container">
      <div className="card-registration">
        <h2 className="title">신규 카드 등록</h2>
        {!image ? (
          <>
            <Camera
              className="camera-view"
              ref={cameraRef}
              aspectRatio={4 / 3}
              facingMode={"environment"}
            />
            <button className="capture-button" onClick={handleTakePhoto}>
              촬영하기
            </button>
          </>
        ) : (
          <>
            <img className="capRecieptIMG" src={image} alt="Captured" />
            <button className="capture-button" onClick={() => setImage(null)}>
              다시 촬영하기
            </button>
          </>
        )}

        <form className="card-form">
          <div className="form-group">
            <label for="card-number">
              카드번호 <span className="required">*</span>
            </label>
            <input
              type="text"
              name="card_num"
              placeholder="1234 5678 4321 9876"
              required
              onChange={handleChange}
              value={memberCard.card_num}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label for="expiry-date">
                유효일자 <span className="required">*</span>
              </label>
              <input
                type="text"
                name="expiration_date"
                placeholder="09/27"
                required
                onChange={handleChange}
                value={memberCard.expiration_date}
              />
            </div>
            <div className="form-group">
              <label for="cvc">
                CVC <span className="required">*</span>
              </label>
              <input
                type="text"
                name="cvc"
                placeholder="111"
                required
                onChange={handleChange}
                value={memberCard.cvc}
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              카드선택 <span className="required">*</span>
            </label>
            <div className="radio-group">
              <label>
                <input type="radio" name="card-type" value="credit" /> 신용
              </label>
              <label>
                <input type="radio" name="card-type" value="check" /> 체크
              </label>
            </div>
            <select>
              <option>신한카드 Deep Dream</option>
            </select>
          </div>

          <button
            type="submit"
            className="submit-button"
            onClick={handleRegisterCard}
          >
            등록하기
          </button>
        </form>

        <Footer />
      </div>
    </div>
  );
}

// 데이터 URL을 Blob으로 변환하는 유틸리티 함수
function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
}

export default CardRegister;
