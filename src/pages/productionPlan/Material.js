// MaterialManagementPage.js
import React, { useState, useEffect } from 'react';
import { getStockStatus, getMaterialRequests, updateMaterialRequestStatus } from '../../apis/productionPlanApi/MaterialApi';
import styles from '../../styles/productionPlan/MaterialManagementPage.module.css';

const MaterialManagementPage = () => {
  const [stockStatus, setStockStatus] = useState([]);
  const [materialRequests, setMaterialRequests] = useState([]);

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
        console.log("📌 API 응답 데이터:", response);

        if (response && response.result && Array.isArray(response.result.requests)) {
            setMaterialRequests(response.result.requests);  
        } else {
            console.error('❌ 응답 데이터가 예상한 형식이 아닙니다:', response);
            setMaterialRequests([]);  
        }
    } catch (error) {
        console.error('❌ 자재 구매 신청 내역 조회 실패:', error);
        setMaterialRequests([]);
    }
};


const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", { timeZone: "Asia/Seoul" });
};


  const handleOrder = async (requestId) => {
    try {
      await updateMaterialRequestStatus(requestId, '발주완료');
      fetchMaterialRequests(); // 변경 후 새로고침
    } catch (error) {
      console.error('자재 구매 신청 발주 실패:', error);
    }
  };
  

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>자재 구매 신청 내역</h2>

      <div className={styles.dashboard}>
        <div className={styles.card}>
          <h3>총 신청 건수</h3>
          <p>{materialRequests.length}</p>
        </div>

        <div className={styles.card}>
          <h3>발주 완료 건수</h3>
          <p>{materialRequests.filter(request => request.status === '발주완료').length}</p>
        </div>

        <div className={styles.card}>
          <h3>미발주 건수</h3>
          <p>{materialRequests.filter(request => request.status !== '발주완료').length}</p>
        </div>
      </div>

      <h3 className={styles.subtitle}>최근 신청 내역</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>신청일</th>
            <th>자재명</th>
            <th>수량</th>
            <th>납기 요청일</th>
            <th>상태</th>
            <th>발주</th>
          </tr>
        </thead>
        <tbody>
          {materialRequests.slice(0, 5).map(request => (
            <tr key={request.requestId}>
              <td>{formatDate(request.requestDate)}</td>
              <td>{request.materialName}</td>
              <td>{request.requestQty}</td>
              <td>{formatDate(request.deliveryDate)}</td>
              <td>{request.status}</td>
              <td>
                {request.status !== '발주완료' && (
                  <button className={styles.orderButton} onClick={() => handleOrder(request.requestId)}>
                    발주하기
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className={styles.subtitle}>자재별 재고 현황</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>자재명</th>
            <th>현재 재고</th>
            <th>단위</th>
          </tr>
        </thead>
        <tbody>
          {stockStatus.map(stock => (
            <tr key={stock.materialId}>
              <td>{stock.materialName}</td>
              <td>{stock.currentStock}</td>
              <td>{stock.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MaterialManagementPage;