import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Filter, AlertCircle } from 'lucide-react';
import "../../styles/productionPlan/BreweryCalendar.css";

const PremiumBreweryCalendar = ({ events = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarView, setCalendarView] = useState('week');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // 날짜 관련 유틸리티 함수
  const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };
  
  const getDayName = (date) => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return days[new Date(date).getDay()];
  };
  
  const generateWeekDays = (startDate) => {
    const result = [];
    const start = new Date(startDate);
    // 주의 시작일을 월요일로 조정
    const dayOfWeek = start.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    start.setDate(start.getDate() + diff);
    
    for (let i = 0; i < 7; i++) {
      const current = new Date(start);
      current.setDate(current.getDate() + i);
      result.push(formatDate(current));
    }
    
    return result;
  };
  
  // 주간 뷰 일자 생성
  const weekDays = generateWeekDays(currentDate);
  
  // 주간 뷰의 시간 범위 (7:00 ~ 20:00)
  const hourRange = Array.from({ length: 14 }, (_, i) => i + 7);
  
  // 이벤트 클릭 핸들러
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowDetailModal(true);
  };
  
  // 다음/이전 주 이동 핸들러
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };
  
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (calendarView === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };
  
  // 특정 날짜/시간에 해당하는 이벤트 찾기
  const getEventsForTimeSlot = (date, hour) => {
    const slotStart = new Date(`${date}T${hour.toString().padStart(2, '0')}:00:00`);
    const slotEnd = new Date(`${date}T${hour.toString().padStart(2, '0')}:59:59`);
    
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      // 이벤트가 시간 슬롯에 걸쳐 있는지 확인
      return (
        (eventStart >= slotStart && eventStart < slotEnd) ||
        (eventEnd > slotStart && eventEnd <= slotEnd) ||
        (eventStart <= slotStart && eventEnd >= slotEnd)
      );
    });
  };
  
  // 시간 포맷팅
  const formatTimeDisplay = (date) => {
    const d = new Date(date);
    const hours = d.getHours();
    const minutes = d.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="calendar-container">
      {/* 캘린더 헤더 */}
      <div className="calendar-header">
        <div className="calendar-header-top">
          <div className="calendar-title">
            <Calendar className="calendar-icon" />
            <h3>생산 공정 일정</h3>
          </div>
          
          <div className="calendar-controls">
            <button 
              onClick={navigatePrevious}
              className="calendar-button"
            >
              <ChevronLeft />
            </button>
            
            <button
              onClick={() => setCurrentDate(new Date())}
              className="today-button"
            >
              오늘
            </button>
            
            <button 
              onClick={navigateNext}
              className="calendar-button"
            >
              <ChevronRight />
            </button>
          </div>
        </div>
        
        <div className="calendar-header-bottom">
          <div className="view-buttons">
            <button 
              onClick={() => setCalendarView('day')}
              className={`view-button ${calendarView === 'day' ? 'active' : ''}`}
            >
              일간
            </button>
            <button 
              onClick={() => setCalendarView('week')}
              className={`view-button ${calendarView === 'week' ? 'active' : ''}`}
            >
              주간
            </button>
          </div>
          
          <div>
            <span className="date-range">
              {calendarView === 'week'
                ? `${weekDays[0]} ~ ${weekDays[6]}`
                : formatDate(currentDate)
              }
            </span>
          </div>
        </div>
      </div>
      
      {/* 주간 뷰 */}
      {calendarView === 'week' && (
        <div className="calendar-content">
          <div className="calendar-grid">
            {/* 요일 헤더 */}
            <div className="calendar-day-header">
              <div className="day-header-cell">시간</div>
              {weekDays.map(day => (
                <div key={day} className="day-header-cell">
                  {day.split('-')[2]}일 ({getDayName(day)})
                </div>
              ))}
            </div>
            
            {/* 시간 행 */}
            {hourRange.map(hour => (
              <div key={hour} className="time-row">
                {/* 시간 셀 */}
                <div className="time-cell">
                  {hour}:00
                </div>
                
                {/* 각 요일에 대한 셀 */}
                {weekDays.map(day => {
                  const timeSlotEvents = getEventsForTimeSlot(day, hour);
                  
                  return (
                    <div key={`${day}-${hour}`} className="day-cell">
                      {timeSlotEvents.length > 0 && (
                        <div className="event-list">
                          {timeSlotEvents.map(event => (
                            <div 
                              key={event.id}
                              className="event"
                              style={{ 
                                backgroundColor: event.backgroundColor || '#E3F2FD',
                                color: event.textColor || '#1E40AF'
                              }}
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="event-title">{event.productName} - {event.process}</div>
                              <div className="event-info">
                                라인 {event.lineNo} | 배치 {event.batchNo}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* 일간 뷰 */}
      {calendarView === 'day' && (
        <div className="day-view">
          <div className="day-container">
            <div className="day-header">
              {formatDate(currentDate)} ({getDayName(currentDate)})
            </div>
            
            <div className="day-content">
              {hourRange.map(hour => {
                const timeSlotEvents = getEventsForTimeSlot(formatDate(currentDate), hour);
                
                return (
                  <div key={hour} className="time-slot">
                    <div className="time-label">
                      {hour}:00
                    </div>
                    <div className="time-content">
                      {timeSlotEvents.length > 0 ? (
                        <div className="time-event-list">
                          {timeSlotEvents.map(event => (
                            <div 
                              key={event.id}
                              className="time-event"
                              style={{ 
                                backgroundColor: event.backgroundColor || '#E3F2FD',
                                color: event.textColor || '#1E40AF'
                              }}
                              onClick={() => handleEventClick(event)}
                            >
                              <div className="time-event-title">{event.productName} - {event.process}</div>
                              <div className="time-event-time">
                                {formatTimeDisplay(event.start)} - {formatTimeDisplay(event.end)}
                              </div>
                              <div className="time-event-info">
                                라인 {event.lineNo} | 배치 {event.batchNo}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="time-slot-empty"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      {/* 범례 */}
      <div className="legend">
        <div className="legend-header">
          <AlertCircle className="legend-icon" />
          <h4 className="legend-title">공정 범례</h4>
        </div>
        <div className="legend-items">
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#E3F2FD' }}></div>
            <span>분쇄</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FFEBEE' }}></div>
            <span>당화</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#E8F5E9' }}></div>
            <span>여과</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#FFF8E1' }}></div>
            <span>발효</span>
          </div>
          <div className="legend-item">
            <div className="legend-color" style={{ backgroundColor: '#F3E5F5' }}></div>
            <span>숙성</span>
          </div>
        </div>
      </div>
      
      {/* 이벤트 상세 모달 */}
      {showDetailModal && selectedEvent && (
        <>
          <div 
            className="modal-backdrop"
            onClick={() => setShowDetailModal(false)}
          ></div>
          <div className="modal">
            <h3 className="modal-title">{selectedEvent.productName} - {selectedEvent.process}</h3>
            <div className="modal-content">
              <p><span className="modal-label">맥주 타입:</span> {selectedEvent.beerType}</p>
              <p><span className="modal-label">라인 번호:</span> {selectedEvent.lineNo}</p>
              <p><span className="modal-label">배치 번호:</span> {selectedEvent.batchNo}</p>
              <p><span className="modal-label">시작:</span> {new Date(selectedEvent.start).toLocaleString()}</p>
              <p><span className="modal-label">종료:</span> {new Date(selectedEvent.end).toLocaleString()}</p>
            </div>
            <button 
              className="modal-button"
              onClick={() => setShowDetailModal(false)}
            >
              닫기
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PremiumBreweryCalendar;