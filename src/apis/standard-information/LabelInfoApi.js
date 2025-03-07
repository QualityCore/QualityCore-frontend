// 라벨 정보 조회
export const fetchLabelInfo = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/labelInfo'); // 해당 URL로 API 요청
        const data = await response.json(); // 응답 JSON 데이터 받기
        console.log('라벨 정보 조회 data', data); // 콘솔에 응답 데이터 출력
        return data.result.labelInfo; // 서버에서 반환된 라벨 정보 데이터 반환
    } catch (error) {
        console.error("Error fetching label info:", error); // 오류 처리
        throw error; // 오류 다시 던짐
    }
};


// 라벨 등록
export const createLabelInfo = async (formData) => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/labelInfo', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`HTTP 오류! 상태: ${response.status}, 메시지: ${errorMessage}`);
        }

        // 서버에서 반환된 데이터 처리
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("라벨 등록 실패:", error);
        throw new Error("라벨 등록 중 오류가 발생했습니다.");
    }
};


