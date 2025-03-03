import React, { useState, useEffect } from 'react';
import { routingApi } from '../../apis/routingApi/ProcessTrackingApi';
import '../../styles/routing/ProcessTracking.css'

const ProcessTrackingPage = () => {
  const [lotNo, setLotNo] = useState('');
  const [processStatus, setProcessStatus] = useState('');
  const [trackingList, setTrackingList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 공정 상태 옵션
  const processStatusOptions = [
    { value: '', label: '전체' },
    { value: '대기중', label: '대기중' },
    { value: '진행중', label: '진행중' },
    { value: '완료', label: '완료' }
  ];

  // 공정 현황 조회 함수
  const fetchProcessTracking = async () => {
    setLoading(true);
    try {
        const params = { 
            lotNo: lotNo.trim(), 
            processStatus: processStatus 
        };
        const result = await routingApi.getProcessTracking(params);
        setTrackingList(result);
    } catch (error) {
        // 사용자에게 보여줄 에러 메시지 설정
        const errorMessage = error.response?.data?.message 
            || error.message 
            || '공정 현황을 조회하는 중 오류가 발생했습니다.';
        
        // 에러 상태 설정 (상태 관리 라이브러리 사용 시)
        // setError(errorMessage);
        
        console.error('공정 현황 조회 실패:', errorMessage);
        
        // 선택적으로 사용자에게 알림
        alert(errorMessage);
    } finally {
        setLoading(false);
    }
};

  // 초기 로딩
  useEffect(() => {
    fetchProcessTracking();
  }, []);

  // 상태별 색상 결정 함수
  const getStatusColor = (status) => {
    switch(status) {
      case '대기중': return 'bg-blue-100 text-blue-800';
      case '진행중': return 'bg-green-100 text-green-800';
      case '완료': return 'bg-gray-100 text-gray-800';
      default: return 'bg-white text-black';
    }
  };

  const formatDate = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 5) return '미정';
    
    try {
      // 배열에서 날짜 생성 [year, month, day, hour, minute]
      const [year, month, day, hour, minute] = dateArray;
      
      // 월은 0부터 시작하므로 month - 1 필요
      const parsedDate = new Date(year, month - 1, day, hour, minute);
      
      return parsedDate.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return '미정';
    }
  };

  
  // 공정 카드 렌더링
  const renderProcessCard = (tracking) => {
    console.log('Process Name:', tracking.processName);
      // 전체 tracking 객체 로깅
  console.log('Full Tracking Object:', tracking);
  
  // 시간 관련 필드 개별 로깅
  console.log('Start Time:', tracking.startTime);
  console.log('Expected End Time:', tracking.expectedEndTime);
    const processMap = {
      '분쇄': '분쇄',
      '당화': '당화',
      '여과': '여과',
      '끓임': '끓임',
      '냉각': '냉각',
      '발효': '발효',
      '숙성': '숙성',
      '숙성후여과': '숙성후여과',
      '탄산 조정': '탄산조정',
      '패키징': '패키징'
    };
  
    const processClassName = processMap[tracking.processName] || tracking.processName;
  
    return (
        <div 
          key={tracking.lotNo} 
          className={`process-tracking-card ${processClassName} ${getStatusColor(tracking.processStatus)}`}
        >
          <div className="card-header">
            <span className="lot-no">{tracking.lotNo}</span>
            <span className="status-badge">
              {tracking.processStatus}
            </span>
          </div>
          <div className="card-content">
            <h3>{tracking.processName}</h3>
            <div className="time-info">
              <p>시작: {formatDate(tracking.startTime)}</p>
              <p>예상 종료: {formatDate(tracking.expectedEndTime)}</p>
            </div>
          </div>
        </div>
      );
    };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchProcessTracking();
    }
  };

  return (
    <div className="productionPlan-container">
      <h1 className="page-title">공정 현황 추적</h1>
      
      <div className="search-bar">
        <div className="search-filter">
          <label>LOT 번호</label>
          <input 
            type="text" 
            placeholder="LOT 번호 입력" 
            value={lotNo}
            onChange={(e) => setLotNo(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        </div>
        
        <div className="search-filter">
          <label>진행 상태</label>
          <select 
            value={processStatus}
            onChange={(e) => setProcessStatus(e.target.value)}
          >
            {processStatusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <button 
          onClick={fetchProcessTracking} 
          disabled={loading}
        >
          {loading ? '조회 중...' : '조회'}
        </button>
      </div>

      <div className="process-tracking-grid">
        {trackingList.length > 0 ? (
          trackingList.map(renderProcessCard)
        ) : (
          <div className="no-data">
            {loading ? '데이터를 불러오는 중...' : '조회된 공정 현황이 없습니다.'}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcessTrackingPage;