// 직원의 전체 스케줄 가져오기
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

export const fetchSchedule = async (scheduleId) => {
    if (!scheduleId) {
        console.error("fetchSchedule - scheduleId가 제공되지 않았습니다.");
        throw new Error("fetchSchedule - scheduleId는 필수입니다.");
    }

    console.log(`fetchSchedule 호출: scheduleId = ${scheduleId}`);

    const url = `http://localhost:8080/api/v1/schedule/${scheduleId}`;
    console.log(`요청 URL: ${url}`);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.error(`API 요청 실패, 상태 코드: ${response.status}, URL: ${url}`);
            throw new Error(`스케줄을 가져오는 데 실패했습니다 (상태 코드: ${response.status})`);
        }

        const data = await response.json();
        console.log('API 응답 데이터:', data);

        if (data && data.result && data.result.schedule) {
            return data.result.schedule;
        } else {
            console.error('스케줄 데이터가 없습니다:', data);
            throw new Error('스케줄 데이터가 존재하지 않습니다.');
        }
    } catch (error) {
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
