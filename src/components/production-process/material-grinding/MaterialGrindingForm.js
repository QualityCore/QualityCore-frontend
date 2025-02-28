import React, { useState , useEffect } from "react";
import materialGrindingApi from "../../../apis/production-process/material-grinding/MaterialGrindingApi"; 
import "../../../styles/production-process/materialGrinding.css";

const MaterialGrindingForm = ({ grindingData,setGrindingData }) => {
    const [formData, setFormData] = useState(grindingData);
    const [lineMaterial, setLineMaterial] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState("");
    const [processStatus, setProcessStatus] = useState("대기 중");

    useEffect(() => {
        setGrindingData(formData);
    }, [formData, setGrindingData]);

    
    // 작업지시 ID 목록 가져오기 (중복 제거 추가)
    useEffect(() => {         
        const fetchLineMaterial = async () => {              
            try {               
                const data = await materialGrindingApi.getLineMaterial(); // 백엔드 API 호출  
                console.log("📌 API 응답 데이터:", data);

                 // lotNo가 존재하는 데이터만 필터링
                const filteredData = data.filter(item => item.lotNo);              
                // 중복된 lotNo 제거 (Set 사용)
                const uniqueLots = Array.from(new Set(data.map(item => item.lotNo)))
                    .map(lotNo => data.find(item => item.lotNo === lotNo));
                
                setLineMaterial(uniqueLots); // 중복 제거된 데이터 저장              
            } catch (error) {                    
                console.error("❌ 작업지시 ID 목록 불러오기 실패:", error);                
            }            
        };               
        fetchLineMaterial();        
    }, []);
    


      // 주원료 필터링: "보리", "밀", "쌀"만 허용
      const allowedMaterials = ["보리", "밀", "쌀"];

      const handleLotNoChange = async (e) => {
        const selectedLotNo = e.target.value;
        setFormData(prev => ({ ...prev, lotNo: selectedLotNo }));
    
        if (!selectedLotNo) return;
    
        try {
            const materialData = await materialGrindingApi.getMaterialByLotNo(selectedLotNo);
            console.log("📌 불러온 원료 데이터:", materialData);
    
            if (!materialData || materialData.length === 0) {
                console.warn("⚠️ 주원료 데이터가 없습니다.");
                setSelectedMaterial("");
                setFormData(prev => ({ 
                    ...prev, 
                    mainMaterial: "", 
                    mainMaterialInputVolume: "", 
                    maltType: "", 
                    maltInputVolume: "" 
                }));
                return;
            }
    
            // 🔹 `allowedMaterials`에 포함된 원료 찾기
            const validMaterial = materialData.find(item => allowedMaterials.includes(item.materialName));
    
            // 🔹 `maltTypes`(맥아 종류) 중에서 존재하는 맥아 찾기
            const validMalt = materialData.find(item => maltTypes.includes(item.materialName));
    
            if (validMaterial) {
                const materialName = validMaterial.materialName;
                const requiredQty = validMaterial.requiredQtyPerUnit || 0;
    
                setSelectedMaterial(materialName);
                setFormData(prev => ({
                    ...prev,
                    mainMaterial: materialName,
                    mainMaterialInputVolume: requiredQty,
                    grindIntervalSetting: materialSettings[materialName]?.grindInterval || "",
                    grindSpeedSetting: materialSettings[materialName]?.grindSpeed || "",
                    maltType: validMalt ? validMalt.materialName : "",  
                    maltInputVolume: validMalt ? validMalt.requiredQtyPerUnit || 0 : "" 
                }));
            } else {
                console.warn(`⚠️ 허용되지 않은 원료만 포함됨: ${materialData.map(item => item.materialName).join(", ")}`);
                setSelectedMaterial("");
                setFormData(prev => ({
                    ...prev,
                    mainMaterial: "",
                    mainMaterialInputVolume: "",
                    grindIntervalSetting: "",
                    grindSpeedSetting: "",
                    maltType: "",
                    maltInputVolume: ""
                }));
            }
        } catch (error) {
            console.error("❌ 주원료 불러오기 실패:", error);
            setSelectedMaterial("");
            setFormData(prev => ({
                ...prev,
                mainMaterial: "",
                mainMaterialInputVolume: "",
                grindIntervalSetting: "",
                grindSpeedSetting: "",
                maltType: "",
                maltInputVolume: ""
            }));
        }
    };
    
    // ✅ 허용된 맥아 종류 리스트
    const maltTypes = ["페일 몰트", "필스너 몰트", "초콜릿 몰트"];


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


    const handleRegister = () => {
        setProcessStatus("작업 중");
    };

    return (
        <div className="material-grinding-form">
            <h2 className="grinding-title">분쇄 공정</h2>
            <div className="g-form-grid">
            <div className="g-grid-item">
                    <label className="g-label01">작업지시 ID </label>
                    <select 
                        className="g-item01" 
                        name="lotNo" 
                        value={formData.lotNo}
                        onChange={handleLotNoChange}> 
                            <option value="">ID 선택</option>
                            {lineMaterial.map((item) => (
                                <option key={item.lineMaterialId} value={item.lotNo}>
                                    {item.lotNo}
                                </option>
                            ))}
                    </select>
                </div>
            
                <div className="g-grid-item">
                <label className="g-label02">주원료</label>
                    <input 
                        className="g-item02" 
                        type="text" 
                        name="mainMaterial" 
                        value={selectedMaterial} 
                        readOnly 
                    />
                </div>
           
                <div className="g-grid-item">
                    <label className="g-label03">주원료 투입량</label>
                    <input className="g-item03" type="number" name="mainMaterialInputVolume" value={formData.mainMaterialInputVolume} onChange={handleChange}/>{" "} kg
                </div>
            
                <div className="g-grid-item">
                    <label className="g-label04">맥아종류</label>
                    <input 
                    className="g-item04" 
                    type="text" 
                    name="maltType" 
                    value={formData.maltType} 
                    readOnly 
                    />
                </div>
            
                <div className="g-grid-item">
                    <label className="g-label05">맥아 투입량</label>
                    <input 
                    className="g-item05" 
                    type="number" 
                    name="maltInputVolume" 
                    value={formData.maltInputVolume} 
                    readOnly
                    /> kg
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
                    <input className="g-item10" type="text" name="processStatus" value={processStatus} disabled />
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
