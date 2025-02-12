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

  // ⭐검색 실행 시 API 호출!⭐
  const handleSearch = async () => {
    const data = await fetchProductionPlans(
      searchParams.planYm,
      searchParams.productName,
      searchParams.status
    );
    setPlans(data);
  };


    return(
      <div className="productionPlan-container">
        <h1 className="page-title">생산계획관리</h1>

        {/* ⭐검색입력필드!⭐ */}
        <div className="search-bar">
            <input type="text"
                   placeholder="계획년월(YYYY-MM)"
                   value={searchParams}
                   onChange={(e) => setSearchParams({...searchParams,planYm:e.target.value})}
                    />
            <input type="text"
                   placeholder="제품명"
                   value={searchParams}
                   onChange={(e) => setSearchParams({...searchParams,productName:e.target.value})} 
                   />
            <input type="text"
                   placeholder="상태 (계획/확정)"
                   value={searchParams}
                   onChange={(e) => setSearchParams({...searchParams,status:e.target.value})}
                    />       
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
                <th>생산라인</th>
                <th>계획수량</th>
                <th>상태</th>
                <th>생산지시</th>
              </tr>
            </thead>

            <tbody>
            {plans.map((plan) => (
              <tr key={plan.planId}>
                <td>{plan.planYm}</td>
                <td>{plan.productCode}</td>
                <td>{plan.productName}</td>
                <td>{plan.sizeSpec}</td>
                <td>{plan.productionLine}</td>
                <td>{plan.planQty}</td>
                <td>
                  <span className={`status ${plan.status}`}>
                    {plan.status === "계획" ? "🟡 계획" : "✅ 확정"}
                  </span>
                </td>
                <td>
                  <button className="action-btn">생산지시하기</button>
                </td>
              </tr>
            ))}
          </tbody>
          </table>
        </div>
      </div>
    )
 
};

export default ProductionPlan;
