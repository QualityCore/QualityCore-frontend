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


    getWorkOrders: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/work-orders`); 
            return response.data;
        } catch (error) {
            console.error("❌ 작업지시 목록 불러오기 실패:", error);
            throw error;
        }
    },

   
};

export default materialGrindingApi;
