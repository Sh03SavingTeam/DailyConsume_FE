import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import Footer from "../components/Footer";
import "../styles/WebCam.css";
//import jsQR from "jsqr";

function ReviewRegister(props) {
  const webcamRef = useRef(null);

  const videoConstraints = {
    facingMode: { exact: "environment" },
  };

  return (
    <div className="container">
      <Webcam className="webcam-video" />

      <Footer />
    </div>
  );
}

export default ReviewRegister;
