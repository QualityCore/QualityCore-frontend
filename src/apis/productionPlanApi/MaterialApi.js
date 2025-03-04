// materialApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/materials';

export const getStockStatus = async () => {
  try {
    const response = await axios.get(`${BASE_URL}`);
    return response.data;
  } catch (error) {
    console.error('자재 재고 현황 조회 실패:', error);
    throw error;
  }
};

export const getMaterialRequests = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/requests`);
    return response.data;
  } catch (error) {
    console.error('자재 구매 신청 내역 조회 실패:', error);
    throw error;
  }
};

export const requestMaterial = async (requestData) => {
  try {
    const response = await axios.post(`${BASE_URL}/request`, requestData);
    return response.data;
  } catch (error) {
    console.error('자재 구매 신청 실패:', error);
    throw error;
  }
};