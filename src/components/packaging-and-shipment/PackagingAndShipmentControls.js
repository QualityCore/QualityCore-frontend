import React, { useState, useEffect } from "react";
import { packagingAndShipmentApi } from "../../apis/production-process/packaging-and-shipment/packagingAndShipmentApi";
import ConfirmModal from "../standard-information/common/ConfirmModal";
import SuccessfulModal from "../standard-information/common/SuccessfulModal";
import ErrorModal from "../standard-information/common/ErrorModal";
import styles from "../../styles/production-process/PackagingAndShipment.module.css";

const PackagingAndShipmentControls = ({ workOrder, workOrderList, setSelectedWorkOrder }) => {
    const [shipmentData, setShipmentData] = useState({
        lotNo: "",
        cleaningAndSterilization: "양호",
        filling: "정상",
        sealing: "양호",
        labelAttachment: "양호",
        packagingCondition: "양호",
        shipmentDate: new Date().toISOString().split("T")[0],
        shipmentVolume: "",
        productName: "",
        destination: "",
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    useEffect(() => {
        if (workOrder?.lotNo) {
            setShipmentData((prev) => ({
                ...prev,
                lotNo: workOrder.lotNo,
            }));
        }
    }, [workOrder]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShipmentData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (groupName, value) => {
        setShipmentData((prev) => ({ ...prev, [groupName]: value }));
    };

    const handleSave = async () => {
        try {
            setIsProcessing(true);
            await packagingAndShipmentApi.createPackagingAndShipment(shipmentData);
            setShowSuccessModal(true);
        } catch (error) {
            console.error("공정 등록 실패:", error);
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form className={styles.packagingForm} onSubmit={(e) => e.preventDefault()}>
            <h2 className={styles.packagingTitle}>패키징 및 출하</h2>

            <div className={styles.formGrid}>

                {/* 작업지시 ID */}
                <div className={styles.gridItem}>
                    <label>작업지시 ID</label>
                    <select
                        name="lotNo"
                        value={shipmentData.lotNo}
                        onChange={(e) => {
                            handleChange(e);
                            const selected = workOrderList.find(wo => wo.lotNo === e.target.value);
                            setSelectedWorkOrder(selected);
                        }}
                    >
                        <option value="">선택하세요</option>
                        {workOrderList.map((wo) => (
                            <option key={wo.lotNo} value={wo.lotNo}>
                                {wo.lotNo}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 세척 및 살균 */}
                <div className={styles.gridItem}>
                    <label>세척 및 살균</label>
                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                name="cleaningAndSterilization"
                                value="양호"
                                checked={shipmentData.cleaningAndSterilization === "양호"}
                                onChange={handleChange}
                            />
                            양호
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="cleaningAndSterilization"
                                value="불량"
                                checked={shipmentData.cleaningAndSterilization === "불량"}
                                onChange={handleChange}
                            />
                            불량
                        </label>
                    </div>
                </div>

                {/* 충전 */}
                <div className={styles.gridItem}>
                    <label>충전</label>
                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                name="filling"
                                value="정상"
                                checked={shipmentData.filling === "정상"}
                                onChange={handleChange}
                            />
                            정상
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="filling"
                                value="과충전"
                                checked={shipmentData.filling === "과충전"}
                                onChange={handleChange}
                            />
                            과충전
                        </label>
                    </div>
                    <p className={styles.subLabel}>산소 농도 0.05% 이하</p>
                </div>

                {/* 밀봉 */}
                <div className={styles.gridItem}>
                    <label>밀봉</label>
                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                name="sealing"
                                value="양호"
                                checked={shipmentData.sealing === "양호"}
                                onChange={handleChange}
                            />
                            양호
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="sealing"
                                value="불량"
                                checked={shipmentData.sealing === "불량"}
                                onChange={handleChange}
                            />
                            불량
                        </label>
                    </div>
                    <p className={styles.subLabel}>밀봉 압력 1.0~1.5 bar</p>
                </div>

                {/* 라벨링 및 코딩 */}
                <div className={styles.gridItem}>
                    <label>라벨링 및 코딩</label>
                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                name="labelAttachment"
                                value="양호"
                                checked={shipmentData.labelAttachment === "양호"}
                                onChange={handleChange}
                            />
                            양호
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="labelAttachment"
                                value="불량"
                                checked={shipmentData.labelAttachment === "불량"}
                                onChange={handleChange}
                            />
                            불량
                        </label>
                    </div>
                    <p className={styles.subLabel}>라벨 부착 여부, 날짜, 배치번호 확인</p>
                </div>

                {/* 포장 */}
                <div className={styles.gridItem}>
                    <label>포장</label>
                    <div className={styles.radioGroup}>
                        <label>
                            <input
                                type="radio"
                                name="packagingCondition"
                                value="양호"
                                checked={shipmentData.packagingCondition === "양호"}
                                onChange={handleChange}
                            />
                            양호
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="packagingCondition"
                                value="불량"
                                checked={shipmentData.packagingCondition === "불량"}
                                onChange={handleChange}
                            />
                            불량
                        </label>
                    </div>
                    <p className={styles.subLabel}>부족 갯수 확인, 팔레트단위 포장</p>
                </div>

                {/* 출하 날짜 */}
                <div className={styles.gridItem}>
                    <label>출하 날짜</label>
                    <input
                        type="date"
                        name="shipmentDate"
                        value={shipmentData.shipmentDate}
                        onChange={handleChange}
                    />
                </div>

                {/* 제품명 */}
                <div className={styles.gridItem}>
                    <label>제품명</label>
                    <input
                        type="text"
                        name="productName"
                        value={shipmentData.productName}
                        onChange={handleChange}
                        placeholder="제품명"
                    />
                </div>

                {/* 목적지 */}
                <div className={styles.gridItem}>
                    <label>목적지</label>
                    <input
                        type="text"
                        name="destination"
                        value={shipmentData.destination}
                        onChange={handleChange}
                        placeholder="목적지"
                    />
                </div>

                {/* 출하 수량 */}
                <div className={styles.gridItem}>
                    <label>출하 수량</label>
                    <input
                        type="number"
                        name="shipmentVolume"
                        value={shipmentData.shipmentVolume}
                        onChange={handleChange}
                        placeholder="수량"
                    />
                </div>

                {/* 등록 버튼 */}
                <div className={styles.gridItem}>
                    <button onClick={() => setShowConfirmModal(true)} disabled={isProcessing}>
                        등록하기
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
        </form>
    );
};

export default PackagingAndShipmentControls;
