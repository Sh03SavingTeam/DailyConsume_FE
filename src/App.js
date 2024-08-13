import React from 'react';
import './App.css';
import Footer from "./components/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="container">
                <div className="calendar-container">
                    <Routes>
                        {/*<Route path="/" element={<Home />}></Route>*/}
                        {/*<Route path="/map" element={<map />}></Route>*/}
                        {/*<Route path="/calendar" element={<Calendar />}></Route>*/}
                        {/*<Route path="/mypage" element={<MyPage />}></Route>*/}
                    </Routes>
                </div>

                {/* Footer 컴포넌트를 렌더링합니다. */}
                <Footer/>
            </div>
        </Router>
    );
}

export default App;
