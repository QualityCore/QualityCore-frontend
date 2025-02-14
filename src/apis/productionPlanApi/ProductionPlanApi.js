// ⭐productionPlanApi.js (API 호출)⭐
export const fetchProductionPlans = async (planYm, status) => {
  try {
    const url = `http://localhost:8080/plan/api/v1/plan-overview?planYm=${planYm}&status=${status}`;
    console.log("요청 URL:", url); // 요청 URL 확인

    const response = await fetch(url);

    console.log("응답 상태:", response.status); // 응답 상태 로그

    if (!response.ok) {
      throw new Error(`API 실패: 상태코드 ${response.status}`);
    }

    const data = await response.json();
    console.log("응답 데이터:", data); // 응답 데이터 확인

    return data;
  } catch (error) {
    console.error("API 호출 중 오류 발생:", error);
    return [];
  }
};