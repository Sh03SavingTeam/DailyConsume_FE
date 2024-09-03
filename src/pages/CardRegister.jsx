import React, { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import { Camera } from "react-camera-pro";
import "../styles/cardRegistration.css";
import "../App.css";
import AWS from "aws-sdk";
import { useLocation, useNavigate } from "react-router-dom";
import { Call } from "@mui/icons-material";
import axios from "axios";
import { Col, Row, Form, Button, InputGroup } from "react-bootstrap";
import { checkJWT } from "services/checkJWT";

function CardRegister(props) {
  //회원 객체
  const [memberId, setMemberId] = useState("");

  //카드 객체
  const [memberCard, setMemberCard] = useState({
    cardNum: "",
    expirationDate: "",
    cvc: "",
    cardName: "",
    memberId: "",
  });

  const location = useLocation();
  const navigate = useNavigate(); // useNavigate 사용

  // 로컬 스토리지에서 ACCESS TOKEN 가져오기
  const accessToken = localStorage.getItem("ACCESS_TOKEN");

  useEffect(() => {
    console.log(location);
  }, [location]);

  useEffect(() => {
    const token = localStorage.getItem("token"); // JWT 토큰 가져오기

    //JWT로 로그인한 사용자 정보 가져오기

    // axios({
    //   method: "get",
    //   url: "http://localhost:9999/api/member/memberSession",
    //   headers: {
    //     Authorization: `Bearer ${token}`, // JWT 토큰 포함
    //   },
    // })
    //   .then((response) => {
    //     console.log(response.data.memberId);
    //     const fetchedMemberId = response.data.memberId;

    //     // memberCard 상태 업데이트
    //     setMemberCard((prevMemberCard) => ({
    //       ...prevMemberCard,
    //       memberId: fetchedMemberId,
    //     }));
    //   })
    //   .catch((error) => {
    //     console.error("There was an error fetching the session data!", error);
    //   });

    checkJWT(
      "http://localhost:9999/api/member/memberSession",
      "get",
      null
    ).then((response) => {
      console.log("JWT 확인 결과" + response.memberId);
      const fetchedMemberId = response.memberId;

      // memberCard 상태 업데이트
      setMemberCard((prevMemberCard) => ({
        ...prevMemberCard,
        memberId: fetchedMemberId,
      }));
      setMemberId(fetchedMemberId);
    });
  }, []);

  // 카드 OCR 요청 결과
  const [ocrResult, setOcrResult] = useState({
    number: "",
    validThru: "",
  });

  //선택 카드 타입
  const [cardType, setCardType] = useState("credit");
  //카드 목록
  const [cards, setCards] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setMemberCard({ ...memberCard, [e.target.name]: e.target.value });
  };

  // 카드 목록을 가져오는 함수
  const fetchCards = async (type) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:9999/api/card/${type}CardList`
      );
      setCards(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 카드 타입이 변경될 때마다 카드 목록을 업데이트
  useEffect(() => {
    fetchCards(cardType);
  }, [cardType]);

  // 라디오 버튼 클릭 핸들러
  const handleCardTypeChange = (event) => {
    setCardType(event.target.value);
  };

  // Select에서 선택한 카드 이름을 memberCard 상태에 저장하는 함수
  const handleCardSelectChange = (event) => {
    const selectedCardName = event.target.value;
    setMemberCard((prevMemberCard) => ({
      ...prevMemberCard,
      cardName: selectedCardName,
    }));
  };

  //카메라용
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);

  const takePicture = () => {
    const photo = cameraRef.current.takePhoto();
    setImage(photo);
    const blob = dataURLtoBlob(photo);
    return blob;
  };

  const getFileName = () => {
    const timestamp = Date.now();
    return `cardimg_${memberId}_${timestamp}.jpg`;
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
        url: "http://localhost:9999/api/card/cardOCR",
        data: {
          fileName: fileName,
        },
      });

      const { number, validThru } = response.data;

      console.log("Card Number:", number);
      console.log("Valid Thru:", validThru);

      const result = number.replace(/(.{4})/g, "$1 ");

      // 상태 업데이트
      setMemberCard({
        ...memberCard,
        cardNum: result,
        expirationDate: validThru,
      });
    } catch (error) {
      console.error(error);
      // 오류를 사용자에게 알리거나 상태에 저장할 수 있습니다.
      // 예를 들어, 상태에 저장하는 경우:
      // setError(error.message);
    }
  };

  const handleRegisterCard = async (e) => {
    e.preventDefault();

    // 상태 업데이트
    setMemberCard({
      ...memberCard,
      memberId: memberId,
    });

    axios({
      method: "post",
      url: "http://localhost:9999/api/card/cardRegister",
      data: memberCard,
    })
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        throw new Error(error);
      });
  };

  return (
    <div className="app-container">
      <div className="main-content">
        <div className="card-registration">
          <h2 className="cardRegtitle">신규 카드 등록</h2>
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
              <img className="capCardIMG" src={image} alt="Captured" />
              <button className="capture-button" onClick={() => setImage(null)}>
                다시 촬영하기
              </button>
            </>
          )}

          <form className="card-form">
            <div className="form-group">
              <label for="cardNum">
                카드번호 <span className="required">*</span>
              </label>
              <input
                type="text"
                name="cardNum"
                placeholder="1234 5678 4321 9876"
                required
                onChange={handleChange}
                value={memberCard.cardNum}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label for="expirationDate">
                  유효일자 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="expirationDate"
                  placeholder="09/27"
                  required
                  onChange={handleChange}
                  value={memberCard.expirationDate}
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
                  <input
                    type="radio"
                    name="card-type"
                    value="credit"
                    checked={cardType === "credit"}
                    onChange={handleCardTypeChange}
                  />
                  신용
                </label>
                <label>
                  <input
                    type="radio"
                    name="card-type"
                    value="check"
                    checked={cardType === "check"}
                    onChange={handleCardTypeChange}
                  />
                  체크
                </label>
              </div>
              {loading && <p>Loading...</p>}
              {error && <p>Error loading data!</p>}
              <select onChange={handleCardSelectChange}>
                {cards.length === 0 && !loading && !error ? (
                  <option>카드 목록이 없습니다</option>
                ) : (
                  cards.map((card) => (
                    <option key={card.cardName} value={card.cardName}>
                      {card.cardName}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div className="submit-button2-center">
            <button
              type="submit"
              className="submit-button"
              onClick={handleRegisterCard}
            >
              등록하기
            </button>
            </div>
          </form>
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

export default CardRegister;
