import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import materialGrindingApi from "../../../apis/production-process/material-grinding/MaterialGrindingApi";
import ConfirmModal from "../../standard-information/common/ConfirmModal"; 
import SuccessfulModal from "../../standard-information/common/SuccessfulModal"; 
import ErrorModal from "../../standard-information/common/ErrorModal"; 
import CompleteModal from "../../standard-information/common/CompleteModal";
import "../../../styles/production-process/materialGrinding.css";

const MaterialGrindingControls = ({ grindingData, setGrindingData }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [timerStarted, setTimerStarted] = useState(false);
    const [timer, setTimer] = useState(0);
    const navigate = useNavigate();
    const [buttonLabel, setButtonLabel] = useState("등록하기");
          

    // 🔹 타이머 설정: 공정 완료까지 남은 시간 카운트다운    
    useEffect(() => {          
      if (timer > 0) {                 
        const interval = setInterval(() => {                         
          setTimer(prev => prev - 1);     
        }, 1000);      
        return () => clearInterval(interval); // ✅ 메모리 누수 방지      
      } else if (timer === 0 && timerStarted) {  
        console.log("✅ 타이머 종료! 완료 모달 열기");        
        setShowCompleteModal(true);        
      }        
    }, [timer]); 

                         
      const startTimer = () => {              
        const totalTime = process.env.NODE_ENV === "development" ? 5 : Number(grindingData.grindDuration) * 60;              
        setTimer(totalTime);        
      };
   
    
      const formatDate = (date) => {              
        if (!date) return "N/A";              
        return new Date(date).toISOString().replace("T", " ").split(".")[0];       
      };
       
    
      const handleSave = async () => {                        
        console.log("🔍 grindingData 전체 데이터:", grindingData);             
        if (!grindingData || !grindingData.maltType) {                    
          alert("⚠️ 맥아 종류를 선택해야 합니다!");                    
          return;              
        }             
        try {                  
          const saveData = { ...grindingData }; // 기존 데이터 복사                                        
          const response = await materialGrindingApi.saveGrindingData(saveData);                      
          if (response.status === 200 || response.status === 201) {                          
            console.log("✅ 데이터 저장 성공:", response);                                   
            const savedData = response.data?.result?.savedMaterialGrinding;                          
            if (!savedData) {                                
              console.warn("⚠️ 응답 데이터에 savedMaterialGrinding 없음:", response.data);                               
              setShowErrorModal(true);                                
              return;                                      
            }                                                         
            setGrindingData(prev => ({                              
              ...prev,                                               
             ...savedData,  // ✅ savedData의 모든 필드를 업데이트                                                   
            }));                                      
            startTimer(); // ✅ 저장 후 타이머 시작       
          }                                            
        } catch (error) {                                             
          console.error("저장 실패:", error);                                             
          setShowErrorModal(true);                        
        }                   
      };                                                                  



    
      const handleConfirmClick = () => {     
        setShowConfirmModal(false);          
        console.log("✅ 확인 버튼 클릭! 성공 모달 열기");     
        setShowSuccessModal(true);     
      };
      

    
      const handleButtonClick = () => {                        
        if (buttonLabel === "등록하기") {                               
          setShowConfirmModal(true);                       
        } else if (buttonLabel === "다음공정으로 이동") {                               
          console.log("🚀 다음 공정으로 이동!");                               
          setGrindingData(prev => ({                                       
            ...prev,                                        
            processStatus: "완료",                                
          }));                                
          navigate("/mashing-process");                        
        }                
      };
    
        
    
      return (                       
        <form className="material-grinding-form" onSubmit={(event) => event.preventDefault()}>                                    
            {timer > 0 && (                                
              <p>남은시간: {Math.floor(timer / 60)}분 {timer % 60}초</p>                        
            )}
                                    
            <div className="grinding-button-container">                
                <button                    
                    onClick={handleButtonClick}                    
                    className={`grinding-save-button ${buttonLabel === "다음공정으로 이동" ? "next-process-button" : ""}`}>
                    {buttonLabel}
                </button>            
            </div>

            
            <ConfirmModal                
                isOpen={showConfirmModal}                
                message=" 등록하시겠습니까?"
                onConfirm={() => {
                  handleConfirmClick();                    
                  setTimeout(handleSave, 100);
                }}
                onClose={() => setShowConfirmModal(false)}            
            />

            <SuccessfulModal 
              isOpen={showSuccessModal} 
              message="데이터가 성공적으로 저장되었습니다!" 
              onClose={() => {
                setShowSuccessModal(false); 
                setShowCompleteModal(true);
            }} 
             
             
            />
            
            <ErrorModal 
              isOpen={showErrorModal} 
              message="데이터 저장에 실패했습니다. 다시 시도해주세요." 
              onClose={() => setShowErrorModal(false)} 
            />
            
            <CompleteModal
                isOpen={showCompleteModal}
                message={["원재료 투입 및 분쇄 공정이 완료되었습니다.", "다음 공정으로 이동하시길 바랍니다."]}
                onClose={() => {
                    console.log("완료 모달 닫힘");
                    setShowCompleteModal(false);
                    setButtonLabel("다음공정으로 이동");
                }}
            />
        </form>
    );
};

export default MaterialGrindingControls;
