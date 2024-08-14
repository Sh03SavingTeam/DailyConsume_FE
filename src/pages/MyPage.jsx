import React from 'react';
import Footer from '../components/Footer';
import "../styles/MyPage.css"

function MyPage(props) {
    return (
        <div className='container'>
            <div className='rank-container'>
                <div className='character-container'>
                    <div className='character-image'>
                        이미지
                    </div>
                    <div className='rank-id'>
                        ________
                    </div>
                </div>
                <div className='rank-info-container'>
                    <div className='rank-info1'>
                        ___님의
                    </div>
                    <div className='rank-info2'>
                        8월 등급 _____
                    </div>
                    <div className='rank-info3'>
                        다음 등급까지 20점 남았어요
                    </div>
                    <div className='rank-info4'>
                        누적 점수 42
                    </div>
                    <div className="progress mb-4" style={{height:"18px"}}>
						<div className="progress-bar bg-inverse progress-animated" style={{width: "60%", height:"18px" }} role="progressbar">
							<span className="sr-only">60% Complete</span>
						</div>
					</div>
                    <div className='rank-info5'>
                        등급별혜택
                    </div>
                </div>
                
            </div>
            <Footer/>
        </div>
    );
}

export default MyPage;