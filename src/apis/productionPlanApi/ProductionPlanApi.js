import axios from 'axios';

// ⭐productionPlanApi.js (API 호출)⭐
// 🔵 생산 계획 조회 (GET)
export const fetchProductionPlans = async (planYm, status) => {
  try {
    const response = await axios.get('http://localhost:8080/api/v1/plans', {
      params: {
        planYm: planYm,
        status: status,
      },
    });

    console.log("요청 파라미터:", planYm, status);
    console.log("응답 데이터:", response.data);

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("서버 응답 에러:", error.response.status, error.response.data);
    } else {
      console.error("API 호출 중 네트워크 오류:", error.message);
    }
    return [];
  }
};

