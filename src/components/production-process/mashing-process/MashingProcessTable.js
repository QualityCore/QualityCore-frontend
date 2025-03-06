import React from "react";
import styles from "../../../styles/production-process/MashingProcessControls.module.css";

const MashingProcessTable = ({ mashingDataList }) => {
  return (
    <table className={styles.mashingProcessTable}>
      <thead className={styles.mashingProcessTableThead}>
        <tr>
          <th>작업지시 ID</th>
          <th>당화 소요 시간</th>
          <th>당화 온도</th>
          <th>pH값</th>
          <th>곡물 대 물 비율</th>
          <th>물 투입량</th>
          <th>공정 상태</th>
        
        </tr>
      </thead>
      <tbody>
        {mashingDataList.map((data, index) => (
          <tr key={index}>
            <td>{data.lotNo}</td>
            <td>{data.mashingTime}분</td>
            <td>{data.temperature}°C</td>
            <td>{data.phValue}</td>
            <td>
              {data.grainRatio} :
              {data.waterRatio}
            </td>
            <td>{data.waterInputVolume}L</td>
            <td>{data.processStatus}</td>
            <td>{data.notes}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MashingProcessTable;
