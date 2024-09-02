import React, { useContext, useEffect } from "react";
import Footer from "../components/Footer";
import CardInfo from "./CardInfo";
import { useNavigate } from "react-router-dom";
import PaymentHistory from "components/PaymentHistory";

function Home(props) {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="main-content">
        <CardInfo />
        <PaymentHistory />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
