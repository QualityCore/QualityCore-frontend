import React , {useState} from "react";
import materialGrindingApi from "../../../apis/production-process/material-grinding/MaterialGrindingApi";
import ConfirmModal from "../../standard-information/common/ConfirmModal"; 
import SuccessfulModal from "../../standard-information/common/SuccessfulModal"; 
import ErrorModal from "../../standard-information/common/ErrorModal"; 
import CompleteModal from "../../standard-information/common/CompleteModal";
import "../../../styles/production-process/materialGrinding.css";


const MaterialGrindingControls = ({ grindingData /* , setGrindingData*/ }) => {

    const[timer , setTimer] = useState(0);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [buttonLabel , setButtonLabel] = useState("등록하기");

    const startTimer = () => {
        console.log("⏳ 타이머 시작됨, grindDuration:", grindingData.grindDuration);
        
        // 테스트 모드에서는 10초로 설정, 실제 운영시에는 grindDuration * 60
        const totalTime = process.env.NODE_ENV === "development" ? 10 : Number(grindingData.grindDuration) * 60;
        setTimer(totalTime);

        const countdown = setInterval(() => {
            setTimer(prevTime => {
              const newTime = prevTime - 1;
              if (newTime <= 0) {
                clearInterval(countdown);
                setShowCompleteModal(true);
                return 0;
              }
              return newTime;
            });
          }, 1000);
        };

    // 데이터 저장
    const handleSave = async () => {

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


            const response =await materialGrindingApi.saveGrindingData(saveData);


            if (response && response.httpStatusCode >= 200 && response.httpStatusCode < 300) {
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

    // 버튼 클릭 handler - 현재 버튼 라벨에 따라 동작이 달라짐
    const handleButtonClick = () => {
        console.log(`${buttonLabel} 버튼 클릭됨!`);
        if (buttonLabel === "등록하기") {
          setShowConfirmModal(true);
        } else if (buttonLabel === "다음공정으로 이동") {
        //   setButtonLabel("당화공정으로 이동");
        // } else if (buttonLabel === "당화공정으로 이동") {
        //   console.log("당화공정으로 이동 버튼 클릭됨 - 이동 로직 추가 예정");
          // 여기서 나중에 당화공정 화면으로 이동하는 로직을 추가하면 됩니다.
        }
      };


    return (
        <div className="material-grinding-controls">
        {timer > 0 && (
            <p>
             남은시간: {Math.floor(timer / 60)}분 {timer % 60}초
            </p>
        )}
           <button onClick={handleButtonClick} className="grinding-save-button">
                {buttonLabel}
            </button>
             
             
            {/* 확인 모달 (등록 전) */}
            
            <ConfirmModal
                isOpen={showConfirmModal}
                message=" 등록하시겠습니까?"
                onConfirm={() => {
                setShowConfirmModal(false);
                handleSave();
                }}
                onClose={() => {
                setShowConfirmModal(false);
                }}
            />
           


            {/* 성공 모달 (등록 성공 시) */}
                
                <SuccessfulModal 
                    isOpen={showSuccessModal}
                    message="데이터가 성공적으로 저장되었습니다!" 
                    onClose={() =>{
                    setShowSuccessModal(false)}}
                />
           


            {/*오류 모달 (등록 실패 시) */}
         
                <ErrorModal 
                    isOpen={showErrorModal}
                    message="데이터 저장에 실패했습니다. 다시 시도해주세요." 
                    onClose={() =>{
                    setShowErrorModal(false)}}
                />

                
              {/* 완료 모달 (타이머 종료 후) */}
                <CompleteModal
                    isOpen={showCompleteModal}
                    message={[
                        "원재료 투입 및 분쇄 공정이 완료되었습니다.",
                        "다음 공정으로 이동하시길 바랍니다.",
                      ]}
                    onClose={() => {
                    console.log("완료 모달 닫힘");
                    setShowCompleteModal(false);
                    setButtonLabel("다음공정으로 이동");}}
                />

        </div>
    );
};

export default MaterialGrindingControls;
