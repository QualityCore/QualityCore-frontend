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
  const [mashingData, setMashingData] = useState({
    lotNo: workOrder?.lotNo || "", // 작업지시 ID 자동 불러오기
    mashingTime: "50",
    temperature: "65",
    phValue: "",
    grainRatio: "",
    waterRatio: "",
    waterInputVolume: "",
    processStatus: "진행 중",
    statusCode: "SC002",
    processName: "당화",
    notes: "",
  });

  const [timer, setTimer] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [mashingId, setMashingId] = useState(null);
  const [buttonLabel, setButtonLabel] = useState("등록하기");
  const navigate = useNavigate(); // ✅ 페이지 이동을 위한 함수!

  // ✅ workOrder가 변경될 때 lotNo를 업데이트
  useEffect(() => {
    if (workOrder?.lotNo) {
      setMashingData((prev) => ({ ...prev, lotNo: workOrder.lotNo }));
    }
  }, [workOrder]);

  // ✅ LOT_NO가 변경될 때 API 호출하여 "물" 데이터 가져오기
  useEffect(() => {
    if (!mashingData.lotNo) return; // ✅ LOT_NO가 없으면 실행하지 않음

    const fetchWaterInputVolume = async () => {
      try {
        console.log(`📌 LOT_NO=${mashingData.lotNo}의 자재 목록 조회 요청`);

        const materialsList = await mashingProcessApi.getMaterialsByLotNo(
          mashingData.lotNo
        );

        console.log("✅ 자재 목록:", materialsList);

        const waterMaterial = materialsList.find(
          (item) => item.materialName === "물"
        );

        if (waterMaterial) {
          console.log(`🔍 물 데이터 찾음: ${waterMaterial.totalQty} L`);
          setMashingData((prev) => ({
            ...prev,
            waterInputVolume: waterMaterial.totalQty, // ✅ 물 투입량 설정
          }));
        } else {
          console.warn("⚠️ 물 데이터가 없음");
        }
      } catch (error) {
        console.error("❌ 물 투입량 데이터를 가져오는 데 실패했습니다.", error);
      }
    };

    fetchWaterInputVolume();
  }, [mashingData.lotNo]);

  useEffect(() => {
    const savedLotNo = localStorage.getItem("selectedLotNo");
    if (savedLotNo) {
      setMashingData((prev) => ({ ...prev, lotNo: savedLotNo }));
    }
  }, []);

  // ✅ LOT_NO가 변경될 때 API 호출하여 자재 목록 조회 & 물 데이터 설정
  useEffect(() => {
    if (!mashingData.lotNo) return;

    const fetchMaterialData = async () => {
      try {
        console.log(`📌 LOT_NO=${mashingData.lotNo}의 자재 목록 조회 요청`);

        const materialsList = await mashingProcessApi.getMaterialsByLotNo(
          mashingData.lotNo
        );
        console.log("✅ 불러온 자재 목록:", materialsList);

        // ✅ "물" 데이터 찾기
        const waterMaterial = materialsList.find(
          (item) => item.materialName === "물"
        );
        const waterInputVolume = waterMaterial
          ? Number(waterMaterial.totalQty)
          : 0;

        // ✅ 곡물 비율 계산 (숫자로 변환 후 합산)
        const maltInputVolume = materialsList
          .filter((item) =>
            ["페일 몰트", "필스너 몰트", "초콜릿 몰트"].includes(
              item.materialName
            )
          )
          .reduce((sum, item) => sum + Number(item.totalQty), 0);
 
        const mainMaterialInputVolume = materialsList
          .filter((item) => ["보리", "밀", "쌀"].includes(item.materialName))
          .reduce((sum, item) => sum + Number(item.totalQty), 0);

        const grainRatio = maltInputVolume + mainMaterialInputVolume;
        const waterRatio = waterInputVolume;

        // ✅ 비율 계산: 곡물비율을 1로 맞추고, 물 비율을 반올림
        const waterRatioAdjusted =
          grainRatio > 0 ? Math.round(waterRatio / grainRatio) : 0;
        console.log(
          `📌 자동 계산된 비율 -> 곡물: 1, 물: ${waterRatioAdjusted}`
        );

        setMashingData((prev) => ({
          ...prev,
          waterInputVolume,
          grainRatio: 1, // 곡물 비율은 항상 1
          waterRatio: waterRatioAdjusted, // 반올림된 물 비율
        }));
      } catch (error) {
        console.error("❌ 물 투입량 데이터를 가져오는 데 실패했습니다.", error);
      }
    };

    fetchMaterialData();
  }, [mashingData.lotNo]);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setMashingData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ `등록하기` 버튼 클릭 시 데이터 저장
  const handleSave = async () => {
    if (!mashingData.lotNo) {
      alert("⚠️ LOT_NO가 없습니다!");
      return;
    }

    try {
      const mashingRequestData = {
        ...mashingData,
        processStatus: "진행 중", // ✅ 상태 업데이트
      };
      console.log("📌 저장할 데이터:", mashingRequestData);

      const response = await mashingProcessApi.saveMashingData(
        mashingRequestData
      );
      console.log("📌 서버 응답:", response); // ✅ 응답 확인

      
    if (response?.result?.savedMashingProcess?.mashingId) {
      console.log("📌 저장된 mashingId:", response.result.savedMashingProcess.mashingId);
      setMashingId(response.result.savedMashingProcess.mashingId);
    } else {
      console.warn("⚠️ 서버 응답에 mashingId가 없습니다.");
    }

      setMashingData((prev) => ({ ...prev, processStatus: "진행 중" }));
      setShowSuccessModal(true);
      setButtonLabel("다음 공정 이동");
    } catch (error) {
      console.error("❌ 데이터 저장 실패:", error);
      setShowErrorModal(true);
    }
  };

  // ✅ 타이머 시작 (테스트 환경에서는 5초)
  const startTimer = () => {
    setIsProcessing(true);
    const totalTime =
      process.env.NODE_ENV === "development"
        ? 5
        : Number(mashingData.mashingTime) * 60;
    setTimer(totalTime);

    const countdown = setInterval(() => {
      setTimer((prev) => {
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

  // ✅ 다음 공정으로 이동 (phValue와 actualEndTime 저장)
  const handleNextProcess = async () => {
    if (!mashingData.phValue || isNaN(Number(mashingData.phValue))) {
      console.error("❌ pH 값이 입력되지 않았거나 잘못된 값입니다.");
      setShowErrorModal(true);
      return;
    }

    if (!mashingId) {
      console.error("❌ MashingID가 없습니다. API 요청을 중단합니다.");
      setShowErrorModal(true);
      return;
    }

    try {
      const updatedMashingData = {
        phValue: Number(mashingData.phValue),
        actualEndTime: new Date().toISOString(),
      };

      console.log("📌 업데이트할 데이터:", updatedMashingData);

      await mashingProcessApi.updateMashingProcess(mashingId,updatedMashingData);
      navigate("/filtration-process");
    } catch (error) {
      setShowErrorModal(true);
    }
  };

  useEffect(() => {
    console.log("📌 현재 mashingId:", mashingId);
  }, [mashingId]);

  
  
  useEffect(() => {
    if (mashingData.lotNo) {  // ✅ lotNo가 있을 때만 저장
      const existingData = sessionStorage.getItem("mashingData");
      const parsedData = existingData ? JSON.parse(existingData) : {};
  
      if (
        parsedData.lotNo !== mashingData.lotNo ||
        parsedData.grainRatio !== mashingData.grainRatio
      ) {
        sessionStorage.setItem("mashingData", JSON.stringify(mashingData));
        console.log("✅ mashingData 저장 완료:", sessionStorage.getItem("mashingData"));
      }
    }
  }, [mashingData]);  // ✅ mashingData 변경될 때만 저장
  
  
  


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
            readOnly
          />
          <label className={styles.mLabel051}>물 비율</label>
          <input
            className={styles.mItem05}
            type="number"
            name="waterRatio"
            value={mashingData.waterRatio}
            readOnly
          />
        </div>

        <div className={styles.mGridItem}>
          <label className={styles.mLabel06}>물 투입량</label>
          <input
            className={styles.mItem06}
            type="number"
            name="waterInputVolume"
            value={mashingData.waterInputVolume}
            readOnly
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
            onClick={() => {
              if (buttonLabel === "등록하기") {
                setShowConfirmModal(true); // ✅ "등록하기"일 때만 선택 모달창 띄움
              } else {
                handleNextProcess(); // ✅ "다음 공정 이동"일 때는 바로 실행
              }
            }}
            disabled={isProcessing}
          >
            {buttonLabel}
          </button>
        </div>

        {/* ✅ "등록하기"일 때만 선택 모달창을 띄움 */}
        <ConfirmModal
          isOpen={showConfirmModal}
          message="등록하시겠습니까?"
          onConfirm={() => {
            setShowConfirmModal(false); // ✅ 모달 먼저 닫기
            setTimeout(handleSave, 100); // ✅ 100ms 후 실행 (비동기 실행 방지)
          }}
          onClose={() => setShowConfirmModal(false)}
        />

        <SuccessfulModal
          isOpen={showSuccessModal}
          message="데이터가 성공적으로 저장되었습니다!"
          onClose={() => {
            setShowSuccessModal(false);
            startTimer(); // ✅ 타이머 시작
          }}
        />

        <ErrorModal
          isOpen={showErrorModal}
          message={
            mashingData.phValue
              ? "데이터 저장에 실패했습니다. 다시 시도해주세요."
              : "입력되지 않는 정보가 있습니다. 확인해주세요."
          }
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
