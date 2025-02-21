import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Schedule from "./attendance.module.css";
import Modal from "react-modal";
import { fetchSchedule, createSchedule, fetchAllSchedules, updateSchedule } from '../../apis/attendanceApi/attendanceApi'; // 서버 API 호출
import SuccessAnimation from "../../lottie/SuccessNotification";

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
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentWorkingHours, setCurrentWorkingHours] = useState(0);
    const [isSuccessModal, setIsSuccessModal] = useState(false); // 성공모달
    const [editEventData, setEditEventData] = useState(null); // 수정 데이터를 위한 상태
    const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부

    const getDatesBetween = (startDate, endDate) => {
        const dates = [];
        let currentDate = new Date(startDate);

        if (!endDate) {
            endDate = startDate; // 종료일이 없으면 시작일로 대체
        }

        while (currentDate <= new Date(endDate)) {
            if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) { // 주말 제외
                dates.push(new Date(currentDate).toISOString().split("T")[0]);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    };



    const startDate = new Date("2025-02-18");
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

    const getColor = (status) => {
        switch (status) {
            case "출근":
                return { backgroundColor: "#28a745", textColor: "#fff" };
            case "휴가":
                return { backgroundColor: "#007bff", textColor: "#fff" };
            case "병가":
                return { backgroundColor: "#ffc107", textColor: "#fff" };
            default:
                return { backgroundColor: "#6c757d", textColor: "#fff" };
        }
    };



    useEffect(() => {
        const empId = "EMP002";

        // 직원의 전체 스케줄 가져오기
        fetchAllSchedules(empId)
            .then((schedules) => {
                if (schedules && schedules.length > 0) {
                    setUserSchedule(schedules[0]);

                    const calendarEvents = schedules.map((schedule) => {
                        const { workStatus, checkIn, checkOut, empName, workTeam, email, phone, profileImage, scheduleId, scheduleEtc } = schedule;
                        const startDate = new Date(checkIn);
                        const endDate = new Date(checkOut);
                        const color = getColor(workStatus);

                        // 주말 제외 날짜들 계산
                        const dates = getDatesBetween(startDate, endDate);

                        return dates.map((date) => {
                            return {
                                title: `${workStatus}`,
                                start: new Date(date).toISOString(),
                                end: new Date(date).toISOString(),
                                allDay: true,
                                description: `Work Team: ${workTeam}`,
                                extendedProps: {
                                    scheduleId,
                                    empName,
                                    workTeam,
                                    workStatus,
                                    email: email,
                                    phone: phone,
                                    profileImage: profileImage || "public/images/baba.png",
                                    scheduleEtc
                                },
                                backgroundColor: color.backgroundColor,
                                textColor: color.textColor,
                            };
                        });
                    });

                    setEvents(calendarEvents.flat());  // 한 번에 setEvents 호출
                }
            })
            .catch((error) => { });
    }, []);

    const calculateWorkingHours = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();  // 현재 달
        const currentYear = currentDate.getFullYear();  // 현재 년도

        const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

        let totalWorkingHours = 0;
        let currentDay = firstDayOfMonth;

        while (currentDay <= lastDayOfMonth) {
            const dayOfWeek = currentDay.getDay();  // 0(일요일) ~ 6(토요일)

            if (dayOfWeek !== 0 && dayOfWeek !== 6) {  // 주말 제외
                totalWorkingHours += 8;  // 평일 하루 8시간씩 추가
            }

            currentDay.setDate(currentDay.getDate() + 1);
        }

        return totalWorkingHours;
    };

    useEffect(() => {
        const updateWorkingHours = () => {
            const currentDate = new Date();
            const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
            const isNewMonth = currentDate.getDate() === 1;

            if (isNewMonth) {
                setCurrentWorkingHours(0);  // 새 달이 시작되면 초기화
            } else {
                let workingDays = 0;
                let currentDay = new Date(firstDayOfMonth);

                while (currentDay <= currentDate) {
                    const dayOfWeek = currentDay.getDay();
                    if (dayOfWeek !== 0 && dayOfWeek !== 6) {  // 평일만 계산
                        workingDays++;
                    }
                    currentDay.setDate(currentDay.getDate() + 1);
                }

                const workingHours = workingDays * 8;  // 평일 수에 8시간 곱하기
                setCurrentWorkingHours(workingHours);  // 현재 근무시간 갱신
            }
        };

        updateWorkingHours();

        const interval = setInterval(() => {
            updateWorkingHours();
        }, 1000 * 60 * 60 * 24);  // 하루마다 업데이트

        return () => clearInterval(interval);

    }, []);

    const totalWorkingHours = calculateWorkingHours();

    const openModal = () => setIsModal(true);
    const closeModal = () => setIsModal(false);
    const detailOpenModal = () => setIsDetailModal(true);
    const detailCloseModal = () => {
        setIsDetailModal(false);
        setEditEventData(null); // 수정 데이터 초기화
        setIsEditMode(false); // 수정 모드 종료
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    // 수정 데이터 변경 핸들러
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditEventData({ ...editEventData, [name]: value });
    };

    const handleUpdateSchedule = async () => {
        if (!editEventData || !selectedEvent) return;

        try {
            const updatedData = {
                scheduleId: selectedEvent.scheduleId,
                checkIn: editEventData.checkIn || selectedEvent.checkIn,
                checkOut: editEventData.checkOut || selectedEvent.checkOut,
                workStatus: editEventData.workStatus || selectedEvent.workStatus,
                scheduleEtc: editEventData.scheduleEtc || selectedEvent.scheduleEtc,
            };

            console.log("Sending updated data:", updatedData);

            const response = await updateSchedule(updatedData); // API 호출
            console.log("API Response:", response);

            if (response) {
                const updatedSchedules = await fetchAllSchedules("EMP002"); // 최신 스케줄 가져오기
                const calendarEvents = updatedSchedules.map((schedule) => ({
                    title: schedule.workStatus,
                    start: new Date(schedule.checkIn).toISOString(),
                    end: new Date(schedule.checkOut).toISOString(),
                    allDay: true,
                    extendedProps: schedule,
                }));

                setEvents(calendarEvents); // 캘린더 이벤트 업데이트
                detailCloseModal(); // 모달 닫기
            }
        } catch (error) {
            console.error("Error updating schedule:", error);
        }
    };


    const handleSubmit = async () => {  // async 추가
        console.log("newEvent:", newEvent);

        if (newEvent.workStatus === '출근') {
            newEvent.endDate = null;  // 출근일 때 종료일을 비우거나, 아예 undefined나 null 처리
        }

        // 오늘 날짜와 비교
        const selectedDate = new Date(newEvent.startDate).toISOString().split("T")[0];

        // 기존 이벤트 중 동일한 날짜에 이벤트가 있는지 확인
        const existingEvent = events.find(
            (event) => new Date(event.start).toISOString().split("T")[0] === selectedDate
        );

        if (existingEvent) {
            alert("이미 해당 날짜에 이벤트가 존재합니다.");
            return;
        }

        const scheduleData = {
            scheduleId: "SD006",
            checkIn: newEvent.startDate,
            checkOut: newEvent.workStatus === '출근' ? newEvent.startDate : newEvent.endDate,
            workStatus: newEvent.workStatus,
            empName: newEvent.empName,
            profileImage: newEvent.profileImage,
            workTeam: newEvent.workTeam,
            empId: "EMP002",
            scheduleEtc: newEvent.scheduleEtc
        };

        try {
            await createSchedule(scheduleData);  // createSchedule 호출도 async로 처리
            const schedules = await fetchAllSchedules("EMP002");  // fetchAllSchedules 호출도 async로 처리

            if (schedules && schedules.length > 0) {
                const calendarEvents = schedules.map((schedule) => {
                    const { workStatus, checkIn, checkOut, empName, workTeam, email, phone, profileImage, scheduleId, scheduleEtc } = schedule;
                    const startDate = new Date(checkIn);
                    const endDate = checkOut ? new Date(checkOut) : startDate;

                    // 주말 제외 날짜들 계산
                    const dates = getDatesBetween(startDate, endDate);

                    return dates.map((date) => {
                        const color = getColor(workStatus);
                        return {
                            title: `${workStatus}`,
                            start: new Date(date).toISOString(),
                            end: new Date(date).toISOString(),
                            allDay: true,
                            description: `Work Team: ${workTeam}`,
                            extendedProps: {
                                scheduleId,
                                empName,
                                workTeam,
                                workStatus,
                                scheduleEtc,
                                email,
                                phone,
                                profileImage: profileImage || "public/images/baba.png",
                            },
                            backgroundColor: color.backgroundColor,
                            textColor: color.textColor,
                        };
                    });
                });

                setEvents(calendarEvents.flat());  // 한 번에 setEvents 호출
            }

            closeModal();
            setIsSuccessModal(true);

            // 새로 등록된 스케줄을 클릭했을 때 이벤트 처리
            const newSchedule = {
                title: newEvent.workStatus,
                start: new Date(newEvent.startDate).toLocaleDateString(),
                end: new Date(newEvent.endDate).toLocaleDateString(),
                extendedProps: {
                    scheduleId: scheduleData.scheduleId,
                    empName: newEvent.empName,
                    workStatus: newEvent.workStatus,
                    workTeam: newEvent.workTeam,
                    email: newEvent.email || "이메일없음",
                    phone: newEvent.phone || "전화번호없음",
                    profileImage: newEvent.profileImage || "public/images/baba.png",
                    scheduleEtc: newEvent.scheduleEtc
                }
            };

            // 이벤트 클릭 처리
            const { scheduleId, empName, scheduleEtc } = newSchedule.extendedProps;
            const formattedStart = newSchedule.start;
            const formattedEnd = newSchedule.end;

            const { workStatus = "미정", workTeam = "정보없음", email = "이메일없음", phone = "전화번호없음" } = newSchedule.extendedProps || {};

            setSelectedEvent({
                title: newSchedule.title,
                start: formattedStart,
                end: formattedEnd,
                workStatus,
                workTeam,
                empName,
                email,
                phone,
                scheduleEtc
            });

            // 스케줄 상세 정보 가져오기
            try {
                const scheduleData = await fetchSchedule(scheduleId);
            } catch (error) { }
        } catch (error) {
            // 에러 처리
            console.error(error);
        }
    };




    const handleEventClick = async (info) => {
        const { event } = info;
        const { title, start, end, extendedProps } = event;

        const { scheduleId, empName, scheduleEtc, checkOut } = extendedProps;

        if (!scheduleId || scheduleId.trim() === "") return;

        console.log("Selected event details:");
        console.log("Schedule ID:", scheduleId);
        console.log("Start Date:", start);
        console.log("End Date:", end);
        console.log("Extended Props:", extendedProps);

        // 기존에 클릭한 날짜가 start, end로 들어오므로 이를 날짜 변환할 필요가 있습니다.
        const formattedStart = start instanceof Date ? start.toLocaleDateString() : "유효하지 않은 시작일";
        const formattedEnd = end instanceof Date ? end.toLocaleDateString() : "유효하지 않은 종료일";

        const {
            workStatus = "미정",
            workTeam = "정보없음",
            email = "이메일없음",
            phone = "전화번호없음",
        } = extendedProps || {};

        // setSelectedEvent로 데이터 설정
        setSelectedEvent({
            title,
            start: formattedStart,
            end: formattedEnd,
            workStatus,
            workTeam,
            empName,
            email,
            phone,
            scheduleEtc
        });

        try {
            // scheduleId를 바탕으로 fetchSchedule 호출
            const scheduleData = await fetchSchedule(scheduleId);

            console.log("Fetched schedule data:", scheduleData);

            // scheduleData에서 실제 시작일(checkIn)과 종료일(checkOut)로 수정
            const actualStart = scheduleData?.checkIn ? new Date(scheduleData.checkIn) : null;
            const actualEnd = scheduleData?.checkOut ? new Date(scheduleData.checkOut) : null;

            // 실제 날짜를 설정해주는 로직
            const updatedStart = actualStart ? actualStart.toLocaleDateString() : "유효하지 않은 시작일";
            const updatedEnd = actualEnd ? actualEnd.toLocaleDateString() : "유효하지 않은 종료일";

            // setSelectedEvent으로 실제 start, end 값을 설정
            setSelectedEvent({
                title,
                start: updatedStart,
                end: updatedEnd,
                workStatus,
                workTeam,
                empName,
                email,
                phone,
                scheduleEtc
            });

            detailOpenModal(); // 모달 열기
        } catch (error) {
            console.error("Error fetching schedule data:", error);
        }
    };
    const closeSuccessModal = () => setIsSuccessModal(false);

    return (
        <>
            {/* ----------------------------------------------------------------------------------------------------------------------------------------------------------- */}
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
                {/* ----------------------------------------------------------------------------------------------------------------------------------------------------------- */}
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
            {/* ----------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            <Modal isOpen={isModal} onRequestClose={closeModal} overlayClassName="modal-overlay" className={Schedule.modal}>
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
                        시작일 :&nbsp;&nbsp;
                        <input
                            type="date"
                            name="startDate"
                            value={newEvent.startDate}
                            onChange={handleInputChange}
                            className={Schedule.formInput}
                        />
                    </label><br />
                    {/* 출근 상태일 때 종료일 필드를 렌더링하지 않도록 조건 추가 */}
                    {newEvent.workStatus !== '출근' && (
                        <label className={Schedule.formLabel}>
                            종료일 :&nbsp;&nbsp;
                            <input
                                type="date"
                                name="endDate"
                                value={newEvent.endDate}
                                onChange={handleInputChange}
                                className={Schedule.formInput}
                            />
                        </label>
                    )}<br />
                    <label className={Schedule.formLabel}>
                        근무 상태 :&nbsp;&nbsp;
                        <select
                            name="workStatus"
                            value={newEvent.workStatus}
                            onChange={handleInputChange}
                            className={Schedule.formInput}
                        >
                            <option value="출근">출근</option>
                            <option value="휴가">휴가</option>
                            <option value="병가">병가</option>
                            <option value="공휴일">공휴일</option>
                        </select><br />
                        <label className={Schedule.scheduleEtc}>
                            특이사항 :&nbsp;&nbsp;
                            <textarea
                                name="scheduleEtc"
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
            {/* ----------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            {/* 성공 알림 모달 */}
            <Modal isOpen={isSuccessModal} onRequestClose={closeSuccessModal} className={Schedule.successModal} overlayClassName="modal-overlay">
                <div className={Schedule.successModalHeader}>
                    <button className={Schedule.successCloseButton} onClick={closeSuccessModal}>X</button>
                </div>
                <div className={Schedule.successModalContent}>
                    <SuccessAnimation /> {/* 성공 애니메이션 컴포넌트 추가 */}
                    <p className={Schedule.successMessage}>스케줄이 성공적으로 등록되었습니다.</p>
                </div>
            </Modal>
            {/* ----------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            {selectedEvent && (
                <Modal isOpen={isDetailModal} onRequestClose={detailCloseModal} className={Schedule.modal} overlayClassName="modal-overlay">
                    <div className={Schedule.modalHeader}>
                        <button className={Schedule.closeButton} onClick={detailCloseModal}>X</button>
                        <h2 className={Schedule.modalTitle}>상세정보</h2>
                    </div>

                    <div className={Schedule.modalContent}>
                        {!isEditMode ? (
                            <>
                                {/* 상세 정보 보기 */}
                                <p>이름 : {selectedEvent.empName}</p>
                                <p>작업조 : {selectedEvent.workTeam}</p>
                                <p>근무 상태 : {selectedEvent.workStatus}</p>
                                <p>시작 시간 : {selectedEvent.checkIn?.split("T")[0]}</p>
                                <p>종료 시간 : {selectedEvent.checkOut?.split("T")[0]}</p>
                                <p>메모 : {selectedEvent.scheduleEtc}</p>

                                {/* 수정 버튼 */}
                                <button
                                    onClick={() => {
                                        setIsEditMode(true); // 수정 모드 활성화
                                        setEditEventData(selectedEvent); // 기존 데이터를 편집 데이터로 설정
                                    }}
                                    className={Schedule.editButton}
                                >
                                    수정
                                </button>
                            </>
                        ) : (
                            <>
                                {/* 수정 가능 상태 */}
                                <label>
                                    근무 상태 :
                                    <select name="workStatus" defaultValue={editEventData.workStatus} onChange={handleEditChange}>
                                        <option value="출근">출근</option>
                                        <option value="휴가">휴가</option>
                                        <option value="병가">병가</option>
                                    </select>
                                </label>
                                <label>
                                    시작 시간 :
                                    <input
                                        type="date"
                                        name="checkIn"
                                        defaultValue={editEventData.checkIn?.split("T")[0]}
                                        onChange={handleEditChange}
                                    />
                                </label>
                                <label>
                                    종료 시간 :
                                    <input
                                        type="date"
                                        name="checkOut"
                                        defaultValue={editEventData.checkOut?.split("T")[0]}
                                        onChange={handleEditChange}
                                    />
                                </label>
                                <label>
                                    메모 :
                                    <textarea name="scheduleEtc" defaultValue={editEventData.scheduleEtc} onChange={handleEditChange}></textarea>
                                </label>

                                {/* 저장 및 취소 버튼 */}
                                <button onClick={handleUpdateSchedule} className={Schedule.saveButton}>저장</button>
                                <button onClick={() => setIsEditMode(false)} className={Schedule.cancelButton}>취소</button>
                            </>
                        )}
                    </div>
                </Modal>
            )}
            {/* ----------------------------------------------------------------------------------------------------------------------------------------------------------- */}
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
