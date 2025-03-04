
import React, { useState, useEffect } from 'react';
import { getStockStatus, getMaterialRequests, requestMaterial } from '../../apis/productionPlanApi/MaterialApi';
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
      setMaterialRequests(response.result.requests);
    } catch (error) {
      console.error('자재 구매 신청 내역 조회 실패:', error);
    }
  };

  const handleMaterialRequest = async (requestData) => {
    try {
      await requestMaterial(requestData);
      alert('자재 구매 신청이 완료되었습니다.');
      fetchMaterialRequests();
    } catch (error) {
      console.error('자재 구매 신청 실패:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>자재 재고 현황</h2>
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

      <h2>자재 구매 신청 내역</h2>
      {/* 자재 구매 신청 내역 테이블 */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>신청일</th>
            <th>자재명</th>
            <th>수량</th>
            <th>납기 요청일</th>
            <th>진행 상태</th>
          </tr>
        </thead>
       
      <tbody>
        {Array.isArray(materialRequests) && materialRequests.map((request) => (
          <tr key={request.requestId}>
            <td>{request.requestDate}</td>
            <td>{request.planMaterial ? request.planMaterial.materialName : ''}</td>
            <td>{request.requestQty}</td>
            <td>{request.deliveryDate}</td>
            <td>{request.status}</td>
          </tr>
        ))}
      </tbody>  
      </table>

      <h2>자재 구매 신청</h2>
      {/* 자재 구매 신청 폼 */}
      <form onSubmit={handleMaterialRequest}>
        {/* 자재명, 수량, 납기 요청일 등의 입력 필드 */}
        <button type="submit">신청</button>
      </form>
    </div>
  );
};

export default MaterialManagementPage;