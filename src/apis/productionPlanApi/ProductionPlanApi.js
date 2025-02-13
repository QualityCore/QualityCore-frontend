// ⭐productionPlanApi.js (API 호출)⭐
export const fetchProductionPlans = async (planYm, productName, status) => {
    try {
      const response = await fetch(
        `http://localhost:8080/production-plans?planYm=${planYm}&productName=${productName}&status=${status}`
      );
      if (!response.ok) throw new Error("데이터 불러오기 실패!");
      return await response.json();
    } catch (error) {
      console.error("API 오류:", error);
      return [];
    }
  };
  