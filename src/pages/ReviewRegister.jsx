import React, { useRef, useState, useEffect } from "react";
//import Webcam from "react-webcam";
import { Camera } from "react-camera-pro";
import Footer from "../components/Footer";
import "../styles/WebCam.css";
import Rate from "rc-rate";
import { Star } from "@mui/icons-material";
import ReactStars from "react-stars";
//import jsQR from "jsqr";

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
      {!image ? (
        <>
          <Camera
            ref={cameraRef}
            aspectRatio={16 / 9}
            facingMode={"environment"}
          />
          <button onClick={takePicture}>Take Picture</button>
        </>
      ) : (
        <>
          <img className="capturedIMG" src={image} alt="Captured" />
          <button onClick={() => setImage(null)}>Retake</button>
        </>
      )}
      <ReactStars
        count={5}
        value={rating}
        onChange={(newRating) => setRating(newRating)}
        size={24}
        color2={"#ffd700"}
      />
      <p>Current Rating: {rating}</p>

      <Footer />
    </div>
  );
}

export default ReviewRegister;
