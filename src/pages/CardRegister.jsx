import React, { useRef, useState } from "react";
import Footer from "../components/Footer";
import { Camera } from "react-camera-pro";
import "../styles/cardRegistration.css";

function CardRegister(props) {
  //카메라용
  const cameraRef = useRef(null);
  const [image, setImage] = useState(null);

  const takePicture = () => {
    const photo = cameraRef.current.takePhoto();
    setImage(photo);
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
            <button class="capture-button" onClick={takePicture}>
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

export default CardRegister;
