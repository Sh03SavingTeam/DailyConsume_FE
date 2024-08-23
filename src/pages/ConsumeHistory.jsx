import "../App.css";
import "../styles/ConsumeHistory.css";
import Footer from "../components/Footer";
import ApexCharts from "react-apexcharts";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";

function ConsumeHistory({ memberId }) {
  let [userList, setUserList] = useState([]);
  let [peerList, setPeerList] = useState([]);
  let [userPercentList, setUserPercentList] = useState([]);
  let [age, setAge] = useState(0);
  let [currentMonth, setCurrentMonth] = useState(0);
  let [userPayment, setUserPayment] = useState(0);
  let [peerPayment, setPeerPayment] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:9999/mypage/mycardHistory?memberId=${memberId}`) // 스프링 서버의 엔드포인트로 수정 필요
      .then((response) => {
        const payAmounts = response.data.map((item) => item.payAmount);
        const percentage = response.data.map((item) => item.percentage);
        setUserList(payAmounts); // payAmount 값을 상태로 저장
        setUserPercentList(percentage);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // 빈 배열은 컴포넌트가 처음 렌더링될 때만 useEffect 실행을 의미

  useEffect(() => {
    axios
      .get(`http://localhost:9999/mypage/peercardHistory?memberId=${memberId}`) // 스프링 서버의 엔드포인트로 수정 필요
      .then((response) => {
        const payAmounts = response.data.payHistories.map(
          (item) => item.payAmount
        );
        setAge(response.data.age);
        setCurrentMonth(response.data.currentMonth);
        setPeerList(payAmounts); // payAmount 값을 상태로 저장
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // userList가 업데이트될 때마다 합계 계산
  useEffect(() => {
    const totalUserPayment = userList.reduce((acc, curr) => acc + curr, 0);
    setUserPayment(totalUserPayment);
  }, [userList]);

  // peerList가 업데이트될 때마다 합계 계산
  useEffect(() => {
    const totalPeerPayment = peerList.reduce((acc, curr) => acc + curr, 0);
    setPeerPayment(totalPeerPayment);
  }, [peerList]);

  const donutData = {
    series: userPercentList,
    options: {
      chart: { type: "donut" },
      legend: {
        position: "bottom", // 범례
        horizontalAlign: "center",
        fontFamily: "OneShinhanBold, sans-serif",
        fontSize: "12px",
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
          fontSize: "14px", 
          fontWeight: "bold", 
          colors: ["#FFFFFF"],
        },
      },
    },
  };

  return (
    <div className="container">
      <div className="total-payment">
        <h2 className="header">{currentMonth}월 총 결제 금액</h2>
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
      <div className="content">
        <h2>카테고리별 소비 비교</h2>
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
                  fontSize: "14px",
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
                fontSize: "8px",
                fontWeight: "light",
                colors: ["#303473"],
              },
            },
            plotOptions: {
              bar: {
                borderRadius: 10,
                columnWidth: "80%",
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
              fontSize: "12px",
              fontWeight: "normal",
              colors: ["#303473"],
            },
          }}
        />
      </div>
      <div className="content">
        <h2>나의 소비 별 통계</h2>
        <ApexCharts
          options={donutData.options}
          series={donutData.series}
          type="donut"
          width="100%"
        />
      </div>
      <Footer />
    </div>
  );
}

export default ConsumeHistory;
