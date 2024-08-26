import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import profileImg from "../assets/profileImg.jpg"
import "../styles/MypageMain.css";
import axios from 'axios';
import { Link, useLocation } from "react-router-dom";
import ConsumeHistory from "./ConsumeHistory";
import Point from "./Point";
import MyPage from "./MyPage";
import AddressList from "./AddressList";
import ConsumeCompare from "./ConsumeCompare";

function MypageMain({memberId}){
    const[memberImg, setMemberImg] = useState("");
    const[memberName, setMemberName] = useState("");
    const[weeklyMoney, setWeeklyMoney] = useState(0);
    const[check, setCheck] = useState(true);
    const [sunday, setSunday] = useState("");
    const [endDate, setEndDate] = useState("");
    const location = useLocation();
    const [selectedTab, setSelectedTab] = useState(location.state?.selectedTab || 'analysis');
    console.log(selectedTab);

    const renderContent = () => {
        switch (selectedTab) {
            case 'analysis':
                return <ConsumeHistory memberId={"jeongin"}/>
            case 'point':
                return <Point memberId='jeongin'/>;
            case 'rank':
                return <MyPage memberId="min"/>;
            case 'address':
                return <AddressList />;
            case 'consumeCompare':
                return <ConsumeCompare memberId={"min"}/>;
            default:
                return <ConsumeHistory />;
        }
    };
    useEffect(() => {
        fetchMemberInfo();
    }, []);
    useEffect(() => {
        if (location.state?.selectedTab) {
          setSelectedTab(location.state.selectedTab);
        }
      }, [location.state]);
    useEffect(() => {
        if (location.state?.selectedTab) {
          setSelectedTab(location.state.selectedTab);
        }
      }, [location.state]);

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

    }, []);

    useEffect(() => {
        if (sunday && endDate) {  // 둘 다 유효한 값일 때만 비교
            if (sunday === endDate) {
                setCheck(false);
            } else {
                setCheck(true);  // 혹시 이전에 false로 잘못 설정된 상태를 다시 true로 돌려놓기 위해 추가
            }
        }
    }, [sunday, endDate]);

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
                    className={selectedTab === 'analysis' || selectedTab === 'consumeCompare' ? 'active' : ''}
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