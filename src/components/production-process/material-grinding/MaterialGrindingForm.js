import React, { useState , useEffect } from "react";
import "../../../styles/production-process/materialGrinding.css";

const MaterialGrindingForm = ({ grindingData,setGrindingData }) => {
    const [formData, setFormData] = useState(grindingData);

    useEffect(() => {
        setGrindingData(formData);
    }, [formData, setGrindingData]);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };


    return (

        <div className="material-grinding-form">
            <h2 className="grinding-title">분쇄 공정</h2>
            <div className="form-grid">
                <div className="grinding-group">
                    <label>작업지시 ID </label>
                    <input type="text" name="lotNo" value={formData.lotNo} onChange={handleChange}/>
                </div>
            
                <div className="grinding-group">
                    <label>주원료</label>
                    <select name="mainMaterial" value={formData.mainMaterial} onChange={handleChange}>
                        <option value="보리">보리</option>
                        <option value="밀">밀</option>
                        <option value="쌀">쌀</option>
                    </select>
                </div>
           
                <div className="grinding-group">
                    <label>주원료 투입량</label>
                    <input type="number" name="mainMaterialInputVolume" value={formData.mainMaterialInputVolume} onChange={handleChange}/>{" "} kg
                </div>
            
                <div className="grinding-group">
                    <label>맥아종류</label>
                    <select name="maltType" value={formData.maltType} onChange={handleChange}>
                        <option value="페일 몰트">페일 몰트</option>
                        <option value="필스너 몰트">필스너 몰트</option>
                        <option value="초코릿 몰트">초콜릿 몰트</option>
                    </select>
                </div>
            
                <div className="grinding-group">
                    <label>맥아아 투입량</label>
                    <input type="number" name="maltInputVolume" value={formData.maltInputVolume} onChange={handleChange}/>{" "} kg
                </div>
           
                <div className="grinding-group">
                    <label>분쇄 간격 설정</label>
                    <input type="number" name="grindIntervalSetting" value={formData.grindIntervalSetting} onChange={handleChange}/>{" "} mm
                </div>
            
                <div className="grinding-group">
                    <label>분쇄 속도 설정</label>
                    <input type="number" name="grindSpeedSetting" value={formData.grindSpeedSetting} onChange={handleChange}/>{" "} RPM
                </div>
            
                <div className="grinding-group">
                    <label>소요 시간</label>
                    <input type="number" name="grindDuration" value={formData.grindDuration} onChange={handleChange}/>{" "} 분
                </div>
           
                <div className="grinding-group">
                    <label>상태 코드</label>
                    <input type="text" name="statusCode" value="SC001" disabled />
                </div>

                <div className="grinding-group">
                    <label>공정 상태</label>
                    <input type="text" name="processStatus" value="대기 중" disabled />
                </div>

                <div className="grinding-group">
                    <label>메모 사항</label>
                    <input type="text" name="notes" value={formData.notes} onChange={handleChange}/>
                </div>
            </div>
        </div>     
    );
};

export default MaterialGrindingForm;
