// logo.svg 파일을 import합니다.
import logo from './logo.svg';
// React 라이브러리를 import합니다.
import React from 'react';
// App.css 파일을 import하여 스타일을 적용합니다.
import './App.css';
// Footer 컴포넌트를 import합니다.
import Footer from "./components/Footer";
// Header 컴포넌트를 import합니다.
import Header from "./components/Header";
import Main from "./components/Main";

// App 컴포넌트를 정의합니다.
function App() {
    return (
        // container 클래스를 가진 div 요소를 반환합니다.
        <div className="container">
            {/* Header 컴포넌트를 렌더링합니다. */}
            <Header/>

            {/* main 태그 안에 메인 콘텐츠를 표시합니다. */}
            <Main/>

            {/* Footer 컴포넌트를 렌더링합니다. */}
            <Footer/>
        </div>
    );
}

// App 컴포넌트를 export하여 다른 파일에서 사용할 수 있게 합니다.
export default App;
