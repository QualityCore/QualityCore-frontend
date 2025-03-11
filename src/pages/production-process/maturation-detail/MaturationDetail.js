import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // useNavigate 추가
import { fetchMaturationById } from "../../../apis/production-process/maturation-detail/maturationDetailApi";
import MaturationCss from "../../../styles/production-process/MaturationPage.module.css";

function MaturationDetail() {
    const { maturationId } = useParams();
    const [maturationDetail, setMaturationDetail] = useState(null);
    const navigate = useNavigate(); // 추가된 훅

    useEffect(() => {
        const getMaturationDetail = async () => {
            try {
                const detail = await fetchMaturationById(maturationId);
                setMaturationDetail(detail);
            } catch (error) {
                console.error("숙성 상세 정보 로드 실패:", error);
                alert("데이터를 불러오지 못했습니다. 목록 페이지로 이동합니다.");
                navigate("/maturation"); // 오류 발생 시 자동 이동
            }
        };
        getMaturationDetail();
    }, [maturationId, navigate]); // navigate 추가

    if (!maturationDetail) {
        return <div>Loading...</div>;
    }

    return (
        <div className={MaturationCss.container}>
            {/* 목록으로 돌아가는 버튼 */}
            <button
                className={MaturationCss.detailButton}
                onClick={() => navigate(`/maturation-details`)}
                style={{ marginBottom: "30px" }}
            >
                ← 목록으로 돌아가기
            </button>

            <h1>숙성 상세 정보</h1>
            <div className={MaturationCss.detailContainer}>
                <div className={MaturationCss.detailItem}>
                    <h4>숙성 공정 ID: {maturationDetail.maturationId}</h4>
                    <p>작업지시 ID: {maturationDetail.lotNo}</p>
                    <p>숙성 시간: {maturationDetail.maturationTime} 일</p>
                    <p>숙성 시작 온도: {maturationDetail.startTemperature}°C</p>
                    <p>평균 온도: {maturationDetail.avgTemperature?.toFixed(2)}°C</p>
                    <p>평균 압력: {maturationDetail.avgPressure?.toFixed(2)} bar</p>
                    <p>평균 CO2 농도: {maturationDetail.avgCo2Percent?.toFixed(2)}%</p>
                    <p>평균 용존 산소량: {maturationDetail.avgDissolvedOxygen?.toFixed(2)} ppm</p>
                    <p>메모: {maturationDetail.notes}</p>
                    <p>시작 시간: {maturationDetail.startTime}</p>
                    <p>종료 시간: {maturationDetail.endTime}</p>
                </div>
            </div>
        </div>
    );
}

export default MaturationDetail;
