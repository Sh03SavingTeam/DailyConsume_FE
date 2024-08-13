import React from "react";
import Footer from "../components/Footer";
import CardInfo from "./CardInfo";

function Home(props) {
  return (
    <div className="container">
      <CardInfo />

      <Footer />
    </div>
  );
}

export default Home;
