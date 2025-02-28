import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {useNavigate} from "react-router-dom"
import mashingProcessApi from "../../../apis/production-process/mashing-process/MashingProcessApi";
import ConfirmModal from "../../standard-information/common/ConfirmModal"; 
import SuccessfulModal from "../../standard-information/common/SuccessfulModal"; 
import ErrorModal from "../../standard-information/common/ErrorModal"; 
import CompleteModal from "../../standard-information/common/CompleteModal";
//import "../../../styles/production-process/mashingProcess.css";

const MashingProcessControls = ({ workOrder }) => {
    const { mashingId } = useParams(); // URL에서 ID 가져오기
    const [mashingData, setMashingData] = useState({
        lotNo: workOrder?.lotNo || "", // 작업지시 ID 자동 불러오기
        mashingTime: "",
        temperature: "",
        phValue: "",
        grainRatio: "",
        waterRatio: "",
        waterInputVolume: "",
        processStatus: "대기중", // 초기 상태값
        statusCode: "SC002", // 고정값
    });

    const [timer, setTimer] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showCompleteModal, setShowCompleteModal] = useState(false);
    const [buttonLabel, setButtonLabel] = useState("등록하기");
    const navigate = useNavigate(); // ✅ 페이지 이동을 위한 함수!

    // 입력값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target; 
        setMashingData((prev) => ({ ...prev, [name]: value }));
    };

    // 타이머 시작 함수
    const startTimer = () => {
        console.log("⏳ 타이머 시작됨, mashingTime:", mashingData.mashingTime);

        const totalTime = process.env.NODE_ENV === "development" ? 10 : Number(mashingData.mashingTime) * 60;
        setTimer(totalTime);
        setIsProcessing(true);
        setMashingData((prev) => ({ ...prev, processStatus: "진행중" }));

        const countdown = setInterval(() => {
            setTimer((prevTime) => {
                const newTime = prevTime - 1;
                if (newTime <= 0) {
                    clearInterval(countdown);
                    setShowCompleteModal(true);
                    setIsProcessing(false);
                    setMashingData((prev) => ({ ...prev, processStatus: "완료" }));
                    setButtonLabel("다음공정으로 이동");
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
                processStatus: "진행중", // 공정상태 변경
            };

            const response = await mashingProcessApi.saveMashingData(saveData);

            if (response?.httpStatusCode >= 200 && response?.httpStatusCode < 300) {
                setShowSuccessModal(true);
                startTimer();
            } else {
                setShowErrorModal(true);
            }
        } catch (error) {
            setShowErrorModal(true);
        }
    };

    // 버튼 클릭 핸들러
    const handleButtonClick = () => {
        if (buttonLabel === "등록하기") {
            setShowConfirmModal(true);
        } else if (buttonLabel === "다음공정으로 이동") {
            console.log("🚀 다음 공정으로 이동!");
            
            // ✅ 이동할 페이지 설정
            navigate("/fermentation"); // 여기에 실제 다음 공정 URL을 넣으면 됨!
        }
    };

    return (
        <form className="mashing-process-form" onSubmit={(e) => e.preventDefault()}>
            <h2>당화공정</h2>

            {/* 작업지시 ID (수정 불가) */}
            <label>작업지시 ID</label>
            <input type="text" value={mashingData.lotNo} readOnly />

            {/* 당화 소요 시간 */}
            <label>당화 소요 시간</label>
            <input type="number" name="mashingTime" value={mashingData.mashingTime} onChange={handleChange} />

            {/* 당화 온도 */}
            <label>당화 온도</label>
            <input type="number" name="temperature" value={mashingData.temperature} onChange={handleChange} />

            {/* pH값 (타이머 종료 후 활성화) */}
            <label>pH값</label>
            <input type="number" name="phValue" value={mashingData.phValue} onChange={handleChange} disabled={!isProcessing && timer > 0} />

            {/* 곡물 대 물 비율 */}
            <label>곡물 대 물 비율</label>
            <div>
                <input type="number" name="grainRatio" value={mashingData.grainRatio} onChange={handleChange} />
                :
                <input type="number" name="waterRatio" value={mashingData.waterRatio} onChange={handleChange} />
            </div>

            {/* 물 투입량 */}
            <label>물 투입량</label>
            <input type="number" name="waterInputVolume" value={mashingData.waterInputVolume} onChange={handleChange} />

            {/* 공정 상태 (수정 불가) */}
            <label>공정 상태</label>
            <input type="text" value={mashingData.processStatus} readOnly />

            {/* 남은 시간 표시 */}
            {timer > 0 && <p>남은시간: {Math.floor(timer / 60)}분 {timer % 60}초</p>}

            {/* 버튼 */}
            <button onClick={handleButtonClick} disabled={buttonLabel === "등록하기" && timer > 0}>
                {buttonLabel}
            </button>



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
                message={[
                    "당화 공정이 완료되었습니다.",
                    "다음 공정으로 이동하세요."
                ]}
                onClose={() => setShowCompleteModal(false)}
            />
        </form>
    );
};

export default MashingProcessControls;
