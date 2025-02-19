import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Schedule from "./attendance.module.css";

const Attendance = () => {
    const [events, setEvents] = useState([]);
    const [noAccidentDays, setNoAccidentDays] = useState(0); // 무사고 일수
    const [currentDateTime, setCurrentDateTime] = useState(""); // 현재 날짜 상태

    // 기준 날짜 (무사고 시작일)
    const startDate = new Date("2020-01-21");

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
        ).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`; // 날짜만 포맷팅
        setCurrentDateTime(formattedDate); // 상태에 저장
    }, []);

    // 일정 데이터 가져오기
    useEffect(() => {
        fetch("http://localhost:8080/api/schedule")
            .then((response) => response.json())
            .then((data) => {
                const transformedEvents = data.schedule.map((schedule) => ({
                    title: schedule.empName,
                    start: new Date(schedule.checkIn).toISOString(),
                    end: new Date(schedule.checkOut).toISOString(),
                    description: `Work Team: ${schedule.workTeam}`,
                    extendedProps: {
                        email: schedule.email,
                        phone: schedule.phone,
                        profileImage: schedule.profileImage,
                    },
                }));
                setEvents(transformedEvents);
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
                            src="../images/baba.png"
                            alt="프로필사진"
                        />
                        <p className={Schedule.profileName}>김관훈님</p>
                        <p className={Schedule.profileName1}>환영합니다.</p>
                    </div>
                    {/* 가운데 구분선 */}
                    <div className={Schedule.divider}></div>
                    {/* 오른쪽 콘텐츠 */}
                    <div className={Schedule.rightContent}>
                        <h3>{noAccidentDays}&nbsp;일 무사고</h3> {/* 무사고 일수 */}
                        <p>{currentDateTime}</p> {/* 날짜만 표시 */}
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
                                <td>김오전</td>
                                <td>A조</td>
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
                    eventClick={(info) => {
                        alert(
                            `Event: ${info.event.title}\nEmail: ${info.event.extendedProps.email}\nPhone: ${info.event.extendedProps.phone}`
                        );
                    }}
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
