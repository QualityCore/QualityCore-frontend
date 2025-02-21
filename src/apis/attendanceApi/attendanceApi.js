// 직원의 1명의 전체 스케줄 가져오기
export const fetchAllSchedules = async (empId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/scheduleAll/${empId}`);
        const data = await response.json();
        console.log('전체 스케줄 조회 data', data)
        return data.result.schedule; // 서버에서 반환된 스케줄 데이터
    } catch (error) {
        console.error("Error fetching all schedules by empId:", error);
        throw error;
    }
};

// 직원 1명의 상세페이지 스케줄 가져오기
export const fetchSchedule = async (scheduleId) => {

    const url = `http://localhost:8080/api/v1/schedule/${scheduleId}`;

    // 요청 URL 출력
    console.log(`요청 URL: ${url}`);

    try {
        // Fetch 요청 보내기
        const response = await fetch(url);

        // 응답 상태 코드 출력
        console.log(`응답 상태 코드: ${response.status}`);

        if (!response.ok) {
            console.error(`API 요청 실패, 상태 코드: ${response.status}, URL: ${url}`);
            throw new Error(`스케줄을 가져오는 데 실패했습니다 (상태 코드: ${response.status})`);
        }

        // JSON 데이터 파싱
        const data = await response.json();

        // 응답 데이터 출력
        console.log('API 응답 데이터:', data);

        // 데이터의 result와 schedule 확인
        if (data && data.result) {
            console.log('result:', data.result);

            if (data.result.schedule) {
                console.log('schedule:', data.result.schedule);
                return data.result.schedule;
            } else {
                console.error('schedule 데이터가 없습니다.');
                throw new Error('스케줄 데이터가 존재하지 않습니다.');
            }
        } else {
            console.error('result 데이터가 없습니다:', data);
            throw new Error('result 데이터가 존재하지 않습니다.');
        }
    } catch (error) {
        // 오류 발생 시 출력
        console.error("스케줄을 가져오는 중 오류 발생:", error);
        throw error;
    }
};

// 스케줄 등록하기
export const createSchedule = async (scheduleData) => {
    try {
        const response = await fetch("http://localhost:8080/api/v1/schedule", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(scheduleData),
        });
        return await response.json();
    } catch (error) {
        console.error("Error creating schedule:", error);
        throw error;
    }
};

// 스케줄 수정하기
export const updateSchedule = async (scheduleData) => {
    try {
        const response = await fetch("http://localhost:8080/api/v1/schedule", {
            method: "PUT", // PUT 메소드 사용
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(scheduleData), // 수정할 스케줄 데이터
        });

        // 응답 상태 코드 출력
        console.log(`응답 상태 코드: ${response.status}`);

        if (!response.ok) {
            console.error(`API 요청 실패, 상태 코드: ${response.status}`);
            throw new Error(`스케줄 수정에 실패했습니다 (상태 코드: ${response.status})`);
        }

        // 수정 성공 메시지 반환 (혹은 응답 내용)
        const data = await response.json();
        console.log('수정 성공:', data);
        return data; // 수정 성공 시 서버에서 반환한 데이터 (예: 수정된 스케줄 정보)

    } catch (error) {
        // 오류 발생 시 출력
        console.error("스케줄 수정 중 오류 발생:", error);
        throw error;
    }
};

// 스케줄 삭제하기
export const deleteSchedule = async (scheduleId) => {
    const url = `http://localhost:8080/api/v1/schedule/${scheduleId}`;

    // 요청 URL 출력
    console.log(`요청 URL: ${url}`);

    try {
        // Fetch 요청 보내기 (DELETE 요청)
        const response = await fetch(url, {
            method: "DELETE", // DELETE 메소드 사용
        });

        // 응답 상태 코드 출력
        console.log(`응답 상태 코드: ${response.status}`);

        if (!response.ok) {
            console.error(`API 요청 실패, 상태 코드: ${response.status}, URL: ${url}`);
            throw new Error(`스케줄을 삭제하는 데 실패했습니다 (상태 코드: ${response.status})`);
        }

        // 삭제 성공 메시지 반환 (혹은 응답 내용)
        const data = await response.json();
        console.log('삭제 성공:', data);
        return data; // 삭제 성공 시 서버에서 반환한 데이터 (예: 삭제된 스케줄의 정보)

    } catch (error) {
        // 오류 발생 시 출력
        console.error("스케줄을 삭제하는 중 오류 발생:", error);
        throw error;
    }
};