
import React from "react";
import Footer from "../components/Footer";
import CardInfo from "./CardInfo";

function Home(props) {
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
