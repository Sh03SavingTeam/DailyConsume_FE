import React from "react";
import "./App.css";
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="container">
      {/* Footer 컴포넌트를 렌더링합니다. */}
      <Footer />
    </div>
  );
}

export default App;
