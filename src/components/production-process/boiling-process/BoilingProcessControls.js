import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import boilingProcessApi from "../../../apis/production-process/boiling-process/BoilingProcessApi";
import filtrationProcessApi from "../../../apis/production-process/filtration-process/FiltrationProcessApi";
import ConfirmModal from "../../standard-information/common/ConfirmModal";
import SuccessfulModal from "../../standard-information/common/SuccessfulModal";
import ErrorModal from "../../standard-information/common/ErrorModal";
import CompleteModal from "../../standard-information/common/CompleteModal";
import styles from "../../../styles/production-process/BoilingProcessControls.module.css";

const BoilingProcessControls = ({ workOrder }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("등록하기");
  const [isProcessing, setIsProcessing] = useState(false);
  const [timer, setTimer] = useState(0); // 타이머 변수 통일
  const navigate = useNavigate();
  const [boilingData, setBoilingData] = useState({
    lotNo: "",
    boilingTime: 60,
    temperature: 100,
    initialWortVolume: "",
    postBoilWortVolume: "",
    boilLossVolume: "",
    firstHopName: "마그너 홉",
    firstHopAmount: "",
    secondHopName: "",
    secondHopAmount: "",
    processStatus: "진행 중",
    notes: "",
  });

  // 로컬스토리지에서 LOT_NO를 불러와 상태에 저장
  useEffect(() => {
    const savedLotNo = localStorage.getItem("selectedLotNo");
    if (savedLotNo) {
      setBoilingData((prev) => ({ ...prev, lotNo: savedLotNo }));
    }
  }, []);

  // LOT_NO가 변경되면 자재 정보 및 여과 공정 데이터 조회 실행
  useEffect(() => {
    if (boilingData.lotNo) {
      fetchMaterials(boilingData.lotNo);
      fetchFiltrationData(boilingData.lotNo);
      fetchBoilingData(boilingData.lotNo);
    }
  }, [boilingData.lotNo]);

  // 여과 공정 데이터 조회 함수
  const fetchFiltrationData = async (lotNo) => {
    try {
      const filtrationData =
        await filtrationProcessApi.getFiltrationProcessesByLotNo(lotNo);
      if (filtrationData.length > 0) {
        setBoilingData((prev) => ({
          ...prev,
          initialWortVolume: filtrationData[0].recoveredWortVolume || "",
        }));
      }
    } catch (error) {
      console.error(`❌ 여과 공정 데이터 조회 실패 (LOT_NO: ${lotNo}):`, error);
    }
  };

  // ✅ 끓임 공정 데이터 불러올 때 boilingId 포함
  const fetchBoilingData = async (lotNo) => {
    try {
      const response = await boilingProcessApi.getBoilingProcessByLotNo(lotNo);
      console.log("✅ 가져온 끓임 공정 데이터:", response);

      if (response.boilingProcesses && response.boilingProcesses.length > 0) {
        const latestBoilingProcess = response.boilingProcesses[0]; // ✅ 첫 번째 데이터 선택
        setBoilingData((prev) => ({
          ...prev,
          boilingId: latestBoilingProcess.boilingId,
          postBoilWortVolume: latestBoilingProcess.postBoilWortVolume || "",
          boilLossVolume: latestBoilingProcess.boilLossVolume || "",
          processStatus: latestBoilingProcess.processStatus || "진행 중",
        }));
      } else {
        console.warn("⚠️ 끓임 공정 데이터가 없습니다.");
      }
    } catch (error) {
      console.error(`❌ 끓임 공정 데이터 조회 실패 (LOT_NO: ${lotNo}):`, error);
    }
  };

  // 자재 정보 조회 함수 (API 주소를 참고하여 수정)
  const fetchMaterials = async (lotNo) => {
    try {
      // boilingProcessApi의 getMaterialsByLotNo 메서드를 사용하여 자재 정보를 조회
      const materials = await boilingProcessApi.getMaterialsByLotNo(lotNo);

      // 첫 번째 홉: "마그너 홉" "캐스케이드 홉" 또는 "아마릴로 홉" 중 조회
      const firstHop = materials.find(
        (item) =>
          item.materialName === "마그너 홉" ||
          item.materialName === "캐스케이드 홉" ||
          item.materialName === "아마릴로 홉"
      );

      // 두 번째 홉: "캐스케이드 홉" 또는 "아마릴로 홉" 중 조회
      const secondHop = materials.find(
        (item) =>
          item.materialName === "캐스케이드 홉" ||
          item.materialName === "아마릴로 홉"
      );

      // 상태 업데이트: 각 홉의 이름과 totalQty 값을 반영
      setBoilingData((prev) => ({
        ...prev,
        firstHopName: firstHop ? firstHop.materialName : "",
        firstHopAmount: firstHop ? firstHop.totalQty : 0,
        secondHopName: secondHop ? secondHop.materialName : "",
        secondHopAmount: secondHop ? secondHop.totalQty : 0,
      }));
    } catch (error) {
      console.error(`❌ 자재 정보 조회 실패 (LOT_NO: ${lotNo}):`, error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBoilingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsProcessing(true);
      await boilingProcessApi.saveBoilingProcess(boilingData);
      setShowSuccessModal(true);
      setButtonLabel("다음 공정 이동");
    } catch (error) {
      setShowErrorModal(true);
    }
  };

  // ✅ 타이머 실행 함수
  const startTimer = () => {
    setIsProcessing(true);
    const totalTime =
      process.env.NODE_ENV === "development"
        ? 5
        : Number(boilingData.boilingTime) * 60;
    setTimer(totalTime);

    const countdown = setInterval(() => {
      setTimer((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          clearInterval(countdown);
          setIsProcessing(false);
          setShowCompleteModal(true); // ✅ 완료 모달 표시
          setButtonLabel("다음 공정 이동");
          calculateLoss();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  };

  const calculateLoss = () => {
    const initialVolume = Number(boilingData.initialWortVolume);
    const lossVolume = (initialVolume * 0.05).toFixed(2);
    const postBoilVolume = (initialVolume - lossVolume).toFixed(2);
    setBoilingData((prev) => ({
      ...prev,
      boilLossVolume: lossVolume,
      postBoilWortVolume: postBoilVolume,
    }));
  };

  const handleNextProcess = async () => {
    try {
      const { boilingId, postBoilWortVolume, boilLossVolume } = boilingData;
  
      if (!boilingId) {
        throw new Error("Boiling ID is missing!");
      }
      console.log("📌 업데이트 요청 데이터:", { boilingId, postBoilWortVolume, boilLossVolume });
  
      await boilingProcessApi.updateBoilingProcess(boilingId, {
        postBoilWortVolume,
        boilLossVolume,
        actualEndTime: new Date().toISOString(),
      });
  
      navigate("/cooling-process");
    } catch (error) {
      setShowErrorModal(true);
    }
  };

  return (
    <form
      className={styles.boilingProcessForm}
      onSubmit={(e) => e.preventDefault()}
    >
      <h2 className={styles.boilingTitle}>끓임 공정</h2>

      <div className={styles.formGrid}>
        
        <div className={styles.gridItem}>
          <label className={styles.bLabel01}>작업지시 ID</label>
          <input
            className={styles.bItem01}
            type="text"
            name="lotNo"
            value={boilingData.lotNo}
            readOnly
          />
        </div>

        <div className={styles.gridItem}>
          <label className={styles.bLabel02}>끓임 시간 (분)</label>
          <input
            className={styles.bItem02}
            type="number"
            name="boilingTime"
            value={boilingData.boilingTime}
            onChange={handleChange}
          />
        </div>

        <div className={styles.gridItem}>
          <label className={styles.bLabel03}>끓임 온도 (°C)</label>
          <input
            className={styles.bItem03}
            type="number"
            name="temperature"
            value={boilingData.temperature}
            onChange={handleChange}
          />
        </div>

        <div className={styles.gridItem}>
          <label className={styles.bLabel04}>초기 워트량 (L)</label>
          <input
            className={styles.bItem04}
            type="number"
            name="initialWortVolume"
            value={boilingData.initialWortVolume}
            readOnly
          />
        </div>

        <div className={styles.gridItem}>
          <label className={styles.bLabel05}>끓임 후 워트량 (L)</label>
          <input
            className={styles.bItem05}
            type="number"
            name="postBoilWortVolume"
            value={boilingData.postBoilWortVolume}
            readOnly
          />
        </div>

        <div className={styles.gridItem}>
          <label className={styles.bLabel06}>끓임 손실량 (L)</label>
          <input
            className={styles.bItem06}
            type="number"
            name="boilLossVolume"
            value={boilingData.boilLossVolume}
            readOnly
          />
        </div>

        <div className={styles.gridItem}>
          <label className={styles.bLabel07}>첫 번째 홉</label>
          <input
            className={styles.bItem07}
            type="text"
            name="firstHopName"
            value={boilingData.firstHopName}
            readOnly
          />
        </div>

        <div className={styles.gridItem}>
          <label className={styles.bLabel08}>첫 번째 홉 투입량 (g)</label>
          <input
            className={styles.bItem08}
            type="number"
            name="firstHopAmount"
            value={boilingData.firstHopAmount}
            readOnly
          />
        </div>

        <div className={styles.gridItem}>
          <label className={styles.bLabel09}>두 번째 홉</label>
          <input
            className={styles.bItem09}
            type="text"
            name="secondHopName"
            value={boilingData.secondHopName}
            readOnly
          />
        </div> 

        <div className={styles.gridItem}>
          <label className={styles.bLabel10}>두 번째 홉 투입량 (g)</label>
          <input
            className={styles.bItem10}
            type="number"
            name="secondHopAmount"
            value={boilingData.secondHopAmount}
            readOnly
          />
        </div>

        <div className={styles.gridItem}>
          <label className={styles.bLabel11}>공정 상태</label>
          <input
            className={styles.bItem11}
            type="text"
            name="processStatus"
            value={boilingData.processStatus}
            readOnly
          />
        </div>

        <div className={styles.gridItem}>
          <label className={styles.bLabel12}>메모 사항</label>
          <input
            className={styles.bItem12}
            type="text"
            name="notes"
            value={boilingData.notes}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* 타이머와 버튼을 포함하는 컨테이너 */}
      <div className={styles.controlsContainer}>
        {/* 타이머 영역 - 타이머가 있을 때만 표시 */}
        {timer > 0 ? (
          <div className={styles.timerContainer}>
            <div className={styles.timerLabel}>끓임 공정 진행 중</div>
            <div className={styles.timerDisplay}>
              <img src="/images/clock-un.gif" alt="타이머" className={styles.timerIcon} />
              <div className={styles.timerValue}>
                {String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}
              </div>
            </div>
            <div className={styles.timerStatus}>
              {isProcessing ? "공정이 진행 중입니다" : ""}
            </div>
          </div>
        ) : (
          <div></div> /* 타이머가 없을 때 빈 공간 생성 */
        )}
        
        {/* 버튼 영역 - 항상 오른쪽에 배치 */}
        <div className={styles.buttonContainer}>
          <button
            className={styles.bSaveButton}
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
        onClose={() => {
          setShowSuccessModal(false);
          startTimer(); // 타이머 시작
        }}
      />
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
    </form>
  );
};

export default BoilingProcessControls;