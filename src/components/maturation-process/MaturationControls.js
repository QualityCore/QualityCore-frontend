import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { maturationDetailApi } from "../../apis/production-process/maturation-detail/maturationDetailApi";
import ConfirmModal from "../standard-information/common/ConfirmModal";
import SuccessfulModal from "../standard-information/common/SuccessfulModal";
import ErrorModal from "../standard-information/common/ErrorModal";
import CompleteModal from "../standard-information/common/CompleteModal";
import styles from "../../styles/production-process/MaturationCss.module.css";

const MaturationControls = () => {
    const [maturationData, setMaturationData] = useState({
        lotNo: "",
        maturationTime: "720",
        startTemperature: "1",
        temperature: "0",
        pressure: "1.4",
        co2Percent: "12",
        dissolvedOxygen: "7",
        notes: "",
    });

    const [fieldErrors, setFieldErrors] = useState({
        maturationTime: '',
        startTemperature: '',
        temperature: '',
        pressure: '',
        co2Percent: '',
        dissolvedOxygen: ''
    });

    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("등록하기");
    const [timeLeft, setTimeLeft] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [isProcessStarted, setIsProcessStarted] = useState(false);
    const [confirmModalShown, setConfirmModalShown] = useState(false);
    const [isNextProcessEnabled, setIsNextProcessEnabled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const savedLotNo = localStorage.getItem("selectedLotNo");
        if (savedLotNo) {
            setMaturationData((prev) => ({ ...prev, lotNo: savedLotNo }));
        }
    }, []);

    useEffect(() => {
        if (isTimerRunning && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        } else if (timeLeft <= 0 && isTimerRunning) {
            setIsTimerRunning(false);
            setButtonLabel("공정 완료");
            setShowCompleteModal(true);
        }
    }, [isTimerRunning, timeLeft]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMaturationData(prev => ({ ...prev, [name]: value }));
    };

    const formatDateTime = (date) => {
        return date.toISOString().replace('T', ' ').substring(0, 19);
    };

    // 타이머 표시 형식 변환 함수
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleSave = async () => {
        try {
            setIsProcessing(true);
            setFieldErrors({
                maturationTime: '',
                startTemperature: '',
                temperature: '',
                pressure: '',
                co2Percent: '',
                dissolvedOxygen: ''
            });

            const requiredFields = {
                maturationTime: '숙성 시간',
                startTemperature: '시작 온도',
                temperature: '현재 온도',
                pressure: '압력',
                co2Percent: 'CO2 농도',
                dissolvedOxygen: '용존 산소량'
            };

            const missingFields = Object.entries(requiredFields)
                .filter(([key]) => !maturationData[key])
                .map(([_, value]) => value);

            if (missingFields.length > 0) {
                alert(`다음 필드를 입력해주세요: ${missingFields.join(', ')}`);
                setIsProcessing(false);
                return;
            }

            const payload = {
                lotNo: maturationData.lotNo,
                maturationTime: Number(maturationData.maturationTime),
                startTemperature: Number(maturationData.startTemperature),
                temperature: Number(maturationData.temperature),
                pressure: Number(maturationData.pressure),
                co2Percent: Number(maturationData.co2Percent),
                dissolvedOxygen: Number(maturationData.dissolvedOxygen),
                notes: maturationData.notes || "",
                startTime: formatDateTime(new Date())
            };

            console.log("📤 서버 전송 데이터:", payload);
            const response = await maturationDetailApi.createMaturationDetails(payload);

            setMaturationData(prev => ({
                ...prev,
                maturationId: response?.maturationId
            }));

            setShowSuccessModal(true);
            setButtonLabel("공정 진행 중");
            const totalSeconds = 5; // 테스트용 5초
            setTimeLeft(totalSeconds);
            setIsTimerRunning(true);
            setIsProcessStarted(true);
            setConfirmModalShown(true);

        } catch (error) {
            console.error("공정 등록 실패:", error);
            setShowErrorModal(true);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCompleteProcess = async () => {
        try {
            const actualEndTime = formatDateTime(new Date());
            console.log("🚀 공정 완료 요청 시작 - maturationId:", maturationData.maturationId);
            console.log("⏰ actualEndTime:", new Date());

            const response = await maturationDetailApi.completeEndTime(maturationData.maturationId, {
                actualEndTime,
                maturationTemperature: Number(maturationData.startTemperature),
                notes: maturationData.notes
            });

            setShowSuccessModal(true);
            setButtonLabel("다음 공정으로 이동");
            setIsNextProcessEnabled(true);
        } catch (error) {
            console.error("공정 완료 처리 실패:", error);
            setShowErrorModal(true);
        }
    };

    const handleNextProcess = () => {
        navigate("/post-maturation-filtration");
    };

    const handleCloseCompleteModal = () => {
        setShowCompleteModal(false);
        setIsNextProcessEnabled(true);
        setButtonLabel("다음 공정으로 이동");
    };

    return (
        <form className={styles.maturationForm} onSubmit={(e) => e.preventDefault()}>
            <h2 className={styles.maturationTitle}>숙성 상세 공정</h2>

            <div className={styles.formGrid}>
                <div className={styles.gridItem}>
                    <label>작업지시 ID</label>
                    <input
                        type="text"
                        value={maturationData.lotNo}
                        readOnly
                    />
                </div>

                <div className={styles.gridItem}>
                    <label>숙성 시간 (시간)</label>
                    <input
                        type="number"
                        name="maturationTime"
                        value={maturationData.maturationTime}
                        onChange={handleChange}
                        disabled={isProcessStarted}
                        className={fieldErrors.maturationTime ? styles.errorInput : ''}
                    />
                    {fieldErrors.maturationTime && <span className={styles.errorText}>{fieldErrors.maturationTime}</span>}
                </div>

                <div className={styles.gridItem}>
                    <label>숙성 시작 온도 (°C)</label>
                    <input
                        type="number"
                        name="startTemperature"
                        value={maturationData.startTemperature}
                        onChange={handleChange}
                        className={fieldErrors.startTemperature ? styles.errorInput : ''}
                    />
                    {fieldErrors.startTemperature && <span className={styles.errorText}>{fieldErrors.startTemperature}</span>}
                </div>

                <div className={styles.gridItem}>
                    <label>현재 온도 (°C)</label>
                    <input
                        type="number"
                        name="temperature"
                        value={maturationData.temperature}
                        onChange={handleChange}
                        className={fieldErrors.temperature ? styles.errorInput : ''}
                    />
                    {fieldErrors.temperature && <span className={styles.errorText}>{fieldErrors.temperature}</span>}
                </div>

                <div className={styles.gridItem}>
                    <label>압력 (bar)</label>
                    <input
                        type="number"
                        name="pressure"
                        value={maturationData.pressure}
                        onChange={handleChange}
                        className={fieldErrors.pressure ? styles.errorInput : ''}
                    />
                    {fieldErrors.pressure && <span className={styles.errorText}>{fieldErrors.pressure}</span>}
                </div>

                <div className={styles.gridItem}>
                    <label>CO2 농도 (%)</label>
                    <input
                        type="number"
                        name="co2Percent"
                        value={maturationData.co2Percent}
                        onChange={handleChange}
                        className={fieldErrors.co2Percent ? styles.errorInput : ''}
                    />
                    {fieldErrors.co2Percent && <span className={styles.errorText}>{fieldErrors.co2Percent}</span>}
                </div>

                <div className={styles.gridItem}>
                    <label>용존 산소량 (ppm)</label>
                    <input
                        type="number"
                        name="dissolvedOxygen"
                        value={maturationData.dissolvedOxygen}
                        onChange={handleChange}
                        className={fieldErrors.dissolvedOxygen ? styles.errorInput : ''}
                    />
                    {fieldErrors.dissolvedOxygen && <span className={styles.errorText}>{fieldErrors.dissolvedOxygen}</span>}
                </div>

                <div className={styles.gridItem}>
                    <label>메모</label>
                    <textarea
                        name="notes"
                        value={maturationData.notes}
                        onChange={handleChange}
                    ></textarea>
                </div>

                {/* 타이머 표시 - 당화/냉각/발효 공정과 동일한 스타일 */}
                {timeLeft > 0 && (
                    <div className={styles.controlsContainer}>
                        <div className={styles.timerContainer}>
                            <div className={styles.timerLabel}>숙성 공정 진행 중</div>
                            <div className={styles.timerDisplay}>
                                <img src="/images/clock-un.gif" alt="타이머" className={styles.timerIcon} />
                                <div className={styles.timerValue}>
                                    {formatTime(timeLeft)}
                                </div>
                            </div>
                            <div className={styles.timerStatus}>
                                {isTimerRunning ? "공정이 진행 중입니다" : ""}
                            </div>
                        </div>
                    </div>
                )}

                <div className={styles.buttonContainer}>
                    <button
                        className={styles.submitButton}
                        onClick={() => {
                            if (buttonLabel === "등록하기" && !confirmModalShown) {
                                setShowConfirmModal(true);
                            } else if (buttonLabel === "다음 공정으로 이동") {
                                handleNextProcess();
                            } else if (buttonLabel === "공정 진행 중" && !isTimerRunning) {
                                handleCompleteProcess();
                            }
                        }}
                        disabled={isProcessing || (buttonLabel === "공정 진행 중" && isTimerRunning) || !isNextProcessEnabled && buttonLabel === "다음 공정으로 이동"}
                    >
                        {buttonLabel === "등록하기"
                            ? "등록하기"
                            : buttonLabel === "공정 진행 중"
                                ? `공정 진행 중`
                                : "다음 공정으로 이동"}
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={showConfirmModal && !confirmModalShown}
                message="공정을 시작하시겠습니까?"
                onConfirm={() => {
                    handleSave();
                    setShowConfirmModal(false);
                }}
                onClose={() => setShowConfirmModal(false)}
            />

            <SuccessfulModal
                isOpen={showSuccessModal}
                message="데이터가 성공적으로 저장되었습니다!"
                onClose={() => setShowSuccessModal(false)}
            />

            <CompleteModal
                isOpen={showCompleteModal}
                message={["숙성 공정이 완료되었습니다.", "다음 공정으로 이동하세요."]}
                onClose={() => {
                    handleCloseCompleteModal()
                }}
            />

            <ErrorModal
                isOpen={showErrorModal}
                message="처리 중 오류가 발생했습니다."
                onClose={() => setShowErrorModal(false)}
            />
        </form>
    );
};

export default MaturationControls;