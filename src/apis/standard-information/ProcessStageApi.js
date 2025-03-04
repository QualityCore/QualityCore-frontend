// 공정 전체조회
export const fetchAllProcesses = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/process');
        const data = await response.json();
        console.log('전체 공정 조회 data', data);
        return data; // 서버에서 반환된 공정 전체 데이터
    } catch (error) {
        console.error("Error fetching all processes:", error);
        throw error;
    }
};

// 공정 상세조회
export const fetchProcessById = async (processId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/process/${processId}`);
        const data = await response.json();
        console.log('공정 상세 조회 data', data);
        return data; // 서버에서 반환된 공정 상세 데이터
    } catch (error) {
        console.error("Error fetching process by id:", error);
        throw error;
    }
};

// 공정등록
export const addProcess = async (processData) => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/process', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(processData),
        });

        const data = await response.json();
        console.log('새로운 공정 추가 data', data);
        return data; // 서버에서 반환된 새로 추가된 공정 데이터
    } catch (error) {
        console.error("Error adding new process:", error);
        throw error;
    }
};
