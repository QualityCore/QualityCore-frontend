import axios from 'axios';

const BASE_URL = 'http://localhost:8080/productionprocess';

const materialGrindingApi = {
    //  분쇄 데이터 저장 (CREATE)
    saveGrindingData: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/materialgrinding`, data, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        } catch (error) {
            console.error("❌ 분쇄 데이터 저장 실패:", error);
            throw error;
        }
    },


    getLineMaterial: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/linematerial`); 
            return response.data;
        } catch (error) {
            console.error("❌ 작업지시 목록 불러오기 실패:", error);
            throw error;
        }
    },


     // ✅ 주원료 데이터 가져오기 (Lot No 기반)
     getMaterialByLotNo: async (lotNo) => {
        try {
            const apiUrl = `${BASE_URL}/${lotNo}`;
            console.log("📌 요청하는 lotNo:", lotNo);
            console.log("📌 최종 API 요청 URL:", apiUrl);

            const response = await axios.get(apiUrl);
            console.log("📌 주원료 API 응답 데이터:", response.data);
            return response.data || [];  // ✅ null 대신 빈 배열 반환
        } catch (error) {
            console.error("❌ 주원료 불러오기 실패:", error);
            return [];  // ✅ 오류 시 빈 배열 반환하여 UI 오류 방지
        }
    }
};



export default materialGrindingApi;




