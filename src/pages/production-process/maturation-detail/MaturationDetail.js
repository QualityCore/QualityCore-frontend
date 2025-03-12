import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import {
    fetchMaturationById,
    createMaturationDetails,
} from "../../../apis/production-process/maturation-detail/maturationDetailApi";
import MaturationCss from "../../../styles/production-process/MaturationPage.module.css";

// Chart.js 등록
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function MaturationDetail() {
    const { maturationId } = useParams();
    const [maturationDetail, setMaturationDetail] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [chartData, setChartData] = useState(null);
    const navigate = useNavigate();

    // 숙성 완료 여부 확인
    useEffect(() => {
        const checkCompletion = () => {
            if (maturationDetail && maturationDetail.endTime) {
                const now = new Date();
                const endTime = new Date(maturationDetail.endTime);
                setIsCompleted(now >= endTime);
            }
        };

        const intervalId = setInterval(checkCompletion, 1000);
        return () => clearInterval(intervalId);
    }, [maturationDetail]);

    // 데이터 로드 및 처리
    useEffect(() => {
        const getMaturationDetail = async () => {
            try {
                const detail = await fetchMaturationById(maturationId);
                console.log("API 응답 데이터:", detail);
                setMaturationDetail(detail);

                if (detail) {
                    // 차트 데이터 준비
                    const labels = [
                        "평균 온도",
                        "평균 압력",
                        "CO2 농도",
                        "용존 산소량",
                    ];
                    const data = [
                        detail.avgTemperature,
                        detail.avgPressure,
                        detail.avgCo2Percent,
                        detail.avgDissolvedOxygen,
                    ];

                    // 기준치 초과 여부 확인
                    const isOverLimit = data.map((value) => value > 5);

                    // 데이터셋 생성
                    setChartData({
                        labels: labels,
                        datasets: [
                            {
                                label: "측정값",
                                data: data,
                                backgroundColor: isOverLimit.map((over) =>
                                    over
                                        ? "rgba(255, 99, 132, 0.5)"
                                        : "rgba(75, 192, 192, 0.5)"
                                ),
                                borderColor: isOverLimit.map((over) =>
                                    over ? "rgb(255, 99, 132)" : "rgb(75, 192, 192)"
                                ),
                                borderWidth: 2,
                            },
                            {
                                label: "기준치",
                                data: [5, 5, 5, 5],
                                borderColor: "rgba(255, 159, 64, 0.8)",
                                borderWidth: 2,
                                borderDash: [5, 5],
                                fill: false,
                                pointRadius: 0,
                            },
                        ],
                    });
                }
            } catch (error) {
                console.error("데이터 로드 실패:", error);
                alert("데이터를 불러오지 못했습니다.");
                navigate("/maturation");
            }
        };
        getMaturationDetail();
    }, [maturationId]);

    // 등록 처리
    const handleRegistration = async () => {
        try {
            if (!maturationDetail) {
                alert("등록할 데이터가 없습니다.");
                return;
            }

            const maturationDetailsDTO = {
                maturationId: maturationDetail.maturationId,
                lotNo: maturationDetail.lotNo,
                maturationTime: maturationDetail.maturationTime,
                startTemperature: maturationDetail.startTemperature,
                avgTemperature: maturationDetail.avgTemperature,
                avgPressure: maturationDetail.avgPressure,
                avgCo2Percent: maturationDetail.avgCo2Percent,
                avgDissolvedOxygen: maturationDetail.avgDissolvedOxygen,
                notes: maturationDetail.notes,
                startTime: maturationDetail.startTime,
                endTime: maturationDetail.endTime,
            };

            console.log("📤 DTO 데이터:", maturationDetailsDTO);
            await createMaturationDetails(maturationDetailsDTO);
            alert("등록 성공!");
            setIsRegistered(true);
            navigate("/post-maturation-filtration"); // 등록 성공 후 페이지 이동
        } catch (error) {
            console.error("등록 실패:", error);
            alert(`등록 실패: ${error.message}`);
        }
    };

    // 차트 옵션 설정
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "숙성 공정 평균 데이터" },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || "";

                        if (label) {
                            label += ": ";
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y.toFixed(2);
                        }
                        return label;
                    },
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                title: { display: true, text: "측정값" },
            },
            x: { title: { display: true, text: "측정 항목" } },
        },
    };

    if (!maturationDetail) return <div>Loading...</div>;

    return (
        <div className={MaturationCss.container}>
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
                    {/* 상세 정보 */}
                    <h4>숙성 공정 ID: {maturationDetail.maturationId}</h4>
                    <p>작업지시 ID: {maturationDetail.lotNo}</p>
                    <p>숙성 시간: {maturationDetail.maturationTime} 일</p>
                    <p>숙성 시작 온도: {maturationDetail.startTemperature}°C</p>
                    <p>
                        평균 온도 (전체):{" "}
                        {maturationDetail.avgTemperature?.toFixed(2)}°C
                    </p>
                    <p>
                        평균 압력 (전체):{" "}
                        {maturationDetail.avgPressure?.toFixed(2)} bar
                    </p>
                    <p>
                        평균 CO2 농도 (전체):{" "}
                        {maturationDetail.avgCo2Percent?.toFixed(2)}%
                    </p>
                    <p>
                        평균 용존 산소량 (전체):{" "}
                        {maturationDetail.avgDissolvedOxygen?.toFixed(2)} ppm
                    </p>
                    <p>메모: {maturationDetail.notes || "없음"}</p>
                    <p>시작 시간: {maturationDetail.startTime}</p>
                    <p>종료 시간: {maturationDetail.endTime}</p>

                    {/* 차트 영역 */}
                    {chartData && (
                        <div style={{ marginTop: "40px" }}>
                            <Line data={chartData} options={chartOptions} />
                        </div>
                    )}

                    {/* 등록 버튼 */}
                    {isCompleted && !isRegistered && (
                        <button
                            className={MaturationCss.detailButton}
                            onClick={handleRegistration}
                            style={{ marginTop: "20px" }}
                        >
                            다음 공정으로 이동
                        </button>
                    )}
                    {isRegistered && (
                        <p
                            style={{
                                color: "green",
                                fontWeight: "bold",
                                marginTop: "20px",
                            }}
                        >
                            ✔️ 등록이 완료되었습니다.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MaturationDetail;
