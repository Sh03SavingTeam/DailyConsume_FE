import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import profileImg from "../assets/profileImg.png"
import "../styles/MypageMain.css";
import axios from 'axios';
import { Link } from "react-router-dom";
import ConsumeHistory from "./ConsumeHistory";
import Point from "./Point";
import MyPage from "./MyPage";
import AddressList from "./AddressList";

function MypageMain({memberId}){

    const[memberImg, setMemberImg] = useState("");
    const[memberName, setMemberName] = useState("");
    const[weeklyMoney, setWeeklyMoney] = useState(0);
    const[check, setCheck] = useState(true);
    const [sunday, setSunday] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedTab, setSelectedTab] = useState('analysis');

    const renderContent = () => {
        switch (selectedTab) {
            case 'analysis':
                return <ConsumeHistory />
            case 'point':
                return <Point memberId='jeongin'/>;
            case 'rank':
                return <MyPage />;
            case 'address':
                return <AddressList />;
            default:
                return <ConsumeHistory />;
        }
    };

    useEffect(() => {
        fetchMemberInfo();
    }, []);

    useEffect(() => {
        const getSunday = () => {
            const today = new Date();
            const dayOfWeek = today.getDay(); // 일요일 = 0, 월요일 = 1, ..., 토요일 = 6
            const sundayDate = new Date(today);
            if(dayOfWeek==0){
               sundayDate.setDate(today.getDate());
            } else{
                sundayDate.setDate(today.getDate() - dayOfWeek + 7); // 일요일로 설정
            }
            const year = sundayDate.getFullYear();
            const month = String(sundayDate.getMonth() + 1).padStart(2, '0');
            const day = String(sundayDate.getDate()).padStart(2, '0');

            return `${year}-${month}-${day}`;
        };

        const sunday = getSunday();

        setSunday(sunday);

        if(sunday==endDate){
            setCheck(false);
        }

    }, []);

    console.log(sunday);

    // 데이터 불러오는 함수
    const fetchMemberInfo = async() => {
        try{
            const response = await axios.get(`http://localhost:9999/mypage/${memberId}`);
            const data = response.data;

            setMemberImg(data.memberImg);
            setMemberName(data.memberName);
            setWeeklyMoney(data.weeklyMoney);
            setEndDate(data.endDate);
        }
        catch (error) {
            console.error("정보를 불러오는데 실패했습니다.", error);
        }   
    };
        

    return(
        <div className="mymain-container">
            <div className="memberinfo">
                {/* 이미지 추후 확인 필요 */}
                <img src={profileImg} alt=""/>
                <p className="info-name"><span className="info-name-big">{memberName}</span> 님</p>
                <p className="info-week">이번주 설정 금액 {weeklyMoney!=0?weeklyMoney.toLocaleString()+"원":"없음"}</p>
                <div className="week-button">
                {check && (
                    <Link to='/mypage/ConsumeSet'><button>주간소비금액 설정</button></Link>
                )}
                </div>
            </div>
            <div className="tabs">
                <button 
                    className={selectedTab === 'analysis' ? 'active' : ''}
                    onClick={() => setSelectedTab('analysis')}
                >
                    소비분석
                </button>
                <button 
                    className={selectedTab === 'point' ? 'active' : ''}
                    onClick={() => setSelectedTab('point')}
                >
                    포인트
                </button>
                <button 
                    className={selectedTab === 'rank' ? 'active' : ''}
                    onClick={() => setSelectedTab('rank')}
                >
                    등급 랭킹
                </button>
                <button 
                    className={selectedTab === 'address' ? 'active' : ''}
                    onClick={() => setSelectedTab('address')}
                >
                    주소 목록
                </button>
            </div>
            <div className="content">
                {renderContent()}
            </div>
            <Footer />
        </div>
    );
}

export default MypageMain;