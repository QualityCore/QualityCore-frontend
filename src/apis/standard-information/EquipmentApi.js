// 설비 전체조회
export const fetchAllEquipment = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/equipment');
        const data = await response.json();
        console.log('설비 전체 조회 data', data);  // 확인용 로그

        return data.result.equipment;  // 서버에서 반환된 설비 목록 데이터
    } catch (error) {
        console.error('Error fetching all equipment:', error);
        throw error;
    }
};

// 설비 상세조회
export const fetchEquipmentById = async (equipmentId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/equipment/${equipmentId}`);
        const data = await response.json();
        console.log('설비 상세 조회 data', data);

        return data.result.equipment;  // 서버에서 반환된 설비 상세 데이터
    } catch (error) {
        console.error('Error fetching equipment by id:', error);
        throw error;
    }
};

export const createEquipment = async (formData) => {
    try {
        console.log("Sending formData:", Object.fromEntries(formData));

        const response = await fetch('http://localhost:8080/api/v1/equipment', {
            method: 'POST',
            body: formData,
        });

        console.log("Response status:", response.status);
        console.log("Response headers:", Object.fromEntries(response.headers));

        if (!response.ok) {
            const errorMessage = await response.text();
            console.error("Error response body:", errorMessage);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
        }

        const data = await response.json();
        console.log("Created equipment:", data);
        return data;
    } catch (error) {
        console.error('Error creating equipment:', error);
        throw error;
    }
};


// 설비 수정
export const updateEquipment = async (equipmentData) => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/equipment', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(equipmentData),  // 수정할 설비 데이터
        });
        const data = await response.json();
        console.log('설비 수정 data', data);

        return data;  // 서버에서 반환된 데이터
    } catch (error) {
        console.error('Error updating equipment:', error);
        throw error;
    }
};

// 설비 삭제
export const deleteEquipment = async (equipmentId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/equipment/${equipmentId}`, {
            method: 'DELETE',
        });
        const data = await response.json();
        console.log('설비 삭제 data', data);

        return data;  // 서버에서 반환된 데이터
    } catch (error) {
        console.error('Error deleting equipment:', error);
        throw error;
    }
};
