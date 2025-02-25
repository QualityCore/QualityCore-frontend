import React , {useState} from "react";
import materialGrindingApi from "../../../apis/production-process/material-grinding/MaterialGrindingApi";
import ConfirmModal from "../../standard-information/common/ConfirmModal"; 
import SuccessfulModal from "../../standard-information/common/SuccessfulModal"; 
import ErrorModal from "../../standard-information/common/ErrorModal"; 



const MaterialGrindingControls = ({ grindingData /* , setGrindingData*/ }) => {

    const[timer , setTimer] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);


    const startTimer = () => {
        console.log("⏳ 타이머 시작됨, grindDuration:", grindingData.grindDuration);
        const totalTime = Number(grindingData.grindDuration) * 60;
        setTimer(totalTime);

        const countdown = setInterval(() => {
            setTimer(prevTime => {
              const newTime = prevTime - 1;
              if (newTime <= 0) {
                clearInterval(countdown);
                return 0;
              }
              return newTime;
            });
          }, 1000);
        };

    // 데이터 저장
    const handleSave = async () => {
        console.log("handleSave 실행됨");

        if (!grindingData || !grindingData.maltType) {
            console.log("⚠️ grindingData 값이 올바르지 않음!", grindingData);
            alert("⚠️ 맥아 종류를 선택해야 합니다!");
            return;
        }

        try {
            const saveData = {
                ...grindingData,
                maltType : grindingData.maltType || "", // 기본값 적용
                processStatus : "가동중", // 공정상태 변경!
            };

            console.log("📡 서버로 전송할 데이터:", saveData);

            const response =await materialGrindingApi.saveGrindingData(saveData);

            console.log("서버응답", response); // 서버응답 확인

            if (response && response.httpStatusCode >= 200 && response.httpStatusCode < 300) {
                console.log("✅ 백엔드에서 성공 응답 받음");
                setShowSuccessModal(true); // 성공 모달 표시
                // setGrindingData((prev) => ({ ...prev, processStatus: "가동중" }));
                startTimer();
              } else {
                console.error("예상치 못한 응답:", response);
                setShowErrorModal(true);
              }
        } catch (error) {
            console.error("저장 실패:", error);
            setShowErrorModal(true); 
        }
      
    };

    return (
        <div className="material-grinding-controls">
        {timer > 0 && (
            <p>
             남은시간: {Math.floor(timer / 60)}분 {timer % 60}초
            </p>
        )}
            <button onClick={() => { 
                console.log("🚀 등록 버튼 클릭됨!");
                setShowConfirmModal(true);
            }} className="save-button"> 등록하기</button>
             
             
            {/* 확인 모달 (등록 전) */}
            
            <ConfirmModal
                isOpen={showConfirmModal}
                message=" 등록하시겠습니까?"
                onConfirm={() => {
                console.log("✅ 확인 버튼 클릭됨!");
                setShowConfirmModal(false);
                handleSave();
            }}
            onCancel={() => {
                console.log("❌ 취소 버튼 클릭됨!");
                setShowConfirmModal(false);
            }}
            />
           


            {/* 성공 모달 (등록 성공 시) */}
                
                <SuccessfulModal 
                    isOpen={showSuccessModal}
                    message="데이터가 성공적으로 저장되었습니다!" 
                    onClose={() =>{
                        console.log("성공모달닫힘");
                        setShowSuccessModal(false)}}
                />
           


            {/*오류 모달 (등록 실패 시) */}
         
                <ErrorModal 
                    isOpen={showErrorModal}
                    message="데이터 저장에 실패했습니다. 다시 시도해주세요." 
                    onClose={() =>{
                        console.log("오류모달 닫힘");
                         setShowErrorModal(false)}}
                />
         


        </div>
    );
};

export default MaterialGrindingControls;
