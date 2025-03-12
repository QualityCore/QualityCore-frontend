import React, { useState, useEffect } from "react";
import { postMaturationFiltrationApi } from "../../apis/production-process/postMaturation-filtration/PostMaturationApi";
import ConfirmModal from "../standard-information/common/ConfirmModal";
import SuccessfulModal from "../standard-information/common/SuccessfulModal";
import ErrorModal from "../standard-information/common/ErrorModal";
import CompleteModal from "../standard-information/common/CompleteModal";
import styles from "../../styles/production-process/PostMaturationFiltration.module.css";

const PostMaturationFiltrationControls = ({ workOrder, workOrderList, setSelectedWorkOrder }) => {
    const [filtrationData, setFiltrationData] = useState({
        lotNo: "",
        filtrationTime: "",
        turbidity: "",
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
            setFiltrationData((prev) => ({
                ...prev,
                lotNo: workOrder.lotNo,
                startTime: new Date().toISOString(),
            }));
        }
    }, [workOrder]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFiltrationData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        try {
            setIsProcessing(true);
            await postMaturationFiltrationApi.createPostMaturationFiltration(filtrationData);
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
            await postMaturationFiltrationApi.updatePostMaturationFiltration(filtrationData.mfiltrationId, {
                turbidity: filtrationData.turbidity,
                actualEndTime: new Date(),
            });
            setShowCompleteModal(true);
        } catch (error) {
            console.error("공정 완료 처리 실패:", error);
            setShowErrorModal(true);
        }
    };

    return (
        <form className={styles.filtrationForm} onSubmit={(e) => e.preventDefault()}>
            <h2 className={styles.filtrationTitle}>숙성 후 여과 공정</h2>

            <div className={styles.formGrid}>
                {/* 작업지시 ID */}
                <div className={styles.gridItem}>
                    <label>작업지시 ID</label>
                    <select
                        value={filtrationData.lotNo}
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

                {/* 여과 소요 시간 */}
                <div className={styles.gridItem}>
                    <label>여과 소요 시간 (분)</label>
                    <input
                        type="number"
                        name="filtrationTime"
                        value={filtrationData.filtrationTime}
                        onChange={handleChange}
                    />
                </div>

                {/* 탁도 */}
                <div className={styles.gridItem}>
                    <label>탁도 (NTU)</label>
                    <input
                        type="number"
                        name="turbidity"
                        value={filtrationData.turbidity}
                        onChange={handleChange}
                    />
                </div>

                {/* 메모 */}
                <div className={styles.gridItem}>
                    <label>메모</label>
                    <textarea
                        name="notes"
                        value={filtrationData.notes}
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

export default PostMaturationFiltrationControls;
