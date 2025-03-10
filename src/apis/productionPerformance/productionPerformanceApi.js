
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1';

export const getMonthlyPerformance = async (yearMonth, productName = '') => {
  try {
    const params = new URLSearchParams();
    params.append('yearMonth', yearMonth);
    if (productName && productName !== '전체') {
      params.append('productName', productName);
    }
         
    const response = await axios.get(`${BASE_URL}/performance/monthly`, { params });
    console.log("API 원본 응답:", response);
    return response;
  } catch (error) {
    console.error('월별 생산실적 조회 오류:', error);
    throw error;
  }
};
export const getPlanVsActual = async (yearMonth, productName = '') => {
  try {
    const params = new URLSearchParams();
    params.append('yearMonth', yearMonth);
    if (productName && productName !== '전체') {
      params.append('productName', productName);
    }
    
    const response = await axios.get(`${BASE_URL}/performance/plan-vs-actual`, { params });
    return response.data;
  } catch (error) {
    console.error('계획 대비 실적 조회 오류:', error);
    throw error;
  }
};

export const getProductEfficiency = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/performance/efficiency`);
    return response.data;
  } catch (error) {
    console.error('제품별 효율성 조회 오류:', error);
    throw error;
  }
};

export const downloadExcelReport = (reportType, yearMonth, productName = '') => {
  const params = new URLSearchParams();
  if (yearMonth) {
    params.append('yearMonth', yearMonth);
  }
  if (productName && productName !== '전체') {
    params.append('productName', productName);
  }
  
  const url = `${BASE_URL}/performance/export/${reportType}?${params.toString()}`;
  window.location.href = url;
};