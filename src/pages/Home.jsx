import React, { useContext, useEffect } from "react";
import Footer from "../components/Footer";
import CardInfo from "./CardInfo";
import { useNavigate } from "react-router-dom";

function Home(props) {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="main-content">
          <CardInfo />
      </div>

      <Footer />
    </div>
  );
}

export default Home;
