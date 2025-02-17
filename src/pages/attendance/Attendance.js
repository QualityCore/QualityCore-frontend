import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Attendance.css';

const Attendance = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8080/api/schedule')
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
            .catch((error) => console.error('Error fetching schedules:', error));
    }, []);

    return (
        <>
            <div style={{ display: "flex", alignItems: "center", marginTop: "30px" }}>
                <div className="profileBar"></div>
                <div className="tableBar"></div>
            </div>
            <div>
                <div className="maiBar">
                    <FullCalendar
                        className="calendar"
                        headerToolbar={{
                            left: 'prev,next today',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek',
                        }}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        events={events}
                        eventClick={(info) => {
                            alert(`Event: ${info.event.title}\nEmail: ${info.event.extendedProps.email}\nPhone: ${info.event.extendedProps.phone}`);
                        }}
                        editable={true}
                        droppable={true}
                        locale="ko"
                        height="100%" // 캘린더 높이를 부모 컨테이너에 맞춤
                        expandRows={true} // 행 높이를 균일하게 설정
                    />
                </div>
            </div>
        </>
    );
};

export default Attendance;
