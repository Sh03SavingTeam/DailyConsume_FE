import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";
import './App.css';
import Footer from "./components/Footer";

function App() {
    return (
            <div className="container">
                <div className="calendar-container">
                </div>
                <Footer/>
            </div>
    );
}

export default App;
