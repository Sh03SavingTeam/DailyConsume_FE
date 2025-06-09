import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import "./App.css";  // 전역 스타일로 불러오기
import Footer from "./components/Footer";

const App = () => {
    return (

        <div className="app-container">
            <div className="main-content">
            </div>
            <Footer/>
        </div>
    );
}

export default App;