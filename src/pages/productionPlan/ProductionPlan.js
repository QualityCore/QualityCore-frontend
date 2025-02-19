import React, { useState, useEffect } from "react";
import "../../styles/productionPlan/ProductionPlan.css";
import { fetchProductionPlans } from "../../apis/productionPlanApi/ProductionPlanApi";

const ProductionPlan = () => {
  const [plans, setPlans] = useState([]);
  const [searchParams, setSearchParams] = useState({
    planYm: "",
    productName: "",
    status: "",
  });

   // 페이지 로딩 시 자동 전체 조회
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

  return (
    <div className="productionPlan-container">
      <h1 className="page-title">생산계획관리</h1>

      {/* ⭐검색입력필드!⭐ */}
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

      {/* ⭐테이블!⭐ */}
      <div className="plan-table">
        <table>
          <thead>
            <tr>
              <th>계획년월</th>
              <th>제품코드</th>
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
                // ⭐ planYm을 YYYY-MM-DD 형식으로 변환 ⭐
                const formattedDate = Array.isArray(plan.planYm)
                  ? `${plan.planYm[0]}-${String(plan.planYm[1]).padStart(2, "0")}-${String(plan.planYm[2]).padStart(2, "0")}`
                  : plan.planYm;

                return (
                  <tr key={index}>
                    <td>{formattedDate}</td>
                    <td>{plan.productId || '-'}</td>
                    <td>{plan.productName}</td>
                    <td>{plan.sizeSpec || '-'}</td>
                    <td>{plan.planQty}</td>
                    <td>
                      <span className={`status ${plan.status}`}>
                        {plan.status === "계획" ? "🟡 계획" : 
                        plan.status === "확정" ? "✅ 확정" : 
                        plan.status === "취소" ? "❌ 취소" : plan.status}
                      </span>
                    </td>
                    <td>
                      {plan.status === "확정" ? (
                        <button className="action-btn">생산지시</button>
                      ) : (
                        <button className="action-btn" disabled>
                          불가
                        </button>
                      )}
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
