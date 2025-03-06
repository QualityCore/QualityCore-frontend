import React from "react";

const MashingProcessTable = ({ mashingDataList }) => {
    return (
        <table className="mashing-process-table">
            <thead>
                <tr>
                    <th>작업지시 ID</th>
                    <th>당화 소요 시간</th>
                    <th>당화 온도</th>
                    <th>pH값</th>
                    <th>곡물 비율</th>
                    <th>물 비율</th>
                    <th>물 투입량</th>
                    <th>공정 상태</th>
                    <th>상태 코드 ID</th>
                </tr>
            </thead>
            <tbody>
                {mashingDataList.map((data, index) => (
                    <tr key={index}>
                        <td>{data.lotNo}</td>
                        <td>{data.mashingTime}분</td>
                        <td>{data.temperature}°C</td>
                        <td>{data.phValue}</td>
                        <td>{data.grainRatio} : {data.waterRatio}</td>
                        <td>{data.waterInputVolume}L</td>
                        <td>{data.processStatus}</td>
                        <td>{data.statusCode}</td>
                        <td>{data.notes}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default MashingProcessTable;
