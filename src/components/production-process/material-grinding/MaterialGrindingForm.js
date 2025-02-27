import React, { useState , useEffect } from "react";
import materialGrindingApi from "../../../apis/production-process/material-grinding/MaterialGrindingApi"; 
import "../../../styles/production-process/materialGrinding.css";

const MaterialGrindingForm = ({ grindingData,setGrindingData }) => {
    const [formData, setFormData] = useState(grindingData);
    const [workOrders, setWorkOrders] = useState([]);

    useEffect(() => {
        setGrindingData(formData);
    }, [formData, setGrindingData]);

    
    // 작업지시 ID 목록 가져오기       
    useEffect(() => {         
        const fetchWorkOrders = async () => {              
            try {               
                const data = await materialGrindingApi.getWorkOrders(); // 백엔드 API 호출                  
                setWorkOrders(data); // API에서 가져온 데이터를 상태에 저장              
            } catch (error) {                    
                console.error("❌ 작업지시 ID 목록 불러오기 실패:", error);                
            }            
        };               
        fetchWorkOrders();        
    }, []);
    


    
    const materialSettings = {
        "쌀": { grindInterval: 1, grindSpeed: 150 },
        "보리": { grindInterval: 1.5, grindSpeed: 200 },
        "밀": { grindInterval: 1, grindSpeed: 250 },
    };





    const handleChange = (e) => {
        const { name, value } = e.target;    
        setFormData((prev) => {        
            let updatedData = { ...prev, [name]: value };        
            // ✅ 원료(mainMaterial) 변경 시, 분쇄 간격과 속도를 자동 설정       
            if (name === "mainMaterial") {           
                const settings = materialSettings[value] || { grindInterval: "", grindSpeed: "" };           
                updatedData.grindIntervalSetting = settings.grindInterval;           
                updatedData.grindSpeedSetting = settings.grindSpeed;        
            }        
            return updatedData;   
        });
    };


    return (
        <div className="material-grinding-form">
            <h2 className="grinding-title">분쇄 공정</h2>
            <div className="g-form-grid">
                <div className="g-grid-item">

                    <label className="g-label01">작업지시 ID </label>
                    <select 
                        className="g-item01" 
                        name ="lotNo" 
                        value={formData.lotNo}
                        onChange={handleChange}>
                            <option value="">ID 선택</option>
                            {workOrders.map((order)=>(
                                <option key={order} value={order}>
                                    {order}
                                </option>
                            ))}
                    </select>
                </div>
            
                <div className="g-grid-item">
                    <label className="g-label02">주원료</label>
                    <select className="g-item02" name="mainMaterial" value={formData.mainMaterial} onChange={handleChange}>
                        <option value="보리">보리</option>
                        <option value="밀">밀</option>
                        <option value="쌀">쌀</option>
                    </select>
                </div>
           
                <div className="g-grid-item">
                    <label className="g-label03">주원료 투입량</label>
                    <input className="g-item03" type="number" name="mainMaterialInputVolume" value={formData.mainMaterialInputVolume} onChange={handleChange}/>{" "} kg
                </div>
            
                <div className="g-grid-item">
                    <label className="g-label04">맥아종류</label>
                    <select className="g-item04" name="maltType" value={formData.maltType} onChange={handleChange}>
                        <option value="페일 몰트">페일 몰트</option>
                        <option value="필스너 몰트">필스너 몰트</option>
                        <option value="초코릿 몰트">초콜릿 몰트</option>
                    </select>
                </div>
            
                <div className="g-grid-item">
                    <label className="g-label05">맥아 투입량</label>
                    <input className="g-item05" type="number" name="maltInputVolume" value={formData.maltInputVolume} onChange={handleChange}/>{" "} kg
                </div>
           
                <div className="g-grid-item">
                    <label className="g-label06">분쇄 간격 설정</label>
                    <input className="g-item06" type="number" name="grindIntervalSetting" value={formData.grindIntervalSetting} readOnly/>{" "} mm
                </div>
            
                <div className="g-grid-item">
                    <label className="g-label07">분쇄 속도 설정</label>
                    <input className="g-item07" type="number" name="grindSpeedSetting" value={formData.grindSpeedSetting} readOnly/>{" "} RPM
                </div>
            
                <div className="g-grid-item">
                    <label className="g-label08">소요 시간</label>
                    <input className="g-item08" type="number" name="grindDuration" value={formData.grindDuration} onChange={handleChange}/>{" "} 분
                </div>
           
                <div className="g-grid-item">
                    <label className="g-label09">상태 코드</label>
                    <input className="g-item09" type="text" name="statusCode" value="SC001" disabled />
                </div>

                <div className="g-grid-item">
                    <label className="g-label10">공정 상태</label>
                    <input className="g-item10" type="text" name="processStatus" value="대기 중" disabled />
                </div>

                <div className="g-grid-item">
                    <label className="g-label11">메모 사항</label>
                    <input className="g-item11" type="text" name="notes" value={formData.notes} onChange={handleChange}/>
                </div>
            </div>
        </div>     
    ); 
};

export default MaterialGrindingForm;
