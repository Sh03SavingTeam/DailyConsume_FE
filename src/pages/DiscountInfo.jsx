import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import "../styles/DiscountInfo.css";
import moreIcon from '../assets/more.png';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function DiscountInfo({ memberId }) {

    const navigate = useNavigate();

    const [discounts, setDiscounts] = useState([]);
    const [category, setCategory] = useState("");
    const [count, setCount] = useState(0);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const now = new Date();

    const year = String(now.getFullYear()).slice(-2);
    const month = String(now.getMonth()+1).padStart(2,'0');
    const day = new Date(year, month, 0).getDate();

    // 데이터 불러오는 함수
    const fetchDiscountInfos = async (page) => {
        try {
            const response = await axios.get(`http://localhost:9999/mypage/discountinginfo/${memberId}?page=${page}`);
            const data = response.data;
    
            setDiscounts((prev) => [...prev, ...data.discountingInfoList]); // 기존 내역에 새로 불러온 내역을 추가
            setCount(data.totalCount);
            setCategory(data.category);
    
            // 다음 페이지가 있는지 여부를 결정
            if (data.discountingInfoList.length === 0 || discounts.length + data.discountingInfoList.length >= data.totalCount) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("할인 정보 내역이 없습니다.", error);
        }   
        };

    // 첫 번째 페이지를 불러오는 useEffect
    useEffect(() => {
        fetchDiscountInfos(page);
    }, [page]);

    // 더보기 버튼 클릭 시 다음 페이지로
    const loadMore = () => {
        setPage((prevPage) => prevPage + 1);
    };

    // 뒤로 가기 버튼 클릭 시 이전 페이지로 이동
     const backClick = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <div className="discount-container">
            <div className="discount-title">이번달은 <span>{category}</span>에 <br/>가장 많은 돈을 썼어요</div>
            <div className="discount-body">
            <div className="discount-box">맞춤 할인 정보</div>
            {discounts.map((item, index) => (
                <div className="discount-item" key={index}>
                    <img src={item.prodImg} alt={item.productName} />
                    <div className="info">
                        <p className="storeName">{item.storeName}</p>
                        <p className="productName">{item.productName}</p>
                        <p className="amount">{item.amount} ({item.productContent})</p>
                        <p className="expiry">~{year}.{month}.{day}</p>
                    </div>
                </div>
            ))}
            <div className="discount-button">
            {hasMore && (
                <button onClick={loadMore}>더보기 <img src={moreIcon} alt="more Icon" className="more-icon" /></button>
            )}
            </div>
            </div>
            <Footer />
        </div>
    );
}

export default DiscountInfo;