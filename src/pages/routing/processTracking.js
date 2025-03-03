import React, { useState, useEffect } from 'react';
import { routingApi } from '../../apis/routingApi/ProcessTrackingApi';
import '../../styles/routing/ProcessTracking.css'

const ProcessTrackingPage = () => {
  const [lotNo, setLotNo] = useState('');
  const [processStatus, setProcessStatus] = useState('');
  const [trackingList, setTrackingList] = useState([]);
  const [loading, setLoading] = useState(false);

  const processStages = [
    { name: '분쇄', title: '분쇄 공정' },
    { name: '당화', title: '당화 공정' },
    { name: '여과', title: '여과 공정' },
    { name: '끓임', title: '끓임 공정' },
    { name: '냉각', title: '냉각 공정' },
    { name: '발효', title: '발효 공정' },
    { name: '숙성', title: '숙성 공정' },
    { name: '숙성후여과', title: '숙성 후 여과 공정' },
    { name: '탄산 조정', title: '탄산 조정 공정' },
    { name: '패키징', title: '패키징 및 출하 공정' }
  ];

  // 공정 상태 옵션
  const processStatusOptions = [
    { value: '', label: '전체' },
    { value: '대기 중', label: '대기 중' },
    { value: '진행 중', label: '진행 중' },
    { value: '완료', label: '완료' }
  ];

  // 공정 현황 조회 함수
  const fetchProcessTracking = async () => {
    setLoading(true);
    try {
        const params = {};
        
        // 값이 있을 때만 파라미터에 추가
        if (lotNo.trim() !== '') {
            params.lotNo = lotNo.trim();
        }
        
        if (processStatus !== '') {
            params.processStatus = processStatus;
        }
        
        const result = await routingApi.getProcessTracking(params);
        setTrackingList(result);
    } catch (error) {
        // 사용자에게 보여줄 에러 메시지 설정
        const errorMessage = error.response?.data?.message 
            || error.message 
            || '공정 현황을 조회하는 중 오류가 발생했습니다.';
        
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
      case '대기 중': return 'bg-blue-100 text-blue-800';
      case '진행 중': return 'bg-green-100 text-green-800';
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
    // 여기서는 클래스 이름 통일을 위해 원래 이름 그대로 처리 (공백 유지)
    // CSS에서 다양한 선택자로 처리하므로 여기서는 변환하지 않음
    return (
      <div 
        key={tracking.lotNo} 
        className={`process-tracking-card`}
        data-status={tracking.processStatus}
        data-process={tracking.processName.replace(/ /g, '-')} // 공백을 하이픈으로 변환
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
  
      <div className="process-tracking-stages">
      {processStages.map((stage, index) => {
        // 해당 공정의 모든 트래킹 정보 필터링
        const stageTrackings = trackingList
          .filter(t => t.processName === stage.name);

        const isAnyProcessRunning = stageTrackings.some(t => t.processStatus === '진행 중');

        return (
          <div 
            key={stage.name} 
            className={`process-stage 
              ${stage.name.replace(/ /g, '-')}  
              ${isAnyProcessRunning ? 'active' : ''}`}
          >
            <div className="stage-header">
              <div className="stage-title-wrapper">
                <div className="stage-number">{index + 1}</div>
                <div className="stage-title">{stage.title}</div>
              </div>
            </div>
            <div className="stage-content">
              {stageTrackings.length > 0 ? (
                stageTrackings.map(tracking => (
                  <div 
                    key={tracking.lotNo} 
                    className="process-tracking-card"
                    data-status={tracking.processStatus}
                    data-process={tracking.processName.replace(/ /g, '-')}
                  >
                    <div className="card-header">
                      <span className="lot-no">{tracking.lotNo}</span>
                      <span className="status-badge">
                        {tracking.processStatus}
                      </span>
                    </div>
                    <div className="card-content">
                      <div className="time-info">
                        <p>시작: {formatDate(tracking.startTime)}</p>
                        <p>예상 종료: {formatDate(tracking.expectedEndTime)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-tracking-data">
                  해당 공정의 진행 정보가 없습니다.
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>

    {trackingList.length === 0 && !loading && (
      <div className="no-data">
        조회된 공정 현황이 없습니다.
      </div>
    )}
  </div>
);
};

export default ProcessTrackingPage;