import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Schedule from "./attendance.module.css";
import Modal from "react-modal";
import { fetchSchedule, createSchedule, fetchAllSchedules } from '../../apis/attendanceApi/attendanceApi'; // 서버 API 호출
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
                // 예상하지 못한 status 값이 들어왔을 때 기본 색상 제공
                return { backgroundColor: "#6c757d", textColor: "#fff" }; // 회색과 흰색 기본 색상
        }
    };


    useEffect(() => {
        const empId = "EMP002";

        // 직원의 전체 스케줄 가져오기
        fetchAllSchedules(empId)
            .then((schedules) => {
                console.log('응답받은 스케줄 리스트:', schedules);

                if (schedules && schedules.length > 0) {
                    setUserSchedule(schedules[0]);

                    // 2. 각 스케줄 데이터 확인
                    schedules.forEach((schedule, index) => {
                        console.log(`스케줄 ${index + 1}:`, schedule);
                    });

                    const calendarEvents = schedules.map((schedule) => {
                        const { workStatus, checkIn, checkOut, empName, workTeam, email, phone, profileImage } = schedule;
                        const startDate = new Date(checkIn);
                        const endDate = new Date(checkOut);

                        const color = getColor(workStatus);

                        return {
                            title: `${workStatus}`,
                            start: startDate.toISOString(),
                            end: endDate.toISOString(),
                            allDay: true,
                            description: `Work Team: ${workTeam}`,
                            extendedProps: {
                                email: email,
                                phone: phone,
                                profileImage: profileImage || "public/images/baba.png",
                            },
                            backgroundColor: color.backgroundColor,
                            textColor: color.textColor,
                        };
                    });

                    // 4. 생성된 calendarEvents 배열 출력

                    setEvents(calendarEvents);  // 한 번에 setEvents 호출
                    console.log('setEvents 호출 후 상태:', calendarEvents);
                }
            })
            .catch((error) => {
            });
    }, []);



    const calculateWorkingHours = () => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();  // 현재 달
        const currentYear = currentDate.getFullYear();  // 현재 년도

        // 해당 월의 첫 날과 마지막 날 계산
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

    // 현재 근무시간 업데이트 함수
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

    // totalWorkingHours와 currentWorkingHours를 화면에 출력
    const totalWorkingHours = calculateWorkingHours();

    const openModal = () => setIsModal(true);
    const closeModal = () => setIsModal(false);
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
            profileImage: newEvent.profileImage,
            workTeam: newEvent.workTeam,
            empId: "EMP002",
            remark: newEvent.scheduleEtc
        };

        // getDatesBetween 함수를 이용하여 주말 제외하고 날짜 범위 내 개별 날짜 반환
        const eventDates = getDatesBetween(newEvent.startDate, newEvent.endDate);  // 각 날짜에 대해 개별적으로 이벤트 생성

        // API 호출하여 DB에 데이터 저장
        createSchedule(scheduleData)
            .then((data) => {
                console.log('서버에서 받은 데이터:', data);

                // 서버에 데이터 저장 후 모든 스케줄을 다시 받아옵니다
                fetchAllSchedules("EMP002")  // EMP001로 스케줄 가져오기
                    .then((schedules) => {
                        console.log('새로고침 후 받은 스케줄 리스트:', schedules);

                        if (schedules && schedules.length > 0) {
                            // 각 스케줄에 대해 이벤트를 반환하고 날짜별로 개별 띠를 생성
                            const calendarEvents = schedules.map((schedule) => {
                                const { workStatus, checkIn, checkOut, empName, workTeam, email, phone, profileImage } = schedule;
                                const startDate = new Date(checkIn);
                                const endDate = new Date(checkOut);

                                // 각 날짜별로 띠를 분리할 때, 주말을 제외하고 개별 이벤트를 생성
                                const dates = getDatesBetween(startDate, endDate);  // 주말을 제외한 각 날짜 반환

                                // 주어진 날짜들에 대해 각각 이벤트 객체를 생성
                                return dates.map((date) => {
                                    const color = getColor(workStatus);
                                    return {
                                        title: `${workStatus}`,
                                        start: new Date(date).toISOString(),
                                        end: new Date(date).toISOString(),
                                        allDay: true,
                                        description: `Work Team: ${workTeam}`,
                                        extendedProps: {
                                            email: email,
                                            phone: phone,
                                            profileImage: profileImage || "public/images/baba.png",
                                        },
                                        backgroundColor: color.backgroundColor,
                                        textColor: color.textColor,
                                    };
                                });
                            });

                            // 모든 이벤트를 한 번에 업데이트
                            setEvents(calendarEvents.flat());  // 2D 배열을 1D 배열로 변환
                            console.log('setEvents 호출 후 상태:', calendarEvents.flat());
                        }
                    })
                    .catch((error) => {
                        console.error("스케줄을 가져오는 중 오류 발생:", error);
                    });

                closeModal();
                setIsSuccessModal(true);
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

    const handleEventClick = (info) => {
        const event = info.event;  // 클릭된 이벤트 객체
        console.log('클릭된 이벤트:', info.event);
        console.log('클릭된 이벤트의 extendedProps:', info.event.extendedProps);

        // 필요한 데이터 추출
        const { title, start, end, extendedProps } = event;

        const formattedStart = start instanceof Date ? start.toLocaleString() : "유효하지 않은 시작일";
        const formattedEnd = end instanceof Date ? end.toLocaleString() : "유효하지 않은 종료일";

        // extendedProps에 포함된 데이터
        const workStatus = extendedProps?.workStatus || "미정";
        const workTeam = extendedProps?.workTeam || "정보없음";
        const empName = extendedProps?.empName || "이름없음";
        const email = extendedProps?.email || "이메일없음";
        const phone = extendedProps?.phone || "전화번호없음";

        // selectedEvent 데이터 업데이트
        setSelectedEvent({
            title,
            start: formattedStart,
            end: formattedEnd,
            workStatus,
            workTeam,
            empName,
            email,
            phone,
        });
        console.log('선택된 이벤트:', {
            title,
            start: formattedStart,
            end: formattedEnd,
            workStatus,
            workTeam,
            empName,
            email,
            phone,
        });

        // 모달 열기
        detailOpenModal();
    };

    const closeSuccessModal = () => setIsSuccessModal(false); // 성공 모달 닫는 함수

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
                        <input type="date" name="startDate" value={newEvent.startDate} onChange={handleInputChange} className={Schedule.formInput} />
                    </label><br />
                    <label className={Schedule.formLabel}>
                        종료일 :&nbsp;&nbsp;
                        <input type="date" name="endDate" value={newEvent.endDate} onChange={handleInputChange} className={Schedule.formInput} />
                    </label><br />
                    <label className={Schedule.formLabel}>
                        근무 상태 :&nbsp;&nbsp;
                        <select name="workStatus" value={newEvent.workStatus} onChange={handleInputChange} className={Schedule.formInput}>
                            <option value="출근">출근</option>
                            <option value="휴가">휴가</option>
                            <option value="병가">병가</option>
                            <option value="공휴일">공휴일</option>
                        </select><br />
                        <label className={Schedule.formLabelRemarks}>
                            특이사항 :&nbsp;&nbsp;
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
            {/* 이벤트 상세정보 모달 */}
            {selectedEvent && (
                <Modal isOpen={isDetailModal} onRequestClose={detailCloseModal} className={Schedule.modal} overlayClassName="modal-overlay">
                    <div className={Schedule.modalHeader}>
                        <button className={Schedule.closeButton} onClick={detailCloseModal}>X</button>
                        <h2 className={Schedule.modalTitle}>상세정보</h2>
                    </div>

                    <div className={Schedule.modalContent}>
                        <p>이름 : {selectedEvent.empName}</p>
                        <p>작업조 : {selectedEvent.workTeam}</p>
                        <p>근무 상태 : {selectedEvent.workStatus}</p>
                        <p>시작 시간 : {selectedEvent.start}</p>
                        <p>종료 시간 : {selectedEvent.end}</p>
                        <p>이메일 : {selectedEvent.email}</p>
                        <p>전화번호 : {selectedEvent.phone}</p>
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
