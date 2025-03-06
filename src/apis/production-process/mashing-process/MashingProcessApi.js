import axios from 'axios';

const BASE_URL = 'http://localhost:8080/mashingprocess';

const mashingProcessApi = {
    // 당화 데이터 저장 (CREATE)
    saveMashingData: async (data) => {
        try {
            const response = await axios.post(`${BASE_URL}/register`, data, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        } catch (error) {
            console.error("❌ 당화 데이터 저장 실패:", error);
            throw error;
        }
    },

    // 📌 특정 LOT_NO에 대한 분쇄공정 상태 업데이트
    updateMashingStatus: async (lotNo, statusData) => {
        try {
            const response = await axios.put(`${BASE_URL}/update`, statusData, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        } catch (error) {
            console.error(`❌ 분쇄공정 상태 업데이트 실패 (LOT_NO: ${lotNo}):`, error);
            throw error;
        }
    },

    // 📌 당화공정 pH 값 및 실제 종료시간 업데이트
    updateMashingProcess: async (mashingId, updateData) => {
        try {
            const response = await axios.put(`${BASE_URL}/register/${mashingId}`, updateData, {
                headers: { "Content-Type": "application/json" }
            });
            return response.data;
        } catch (error) {
            console.error(`❌ 당화공정 업데이트 실패 (MashingID: ${mashingId}):`, error);
            throw error;
        }
    },

    // 📌 특정 LOT_NO에 대한 자재 정보 조회
    getMaterialsByLotNo: async (lotNo) => {
        try {
            const response = await axios.get(`${BASE_URL}/${lotNo}`);
            return response.data;
        } catch (error) {
            console.error(`❌ 자재 정보 조회 실패 (LOT_NO: ${lotNo}):`, error);
            throw error;
        }
    },

    // 📌 작업지시 ID 목록 조회
    getWorkOrderList: async () => {
        try {
            const response = await axios.get(`${BASE_URL}/linematerial`);
            return response.data;
        } catch (error) {
            console.error("❌ 작업지시 ID 목록 조회 실패:", error);
            throw error;
        }
    }
};

export default mashingProcessApi;
