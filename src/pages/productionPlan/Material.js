
import React, { useState, useEffect } from 'react';
import { getStockStatus, getMaterialRequests, requestMaterial } from '../../apis/productionPlanApi/MaterialApi';
import styles from '../../styles/productionPlan/MaterialManagementPage.module.css';

const MaterialManagementPage = () => {
  const [stockStatus, setStockStatus] = useState([]);
  const [materialRequests, setMaterialRequests] = useState([]);
  const [selectedMaterialId, setSelectedMaterialId] = useState(""); 
  const [materialName, setMaterialName] = useState("");

  useEffect(() => {
    fetchStockStatus();
    fetchMaterialRequests();
  }, []);

  const fetchStockStatus = async () => {
    try {
      const response = await getStockStatus();
      setStockStatus(response.result.stockStatus);
    } catch (error) {
      console.error('자재 재고 현황 조회 실패:', error);
    }
  };
  
  const fetchMaterialRequests = async () => {
    try {
      const response = await getMaterialRequests();
      
   
      if (response.result && Array.isArray(response.result.requests)) {
        setMaterialRequests(response.result.requests);
      } else {
        console.error('자재 구매 신청 내역 데이터 형식이 올바르지 않습니다.');
        setMaterialRequests([]);
      }
    } catch (error) {
      console.error('자재 구매 신청 내역 조회 실패:', error);
    }
  };
  

  const handleMaterialRequest = async (event) => {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const requestData = {
      materialId: selectedMaterialId || null,  // 기존 자재 선택 시 ID 전송, 없으면 null
      materialName: selectedMaterialId ? null : formData.get("materialName"), // 기존 자재 선택 시 materialName 전송 안함
      requestQty: formData.get("requestQty") || null,
      deliveryDate: formData.get("deliveryDate") || null,
      reason: formData.get("reason") || null,
      note: formData.get("note") || null,
    };

    console.log("🔍 requestData 확인:", requestData);

    try {
      await requestMaterial(requestData); 
      alert("자재 구매 신청이 완료되었습니다.");
      setSelectedMaterialId(""); // 선택 초기화
      setMaterialName(""); // 신규 자재 입력값 초기화
    } catch (error) {
      console.error("자재 구매 신청 실패:", error);
    }
  };

  
  
  
  


const formatDate = (dateString) => {
  if (!dateString) return ''; // 날짜 값이 없을 경우 빈 값 반환
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // 'YYYY-MM-DD' 형태로 변환
};


  return (
    <div className={styles.container}>
       <h2 className={styles.sectionTitle}>자재 재고 현황</h2>
      {/* 자재 재고 현황 테이블 */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>자재명</th>
            <th>현재 재고</th>
            <th>단위</th>
          </tr>
        </thead>
        <tbody>
        {Array.isArray(stockStatus) && stockStatus.map((stock) => (
          <tr key={stock.materialId}>
            <td>{stock.materialName}</td>
            <td>{stock.currentStock}</td>
            <td>{stock.unit}</td>
          </tr>
        ))}
      </tbody>
      </table>

      <h2 className={styles.sectionTitle}>자재 구매 신청 내역</h2>
      {/* 자재 구매 신청 내역 테이블 */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>신청일</th>
            <th>자재명</th>
            <th>수량</th>
            <th>납기 요청일</th>
          </tr>
        </thead>
       
      <tbody>
        {Array.isArray(materialRequests) && materialRequests.map((request) => (
          <tr key={request.requestId}>
             <td>{formatDate(request.requestDate)}</td>
            <td>{request.materialName}</td>
            <td>{request.requestQty}</td>
            <td>{formatDate(request.deliveryDate)}</td> 
          </tr>
        ))}
      </tbody>  
      </table>

      <h2 className={styles.sectionTitle}>자재 구매 신청</h2>
      {/* 자재 구매 신청 폼 */}
      <form onSubmit={handleMaterialRequest} className={styles.requestForm}>
        
        {/* 기존 자재 선택 (드롭다운) */}
        <div className={styles.formGroup}>
          <label htmlFor="materialId">기존 자재 선택</label>
          <select
            id="materialId"
            name="materialId"
            value={selectedMaterialId}
            onChange={(e) => setSelectedMaterialId(e.target.value)}
          >
            <option value="">신규 자재 신청</option>
            {stockStatus.map((material) => (
              <option key={material.materialId} value={material.materialId}>
                {material.materialName}
              </option>
            ))}
          </select>
        </div>

        {/* 신규 자재명 입력 (기존 자재 선택 시 비활성화) */}
        <div className={styles.formGroup}>
          <label htmlFor="materialName">자재명 (신규 자재)</label>
          <input 
            type="text" 
            id="materialName" 
            name="materialName" 
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            disabled={selectedMaterialId} // 기존 자재 선택 시 입력 불가능
            required={!selectedMaterialId} // 기존 자재 선택 안 했을 때만 필수
          />
        </div>

        {/* 신청 수량 */}
        <div className={styles.formGroup}>
          <label htmlFor="requestQty">수량</label>
          <input type="number" id="requestQty" name="requestQty" min="0" step="0.01" required />
        </div>

        {/* 납기 요청일 */}
        <div className={styles.formGroup}>
          <label htmlFor="deliveryDate">납기 요청일</label>
          <input type="date" id="deliveryDate" name="deliveryDate" required />
        </div>

        {/* 신청 사유 */}
        <div className={styles.formGroup}>
          <label htmlFor="reason">신청 사유</label>
          <input type="text" id="reason" name="reason" required />
        </div>

        {/* 추가 메모 */}
        <div className={styles.formGroup}>
          <label htmlFor="note">추가 메모</label>
          <textarea id="note" name="note"></textarea>
        </div>

        {/* 제출 버튼 */}
        <button type="submit" className={styles.submitButton}>
          신청
        </button>
      </form>
    </div>
  );
};

export default MaterialManagementPage;