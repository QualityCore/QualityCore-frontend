import React, { useState, useEffect } from "react";
import { 
    fetchMaturationById,
    createMaturationDetails,
    completeEndTime
} from "../../../apis/production-process/maturation-detail/maturationDetailApi";
import ConfirmModal from "../../standard-information/common/ConfirmModal";
import SuccessfulModal from "../../standard-information/common/SuccessfulModal";
import ErrorModal from "../../standard-information/common/ErrorModal";
import CompleteModal from "../../standard-information/common/CompleteModal";
import styles from "../../../styles/production-process/MaturationProcessControls.module.css";

const MaturationProcessControls = ({ workOrder }) => {
    const [maturationData, setMaturationData] = useState({
        lotNo: "",
        maturationTime: "",
        avgTemperature: "",
        avgPressure: "",
        avgCo2Percent: "",
        avgDissolvedOxygen: "",
        notes: "",
        processStatus: "진행 중"
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("등록하기");

    useEffect(() => {
        const loadData = async () => {
            try {
                const detail = await fetchMaturationById(workOrder.lotNo);
                if (detail) {
                    setMaturationData({
                        ...detail,
                        lotNo: workOrder.lotNo,
                        processStatus: detail.endTime ? "완료" : "진행 중"
                    });
                }
            } catch (error) {
                console.error("초기 데이터 로드 실패:", error);
            }
        };

        if (workOrder.lotNo) {
            loadData();
            localStorage.setItem("selectedLotNo", workOrder.lotNo);
        }
    }, [workOrder]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMaturationData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setIsProcessing(true);
            await createMaturationDetails(maturationData);
            setShowSuccessModal(true);
            setButtonLabel("공정 완료");
        } catch (error) {
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCompleteProcess = async () => {
        try {
            await completeEndTime(maturationData.maturationId);
            setShowCompleteModal(true);
            setMaturationData(prev => ({ ...prev, processStatus: "완료" }));
        } catch (error) {
            console.error("공정 완료 처리 실패:", error);
        }
    };

    return (
        <form className={styles.maturationForm} onSubmit={(e) => e.preventDefault()}>
            <h2 className={styles.maturationTitle}>숙성 공정 관리</h2>

            <div className={styles.mFormGrid}>
                {/* 작업지시 ID */}
                <div className={styles.mGridItem}>
                    <label className={styles.mLabel01}>작업지시 ID</label>
                    <input 
                        className={styles.mItem01}
                        type="text" 
                        value={maturationData.lotNo} 
                        readOnly 
                    />
                </div>

                {/* 숙성 시간 */}
                <div className={styles.mGridItem}>
                    <label className={styles.mLabel02}>숙성 시간(일)</label>
                    <input
                        className={styles.mItem02}
                        type="number"
                        name="maturationTime"
                        value={maturationData.maturationTime}
                        onChange={handleChange}
                    />
                </div>

                {/* 평균 온도 */}
                <div className={styles.mGridItem}>
                    <label className={styles.mLabel03}>평균 온도(℃)</label>
                    <input
                        className={styles.mItem03}
                        type="number"
                        name="avgTemperature"
                        value={maturationData.avgTemperature}
                        onChange={handleChange}
                    />
                </div>

                {/* 평균 압력 */}
                <div className={styles.mGridItem}>
                    <label className={styles.mLabel04}>평균 압력(bar)</label>
                    <input
                        className={styles.mItem04}
                        type="number"
                        name="avgPressure"
                        value={maturationData.avgPressure}
                        onChange={handleChange}
                    />
                </div>

                {/* CO2 농도 */}
                <div className={styles.mGridItem}>
                    <label className={styles.mLabel05}>CO2 농도(%)</label>
                    <input
                        className={styles.mItem05}
                        type="number"
                        name="avgCo2Percent"
                        value={maturationData.avgCo2Percent}
                        onChange={handleChange}
                    />
                </div>

                {/* 용존 산소량 */}
                <div className={styles.mGridItem}>
                    <label className={styles.mLabel06}>용존 산소량(ppm)</label>
                    <input
                        className={styles.mItem06}
                        type="number"
                        name="avgDissolvedOxygen"
                        value={maturationData.avgDissolvedOxygen}
                        onChange={handleChange}
                    />
                </div>

                {/* 공정 상태 */}
                <div className={styles.mGridItem}>
                    <label className={styles.mLabel07}>공정 상태</label>
                    <input 
                        className={styles.mItem07} 
                        type="text" 
                        value={maturationData.processStatus} 
                        readOnly 
                    />
                </div>

                {/* 메모 사항 */}
                <div className={styles.mGridItem}>
                    <label className={styles.mLabel08}>메모 사항</label>
                    <input
                        className={styles.mItem08}
                        type="text"
                        name="notes"
                        value={maturationData.notes}
                        onChange={handleChange}
                    />
                </div>

                {/* 등록/완료 버튼 */}
                <div className={styles.mGridItem}>
                    <button
                        className={styles.mButton}
                        onClick={() => {
                            if (buttonLabel === "등록하기") {
                                setShowConfirmModal(true);
                            } else {
                                handleCompleteProcess();
                            }
                        }}
                        disabled={isProcessing || maturationData.processStatus === "완료"}
                    >
                        {maturationData.processStatus === "완료" ? "처리 완료" : buttonLabel}
                    </button>
                </div>
            </div>

            {/* 모달 처리 */}
            <ConfirmModal
                isOpen={showConfirmModal}
                message="숙성 데이터를 등록하시겠습니까?"
                onConfirm={() => {
                    setShowConfirmModal(false);
                    setTimeout(handleSave, 100);
                }}
                onClose={() => setShowConfirmModal(false)}
            />

            <SuccessfulModal
                isOpen={showSuccessModal}
                message="숙성 데이터가 성공적으로 저장되었습니다!"
                onClose={() => setShowSuccessModal(false)}
            />

            <ErrorModal
                isOpen={showErrorModal}
                message="데이터 저장 실패. 다시 시도해주세요."
                onClose={() => setShowErrorModal(false)}
            />

            <CompleteModal
                isOpen={showCompleteModal}
                message={["숙성 공정이 완료되었습니다.", "다음 공정으로 이동하세요."]}
                onClose={() => setShowCompleteModal(false)}
            />
        </form>
    );
};

export default MaturationProcessControls;
