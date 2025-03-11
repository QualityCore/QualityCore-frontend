import React, { useState, useEffect } from "react";
import "../../styles/productionPlan/ProductionPlan.css";
import { fetchProductionPlans, updatePlanStatus } from "../../apis/productionPlanApi/ProductionPlanApi";
import { useNavigate } from "react-router-dom"; 

const ProductionPlan = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [searchParams, setSearchParams] = useState({
    planYm: "",
    productName: "",
    status: "",
  });

   // ⭐ 이지 로딩 시 자동 전체 조회⭐
   useEffect(() => {
    handleSearch();
  }, []);

  // ⭐검색 실행 시 API 호출!⭐
  const handleSearch = async () => {
    console.log("검색 파라미터:", searchParams);
    const data = await fetchProductionPlans(
      searchParams.planYm,
      searchParams.status
    );
    setPlans(data);
    console.log(searchParams.planYm);
  };

  // ⭐ Enter 키를 누르면 검색 실행! ⭐
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

    // ⭐ 상세 페이지로 이동하는 함수 ⭐
    const handleRowClick = (planId) => {
      console.log('행 클릭됨, planId:', planId);
      navigate(`/detail/${planId}`); 
    };


    const handleProductionInstruction = async (planId) => {
      try {
          // 상태 변경 확인 모달
          const confirmed = window.confirm('생산 지시를 진행하시겠습니까? ');
          
          if (confirmed) {
              await updatePlanStatus(planId, '확정');
              
              // 성공 후 목록 새로고침
              handleSearch();
          }
      } catch (error) {
          window.alert('상태 변경 중 오류가 발생했습니다.');
      }
  };

    return (
      <div className="productionPlan-container">
        <h1 className="page-title">생산계획관리</h1>
  
        {/* 검색입력필드 */}
        <div className="search-bar">
          <div className="search-filter">
            <label>계획년월</label>
            <input 
              type="text"
              placeholder="YYYY-MM"
              value={searchParams.planYm}
              onChange={(e) => setSearchParams({...searchParams, planYm: e.target.value})}
              onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
            />
          </div>
          
          <div className="search-filter">
            <label>상태</label>
            <input 
              type="text"
              placeholder="미확정/확정"
              value={searchParams.status}
              onChange={(e) => setSearchParams({...searchParams, status: e.target.value})}
              onKeyDown={handleKeyDown} // 엔터 키 이벤트 추가
            />
          </div>
          <button onClick={handleSearch}>조회</button>
        </div>
  
        {/* 테이블 */}
        <div className="plan-table">
          <table>
            <thead>
              <tr>
                <th>계획년월</th>
                <th>계획ID</th> {/* 계획ID 컬럼 추가 */}
                <th>제품명</th>
                <th>규격</th>
                <th>계획수량</th>
                <th>상태</th>
                <th>생산지시</th>
              </tr>
            </thead>
            <tbody>
              {plans.length > 0 ? (
                plans.map((plan, index) => {
                  // planYm을 YYYY-MM-DD 형식으로 변환
                  const formattedDate = Array.isArray(plan.planYm)
                    ? `${plan.planYm[0]}-${String(plan.planYm[1]).padStart(2, "0")}-${String(plan.planYm[2]).padStart(2, "0")}`
                    : plan.planYm;
  
                  return (
                    <tr 
                      key={index} 
                      onClick={() => handleRowClick(plan.planId)} 
                      className="clickable-row" // 클릭 가능한 행임을 표시하는 클래스 추가
                    >
                      <td>{formattedDate}</td>
                      <td>{plan.planId}</td> {/* 계획ID 표시 */}
                      <td>{plan.mainProductName}</td>
                      <td>{plan.sizeSpec || '-'}</td>
                      <td>{plan.totalPlanQty?.toLocaleString() || 0}</td>
                      <td>
                        <span className={`status ${plan.status}`}>
                          {plan.status === "미확정" ? "🟡 미확정" : 
                          plan.status === "확정" ? "✅ 확정" : 
                          plan.status === "취소" ? "❌ 취소" : plan.status}
                        </span>
                      </td>
                      <td onClick={(e) => e.stopPropagation()} 
                            style={{ 
                                color: (plan.status === "확정" || plan.status === "생산지시") ? "#999" : "", // "확정" 또는 "생산지시" 상태일 때 글씨 회색
                            }}
                        > 
                            <button 
                                className="action-btn"
                                onClick={() => handleProductionInstruction(plan.planId)}
                                disabled={plan.status === "확정" || plan.status === "생산지시"} // 두 상태일 때 버튼 비활성화
                                style={{
                                    backgroundColor: (plan.status === "확정" || plan.status === "생산지시") ? "#cccccc" : "", // 두 상태일 때 배경 회색
                                    cursor: (plan.status === "확정" || plan.status === "생산지시") ? "not-allowed" : "pointer"
                                }}
                            >
                                {(plan.status === "확정" || plan.status === "생산지시") ? "완료" : "생산지시"}
                            </button>
                        </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>조회된 데이터가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
};

export default ProductionPlan;
