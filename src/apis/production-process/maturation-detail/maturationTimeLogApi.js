// 숙성 상세 공정 ID 목록 조회
export const fetchMaturationIds = async () => {
    try {
        const response = await fetch('http://localhost:8080/maturationtimedlog/maturation-ids');
        if (!response.ok) {
            throw new Error(`요청 실패: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('숙성 상세 공정 ID 목록 조회 성공:', data);
        return data.result.maturationIds || [];
    } catch (error) {
        console.error('숙성 상세 공정 ID 목록 조회 실패:', error);
        throw error;
    }
};

// 숙성 시간대별 로그 등록
export const logMaturationData = async (maturationTimedLogDTO) => {
    try {
        const response = await fetch('http://localhost:8080/maturationtimedlog/log', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(maturationTimedLogDTO),
        });
        if (!response.ok) {
            throw new Error(`요청 실패: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('숙성 시간대별 로그 등록 성공:', data);
        return data.result.logId;
    } catch (error) {
        console.error('숙성 시간대별 로그 등록 실패:', error);
        throw error;
    }
};

// 숙성 공정 종료시간 수정
export const completeEndTime = async (mlogId) => {
    try {
        const response = await fetch(`http://localhost:8080/maturationtimedlog/update/${mlogId}`, {
            method: 'PUT',
        });
        if (!response.ok) {
            throw new Error(`요청 실패: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('숙성 공정 종료시간 수정 성공:', data);
        return data;
    } catch (error) {
        console.error('숙성 공정 종료시간 수정 실패:', error);
        throw error;
    }
};
