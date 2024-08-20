import React, { useEffect, useState } from 'react';
import moment from 'moment';
import "../styles/AmountListForDay.css";
import AmountDetail from './AmountDetail'; // 상세보기 컴포넌트 추가

    function AmountListForDay({ initialDay }) {
        const [day, setDay] = useState(initialDay);
        const [orderList, setOrderList] = useState([]);
        const [error, setError] = useState(null);
        const [selectedItem, setSelectedItem] = useState(null); // 선택된 항목
        const [isDetailVisible, setIsDetailVisible] = useState(false); // 상세보기 표시 상태

        // API 호출 부분 (현재 주석 처리됨)
        // useEffect(() => {
        //     axios
        //         .get("http://localhost:9999/api/board/list2", {
        //             params: { regdate: day },
        //         })
        //         .then((response) => {
        //             if (Array.isArray(response.data)) {
        //                 setOrderList(response.data);
        //             } else {
        //                 console.error("Unexpected response format:", response.data);
        //                 setError("Unexpected response format");
        //             }
        //         })
        //         .catch((error) => {
        //             console.error("Failed to fetch data:", error);
        //             setError("Failed to fetch data");
        //         });
        // }, [day]);

        useEffect(() => {
            // axios 요청을 사용하지 않고, 초기 데이터를 설정합니다.
            setOrderList([
                { id: 1, time: "12:27:51", amount: 6000, description: "스타벅스 홍대역점", type: "expense" },
                { id: 2, time: "12:27:51", amount: 5900, description: "antz옆 편의점", type: "income" }
            ]);
        }, [day]);

        if (error) {
            return <div>Error: {error}</div>;
        }

        const formattedDay = moment(day, "YYYY년 MM월 DD일").format("YY.MM.DD");

        const handleItemClick = (item) => {
            setSelectedItem(item);
            setIsDetailVisible(true);
        };

        const handleCloseDetail = () => {
            setIsDetailVisible(false);
            setSelectedItem(null);
        };

        return (
            <div className="amount-list">
                <div className="date-header">{formattedDay}</div>
                <ul>
                    {orderList.length > 0 ? (
                        orderList.map((item, index) => (
                            <li key={index} className="amount-list-item" onClick={() => handleItemClick(item)}>
                                <div className="icon">
                                    {item.type === "expense" ? "!" : "✔️"}
                                </div>
                                <div className="item-details">
                                    <span className="time">{item.time}</span>
                                    <span className="amount">{item.amount}원</span>
                                    <span className="description">{item.description}</span>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="no-data">No data available for this date.</li>
                    )}
                </ul>
                {isDetailVisible && selectedItem && (
                    <AmountDetail item={selectedItem} onClose={handleCloseDetail} />
                )}
            </div>
        );
    }

    export default AmountListForDay;
