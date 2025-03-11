// 작업지시 ID 목록 조회
export const fetchLineMaterial = async () => {
    try {
        const response = await fetch('http://localhost:8080/maturationdetails/linematerial');
        if (!response.ok) {
            throw new Error(`요청 실패: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('작업지시 ID 목록 조회:', data);
        return data.result.lineMaterials || [];
    } catch (error) {
        console.error('작업지시 ID 목록 조회 실패:', error);
        throw error;
    }
};

// 숙성 상세 공정 등록 API
export const createMaturationDetails = async (maturationDetailsDTO) => {
    try {
        console.log("🔵 [API 요청 시작] POST /maturationdetails/register");
        console.log("📤 요청 데이터:", maturationDetailsDTO);

        const response = await fetch('http://localhost:8080/maturationdetails/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(maturationDetailsDTO),
        });

        console.log("🟢 [API 응답 수신] 상태 코드:", response.status);

        if (!response.ok) {
            const errorResponse = await response.json();
            console.error("🔴 [API 오류 응답]:", errorResponse);
            throw new Error(`요청 실패: ${errorResponse.message || response.statusText}`);
        }

        const data = await response.json();
        console.log("🟢 [API 성공 응답]:", data);
        return data;
    } catch (error) {
        console.error("🔴 [API 호출 실패]:", error);
        throw error;
    }
};


// 숙성 상세 공정 종료시간 수정
export const completeEndTime = async (maturationId) => {
    try {
        const response = await fetch(`http://localhost:8080/maturationdetails/update/${maturationId}`, {
            method: 'PUT',
        });
        if (!response.ok) {
            throw new Error(`요청 실패: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('숙성 상세 공정 종료시간 수정 성공:', data);
        return data;
    } catch (error) {
        console.error('숙성 상세 공정 종료시간 수정 실패:', error);
        throw error;
    }
};

// LOT_NO에 따른 숙성 상세 공정 상태 업데이트
export const updateMaturationDetailsStatus = async (maturationDetailsDTO) => {
    try {
        const response = await fetch('http://localhost:8080/maturationdetails/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(maturationDetailsDTO),
        });
        if (!response.ok) {
            throw new Error(`요청 실패: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('숙성 상세 공정 상태 업데이트 성공:', data);
        return data;
    } catch (error) {
        console.error('숙성 상세 공정 상태 업데이트 실패:', error);
        throw error;
    }
};

// 숙성 시간대별 전체 조회
export const fetchAllTimedLogs = async (maturationId = '') => {
    try {
        const params = new URLSearchParams();
        if (maturationId) params.append('maturationId', maturationId);

        const url = `http://localhost:8080/maturationdetails/timed-logs?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`요청 실패: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('숙성 시간대별 전체 조회 성공:', data);
        return data.result.logs || [];
    } catch (error) {
        console.error('숙성 시간대별 전체 조회 실패:', error);
        throw error;
    }
};

// 전체조회
export const fetchAllMaturation = async () => {
    try {
        const url = "http://localhost:8080/maturationdetails/maturation";
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`요청 실패: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("숙성 전체 조회 성공:", data);
        return data.result.maturationDetail || [];
    } catch (error) {
        console.error("숙성 전체 조회 실패:", error);
        throw error;
    }
};

// 상세조회
export const fetchMaturationById = async (maturationId) => {
    try {
        const url = `http://localhost:8080/maturationdetails/maturation/${maturationId}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`요청 실패: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("숙성 상세 조회 성공:", data);
        return data.result.maturationDetail || null;
    } catch (error) {
        console.error("숙성 상세 조회 실패:", error);
        throw error;
    }
};

