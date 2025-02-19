import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Schedule from "./attendance.module.css";

const Attendance = () => {
    const [events, setEvents] = useState([]); // 캘린더 이벤트 저장
    const [noAccidentDays, setNoAccidentDays] = useState(0); // 무사고 일수
    const [currentDateTime, setCurrentDateTime] = useState(""); // 현재 날짜 상태
    const [userSchedule, setUserSchedule] = useState(null); // 유저 스케줄 데이터

    // 기준 날짜 (무사고 시작일)
    const startDate = new Date("2020-02-18");

    // 무사고 일수 계산
    useEffect(() => {
        const currentDate = new Date();
        const dayDifference = Math.floor(
            (currentDate - startDate) / (1000 * 60 * 60 * 24)
        );
        setNoAccidentDays(dayDifference);
    }, []);

    // 현재 날짜 업데이트 (날짜만 표시)
    useEffect(() => {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}.${String(
            now.getMonth() + 1
        ).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
        setCurrentDateTime(formattedDate);
    }, []);

    // 유저 스케줄 데이터 가져오기
    useEffect(() => {
        const scheduleId = "SD001"; // 예시로 SD001을 사용

        fetch(`http://localhost:8080/api/v1/schedules/${scheduleId}`)
            .then((response) => response.json())
            .then((data) => {
                console.log('유저의 데이터값', data)
                const schedule = data.result.schedule;

                // 캘린더 이벤트로 변환
                const transformedEvent = {
                    title: schedule.empName,
                    start: new Date(schedule.checkIn).toISOString(),
                    end: new Date(schedule.checkOut).toISOString(),
                    description: `Work Team: ${schedule.workTeam}`,
                    extendedProps: {
                        email: schedule.email,
                        phone: schedule.phone,
                        profileImage: schedule.profileImage || "../public/images/baba",
                    },
                };

                setEvents([transformedEvent]); // 이벤트 설정
                setUserSchedule(schedule); // 유저 스케줄 설정
            })
            .catch((error) => console.error("Error fetching schedules:", error));
    }, []);

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", marginTop: "30px" }}>
                <div className={Schedule.profileBar}>
                    {/* 왼쪽 콘텐츠 */}
                    <div className={Schedule.leftContent}>
                        <img
                            className={Schedule.profile}
                            src={userSchedule?.profileImage}
                            alt="프로필사진"
                        />
                        <p className={Schedule.profileName}>{userSchedule?.empName}님</p>
                        <p className={Schedule.profileName1}>환영합니다.</p>
                    </div>
                    {/* 가운데 구분선 */}
                    <div className={Schedule.divider}></div>
                    {/* 오른쪽 콘텐츠 */}
                    <div className={Schedule.rightContent}>
                        <h3>{noAccidentDays}&nbsp;일 무사고</h3>
                        <p>{currentDateTime}</p>
                        <p>근무 기록을 기록합니다.</p>
                    </div>
                </div>

                {/* 인원 투입 시간 관리 테이블 */}
                <div className={Schedule.tableBar}>
                    <h3 className={Schedule.tableName}>인원투입시간관리</h3>
                    <table className={Schedule.styledTb}>
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>작업조</th>
                                <th>이번달 근무시간</th>
                                <th>현재 근무시간</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{userSchedule?.empName}</td>
                                <td>{userSchedule?.workTeam}</td>
                                <td>180시간</td>
                                <td>3시간</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 캘린더 영역 */}
            <div className={Schedule.maiBar}>
                <FullCalendar
                    className={Schedule.calendar}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,dayGridWeek",
                    }}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    editable={true}
                    droppable={true}
                    locale="ko"
                    height="100%" // 캘린더 높이를 부모 컨테이너에 맞춤
                    expandRows={true} // 행 높이를 균일하게 설정
                />
            </div>
        </>
    );
};

export default Attendance;
