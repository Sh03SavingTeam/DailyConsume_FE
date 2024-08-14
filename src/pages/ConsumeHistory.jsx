import "../App.css";
import "../styles/ConsumeHistory.css";
import Footer from "../components/Footer";
import ApexCharts from "react-apexcharts";
function ConsumeHistory() {
  const donutData = {
    series: [50, 40, 30, 10, 0],
    options: {
      chart: { type: "donut" },
      legend: { position: "bottom" },
      responsive: [{ breakpoint: 480 }],
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              total: {
                showAlways: true,
                show: true,
                label: "히릿",
                fontSize: "12px",
                color: "red",
              },
              value: { fontSize: "22px", show: true, color: "blue" },
            },
          },
        },
      },
      labels: ["식비", "교통비", "온라인쇼핑", "문화", "여가"],
      title: { text: "소비별 통계", align: "center" },
    },
  };

  return (
    <div className="container">
      <div className="content">
        <h2>8월 총 결제 금액</h2>
        <ApexCharts
          type="bar"
          series={[
            { name: "나의 소비", data: [19, 26, 20, 9] },
            { name: "또래 소비", data: [30, 26, 34, 10] },
            
          ]}
          options={{
            chart: {
              height: 500,
              width: 800,
            },
          }}
        ></ApexCharts>
      </div>
      <div className="content">
      <h2>나의 소비 별 통계</h2>
        <ApexCharts
          options={donutData.options}
          series={donutData.series}
          type="donut"
          width="500"
        />
      </div>
      <Footer />
    </div>
  );
}

export default ConsumeHistory;
