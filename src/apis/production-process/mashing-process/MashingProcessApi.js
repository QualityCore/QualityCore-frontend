import axios from 'axios';

const BASE_URL = 'http://localhost:8080/mashingprocess';

const mashingProcessApi = {
    //  당화 데이터 저장 (CREATE)
    saveGrindingData: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/register`, data, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        } catch (error) {
            console.error("❌ 당화 데이터 저장 실패:", error);
            throw error;
        }
    }

   
};

export default mashingProcessApi;
