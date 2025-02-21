import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Schedule from "./attendance.module.css";
import Modal from "react-modal";

Modal.setAppElement("#root");

const Attendance = () => {
    const [events, setEvents] = useState([]);
    const [noAccidentDays, setNoAccidentDays] = useState(0);
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [userSchedule, setUserSchedule] = useState(null);
    const [isModal, setIsModal] = useState(false);
    const [isDetailModal, setIsDetailModal] = useState(false);
    const [newEvent, setNewEvent] = useState({
        startDate: "",
        endDate: "",
        workStatus: "출근",
        empName: "",
        etc: "",
    });
    const [selectedEvent, setSelectedEvent] = useState(null); // 클릭한 이벤트 상세 정보 저장
    const [currentWorkingHours, setCurrentWorkingHours] = useState(0);

    const startDate = new Date("2020-02-18");

    useEffect(() => {
        const currentDate = new Date();
        const dayDifference = Math.floor(
            (currentDate - startDate) / (1000 * 60 * 60 * 24)
        );
        setNoAccidentDays(dayDifference);
    }, []);

    useEffect(() => {
        const now = new Date();
        const formattedDate = `${now.getFullYear()}.${String(
            now.getMonth() + 1
        ).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
        setCurrentDateTime(formattedDate);
    }, []);

    useEffect(() => {
        const scheduleId = "SD001";

        fetch(`http://localhost:8080/api/v1/schedule/${scheduleId}`)
            .then((response) => response.json())
            .then((data) => {
                const schedule = data.result.schedule;

                const calendarEvent = {
                    title: schedule.empName,
                    start: new Date(schedule.checkIn).toISOString(),
                    end: new Date(schedule.checkOut).toISOString(),
                    description: `Work Team: ${schedule.workTeam}`,
                    extendedProps: {
                        email: schedule.email,
                        phone: schedule.phone,
                        profileImage: schedule.profileImage || "public/images/baba.png",
                    },
                    backgroundColor: getColor(schedule.workStatus).backgroundColor,
                    textColor: getColor(schedule.workStatus).textColor,
                };

                setEvents([calendarEvent]);
                setUserSchedule(schedule);
            })
            .catch((error) => console.error("Error fetching schedules:", error));
    }, []);

    const getColor = (status) => {
        switch (status) {
            case "출근":
                return { backgroundColor: "#28a745", textColor: "#fff" };
            case "휴가":
                return { backgroundColor: "#007bff", textColor: "#fff" };
            case "병가":
                return { backgroundColor: "#ffc107", textColor: "#fff" };
        }
    };

    // 주말 제외 근무시간 계산 함수
    const calculateWorkingHours = () => {
        const currentMonth = new Date().getMonth();
        let totalWorkingHours = 0;

        // 이번 달의 첫 번째 날짜와 마지막 날짜를 구합니다.
        const firstDayOfMonth = new Date(new Date().getFullYear(), currentMonth, 1);
        const lastDayOfMonth = new Date(new Date().getFullYear(), currentMonth + 1, 0);

        // 첫 번째 날짜부터 마지막 날짜까지 반복하면서 주말을 제외한 평일에 대해 8시간씩 추가
        let currentDate = firstDayOfMonth;
        while (currentDate <= lastDayOfMonth) {
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // 주말(토, 일)을 제외
                totalWorkingHours += 8; // 평일에는 하루 8시간씩 추가
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return totalWorkingHours;
    };

    // 현재 근무시간 나타내기
    useEffect(() => {
        const updateWorkingHours = () => {
            const currentDate = new Date();
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const isNewMonth = currentDate.getDate() === 1; // 오늘이 1일인지 확인

            if (isNewMonth) {
                setCurrentWorkingHours(0); // 매달 1일 근무시간 초기화
            } else {
                // 첫 번째 날짜부터 오늘까지의 날짜 중에서 근무일만 계산 (주말 제외)
                let workingDays = 0;
                let currentDay = new Date(firstDayOfMonth);

                while (currentDay <= currentDate) {
                    const dayOfWeek = currentDay.getDay(); // 일요일(0)과 토요일(6)을 제외한 날짜를 계산
                    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                        workingDays++; // 주말을 제외한 근무일을 계산
                    }
                    currentDay.setDate(currentDay.getDate() + 1);
                }

                const workingHours = workingDays * 8; // 근무일에 8시간씩 계산
                setCurrentWorkingHours(workingHours); // 새로운 근무시간 설정
            }
        };

        // 페이지 로드 시 한 번 실행
        updateWorkingHours();

        // 매일 자정에 근무시간 업데이트
        const interval = setInterval(() => {
            updateWorkingHours();
        }, 1000 * 60 * 60 * 24); // 24시간마다 실행

        // 컴포넌트 언마운트 시 interval을 클리어
        return () => clearInterval(interval);

    }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행

    const totalWorkingHours = calculateWorkingHours();


    // 등록 모달
    const openModal = () => setIsModal(true);
    const closeModal = () => setIsModal(false);
    // 상세정보 모달
    const detailOpenModal = () => setIsDetailModal(true);
    const detailCloseModal = () => setIsDetailModal(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleSubmit = () => {

        const scheduleData = {
            scheduleId: "SD006",
            checkIn: newEvent.startDate,
            checkOut: newEvent.endDate,
            workStatus: newEvent.workStatus,
            empName: newEvent.empName,
            profileImage: null,
            workTeam: newEvent.workTeam,
            empId: "EMP001", // 로그인한 정보가 없으므로 하드코딩으로 일단 하자 ㅠㅠ
            remark: newEvent.scheduleEtc
        };

        console.log("등록할 스케줄 데이터:", scheduleData);

        const eventDates = getDatesBetween(newEvent.startDate, newEvent.endDate);

        fetch("http://localhost:8080/api/v1/schedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ schedule: [scheduleData] }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('데이터 들어오는값 확인 : ', data)
                const newEvents = eventDates.map((date) => ({
                    title: `${scheduleData.workStatus} ${scheduleData.empName}`,
                    start: date,
                    end: date,
                    backgroundColor: getColor(scheduleData.workStatus).backgroundColor,
                    textColor: getColor(scheduleData.workStatus).textColor,
                }));

                setEvents((prevEvents) => [...prevEvents, ...newEvents]);
                closeModal();
            })
            .catch((error) => {
                console.error("스케줄 등록 오류:", error);
            });
    };

    const getDatesBetween = (startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                dates.push(new Date(currentDate).toISOString().split("T")[0]);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    };

    // eventClick 핸들러
    const handleEventClick = (info) => {
        const event = info.event;
        const { title, start, end, extendedProps } = event;

        // start와 end가 유효한 Date 객체인지 확인
        const formattedStart = start instanceof Date ? start.toLocaleString() : "유효하지 않은 시작일";
        const formattedEnd = end instanceof Date ? end.toLocaleString() : "유효하지 않은 종료일";

        const workStatus = event.extendedProps?.workStatus || "미정"; // 예외처리

        setSelectedEvent({
            title,
            start: formattedStart,
            end: formattedEnd,
            workStatus,
            workTeam: extendedProps?.workTeam || "정보없음",
            empName: extendedProps?.empName || "이름없음",
            email: extendedProps?.email || "이메일없음",
            phone: extendedProps?.phone || "전화번호없음",
        });
        detailOpenModal();
    };

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", marginTop: "30px" }}>
                <div className={Schedule.profileBar}>
                    <div className={Schedule.leftContent}>
                        <img className={Schedule.profile} src={userSchedule?.profileImage || "../images/baba.png"} alt="프로필사진" />
                        <p className={Schedule.profileName}>{userSchedule?.empName}님</p>
                        <p className={Schedule.profileName1}>환영합니다.</p>
                    </div>
                    <div className={Schedule.divider}></div>
                    <div className={Schedule.rightContent}>
                        <h3 style={{ color: 'red' }}>{noAccidentDays}&nbsp;일 무사고</h3>
                        <p>{currentDateTime}</p>
                        <p>근무 기록을 기록합니다.</p>
                    </div>
                </div>

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
                                <td>{totalWorkingHours}시간</td>
                                <td>{currentWorkingHours}시간</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <button className={Schedule.scheduleButton} onClick={openModal}>스케줄 등록</button>

            <Modal isOpen={isModal} onRequestClose={closeModal} className={Schedule.modal}>
                <div className={Schedule.modalHeader}>
                    <button className={Schedule.closeButton} onClick={closeModal}>X</button>
                    <h2 className={Schedule.modalTitle}>스케줄 등록</h2>
                </div>

                <form className={Schedule.modalForm}>
                    <input
                        type="text"
                        name="empId"
                        value="EMP001" // 하드코딩된 empId 값
                        onChange={handleInputChange}
                        style={{ display: 'none' }}
                    />
                    <label className={Schedule.formLabel}>
                        시작일:
                        <input type="date" name="startDate" value={newEvent.startDate} onChange={handleInputChange} className={Schedule.formInput} />
                    </label><br />
                    <label className={Schedule.formLabel}>
                        종료일:
                        <input type="date" name="endDate" value={newEvent.endDate} onChange={handleInputChange} className={Schedule.formInput} />
                    </label><br />
                    <label className={Schedule.formLabel}>
                        근무 상태:
                        <select name="workStatus" value={newEvent.workStatus} onChange={handleInputChange} className={Schedule.formInput}>
                            <option value="출근">출근</option>
                            <option value="휴가">휴가</option>
                            <option value="병가">병가</option>
                            <option value="공휴일">공휴일</option>
                        </select>
                        <label className={Schedule.formLabel}>
                            특이사항:
                            <textarea
                                name="remarks"
                                value={newEvent.scheduleEtc}
                                onChange={handleInputChange}
                                className={Schedule.formInput}
                                placeholder="특이사항을 입력하세요"
                            />
                        </label><br />
                    </label><br />
                    <button type="button" onClick={handleSubmit} className={Schedule.submitButton}>등록</button>
                </form>
            </Modal>

            {/* 이벤트 상세정보 모달 */}
            {selectedEvent && (
                <Modal isOpen={isDetailModal} onRequestClose={detailCloseModal} className={Schedule.modal}>
                    <div className={Schedule.modalHeader}>
                        <button className={Schedule.closeButton} onClick={detailCloseModal}>X</button>
                        <h2 className={Schedule.modalTitle}>상세정보</h2>
                    </div>

                    <div className={Schedule.modalContent}>
                        <p>이름: {selectedEvent.empName}</p>
                        <p>작업조: {selectedEvent.workTeam}</p>
                        <p>근무 상태: {selectedEvent.workStatus}</p>
                        <p>시작 시간: {selectedEvent.start}</p>
                        <p>종료 시간: {selectedEvent.end}</p>
                        <p>이메일: {selectedEvent.email}</p>
                        <p>전화번호: {selectedEvent.phone}</p>
                    </div>
                </Modal>
            )}

            <div className={Schedule.maiBar}>
                <FullCalendar
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,dayGridWeek",
                    }}
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    editable={false}
                    droppable={false}
                    locale="ko"
                    height="100%"
                    expandRows={true}
                    eventClick={handleEventClick}
                />
            </div>
        </>
    );
};

export default Attendance;
