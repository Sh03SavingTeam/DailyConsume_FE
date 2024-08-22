import React, { useRef, useState, useEffect } from "react";
//import Webcam from "react-webcam";
import { Camera } from "react-camera-pro";
import Footer from "../components/Footer";
import "../styles/reviewRegister.css";
import ReactStars from "react-stars";
import AWS from "aws-sdk";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import OCRConfirmedPopUp from "../components/ReceiptOCRPopUp";

function ReviewRegister(props) {
  const navigate = useNavigate(); // useNavigate 사용

  const location = useLocation();
  const { storename, storebizNum } = location.state || {};

  //상호명

  //사업자등록번호
  const [bizNum, setBizNum] = useState("");

  //리뷰객체
  const [review, setReview] = useState({
    storeRegNum: "",
    rating: 0.0,
  });

  //카메라용
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);

  //별점용
  const [rating, setRating] = useState(2.5);

  // 영수증 OCR 요청 결과
  const [ocrResult, setOcrResult] = useState({
    name: "",
    bizNum: "",
    price: "",
  });
  // 등록 버튼 활성화 상태
  const [isReviewButtonEnabled, setReviewButtonEnabled] = useState(false);

  // 팝업 상태
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupAction, setPopupAction] = useState(() => () => {});

  const openPopUp = (message, action) => {
    setPopupMessage(message);
    setPopupAction(() => action); // 팝업에서 확인 버튼 클릭 시 수행할 작업 설정
    setPopupOpen(true);
  };

  //삭제확인 팝업창 닫기
  const closePopUp = () => {
    setPopupOpen(false);
  };

  //삭제버튼 클릭 시 삭제 수행
  const handleConfirmReset = () => {
    closePopUp();
  };

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
      console.log("상호명 : ", name);
      console.log("사업자등록번호 : ", bizNum);
      setBizNum(bizNum);

      //지도 -> 결제이력 -> 리뷰 작성 버튼 클릭 -> 상호명, 사업자등록번호 가지고 이동
      //-> 리뷰 작성 페이지로 이동 -> OCR 수행 -> 상호명, 사업자등록번호
      //-> 지도 페이지에서 갖고 온 데이터와 OCR 수행 데이터를 비교
      //-> 일치하면 리뷰 등록 버튼 활성화

      //지도 페이지에서 가져온 상호명
      const str_name = storename;
      console.log("선택한 상호명 : " + str_name);
      //const str_name = "키토분식";
      //지도 페이지에서 가져온 사업자등록번호
      const str_bizNum = storebizNum;
      console.log("선택한 사업자번호 : " + str_bizNum);
      //const str_bizNum = "632-85-00430";

      // 상호명과 사업자등록번호 비교
      if (name === str_name && bizNum === str_bizNum) {
        //일치(콘솔로만 띄워져있음. 팝업창으로도 띄워야 함)
        console.log("상호명과 사업자등록번호가 모두 일치합니다.");
        openPopUp("인증되었습니다", () => {
          setReviewButtonEnabled(true); // 리뷰 등록 버튼 활성화
          closePopUp(); // 팝업 닫기
        });
      } else {
        //불일치(콘솔로만 띄워져있음. 팝업창으로도 띄워야 함)
        console.log("상호명 또는 사업자등록번호가 일치하지 않습니다.");
        // 팝업 열기 - 일치하지 않는 경우
        openPopUp("인증 실패. 다시 촬영해주세요", () => {
          setReviewButtonEnabled(false); // 리뷰 등록 버튼 비활성화
          setImage(null);
          closePopUp(); // 팝업 닫기
        });
      }

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

    const updatedReview = {
      ...review,
      storeRegNum: storebizNum,
      rating: rating,
    };

    axios({
      method: "post",
      url: "/api/review/reviewRegister",
      data: updatedReview,
    })
      .then((res) => {
        console.log(res);
        navigate("/map/payhistory");
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <h2 className="title">영수증 인증</h2>
        {/* <p>가게 이름: {storename}</p>
        <p>사업자 번호: {storebizNum}</p> */}
        <div className="pictureContainer">
          {!image ? (
            <>
              <Camera
                ref={cameraRef}
                aspectRatio={3 / 4}
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

        <OCRConfirmedPopUp
          open={popupOpen}
          close={closePopUp}
          header="영수증 인증 결과"
          onConfirm={popupAction} // 확인 버튼 클릭 시 실행할 동작
        >
          {popupMessage}
        </OCRConfirmedPopUp>

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
            disabled={!isReviewButtonEnabled} // 버튼 비활성화 상태 제어
          >
            등록하기
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ReviewRegister;
