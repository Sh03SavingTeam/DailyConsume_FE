import React, { useEffect, useState } from "react";
import moment from "moment"; // 날짜와 시간을 다루기 위한 라이브러리 import
import axios from "axios"; // HTTP 요청을 보내기 위한 라이브러리 import
import "../styles/AmountListForDay.css"; // 스타일링을 위한 CSS 파일 import
import AmountDetail from "./AmountDetail"; // 상세보기 컴포넌트 import
import { checkJWT } from "services/checkJWT"; // JWT 토큰 확인을 위한 서비스 함수 import
import XImage from "../assets/XImage.jpg"; // 데이터가 없을 때 표시할 이미지 import

function AmountListForDay({ initialDay }) {
    // 상태(state) 선언
    const [day, setDay] = useState(initialDay); // 선택된 날짜를 관리하는 상태
    const [orderList, setOrderList] = useState([]); // 특정 날짜의 결제 내역 리스트를 관리하는 상태
    const [error, setError] = useState(null); // 에러 메시지를 관리하는 상태
    const [selectedItem, setSelectedItem] = useState(null); // 선택된 결제 항목의 상세 정보를 관리하는 상태
    const [isDetailVisible, setIsDetailVisible] = useState(false); // 상세보기의 가시성을 관리하는 상태
    const [weeklyBudget, setWeeklyBudget] = useState(null); // 주간 소비 예산 정보를 관리하는 상태
    const [memberId, setMemberId] = useState(""); // 회원 ID를 관리하는 상태

    // 컴포넌트가 처음 마운트될 때 실행되는 useEffect
    useEffect(() => {
        setDay(initialDay); // 초기 날짜를 설정

        // JWT 토큰을 확인하고, 해당 사용자의 ID를 가져옴
        checkJWT("/api/member/memberSession", "get", null)
            .then((response) => {
                console.log("JWT 확인 결과" + response.memberId);
                const memberId = response.memberId;
                setMemberId(memberId);

                // 페이지가 처음 로드될 때 주간 소비 예산 데이터를 가져옴
                fetchWeeklyBudget(initialDay, memberId);
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }, [initialDay]); // initialDay가 변경될 때마다 실행

    // 특정 날짜에 대한 결제 내역 리스트를 서버에서 가져오는 함수
    const fetchOrderList = async () => {
        try {
            // 현재 선택된 날짜를 포맷하여 년, 월, 일을 추출
            const formattedDate = moment(day, "YYYY년 MM월 DD일");
            const year = formattedDate.format("YYYY");
            const month = formattedDate.format("MM");
            const dayOfMonth = formattedDate.format("DD");

            // 서버에 GET 요청을 보내 결제 내역 데이터를 가져옴
            const response = await axios.get(
                "http://localhost:9999/api/calendar/payhistory/daily",
                {
                    params: {
                        memberId: memberId, // 요청 파라미터로 사용자 ID를 보냄
                        day: dayOfMonth, // 요청 파라미터로 선택된 날짜의 일을 보냄
                        month: month, // 요청 파라미터로 선택된 날짜의 월을 보냄
                        year: year, // 요청 파라미터로 선택된 날짜의 년도를 보냄
                    },
                }
            );

            // 서버로부터 받은 데이터를 사용하기 편하게 가공
            const fetchedData = response.data.map((item) => ({
                id: item.payId, // 결제 ID
                time: moment(item.payDate).format("HH:mm:ss"), // 결제 시간을 포맷팅
                amount: item.payAmount, // 결제 금액
                description: item.storeName || "Unknown Store", // 상점 이름 (없으면 "Unknown Store")
                myPayCheck: item.myPayCheck, // 결제 확인 상태
                type: item.myPayCheck === 1 ? "normal" : "suspicious", // 결제 타입(정상/이상 결제) 구분
            }));

            setOrderList(fetchedData); // 결제 내역 리스트 상태 업데이트
        } catch (err) {
            setError("Failed to fetch data from server"); // 에러 발생 시 에러 상태 업데이트
            console.error(err); // 콘솔에 에러 출력
        }
    };

    // 특정 날짜에 대한 주간 소비 예산 데이터를 서버에서 가져오는 함수
    const fetchWeeklyBudget = async (date, memberId) => {
        try {
            // 현재 선택된 날짜를 포맷하여 년, 월, 일을 추출
            const formattedDate = moment(date, "YYYY년 MM월 DD일");
            const year = formattedDate.format("YYYY");
            const month = formattedDate.format("MM");
            const dayOfMonth = formattedDate.format("DD");

            // 서버에 GET 요청을 보내 주간 소비 예산 데이터를 가져옴
            const response = await axios.get(
                "http://localhost:9999/api/calendar/payweekly",
                {
                    params: {
                        memberId: memberId, // 요청 파라미터로 사용자 ID를 보냄
                        year: year, // 요청 파라미터로 선택된 날짜의 년도를 보냄
                        month: month, // 요청 파라미터로 선택된 날짜의 월을 보냄
                        day: dayOfMonth, // 요청 파라미터로 선택된 날짜의 일을 보냄
                    },
                }
            );

            setWeeklyBudget(response.data); // 주간 소비 예산 상태 업데이트
        } catch (err) {
            setError("Failed to fetch weekly budget data"); // 에러 발생 시 에러 상태 업데이트
            console.error(err); // 콘솔에 에러 출력
        }
    };

    // day 또는 memberId가 변경될 때마다 실행되는 useEffect
    useEffect(() => {
        fetchOrderList(); // 결제 내역 리스트를 가져옴
        fetchWeeklyBudget(day, memberId); // 주간 소비 예산 데이터를 가져옴
    }, [day, memberId]); // day 또는 memberId가 변경될 때마다 실행

    // 컴포넌트가 언마운트될 때 실행되는 useEffect
    // 상태 초기화 작업 수행
    useEffect(() => {
        return () => {
            setOrderList([]); // 결제 내역 리스트 초기화
            setWeeklyBudget(null); // 주간 소비 예산 초기화
        };
    }, [initialDay]); // initialDay가 변경될 때마다 실행

    // 결제 내역 리스트의 아이템을 클릭했을 때 호출되는 함수
    const handleItemClick = (item) => {
        setSelectedItem({ ...item, memberId: memberId }); // 선택된 아이템의 상세 정보를 상태로 저장
        setIsDetailVisible(true); // 상세보기 가시성 상태를 true로 설정
    };

    // 상세보기 창을 닫을 때 호출되는 함수
    const handleCloseDetail = () => {
        setIsDetailVisible(false); // 상세보기 가시성 상태를 false로 설정
        setSelectedItem(null); // 선택된 아이템 상태 초기화
        fetchOrderList(); // 결제 내역 리스트를 다시 가져옴
    };

    // 현재 선택된 날짜를 "YY.MM.DD" 형식으로 변환
    const formattedDay = moment(day, "YYYY년 MM월 DD일").format("YY.MM.DD");

    return (
        <div className="amount-list">
            <div className="detail-item">
                <div className="weekly-budget">
                    {/* 주간 소비 금액과 잔여 금액을 화면에 표시 */}
                    <p>주간소비금액 :{" "}
                        {weeklyBudget
                            ? `${weeklyBudget.설정금액.toLocaleString()}원`
                            : ""}
                    </p>
                    <p>주간소비잔여금액 :{" "}
                        {weeklyBudget
                            ? (weeklyBudget.잔여금액 < 0
                                ? "❌"  // 잔여금액이 마이너스일 경우 X 이모지만 표시
                                : `${weeklyBudget.잔여금액.toLocaleString()}원`) // 잔여금액이 양수일 경우 금액을 표시
                            : ""}
                    </p>
                </div>
            </div>
            <hr className="calendar-divider"/>
            {/* 현재 선택된 날짜를 화면에 표시 */}
            <div className="date-header">{formattedDay}</div>
            {/* 결제 내역이 있을 경우 리스트로 표시, 없으면 "No data available" 메시지 표시 */}
            <ul>

                {orderList.length > 0 ? (
                    orderList.map((item, index) => (
                        <li
                            key={index}
                            className="amount-list-item"
                            onClick={() => handleItemClick(item)} // 리스트 아이템 클릭 시 상세보기 열기
                        >
                            <div
                                className={`icon ${
                                    item.type === "normal" ? "check-icon" : "warning-icon"
                                }`}
                            >
                                {item.type === "normal" ? "✔️" : "!"}
                            </div>
                            <div className="item-details">
                                <span className="time">{item.time}</span>
                                <span className="amount">{item.amount.toLocaleString()}원</span>
                                <span className="description">{item.description}</span>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="no-data"></li>
                    //<li className="no-data">No data available for this date.</li>
                )}
            </ul>
            {/* 상세보기 컴포넌트가 활성화된 경우 렌더링 */}
            {isDetailVisible && selectedItem && (
                <AmountDetail item={selectedItem} onClose={handleCloseDetail} />
            )}
            <hr  className="calendar-divider" />
        </div>
    );
}

export default AmountListForDay; // AmountListForDay 컴포넌트 export
