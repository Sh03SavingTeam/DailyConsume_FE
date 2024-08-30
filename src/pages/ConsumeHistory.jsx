import "../App.css";
import "../styles/ConsumeHistory.css";
import Footer from "../components/Footer";
import ApexCharts from "react-apexcharts";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { checkJWT } from "services/checkJWT";

function ConsumeHistory({ memberId }) {
  let [userList, setUserList] = useState([]);
  let [peerList, setPeerList] = useState([]);
  let [userPercentList, setUserPercentList] = useState([]);
  let [age, setAge] = useState(0);
  let [currentMonth, setCurrentMonth] = useState(0);
  let [userPayment, setUserPayment] = useState(0);
  let [peerPayment, setPeerPayment] = useState(0);
  const [memberID, setMemberID] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. JWT 확인
        const jwtResponse = await checkJWT(
          "/api/member/memberSession",
          "get",
          null
        );
        console.log("JWT 확인 결과: " + jwtResponse.memberId);
        const memberID = jwtResponse.memberId;
        setMemberID(memberID);

        // 2. My Card History 가져오기
        const myCardHistoryResponse = await axios.get(
          `http://localhost:9999/mypage/mycardHistory?memberId=${memberID}`
        );
        const userPayAmounts = myCardHistoryResponse.data.map(
          (item) => item.payAmount
        );
        const userPercentages = myCardHistoryResponse.data.map(
          (item) => item.percentage
        );
        setUserList(userPayAmounts);
        setUserPercentList(userPercentages);

        // 3. Peer Card History 가져오기
        const peerCardHistoryResponse = await axios.get(
          `http://localhost:9999/mypage/peercardHistory?memberId=${memberID}`
        );
        const peerPayAmounts = peerCardHistoryResponse.data.payHistories.map(
          (item) => item.payAmount
        );
        setAge(peerCardHistoryResponse.data.age);
        setCurrentMonth(peerCardHistoryResponse.data.currentMonth);
        setPeerList(peerPayAmounts);

        // 4. userList와 peerList의 합계 계산
        const totalUserPayment = userPayAmounts.reduce(
          (acc, curr) => acc + curr,
          0
        );
        setUserPayment(totalUserPayment);

        const totalPeerPayment = peerPayAmounts.reduce(
          (acc, curr) => acc + curr,
          0
        );
        setPeerPayment(totalPeerPayment);
      } catch (error) {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
      }
    };

    // 데이터 가져오는 함수 호출
    fetchData();
  }, []); // 초기 렌더링 시 한 번만 실행되도록 의존성 배열은 빈 배열로 설정
  // useEffect(() => {
  //   checkJWT("/api/member/memberSession", "get", null)
  //     .then((resopnse) => {
  //       console.log("JWT 확인 결과" + resopnse.memberId);
  //       const memberID = resopnse.memberId;
  //       setMemberID(memberID);
  //     })
  //     .catch((error) => {
  //       console.error("There was an error!", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:9999/mypage/mycardHistory?memberId=${memberID}`)
  //     .then((response) => {
  //       const payAmounts = response.data.map((item) => item.payAmount);
  //       const percentage = response.data.map((item) => item.percentage);
  //       setUserList(payAmounts);
  //       setUserPercentList(percentage);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);

  // useEffect(() => {
  //   axios
  //     .get(`http://localhost:9999/mypage/peercardHistory?memberId=${memberID}`)
  //     .then((response) => {
  //       const payAmounts = response.data.payHistories.map(
  //         (item) => item.payAmount
  //       );
  //       setAge(response.data.age);
  //       setCurrentMonth(response.data.currentMonth);
  //       setPeerList(payAmounts);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data:", error);
  //     });
  // }, []);
  // // userList가 업데이트될 때마다 합계 계산
  // useEffect(() => {
  //   const totalUserPayment = userList.reduce((acc, curr) => acc + curr, 0);
  //   setUserPayment(totalUserPayment);
  // }, [userList]);
  // // peerList가 업데이트될 때마다 합계 계산
  // useEffect(() => {
  //   const totalPeerPayment = peerList.reduce((acc, curr) => acc + curr, 0);
  //   setPeerPayment(totalPeerPayment);
  // }, [peerList]);

  const donutData = {
    series: userPercentList,
    options: {
      chart: { type: "donut" },
      legend: {
        position: "bottom", // 범례
        horizontalAlign: "center",
        fontFamily: "OneShinhanBold, sans-serif",
        fontSize: "11px",
        fontWeight: "light",
        colors: ["#303473"],
      },
      responsive: [{ breakpoint: 300 }],
      plotOptions: {
        pie: {
          donut: {
            size: "45%", // 도넛의 두께를 넓히기 위해 size 값을 조정 (기본은 65%)
          },
        },
      },
      labels: ["식비", "교통비", "온라인쇼핑", "문화/여가"],
      colors: ["#2CD6BE", "#94DBE0", "#F0C0D8", "#E962AE"],
      dataLabels: {
        enabled: true,
        style: {
          fontFamily: "OneShinhanBold, sans-serif", // 도넛 안의 수치 글꼴
          fontSize: "12px",
          fontWeight: "bold",
          colors: ["#FFFFFF"],
        },
      },
    },
  };
  const navigate = useNavigate();
  return (
    <div className="container">
      <div className="total-payment">
        <h3 className="header">{currentMonth}월 총 결제 금액</h3>
        <div className="amounts">
          <div>
            <div>{memberId}님</div>
            <div>{age}대 또래</div>
          </div>
          <div>
            <div>{userPayment.toLocaleString()}원</div>
            <div>{peerPayment.toLocaleString()}원</div>
          </div>
        </div>
      </div>
      <div className="container2">
        <div className="content-card card" id="test">
          <h3>
            카테고리별 소비 비교{" "}
            <Link to="/mypage" state={{ selectedTab: "consumeCompare" }}>
              <button className="plus">+</button>
            </Link>
          </h3>
          <ApexCharts
            type="bar"
            series={[
              { name: "나의 소비", data: userList },
              { name: "또래 소비", data: peerList },
            ]}
            options={{
              chart: {
                height: "100%",
                width: "100%",
              },
              xaxis: {
                categories: ["식비", "교통비", "온라인쇼핑", "문화/여가"],
                labels: {
                  style: {
                    fontFamily: "OneShinhanBold, sans-serif",
                    fontSize: "10px",
                    fontWeight: "light", // Optional: 'bold', 'normal', 'light', etc.
                    colors: "#000000",
                  },
                },
              },
              yaxis: {
                axisBorder: {
                  show: false, // y축의 선 숨기기
                },
                axisTicks: {
                  show: false, // y축의 눈금 숨기기
                },
                labels: {
                  show: false, // y축 레이블 숨기기
                },
              },
              dataLabels: {
                enabled: true,
                formatter: function (val) {
                  return `${val.toLocaleString()}원`;
                },
                offsetY: -20, // 막대 위로 올리기 위한 y축 오프셋
                style: {
                  fontFamily: "OneShinhanBold, sans-serif",
                  fontSize: "7px",
                  fontWeight: "bold",
                  colors: ["#303473"],
                },
              },
              plotOptions: {
                bar: {
                  borderRadius: 10,
                  columnWidth: "85%",
                  dataLabels: {
                    position: "top",
                  },
                },
              },
              grid: {
                show: false,
              },
              colors: ["#F9C3D6", "#C1C7E2"],
              legend: {
                show: true,
                position: "bottom", // 범례
                horizontalAlign: "center",
                fontFamily: "OneShinhanBold, sans-serif",
                fontSize: "11px",
                fontWeight: "normal",
                colors: ["#303473"],
              },
            }}
          />
        </div>
        <div className="content-card card" id="test mine">
          <h3>나의 소비 별 통계</h3>
          <Link to="/MyPage/DiscountInfo">
            <button class="content-discount">
              나를 위한 할인 정보 보러가기
            </button>
          </Link>
          <ApexCharts
            options={donutData.options}
            series={donutData.series}
            type="donut"
            width="100%"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default ConsumeHistory;
