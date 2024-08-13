// logo.svg 파일을 import합니다.
import logo from "./logo.svg";
// React 라이브러리를 import합니다.
import React from "react";
// App.css 파일을 import하여 스타일을 적용합니다.
import "./App.css";
// Footer 컴포넌트를 import합니다.
import Footer from "./components/Footer";
// Header 컴포넌트를 import합니다.
import Header from "./components/Header";
import Main from "./components/Main";
import { Router, Routes } from "react-router-dom";

// App 컴포넌트를 정의합니다.
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
        <Footer />
      </div>
    </Router>
  );
}

// App 컴포넌트를 export하여 다른 파일에서 사용할 수 있게 합니다.
export default App;
