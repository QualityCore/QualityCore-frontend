import axios from "axios";

export const calculateMaterialRequirements = async (planData) => {
    try {
        const response = await axios.post(
            `http://localhost:8080/api/v1/materials/calculate`, 
            planData
        );
        return response.data;
    } catch (error) {
        console.error("자재 소요량 계산 중 오류:", error);
        throw error;
    }
};

export const saveMaterialPlan = async (completeData) => {
    console.log("🚀 Step3 API 요청 데이터:", JSON.stringify(completeData, null, 2)); // JSON 포맷 정리

    try {
        const response = await axios.post(
            `http://localhost:8080/api/v1/save`, 
            completeData
        );
        return response.data;
    } catch (error) {
        console.error("❌ 자재 계획 저장 중 오류:", error);
        throw error;
    }
};
