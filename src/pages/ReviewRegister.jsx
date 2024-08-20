import React, { useRef, useState, useEffect } from "react";
//import Webcam from "react-webcam";
import { Camera } from "react-camera-pro";
import Footer from "../components/Footer";
import "../styles/reviewRegister.css";
import ReactStars from "react-stars";
import AWS from "aws-sdk";
import axios from "axios";

function ReviewRegister(props) {
  // const webcamRef = useRef(null);

  // const videoConstraints = {
  //   facingMode: { exact: "environment" },
  // };

  //카메라용
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);

  //별점용
  const [rating, setRating] = useState(4);

  // 영수증 OCR 요청 결과
  const [ocrResult, setOcrResult] = useState({
    name: "",
    bizNum: "",
    price: "",
  });

  const takePicture = () => {
    const photo = cameraRef.current.takePhoto();
    setImage(photo);
    return photo;
  };

  const getFileName = () => {
    const timestamp = Date.now();
    return `receiptimg_${timestamp}.jpg`;
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
        Key: "ReceiptIMG/" + filename,
        Body: fileBlob,
      },
    });
    upload.promise().then(console.log("업로드"));
  };

  const handleTakePhoto = async () => {
    try {
      const photoBlob = takePicture();
      const fileName = getFileName();
      uploadToS3(fileName, photoBlob);

      const response = await axios({
        method: "post",
        url: "/api/receipt/receiptOCR",
        data: {
          fileName: fileName,
        },
      });
      console.log("영수증OCR:" + response.data);

      const { name, bizNum, price } = response.data;

      // console.log("Card Number:", number);
      // console.log("Valid Thru:", validThru);

      // 상태 업데이트
    } catch (error) {
      console.error(error);
      // 오류를 사용자에게 알리거나 상태에 저장할 수 있습니다.
      // 예를 들어, 상태에 저장하는 경우:
      // setError(error.message);
    }
  };

  const handleRegisterReview = async (e) => {
    e.preventDefault();

    axios({});
  };

  return (
    <div className="container">
      <div className="pictureContainer">
        {!image ? (
          <>
            <Camera
              ref={cameraRef}
              aspectRatio={4 / 3}
              facingMode={"environment"}
            />
            <button className="picturebutton" onClick={handleTakePhoto}>
              촬영하기
            </button>
          </>
        ) : (
          <>
            <img className="capRecieptIMG" src={image} alt="Captured" />
            <button className="picturebutton" onClick={() => setImage(null)}>
              다시 촬영하기
            </button>
          </>
        )}
      </div>

      <div className="reactstar">
        <ReactStars
          count={5}
          value={rating}
          onChange={(newRating) => setRating(newRating)}
          size={50}
          color2={"#ffd700"}
        />
      </div>
      <div className="pictureContainer">
        <p>Current Rating: {rating}</p>
        <button
          type="submit"
          className="picturebutton"
          onClick={handleRegisterReview}
        >
          등록하기
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default ReviewRegister;
