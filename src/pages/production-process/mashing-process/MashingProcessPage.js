import React, { useState, useEffect } from "react";
import mashingProcessApi from "../../../apis/production-process/mashing-process/MashingProcessApi";
import MashingProcessTable from "../../../components/production-process/mashing-process/MashingProcessTable";
import MashingProcessControls from "../../../components/production-process/mashing-process/MashingProcessControls";

const MashingProcessPage = () => {
    const [mashingDataList, setMashingDataList] = useState([]);

    useEffect(() => {
        // 당화공정 데이터 가져오기
        const fetchMashingData = async () => {
            try {
                const response = await mashingProcessApi.getMashingData();
                setMashingDataList(response.data);
            } catch (error) {
                console.error("❌ 당화공정 데이터 불러오기 실패:", error);
            }
        };

        fetchMashingData();
    }, []);

    return (
        <div>            
            <MashingProcessTable mashingDataList= {mashingDataList} setMashingDataList={setMashingDataList} />
            <MashingProcessControls mashingDataList= {mashingDataList} setMashingDataList={setMashingDataList} />
        </div>
    );
};

export default MashingProcessPage;
