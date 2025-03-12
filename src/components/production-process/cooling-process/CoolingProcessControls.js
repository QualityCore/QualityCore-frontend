import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/production-process/CoolingProcessControls.module.css";
import coolingProcessApi from "../../../apis/production-process/cooling-process/CoolingProcessApi";
import ConfirmModal from "../../standard-information/common/ConfirmModal";
import SuccessfulModal from "../../standard-information/common/SuccessfulModal";
import ErrorModal from "../../standard-information/common/ErrorModal";
import CompleteModal from "../../standard-information/common/CompleteModal";

const CoolingProcessControls = ({ workOrder }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCoolingCompleteModal, setShowCoolingCompleteModal] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("등록하기");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCooling, setIsCooling] = useState(false);
  const [temperature, setTemperature] = useState(100); // 🔥 초기 온도 100°C
  const [timeLeft, setTimeLeft] = useState(false);
  const navigate = useNavigate();
  const [coolingData, setCoolingData] = useState({
    lotNo: "",
    coolingTime: 120, // 냉각 시간
    targetTemperature: 5, //  목표 온도 (°C)
    coolantTemperature: 2, //  냉각수 온도 (°C)
    notes: "",
    processStatus: "진행 중",
  }); 


// LOT_NO가 변경되면 데이터 로드
  useEffect(() => {
    const savedLotNo = localStorage.getItem("selectedLotNo");
    if (savedLotNo) {
      setCoolingData((prev) => ({ ...prev, lotNo: savedLotNo }));
    }
  }, []);


  // LOT_NO가 변경되면 자재 정보 및 여과 공정 데이터 조회 실행
    useEffect(() => {
      if (coolingData.lotNo) {
       fetchCoolingData(coolingData.lotNo);
      }
    }, [coolingData.lotNo]);

    
   // 냉각 공정 데이터 가져오기
   const fetchCoolingData = async (lotNo) => {
    try {
      console.log("✅ fetchCoolingData 실행 - LOT_NO:", lotNo);
      const response = await coolingProcessApi.getCoolingProcessByLotNo(lotNo);
  
      if (response && response.result) {
        console.log("✅ 서버에서 받은 냉각 공정 데이터:", response.result);
        setCoolingData((prev) => ({
          ...prev,
          coolingTime: response.result.coolingTime || prev.coolingTime,
          targetTemperature: response.result.targetTemperature || prev.targetTemperature,
          coolantTemperature: response.result.coolantTemperature || prev.coolantTemperature,
          notes: response.result.notes || prev.notes,
          processStatus: response.result.processStatus || prev.processStatus,
        }));
      } else {
        console.warn("⚠️ 서버에서 받은 냉각 공정 데이터가 없음:", response);
      }
    } catch (error) {
      console.error("❌ 냉각 공정 데이터 불러오기 실패:", error);
    }
  };
  

   // ✅ 온도 감소 애니메이션 시작
   const startCooling = () => {
    if (isCooling) return; // 이미 실행 중이면 중복 실행 방지

    setIsCooling(true);
    const coolingInterval = setInterval(() => {
      setTemperature((prevTemp) => {
        const newTemp = prevTemp - 5; // 5°C씩 감소
        if (newTemp <= coolingData.targetTemperature) {
          clearInterval(coolingInterval);
          setShowCoolingCompleteModal(true); // ✅ 목표 온도 도달 시 모달 표시
          setIsCooling(false);
          return coolingData.targetTemperature;
        }
        return newTemp;
      });
    }, 1000); // ✅ 1초마다 5°C 감소
  };



  // ✅ 타이머 실행 함수
  const startTimer = () => {
    setIsTimerRunning(true);
    const totalTime =
      process.env.NODE_ENV === "development"
        ? 5
        : Number(coolingData.coolingTime) * 60;
    setTimeLeft(totalTime);

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(countdown);
          setIsProcessing(false);
          setShowCompleteModal(true); // ✅ 완료 모달 표시
          setButtonLabel("다음 공정 이동");
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

 

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      await coolingProcessApi.createCoolingProcess(coolingData);
      setShowSuccessModal(true);
      setButtonLabel("다음 공정 이동");    
    } catch (error) {
      setShowErrorModal(true);
    }
  };



  const handleNextProcess = async () => {
    try {
     
      navigate("/maturation-details");
    } catch (error) {
      setShowErrorModal(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCoolingData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form
      className={styles.boilingProcessForm}
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 className={styles.title}>냉각 공정</h2>

      <div className={styles.formGrid}>
        <div className={styles.gridItem}>
          <label className={styles.cLabel01}>작업지시 ID</label>
          <input
            className={styles.cItem01}
            type="text"
            name="lotNo"
            value={coolingData.lotNo}
            readOnly
          />
        </div>

        <div className={styles.gridItem}>
          <label className={styles.cLabel02}>냉각 소요 시간 (분):</label>
          <input
            className={styles.cItem02}
            type="text"
            name="coolingTime"
            value={coolingData.coolingTime}
            onChange={handleChange}
          />
        </div>

        <div className={styles.gridItem}>
          <label className={styles.cLabel03}>냉각 목표 온도 (°C):</label>
          <input
            className={styles.cItem03}
            type="number"
            name="targetTemperature"
            value={`${temperature}°C / ${coolingData.targetTemperature}°C`}
            onChange={handleChange}
          />
        </div>

        <div className={styles.gridItem}>
          <label className={styles.cLabel04}>냉각수 온도 (°C):</label>
          <input
            className={styles.cItem04}
            type="number"
            name="coolantTemperature"
            value={coolingData.coolantTemperature}
            onChange={handleChange}
          />
        </div>


        <div className={styles.gridItem}>
          <label className={styles.cLabel05}>공정 상태:</label>
          <input
            className={styles.cItem05}
            type="text"
            name="processStatus"
            value={coolingData.processStatus}
            onChange={handleChange}
          />
        </div>



        <div className={styles.gridItem}>
          <label className={styles.cLabel06}>메모 사항:</label>
          <input
            className={styles.cItem06}
            type="number"
            name="notes"
            value={coolingData.notes}
            onChange={handleChange}
          />
        </div>
      </div>

      {timeLeft > 0 && (
        <p>
          남은시간: {Math.floor(timeLeft / 60)}분 {timeLeft % 60}초
        </p>
      )}

      <div className={styles.fGridItem}>
        <button
          className={styles.fSaveButton}
          onClick={() => {
            if (buttonLabel === "등록하기") {
              setShowConfirmModal(true);
            } else {
              handleNextProcess();
            }
          }}
          disabled={isProcessing}
        >
          {buttonLabel}
        </button>
      </div>

      {/* 모달 처리 */}
      <ConfirmModal
        isOpen={showConfirmModal}
        message="등록하시겠습니까?"
        onConfirm={() => {
          setShowConfirmModal(false);
          handleSave();
        }}
        onClose={() => setShowConfirmModal(false)}
      />

      <SuccessfulModal
        isOpen={showSuccessModal}
        message="데이터가 성공적으로 저장되었습니다!"
        onClose={() => { setShowSuccessModal(false); startCooling(); }} />
      <ErrorModal
        isOpen={showErrorModal}
        message="데이터 저장에 실패했습니다. 다시 시도해주세요."
        onClose={() => setShowErrorModal(false)}
      />
      <CompleteModal
        isOpen={showCompleteModal}
        message={["끓임 공정이 완료되었습니다.", "다음 공정으로 이동하세요."]}
        onClose={() => setShowCompleteModal(false)}
      />

<ConfirmModal isOpen={showCoolingCompleteModal} message="설정한 온도에 도달하여 작업을 시작합니다." onConfirm={() => { setShowCoolingCompleteModal(false); startTimer(); }} />

    </form>
  );
};

export default CoolingProcessControls;
