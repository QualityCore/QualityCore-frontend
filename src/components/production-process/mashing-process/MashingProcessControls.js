import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import mashingProcessApi from "../../../apis/production-process/mashing-process/MashingProcessApi";
import ConfirmModal from "../../standard-information/common/ConfirmModal";
import SuccessfulModal from "../../standard-information/common/SuccessfulModal";
import ErrorModal from "../../standard-information/common/ErrorModal";
import CompleteModal from "../../standard-information/common/CompleteModal";
import styles from "../../../styles/production-process/MashingProcessControls.module.css";




const MashingProcessControls = ({ workOrder }) => {
  const { mashingId } = useParams(); // URL에서 ID 가져오기
  const [mashingData, setMashingData] = useState({
    lotNo: workOrder?.lotNo || "", // 작업지시 ID 자동 불러오기
    mashingTime: "50",
    temperature: "65",
    phValue: "",
    grainRatio: "",
    waterRatio: "",
    waterInputVolume: "",
    notes: "",
  });

  const [timer, setTimer] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("등록하기");
  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 함수!



  useEffect(() => {
    const savedLotNo = localStorage.getItem("selectedLotNo");
    if (savedLotNo) {
      setMashingData((prev) => ({ ...prev, lotNo: savedLotNo }));
    }
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMashingData((prev) => ({ ...prev, [name]: value }));
  };

  // 타이머 시작 함수
  const startTimer = () => {
    console.log("⏳ 타이머 시작됨, mashingTime:", mashingData.mashingTime);

    const totalTime =
      process.env.NODE_ENV === "development"
        ? 5
        : Number(mashingData.mashingTime) * 60;
    setTimer(totalTime);
    setIsProcessing(true);

    const countdown = setInterval(() => {
      setTimer((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(countdown);
          setShowCompleteModal(true);
          setIsProcessing(false);
          setButtonLabel("다음 공정 이동");
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

   // 데이터 저장 (등록하기 버튼 클릭 시)
   const handleSave = async () => {
    if (!mashingData.temperature || !mashingData.grainRatio || !mashingData.waterRatio) {
      alert("⚠️ 필수 입력값을 입력해주세요!");
      return;
    }

    try {
      const saveData = { 
        ...mashingData,
        processStatus: "진행 중", // 공정 상태 변경
        statusCode: "SC002", // 상태 코드 업데이트
        processName: "당화", // 공정 이름 업데이트
      };

      // 1️⃣ 당화공정 데이터 저장 (saveMashingData API 호출)
      await mashingProcessApi.saveMashingData(saveData);

      // 2️⃣ processTracking 업데이트 (updateMashingProcess API 호출)
      await mashingProcessApi.updateMashingProcess(mashingId, saveData);

      setShowSuccessModal(true);
      setButtonLabel("다음 공정 이동");
      startTimer();
    } catch (error) {
      setShowErrorModal(true);
    }
  };

  // 다음 공정으로 이동 (phValue와 actualEndTime 업데이트)
  const handleNextProcess = async () => {
    try {
      const updateData = {
        phValue: mashingData.phValue,
        actualEndTime: new Date().toISOString(), // 현재 시간 저장
      };

      await mashingProcessApi.updateMashingProcess(mashingId, updateData);

      navigate("/fermentation");
    } catch (error) {
      setShowErrorModal(true);
    }
  };


   // 버튼 클릭 핸들러
  const handleButtonClick = () => {
    if (buttonLabel === "등록하기") {
      handleSave();
    } else if (buttonLabel === "다음 공정 이동") {
      handleNextProcess();
    }
  };

  return (
    <form
      className={styles.mashingProcessForm}
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 className={styles.mashingTitle}>당화공정</h2>

      <div className={styles.mFormGrid}>
        <div className={styles.mGridItem}>
          <label className={styles.mLabel01}>작업지시 ID</label>
          <input
            className={styles.mItem01}
            type="text"
            value={mashingData.lotNo}
            readOnly
          />
        </div>

        <div className={styles.mGridItem}>
          <label className={styles.mLabel02}>당화 소요 시간</label>
          <input
            className={styles.mItem02}
            type="number"
            name="mashingTime"
            value={mashingData.mashingTime}
            onChange={handleChange}
          />
        </div>

        <div className={styles.mGridItem}>
          <label className={styles.mLabel03}>당화 온도</label>
          <input
            className={styles.mItem03}
            type="number"
            name="temperature"
            value={mashingData.temperature}
            onChange={handleChange}
          />
        </div>

        <div className={styles.mGridItem}>
          <label className={styles.mLabel04}>pH값</label>
          <input
            className={styles.mItem04}
            type="number"
            name="phValue"
            value={mashingData.phValue}
            onChange={handleChange}
            disabled={!isProcessing && timer > 0}
          />
        </div>

        <div className={styles.mGridItem}>
          <label className={styles.mLabel05}>곡물 비율</label>
          <input
            className={styles.mItem05}
            type="number"
            name="grainRatio"
            value={mashingData.grainRatio}
            onChange={handleChange}
          />
          <label className={styles.mLabel051}>물 비율</label>
          <input
            className={styles.mItem05}
            type="number"
            name="waterRatio"
            value={mashingData.waterRatio}
            onChange={handleChange}
          />
        </div>

        <div className={styles.mGridItem}>
          <label className={styles.mLabel06}>물 투입량</label>
          <input
            className={styles.mItem06}
            type="number"
            name="waterInputVolume"
            value={mashingData.waterInputVolume}
            onChange={handleChange}
          />
        </div>

        <div className={styles.mGridItem}>
          <label className={styles.mLabel07}>공정 상태</label>
          <input
            className={styles.mItem07}
            type="text"
            value={mashingData.processStatus}
            readOnly
          />
        </div>

        <div className={styles.mGridItem}>
          <label className={styles.mLabel08}>메모 사항</label>
          <input
            className={styles.mItem08}
            type="text"
            name="notes"
            value={mashingData.notes}
            onChange={handleChange}
          />
        </div>

        {timer > 0 && (
          <p>
            남은시간: {Math.floor(timer / 60)}분 {timer % 60}초
          </p>
        )}

        <div className={styles.mGridItem}>
          <button
            className={styles.mSaveButton}
            onClick={handleButtonClick}
            disabled={buttonLabel === "등록하기" && timer > 0}
          >
            {buttonLabel}
          </button>
        </div>

        <ConfirmModal
          isOpen={showConfirmModal}
          message="등록하시겠습니까?"
          onConfirm={() => {
            setShowConfirmModal(false);
            setTimeout(handleSave, 100);
          }}
          onClose={() => setShowConfirmModal(false)}
        />

        <SuccessfulModal
          isOpen={showSuccessModal}
          message="데이터가 성공적으로 저장되었습니다!"
          onClose={() => setShowSuccessModal(false)}
        />

        <ErrorModal
          isOpen={showErrorModal}
          message="데이터 저장에 실패했습니다. 다시 시도해주세요."
          onClose={() => setShowErrorModal(false)}
        />

        <CompleteModal
          isOpen={showCompleteModal}
          message={["당화 공정이 완료되었습니다.", "다음 공정으로 이동하세요."]}
          onClose={() => setShowCompleteModal(false)}
        />
      </div>
    </form>
  );
};

export default MashingProcessControls;
