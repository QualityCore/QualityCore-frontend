import React, { useState, useEffect } from "react";
import { carbonationProcessApi } from "../../apis/production-process/carbonation-process/carbonationProcessApi";
import ConfirmModal from "../standard-information/common/ConfirmModal";
import SuccessfulModal from "../standard-information/common/SuccessfulModal";
import ErrorModal from "../standard-information/common/ErrorModal";
import CompleteModal from "../standard-information/common/CompleteModal";
import styles from "../../styles/production-process/CarbonationProcess.module.css";

const CarbonationProcessControls = ({ workOrder, workOrderList, setSelectedWorkOrder }) => {
    const [carbonationData, setCarbonationData] = useState({
        lotNo: "",
        carbonationTime: "",
        co2CarbonationPercent: "",
        processTemperature: "",
        processPressure: "",
        startTime: "",
        expectedEndTime: "",
        actualEndTime: "",
        notes: "",
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("등록하기");

    // 작업지시 선택 시 데이터 초기화
    useEffect(() => {
        if (workOrder?.lotNo) {
            setCarbonationData((prev) => ({
                ...prev,
                lotNo: workOrder.lotNo,
                startTime: new Date().toISOString(),
            }));
        }
    }, [workOrder]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCarbonationData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setIsProcessing(true);
            await carbonationProcessApi.createCarbonationProcess(carbonationData);
            setShowSuccessModal(true);
            setButtonLabel("공정 완료");
        } catch (error) {
            console.error("공정 등록 실패:", error);
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCompleteProcess = async () => {
        try {
            await carbonationProcessApi.completeEndTime(carbonationData.carbonationId);
            setShowCompleteModal(true);
        } catch (error) {
            console.error("공정 완료 처리 실패:", error);
            setShowErrorModal(true);
        }
    };

    return (
        <form className={styles.carbonationForm} onSubmit={(e) => e.preventDefault()}>
            <h2 className={styles.carbonationTitle}>탄산 조정 공정</h2>

            <div className={styles.formGrid}>
                {/* 작업지시 ID */}
                <div className={styles.gridItem}>
                    <label>작업지시 ID</label>
                    <select
                        value={carbonationData.lotNo}
                        onChange={(e) =>
                            setSelectedWorkOrder(workOrderList.find((wo) => wo.lotNo === e.target.value))
                        }
                    >
                        {workOrderList.map((wo) => (
                            <option key={wo.lotNo} value={wo.lotNo}>
                                {wo.lotNo}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 탄산 조정 소요 시간 */}
                <div className={styles.gridItem}>
                    <label>탄산 조정 소요 시간 (분)</label>
                    <input
                        type="number"
                        name="carbonationTime"
                        value={carbonationData.carbonationTime}
                        onChange={handleChange}
                    />
                </div>

                {/* CO2 농도 */}
                <div className={styles.gridItem}>
                    <label>CO2 농도 (%)</label>
                    <input
                        type="number"
                        name="co2CarbonationPercent"
                        value={carbonationData.co2CarbonationPercent}
                        onChange={handleChange}
                    />
                </div>

                {/* 탄산 공정 온도 */}
                <div className={styles.gridItem}>
                    <label>탄산 공정 온도 (°C)</label>
                    <input
                        type="number"
                        name="processTemperature"
                        value={carbonationData.processTemperature}
                        onChange={handleChange}
                    />
                </div>

                {/* 공정 중 압력 */}
                <div className={styles.gridItem}>
                    <label>공정 중 압력 (bar)</label>
                    <input
                        type="number"
                        name="processPressure"
                        value={carbonationData.processPressure}
                        onChange={handleChange}
                    />
                </div>

                {/* 메모 */}
                <div className={styles.gridItem}>
                    <label>메모</label>
                    <textarea
                        name="notes"
                        value={carbonationData.notes}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* 등록 버튼 */}
                <div className={styles.gridItem}>
                    <button
                        onClick={() =>
                            buttonLabel === "등록하기" ? setShowConfirmModal(true) : handleCompleteProcess()
                        }
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
                onClose={() => setShowSuccessModal(false)}
            />

            <ErrorModal
                isOpen={showErrorModal}
                message="오류가 발생했습니다. 다시 시도해주세요."
                onClose={() => setShowErrorModal(false)}
            />

            <CompleteModal
                isOpen={showCompleteModal}
                message="공정이 완료되었습니다."
                onClose={() => setShowCompleteModal(false)}
            />
        </form>
    );
};

export default CarbonationProcessControls;
