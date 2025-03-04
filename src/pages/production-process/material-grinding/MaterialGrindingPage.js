import React, { useState } from "react";
import MaterialGrindingForm from "../../../components/production-process/material-grinding/MaterialGrindingForm";
import MaterialGrindingControls from "../../../components/production-process/material-grinding/MaterialGrindingControls";
import styles from "../../../styles/production-process/MaterialGrindingControls.module.css";

const MaterialGrindingPage = () => {
    const [grindingData, setGrindingData] = useState({
        lotNo : "LOT",
        mainMaterial: "보리",
        mainMaterialInputVolume: "",
        maltType: "페일 몰트",
        maltInputVolume: "",
        grindIntervalSetting: "",
        grindSpeedSetting: "",
        grindDuration: "1",   
        statusCode : "SC001",
        processStatus: "대기중",
        notes: "",
    });

    return (
        <div className={styles.grindingButtonContainer}>
            <MaterialGrindingForm  grindingData={grindingData} setGrindingData={setGrindingData} />
            <MaterialGrindingControls grindingData={grindingData} setGrindingData={setGrindingData}/>
        </div>
    );
};

export default MaterialGrindingPage;
