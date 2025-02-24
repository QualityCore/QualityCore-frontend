import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import Schedule from "./attendance.module.css";
import Modal from "react-modal";
import { fetchSchedule, createSchedule, fetchAllSchedules, updateSchedule, deleteSchedule  } from '../../apis/attendanceApi/attendanceApi'; // 서버 API 호출
import SuccessAnimation from "../../lottie/SuccessNotification";
import WarningAnimation from "../../lottie/WarningNotification";

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
    const [isWarningOpen, setIsWarningOpen] = useState(false); // 경고모달
    const [editEventData, setEditEventData] = useState(null); // 수정 데이터를 위한 상태
    const [isEditMode, setIsEditMode] = useState(false); // 수정 모드 여부
    const [minCheckOutDate, setMinCheckOutDate] = useState(""); // 
    const [minEndDate, setMinEndDate] = useState("");
    const [modalMessage, setModalMessage] = useState(''); // 성공메시지
    const [warningMessage, setWarningMessage] = useState(''); // 경고메시지

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
                return {
                    backgroundColor: "#28a745", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "5px", 
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                };
            case "휴가":
                return {
                    backgroundColor: "#007bff", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "5px", 
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                };
            case "병가":
                return {
                    backgroundColor: "#ffc107", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "5px", 
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                };
            case "기타":
                return {
                    backgroundColor: "#f44336", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "5px", 
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                };
            default:
                return {
                    backgroundColor: "#6c757d", 
                    color: "#fff", 
                    border: "none", 
                    borderRadius: "5px", 
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)"
                };
        }
    };    

    useEffect(() => {
        const empId = "EMP001"; // 나중에 로그인한 유저 가져와야함!!!!!
    
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
                                textColor: color.textColor,  // `color`를 `textColor`로 적용
                                border: color.border,
                                borderRadius: color.borderRadius,
                                boxShadow: color.boxShadow
                            };
                        });
                    });
    
                    setEvents(calendarEvents.flat());  // 한 번에 setEvents 호출
                }
            });
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
        if (name === "startDate") {
            setMinEndDate(value); // 시작 날짜가 변경될 때 최소 종료 날짜 업데이트
        }
    };

    // 수정 데이터 변경 핸들러
    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditEventData({ ...editEventData, [name]: value });
        if (name === "checkIn") {
            setMinCheckOutDate(value); // 시작 날짜 변경 시 최소 종료 날짜 업데이트
        }
    };

   // 스케줄 수정
const handleUpdateSchedule = async () => {
    if (!editEventData || !selectedEvent) {
        setWarningMessage("수정할 데이터가 없거나, 선택된 이벤트가 없습니다.");
        setIsWarningOpen(true);
        return;
    }

    // checkIn과 checkOut을 Date 객체로 변환
    const startDate = new Date(editEventData.checkIn);
    const endDate = new Date(editEventData.checkOut);

    if (endDate.getTime() < startDate.getTime()) {
        setWarningMessage("종료 날짜는 시작 날짜보다 이후여야 합니다.");
        setIsWarningOpen(true);
        return;
    }

     // 출근 시간을 오늘로 제한
if (editEventData.workStatus === "출근") {
    const selectedCheckIn = new Date(editEventData.checkIn);
    const selectedCheckOut = new Date(editEventData.checkOut);

    // 시작일과 종료일이 동일한 날짜여야 한다.
    if (selectedCheckIn.toDateString() !== selectedCheckOut.toDateString()) {
        setWarningMessage("출근 시작일과 종료일은 동일한 날짜여야 합니다.");
        setIsWarningOpen(true);
        return;
    }

    // 동일한 날짜에 이미 출근 기록이 있는지 확인
    const existingEvent = events.find(event => {
        const eventDate = new Date(event.start);
        return eventDate.toDateString() === selectedCheckIn.toDateString() && event.title === "출근";
    });

    // 이미 출근 기록이 있으면 새로운 기록 추가를 방지
    if (existingEvent) {
        setWarningMessage("이미 출근 기록이 존재합니다.");
        setIsWarningOpen(true);
        return;
    }
}

    try {
        const updatedData = {
            scheduleId: selectedEvent.extendedProps.scheduleId,
            checkIn: editEventData.checkIn || selectedEvent.checkIn,
            checkOut: editEventData.checkOut || selectedEvent.checkOut,
            workStatus: editEventData.workStatus || selectedEvent.workStatus,
            scheduleEtc: editEventData.scheduleEtc || selectedEvent.scheduleEtc,
        };

        const response = await updateSchedule(updatedData);

        if (response) {
            const updatedSchedules = await fetchAllSchedules("EMP001"); // 최신 스케줄 가져오기
            const calendarEvents = updatedSchedules.flatMap((schedule) => {
                const { workStatus, checkIn, checkOut, empName, workTeam, email, phone, profileImage, scheduleId, scheduleEtc } = schedule;
                const startDate = new Date(checkIn);
                const endDate = new Date(checkOut);
                const color = getColor(workStatus);

                // 주말 제외 날짜들 계산
                const dates = getDatesBetween(startDate, endDate);

                return dates.map((date) => ({
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
                        email,
                        phone,
                        profileImage: profileImage || "public/images/baba.png",
                        scheduleEtc
                    },
                    backgroundColor: color.backgroundColor,
                    textColor: color.textColor,
                    border: color.border,
                    borderRadius: color.borderRadius,
                    boxShadow: color.boxShadow
                }));
            });

            setEvents(calendarEvents); // 캘린더 이벤트 업데이트
            detailCloseModal(); // 모달 닫기
            setModalMessage("스케줄이 성공적으로 변경되었습니다.");
            setIsSuccessModal(true); // 성공 모달 띄우기
        }
    } catch (error) {
        // Removed console.log
    }
};


    // 스케줄 등록
const handleSubmit = async () => {  // async 추가
    // 1. 필수 입력값 체크
    if (!newEvent.startDate || !newEvent.workStatus || (newEvent.workStatus !== '출근' && !newEvent.endDate)) {
        setWarningMessage("모든 필수 입력값을 입력해주세요!");
        setIsWarningOpen(true);
        return;
    }

    // 2. 종료일이 시작일보다 빠를 경우 체크
    if (newEvent.endDate && newEvent.startDate > newEvent.endDate) {
        setWarningMessage("종료일은 시작일보다 빠를 수 없습니다.");
        setIsWarningOpen(true);
        return;
    }

    // 3. 중복 일정 확인
    const selectedDate = new Date(newEvent.startDate).toISOString().split("T")[0];
    const existingEvent = events.find(
        (event) => new Date(event.start).toISOString().split("T")[0] === selectedDate
    );

    if (existingEvent) {
        setWarningMessage("해당 날짜에 스케줄이 존재합니다.");
        setIsWarningOpen(true);
        return;
    }

     // 주말(토요일, 일요일) 체크
     const checkWeekend = (date) => {
        const day = new Date(date).getDay(); // 0(일요일) ~ 6(토요일)
        return day === 0 || day === 6;
    };

    // 시작일과 종료일이 모두 주말이라면 등록 막기
    if (checkWeekend(newEvent.startDate) && checkWeekend(newEvent.endDate)) {
        setWarningMessage("주말은 등록할 수 없습니다.");
        setIsWarningOpen(true);
        return;
    }

    // 4. 주말만 등록하는 경우 체크
    if (checkWeekend(newEvent.startDate) && !newEvent.endDate) {
        setWarningMessage("주말은 등록할 수 없습니다.");
        setIsWarningOpen(true);
        return;
    }
    if (checkWeekend(newEvent.endDate) && !newEvent.startDate) {
        setWarningMessage("주말은 등록할 수 없습니다.");
        setIsWarningOpen(true);
        return;
    }

    const scheduleData = {
        scheduleId: newEvent.scheduleId,
        checkIn: newEvent.startDate,
        checkOut: newEvent.workStatus === '출근' ? newEvent.startDate : newEvent.endDate,
        workStatus: newEvent.workStatus,
        empName: newEvent.empName,
        profileImage: newEvent.profileImage,
        workTeam: newEvent.workTeam,
        empId: "EMP001",
        scheduleEtc: newEvent.scheduleEtc
    };

    try {
        await createSchedule(scheduleData);  // createSchedule 호출도 async로 처리
        const schedules = await fetchAllSchedules("EMP001");  // fetchAllSchedules 호출도 async로 처리

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
                        textColor: color.textColor,  // `color`를 `textColor`로 적용
                        border: color.border,
                        borderRadius: color.borderRadius,
                        boxShadow: color.boxShadow
                    };
                });
            });

            setEvents(calendarEvents.flat());  // 한 번에 setEvents 호출
        }

        setIsModal(false);
        setModalMessage("스케줄이 성공적으로 등록되었습니다.");
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

    } catch (error) {
        // 에러 처리
        console.error(error); // 에러 처리, 나중에 수정 필요
    }
};

    // 스케줄 상세정보 보기
    const handleEventClick = async (info) => {
        const { event } = info;
        const { title, extendedProps } = event;
        const { scheduleId, empName, scheduleEtc, checkOut } = extendedProps;
    
        if (!scheduleId || scheduleId.trim() === "") return;
    
        const { workStatus = "미정", workTeam = "정보없음", email = "이메일없음", phone = "전화번호없음" } = extendedProps || {};
    
        try {
            // scheduleId를 바탕으로 fetchSchedule 호출
            const scheduleData = await fetchSchedule(scheduleId);
            setSelectedEvent({
                title,
                workStatus,
                workTeam,
                empName,
                email,
                phone,
                scheduleEtc,
                checkIn: scheduleData?.checkIn || "시간 없음",
                checkOut: scheduleData?.checkOut || "시간 없음",
                extendedProps: extendedProps  // extendedProps 유지
            });
    
            setEditEventData({
                checkIn: scheduleData?.checkIn || null,
                checkOut: scheduleData?.checkOut || null,
                workStatus: scheduleData?.workStatus || workStatus,
                scheduleEtc: scheduleData?.scheduleEtc || scheduleEtc,
            });
    
            detailOpenModal(); // 모달 열기
        } catch (error) {
            // 에러 처리 없이 단순 리턴
        }
    };
    
    const closeSuccessModal = () => setIsSuccessModal(false);

    // 스케줄 삭제
    const handleDeleteSchedule = async (scheduleId) => {
        if (!scheduleId) return;
    
        try {
            const deletedSchedule = await deleteSchedule(scheduleId);
    
            if (deletedSchedule && deletedSchedule.code === 200) {
                setModalMessage("스케줄이 성공적으로 삭제되었습니다.");
                setIsSuccessModal(true);
                detailCloseModal();
    
                // 스케줄 삭제 후 캘린더 이벤트에서 해당 스케줄을 제거
                setEvents((prevEvents) => prevEvents.filter(event => event.extendedProps.scheduleId !== scheduleId));
    
                const empId = "EMP001";  // 현재 로그인한 사용자 ID
    
                // 스케줄 목록 새로 가져오기
                fetchAllSchedules(empId)
                    .then((schedules) => {
                        if (schedules && schedules.length > 0) {
                            setUserSchedule(schedules[0]);
    
                            const calendarEvents = schedules.map((schedule) => {
                                const { scheduleId, workStatus, checkIn, checkOut, empName, workTeam, email, phone, profileImage, scheduleEtc } = schedule;
                                const startDate = new Date(checkIn);
                                const endDate = new Date(checkOut);
                                const color = getColor(workStatus);
    
                                const dates = getDatesBetween(startDate, endDate);
    
                                return dates.map((date) => ({
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
                                        email,
                                        phone,
                                        profileImage: profileImage || "public/images/baba.png",
                                        scheduleEtc
                                    },
                                    backgroundColor: color.backgroundColor,
                                    textColor: color.textColor,
                                    border: color.border,
                                    borderRadius: color.borderRadius,
                                    boxShadow: color.boxShadow
                                }));
                            });
    
                            setEvents(calendarEvents.flat());
                        }
                    });
            }
        } catch (error) {
            // 여기에 에러 처리 없이 그냥 리턴
        }
    };
    
    return (
        <>
            {/* ----------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            <div style={{ display: "flex", alignItems: "center", marginTop: "30px" }}>
                <div className={Schedule.profileBar}>
                    <div className={Schedule.leftContent}>
                        <img className={Schedule.profile} src={userSchedule?.profileImage || "../images/baba.png"} alt="프로필사진" />
                        <p className={Schedule.profileName}><b>{userSchedule?.empName}</b>&nbsp;님</p>
                        <p className={Schedule.profileName1}>환영합니다.</p>
                    </div>
                    <div className={Schedule.divider}></div>
                    <div className={Schedule.rightContent}>
                        <h3 style={{ color: 'red' }}>{noAccidentDays}&nbsp;일 무사고</h3>
                        <p>{currentDateTime}</p>
                        <p><b>오늘도 안전 무사고!!</b></p>
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
                    <label className={Schedule.formLabel}>시작일 :&nbsp;&nbsp;</label><br />
                        <input
                            type="date"
                            name="startDate"
                            value={newEvent.startDate}
                            onChange={handleInputChange}
                            className={Schedule.formInput}
                        />
                  <br />
                    {/* 출근 상태일 때 종료일 필드를 렌더링하지 않도록 조건 추가 */}
                    {newEvent.workStatus !== '출근' && (
  <>
    <label className={Schedule.formLabel}>종료일 :&nbsp;&nbsp;</label><br />
    <input
      type="date"
      name="endDate"
      value={newEvent.endDate}
      onChange={handleInputChange}
      className={Schedule.formInput}
      min={minEndDate}
    />
    <br />
  </>
)}
                    <label className={Schedule.formLabel}>근무 상태 :&nbsp;&nbsp;</label> <br />
                        <select
                            name="workStatus"
                            value={newEvent.workStatus}
                            onChange={handleInputChange}
                            className={Schedule.formInput}
                        >
                            <option value="출근">출근</option>
                            <option value="휴가">휴가</option>
                            <option value="병가">병가</option>
                            <option value="기타">기타</option>
                        </select><br />
                        <label className={Schedule.formLabel}>특이사항 :&nbsp;&nbsp;</label>
                        <br />
                            <textarea
                                name="scheduleEtc"
                                value={newEvent.scheduleEtc}
                                onChange={handleInputChange}
                                className={Schedule.formInput}
                                placeholder="특이사항을 입력하세요"
                            />
                    <br />
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
                    <p className={Schedule.successMessage}>{modalMessage}</p>
                </div>
            </Modal>
            {/* ----------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            {/* 경고 알림 모달 */}
            <Modal
  isOpen={isWarningOpen}  // 올바른 상태 변수 사용
  onRequestClose={() => setIsWarningOpen(false)}  // 닫기 핸들러 수정
  className={Schedule.warningModal}
  overlayClassName="modal-overlay"
>
  <div className={Schedule.warningModalHeader}>
    <button className={Schedule.warningCloseButton} onClick={() => setIsWarningOpen(false)}>X</button>
  </div>
  <div className={Schedule.warningModalContent}>
    <WarningAnimation /> {/* 경고 애니메이션 추가 */}
    <p className={Schedule.warningMessage}>{warningMessage}</p>  {/* 메시지 변수 수정 */}
  </div>
</Modal>

            {/* ----------------------------------------------------------------------------------------------------------------------------------------------------------- */}
            {selectedEvent && (
    <Modal isOpen={isDetailModal} onRequestClose={detailCloseModal} className={Schedule.modal} overlayClassName="modal-overlay">
        <div className={Schedule.modalHeader}>
            <button className={Schedule.closeButton} onClick={detailCloseModal}>X</button>
            {!isEditMode && <h2 className={Schedule.modalTitle}>스케줄</h2>}
            {isEditMode && <h2 className={Schedule.modalTitle}>스케줄 수정</h2>}
        </div>

        <div className={Schedule.modalContent}>
            {/* 상세 정보 보기 */}
            <div className={Schedule.detailView}>
                {!isEditMode ? (
                    <>
                        <p><b>이름 : </b>{selectedEvent.empName}</p>
                        <p><b>작업조 : </b>{selectedEvent.workTeam}</p>
                        <p><b>근무 상태 : </b>{selectedEvent.workStatus}</p>
                        <p><b>시작 시간 : </b>{selectedEvent.checkIn ? selectedEvent.checkIn : "시간 없음"}</p>
                        <p><b>종료 시간 : </b>{selectedEvent.checkOut ? selectedEvent.checkOut : "시간 없음"}</p>
                        <p><b>메모 : </b>{selectedEvent.scheduleEtc}</p>

                        {/* 수정 버튼 */}
                        <button
                            onClick={() => { setIsEditMode(true);
                                            setEditEventData(selectedEvent);}}
                            className={Schedule.editButton}
                        >수정</button>
                        <button
    className={Schedule.editRemoveButton}
    onClick={() => {handleDeleteSchedule(selectedEvent.extendedProps.scheduleId);  // 삭제 시 해당 스케줄 ID 전달
}}
>
    삭제
</button>
                    </>
                ) : null}
            </div>

            {/* 수정 가능 상태 */}
            <div className={Schedule.editView}>
                {isEditMode ? (
                    <>
                        <label>
                            근무 상태 :
                        </label>
                            <select name="workStatus" defaultValue={editEventData.workStatus} onChange={handleEditChange}>
                                <option value="출근">출근</option>
                                <option value="휴가">휴가</option>
                                <option value="병가">병가</option>
                                <option value="기타">기타</option>
                            </select>
                        <label>
                            시작 시간 :
                        </label>
                            <input
                                type="date"
                                name="checkIn"
                                defaultValue={editEventData.checkIn?.split("T")[0]}
                                onChange={handleEditChange}
                            />
                        <label>
                            종료 시간 : 
                        </label>
                            <input
                                type="date"
                                name="checkOut"
                                defaultValue={editEventData.checkOut?.split("T")[0]}
                                onChange={handleEditChange}
                                min={minCheckOutDate}
                            />
                        <label className={Schedule.textLabel}>메모 :</label>
                        <textarea name="scheduleEtc" defaultValue={editEventData.scheduleEtc} onChange={handleEditChange}></textarea>

                        {/* 저장 및 취소 버튼 */}
                        <button onClick={handleUpdateSchedule} className={Schedule.saveButton}>저장</button>
                        <button onClick={() => setIsEditMode(false)} className={Schedule.cancelButton}>취소</button>
                    </>
                ) : null}
            </div>
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
                    eventDidMount={(info) => {
                        // 이벤트가 렌더링 된 후 스타일을 직접 적용
                        const { backgroundColor, textColor, borderColor, borderRadius, boxShadow } = info.event.extendedProps;
                
                        const eventElement = info.el;
                        eventElement.style.backgroundColor = backgroundColor;
                        eventElement.style.color = textColor;
                        eventElement.style.borderColor = borderColor;
                        eventElement.style.borderRadius = borderRadius;
                        eventElement.style.boxShadow = boxShadow;
                      }}
                />
            </div>
        </>
    );
};
export default Attendance;