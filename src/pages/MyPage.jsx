import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import "../styles/MyPage.css";
import Character1 from '../assets/Character1.png';
import Character2 from '../assets/Character2.png';
import Character3 from '../assets/Character3.png';
import Character4 from '../assets/Character4.png';
import axios from 'axios';
import RankInfo from './RankInfo';
import RankerCalendar from './RankerCalendar'; 


function MyPage(props) {
    const date = new Date(); 
    const month = date.getMonth() + 1;
    const [rankInfo, setRankInfo] = useState(null);
    const [rankingList, setRankingList] = useState([]);
    const [arankingList, setArankingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isVisable, setIsVisable] = useState(false);
    const [selectedMemberId, setSelectedMemberId] = useState(null); 
    const memberId = "m002";
    const viewRankClickHandler = () => {
        setIsVisable(prevState => !prevState);
    };
    const handleBackClick = () => {
        setSelectedMemberId(null); // 선택된 memberId 초기화하여 RankerCalendar 종료
    };
    
    useEffect(() => {
        axios.get(`http://localhost:9999/rank/${memberId}`)
            .then(response => {
                setRankInfo(response.data); 
                console.log(response.data);
            })
            .catch(error => {
                console.error("Error fetching rank info:", error);
            });
    }, [memberId]);

    useEffect(() => {
        axios.get(`http://localhost:9999/rank/ranking`)
            .then(response => {
                setRankingList(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching ranking list:", error);
                setError(error);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:9999/rank/aranking/${memberId}`)
            .then(response => {
                setArankingList(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching ranking list:", error);
                setError(error);
                setLoading(false);
            });
    }, []);

    if (!rankInfo) {
        return <div>Loading...</div>;
    }

    const totalAmount = rankInfo.amount + rankInfo.nextAmount;
    const percent = Math.round((rankInfo.amount / totalAmount) * 100);
    
    const rankImages = {
        "Character1": Character1,
        "Character2": Character2,
        "Character3": Character3,
        "Character4": Character4,
        1:Character1,
        2:Character2,
        3:Character3,
        4:Character4,
    };

    const getRankImage = (rankImg) => {
        return rankImages[rankImg] || Character1;
    };
    const getRankingImage = (rankId) => {
        return rankImages[rankId] || Character1;
    };
    const renderRankImage = () => {
        console.log(rankInfo.rankImg); 
        return <img src={getRankImage(rankInfo.rankImg)} alt={`Rank ${rankInfo.rankImg}`} className='rank-image' />;
    };

    // 소비패턴 보러가기를 클릭했을 때 처리하는 함수
    const handleConsumptionPatternClick = (memberId) => {
        setSelectedMemberId(memberId); // 선택된 memberId 설정
    };

    return (
        <div className='rank-main-container not-center'>
            <div className='rank-container'>
                <div className='character-container'>
                    <div className='character-image'>
                        {renderRankImage()}
                    </div>
                    <div className='rank-id'>
                        {rankInfo.rankName}
                    </div>
                </div>
                <div className='rank-info-container'>
                    <div className='rank-info1'>
                        {rankInfo.memberName} 님의
                    </div>
                    <div className='rank-info2'>
                        {month}월 등급 {rankInfo.rankName}
                    </div>
                    <div className='rank-info4'>
                        누적 점수 <span className='rank-score'>{rankInfo.amount}</span>
                    </div>
                    <div className='rank-info3'>
                        다음 등급까지 <span className='highlight'>{rankInfo.nextAmount}</span> 남았어요
                    </div>
                    
                    <div className="progress mb-4" style={{height:"18px"}}>
                        <div className="progress-bar bg-inverse progress-animated" style={{width: `${percent}%`, height:"18px" }} role="progressbar">
                            <span className="sr-only">{percent}%</span>
                        </div>
                    </div>
                    
                    <div className='rank-info5' onClick={viewRankClickHandler}>
                        등급별 혜택 보러가기
                    </div>
                </div>
            </div>
            <div className={`list-container ${isVisable && 'isVisable'} ${selectedMemberId &&  'isVisable'}`}>
                <div className='text-wrap'>
                    전체 랭킹 
                </div>
                {loading ? (
                    <div>Loading rankings...</div>
                ) : error ? (
                    <div>Error loading rankings: {error.message}</div>
                ) : (
                    rankingList.map((item, index) => (
                        <div key={item.memberId} className="list-item">
                            <div className="item-image">
                                <img src={getRankingImage(item.rankId)} alt={`RankLv${index + 1}`} className="item-rank-image"/>
                            </div>
                            <div className="item-info">
                                <div className="item-info1">
                                    <span className="rank-count">{item.rankNum}위</span> {item.memberName} 님
                                </div>
                                <div className="item-info2-wrap">
                                    <div className="item-info2">
                                        누적점수 <span className='highlight2'>{item.totalAmount}점</span>
                                    </div>
                                    <div 
                                        className="info-link" 
                                        onClick={() => handleConsumptionPatternClick(item.memberId)}>
                                        소비패턴 보러가기
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
               
                <div className='text-wrap'>
                    주소지 주변 랭킹 
                </div>
                {loading ? (
                    <div>Loading rankings...</div>
                ) : error ? (
                    <div>Error loading address rankings: {error.message}</div>
                ) : (
                    arankingList.map((item) => (
                        <div key={item.memberId} className="list-item">
                            <div className="item-image">
                                <img src={getRankingImage(item.rankId)} alt={`RankLv${item.rankNum}`} className="item-rank-image"/>
                            </div>
                            <div className="item-info">
                                <div className="item-info1">
                                    <span className="rank-count">{item.rankNum}위</span> {item.memberName} 님 {"("}{item.addrDetail}{")"}
                                </div>
                                <div className="item-info2-wrap">
                                    <div className="item-info2">
                                        누적점수 <span className='highlight2'>{item.totalAmount}점</span>
                                    </div>
                                    <div 
                                        className="info-link" 
                                        onClick={() => handleConsumptionPatternClick(item.memberId)}>
                                        소비패턴 보러가기
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Footer/>
            {isVisable && <RankInfo setIsVisable={setIsVisable} />}
            {selectedMemberId && <RankerCalendar memberId={selectedMemberId} onBack={handleBackClick} />} 

        </div>
    );
}

export default MyPage;
