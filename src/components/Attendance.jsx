import React, { useEffect, useState } from "react";
import "../styles/Attendance.css";
import Carrot from "../assets/Carrot.png";
import axios from "axios";

function Attendance(props) {
  const [memberId, setMemberId] = useState("m004");
  const [attendanceData, setAttendanceData] = useState(null);

  const fetchAttendanceData = () => {
    axios
      .get(`/rank/attendance/${memberId}`)
      .then((response) => {
        setAttendanceData(response.data); // 응답 데이터를 상태에 저장
      })
      .catch((error) => {
        console.error("Error fetching attendance data:", error);
      });
  };

  useEffect(() => {
    fetchAttendanceData(); // memberId가 바뀌거나 컴포넌트가 처음 렌더링될 때 호출
  }, [memberId]);

  const handleAttendanceClick = () => {
    if (attendanceData && attendanceData.attendanceInfo === 1) return; // attendanceInfo가 1이면 클릭 방지

    const data = {
      memberId: memberId,
      coment: "출석체크",
      score: 1,
    };

    axios
      .post("/rank/scoreInsert", data)
      .then((response) => {
        console.log("출석체크 완료:", response.data);
        fetchAttendanceData(); // 출석체크 후 데이터를 다시 가져옴
      })
      .catch((error) => {
        console.error("Error posting attendance data:", error);
      });
  };

  // 데이터를 아직 받아오지 못한 경우 로딩 메시지를 표시
  if (!attendanceData) {
    return <div>Loading...</div>;
  }

  // attendanceInfo가 1이면 버튼 비활성화 스타일 적용
  const buttonStyle =
    attendanceData.attendanceInfo === 1
      ? { backgroundColor: "#B6B6B6", cursor: "not-allowed" }
      : { backgroundColor: "#94DBE0", cursor: "pointer" }; // 기본 스타일

  // attendanceInfo가 1일 때 텍스트를 변경
  const attendanceMessage =
    attendanceData.attendanceInfo === 1
      ? "오늘의 출석체크를 이미 했습니다"
      : "출석체크 하면 당근 한개를 드려요 !";

  return (
    <div className="attendance-box">
      <div className="ad-title">하루소비 출석체크</div>
      <div className="ad-info">
        <div
          className="attendance-btn-box"
          style={buttonStyle}
          onClick={handleAttendanceClick}
        >
          <img src={Carrot} alt="carrotIcon" className="carrot-icon" />
        </div>
        <div className="ad-text-box">
          <div className="ad-text1">{attendanceMessage}</div>
          <div className="ad-text2">
            이번 달 누적 출석 횟수 : {attendanceData.totalAttendance}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Attendance;
