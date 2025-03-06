import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import materialGrindingApi from "../../../apis/production-process/material-grinding/MaterialGrindingApi";
import ConfirmModal from "../../standard-information/common/ConfirmModal";
import SuccessfulModal from "../../standard-information/common/SuccessfulModal";
import ErrorModal from "../../standard-information/common/ErrorModal";
import CompleteModal from "../../standard-information/common/CompleteModal";
import styles from "../../../styles/production-process/MaterialGrindingControls.module.css";

const MaterialGrindingControls = ({ grindingData, setGrindingData }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();
  const [buttonLabel, setButtonLabel] = useState("등록하기");
  
  
  
  useEffect(() => {
    if (grindingData?.lotNo) {
      localStorage.setItem("selectedLotNo", grindingData.lotNo);
    }
  }, [grindingData?.lotNo]);




  // 🔹 타이머 설정: 공정 완료까지 남은 시간 카운트다운
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval); // ✅ 메모리 누수 방지
    } else if (timer === 0 && timerStarted) {
      setShowCompleteModal(true);
      setTimerStarted(false); // 모달이 뜬 후 타이머 상태 리셋
    }
  }, [timer, timerStarted]); // 상태체크

  const startTimer = () => {
    setTimerStarted(true); // ✅ 타이머 실행됨을 명확히 설정
    const totalTime =
      process.env.NODE_ENV === "development"
        ? 5
        : Number(grindingData.grindDuration) * 60;
    setTimer(totalTime);

    // ✅ 부모 상태 업데이트
    setGrindingData((prev) => ({ ...prev, processStatus: "진행 중" }));
  };

  const handleSave = async () => {
    console.log("🔍 grindingData 전체 데이터:", grindingData);

    if (!grindingData || !grindingData.lotNo) {
      alert("⚠️ LOT_NO를 입력해야 합니다!");
      return;
    }

    try {
      // ✅ LOT_NO가 이미 DB에 있는지 확인하는 API 호출
      const checkLotResponse = await materialGrindingApi.getMaterialByLotNo(
        grindingData.lotNo
      );
      const savedData = { ...grindingData}; // 상태 변경
      console.log("✅ 저장할 데이터:", savedData);


      console.log("🔍 LOT_NO 확인 API 응답:", checkLotResponse);

      await materialGrindingApi.saveGrindingData(savedData);

      // ✅ 상태 업데이트 (UPDATE)
      const updatedData = {
        lotNo: grindingData.lotNo,
        processTracking: { processStatus: "진행 중" },
      };
      console.log("✅ 상태 업데이트 요청:", updatedData);
      const response = await materialGrindingApi.updateProcessStatus(
        updatedData
      );

      if (response.status === 200 || response.status === 201) {
        console.log("✅ 데이터 저장 & 상태 업데이트 성공:", response);
        setGrindingData((prev) => ({ ...prev, processStatus: "진행 중" }));
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error("❌ 저장 실패:", error);
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
    } else if (buttonLabel === "다음공정 이동") {
      setGrindingData((prev) => ({
        ...prev,
        processStatus: "대기 중",
      }));
      navigate("/mashing-process");
    }
  };

  return (
    <form
      className={styles.materialGrindingForm}
      onSubmit={(event) => event.preventDefault()}
    >
      {timer > 0 && (
        <p className={styles.timerDisplay}>
          남은시간: {Math.floor(timer / 60)}분 {timer % 60}초
        </p>
      )}

      <div className={styles.grindingButtonContainer}>
        <button
          onClick={handleButtonClick}
          className={` ${styles.grindingSaveButton} ${
            buttonLabel === "다음공정 이동" ? `${styles.nextProcessButton}` : ""
          }`}
        >
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
          setTimerStarted(true); // 타이머 실행됨을 명확히 설정
          startTimer(); // 확인눌렀을때 타이머 시작
        }}
      />

      <ErrorModal
        isOpen={showErrorModal}
        message="데이터 저장에 실패했습니다. 다시 시도해주세요."
        onClose={() => setShowErrorModal(false)}
      />

      <CompleteModal
        isOpen={showCompleteModal}
        message={[
          "원재료 투입 및 분쇄 공정이 완료되었습니다.",
          "다음 공정으로 이동하시길 바랍니다.",
        ]}
        onClose={() => {
          console.log("완료 모달 닫힘");
          setShowCompleteModal(false);
          setButtonLabel("다음공정 이동");
        }}
      />
    </form>
  );
};

export default MaterialGrindingControls;
