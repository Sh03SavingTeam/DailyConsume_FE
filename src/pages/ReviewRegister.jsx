import React, { useRef, useState, useEffect } from "react";
//import Webcam from "react-webcam";
import { Camera } from "react-camera-pro";
import Footer from "../components/Footer";
import ReactStars from "react-stars";
import AWS from "aws-sdk";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import OCRConfirmedPopUp from "../components/ReceiptOCRPopUp";
import { checkJWT } from "services/checkJWT";
import "../styles/reviewRegister.css";

function ReviewRegister(props) {
  //회원 객체
  const [memberId, setMemberId] = useState("");
  const [member, setMember] = useState("");

  const navigate = useNavigate(); // useNavigate 사용

  const location = useLocation();
  const { payid, storename, storebizNum } = location.state || {};
  console.log(payid + "_" + storename + "_" + storebizNum);

  // 로컬 스토리지에서 ACCESS TOKEN 가져오기
  const accessToken = localStorage.getItem("ACCESS_TOKEN");

  useEffect(() => {
    const token = localStorage.getItem("token");
    checkJWT("/api/member/memberSession", "get", null).then((response) => {
      console.log("JWT 확인 결과" + response.memberId);
      const fetchedMemberId = response.memberId;
      setMember(fetchedMemberId);
      setMemberId(fetchedMemberId);
    });
  }, []);

  //상호명

  //사업자등록번호
  const [bizNum, setBizNum] = useState("");

  //리뷰객체
  const [review, setReview] = useState({
    payId: 0,
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
    const blob = dataURLtoBlob(photo);
    return blob;
  };

  const getFileName = () => {
    const timestamp = Date.now();
    return `receiptimg_${memberId}_${timestamp}.jpg`;
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
    // promise()를 반환하여 호출부에서 await를 사용할 수 있게 합니다.
    return upload.promise();
  };

  const handleTakePhoto = async () => {
    try {
      const photoBlob = takePicture();
      const fileName = getFileName();
      // 업로드가 완료될 때까지 기다립니다.
      await uploadToS3(fileName, photoBlob);

      const response = await axios({
        method: "post",
        url: "/api/receipt/receiptOCR",
        data: {
          fileName: fileName,
        },
      });
      console.log("영수증OCR:" + response.data);

      const { name, bizNum } = response.data;
      console.log("상호명 : ", name);
      console.log("사업자등록번호 : ", bizNum);

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

      if (bizNum === str_bizNum) {
        // 상호명과 사업자등록번호 비교
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
      payId: payid,
      rating: rating,
    };

    const point = {
      memberId: member,
      comment: "리뷰 등록",
      point: 50,
    };

    axios({
      method: "post",
      url: "/api/review/reviewRegister",
      data: JSON.stringify({
        reviewDTO: updatedReview,
        pointRegisterDTO: point,
      }),
      headers: {
        "Content-Type": "application/json",
      },
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
        <h2 className="reviewRegtitle">리뷰 등록</h2>
        <div className="pictureContainer">
          {!image ? (
            <>
              <Camera
                ref={cameraRef}
                aspectRatio={3 / 4}
                facingMode={"environment"}
              />
              <button
                className="review-picture-button"
                onClick={handleTakePhoto}
              >
                영수증 인증
              </button>
            </>
          ) : (
            <>
              <img className="capRecieptIMG" src={image} alt="Captured" />
              <button
                className="review-picture-button"
                onClick={() => setImage(null)}
              >
                다시 인증하기
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
          <button
            type="submit"
            className="review-submit-button"
            onClick={handleRegisterReview}
            disabled={!isReviewButtonEnabled} // 버튼 비활성화 상태 제어
          >
            리뷰 등록
          </button>
        </div>
      </div>

      <Footer />
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

export default ReviewRegister;
