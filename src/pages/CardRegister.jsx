import React, { useRef, useState } from "react";
import Footer from "../components/Footer";
import { Camera } from "react-camera-pro";
import "../styles/cardRegistration.css";
import AWS from "aws-sdk";

function CardRegister(props) {
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

    fetch("http://localhost:5000/uploadd", {
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
    // uploadToS3(fileName, photoBlob);
    uploadToServer(fileName, photoBlob);
  };

  return (
    <div className="container">
      <div class="card-registration">
        <h2>신규 카드 등록</h2>
        {!image ? (
          <>
            <Camera
              className="camera-view"
              ref={cameraRef}
              aspectRatio={4 / 3}
              facingMode={"environment"}
            />
            <button class="capture-button" onClick={handleTakePhoto}>
              촬영하기
            </button>
          </>
        ) : (
          <>
            <img className="capRecieptIMG" src={image} alt="Captured" />
            <button class="capture-button" onClick={() => setImage(null)}>
              다시 촬영하기
            </button>
          </>
        )}
        <form class="card-form">
          <div class="form-group">
            <label for="card-number">
              카드번호 <span class="required">*</span>
            </label>
            <input
              type="text"
              id="card-number"
              placeholder="1234 5678 4321 9876"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="expiry-date">
                유효일자 <span class="required">*</span>
              </label>
              <input
                type="text"
                id="expiry-date"
                placeholder="09/27"
                required
              />
            </div>
            <div class="form-group">
              <label for="cvc">
                CVC <span class="required">*</span>
              </label>
              <input type="text" id="cvc" placeholder="111" required />
            </div>
          </div>

          <div class="form-group">
            <label>
              카드선택 <span class="required">*</span>
            </label>
            <div class="radio-group">
              <label>
                <input type="radio" name="card-type" value="credit" required />{" "}
                신용
              </label>
              <label>
                <input type="radio" name="card-type" value="debit" required />{" "}
                체크
              </label>
            </div>
            <select>
              <option>신한카드 Deep Dream</option>
            </select>
          </div>

          <button type="submit" class="submit-button">
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
