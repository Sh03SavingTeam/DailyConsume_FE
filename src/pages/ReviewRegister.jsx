import React, { useRef, useState, useEffect } from "react";
//import Webcam from "react-webcam";
import { Camera } from "react-camera-pro";
import Footer from "../components/Footer";
import "../styles/reviewRegister.css";
import ReactStars from "react-stars";

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

  const takePicture = () => {
    const photo = cameraRef.current.takePhoto();
    setImage(photo);
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
            <button className="picturebutton" onClick={takePicture}>
              Take Picture
            </button>
          </>
        ) : (
          <>
            <img className="capRecieptIMG" src={image} alt="Captured" />
            <button className="picturebutton" onClick={() => setImage(null)}>
              Retake
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
        <button className="picturebutton">등록하기</button>
      </div>

      <Footer />
    </div>
  );
}

export default ReviewRegister;
