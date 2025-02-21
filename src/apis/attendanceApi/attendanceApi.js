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

// 스케줄 상세페이지
export const fetchSchedule = async (scheduleId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/schedule/${scheduleId}`);
        const data = await response.json();
        return data.result.schedule;
    } catch (error) {
        console.error("Error fetching schedule:", error);
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
