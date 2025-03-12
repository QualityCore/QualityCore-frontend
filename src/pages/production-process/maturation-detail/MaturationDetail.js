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
  fetchLineMaterial,
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
  const [selectedWorkOrder, setSelectedWorkOrder] = useState({});
  const [chartData, setChartData] = useState({ datasets: [] }); // ✅ 기본값 설정

  const navigate = useNavigate();

  //-------------------------------------------------------------------

  useEffect(() => {
    const savedLotNo = localStorage.getItem("selectedLotNo");
    if (savedLotNo) {
      console.log("✅ LocalStorage에서 불러온 LOT_NO:", savedLotNo);
      setMaturationDetail((prev) => ({
        ...prev,
        lotNo: prev?.lotNo || savedLotNo,
      }));
      setSelectedWorkOrder({ lotNo: savedLotNo });
    }
  }, []);

  useEffect(() => {
    const fetchWorkOrders = async () => {
      try {
        const workOrders = await fetchLineMaterial();
        console.log("✅ 가져온 작업지시 목록:", workOrders);

        if (workOrders.length > 0) {
          console.log("✅ 선택된 작업지시 ID:", workOrders[0].lotNo);

          setSelectedWorkOrder(workOrders[0]);

          setMaturationDetail((prev) => ({
            ...prev,
            lotNo: prev?.lotNo || workOrders[0].lotNo,
          }));

          setChartData((prev) => ({
            ...prev,
            lotNo: workOrders[0].lotNo,
            datasets: prev?.datasets || [],
          }));

          localStorage.setItem("selectedLotNo", workOrders[0].lotNo);
        }
      } catch (error) {
        console.error("❌ 데이터 불러오기 실패:", error);
      }
    };

    fetchWorkOrders();
  }, []);

  useEffect(() => {
    const getMaturationDetail = async () => {
      try {
        const detail = await fetchMaturationById(maturationId);
        console.log("API 응답 데이터:", detail);

        setMaturationDetail((prev) => ({
          ...prev,
          ...detail,
          lotNo: prev?.lotNo || detail?.lotNo,
        }));

        if (detail) {
          const labels = ["평균 온도", "평균 압력", "CO2 농도", "용존 산소량"];
          const data = [
            detail.avgTemperature,
            detail.avgPressure,
            detail.avgCo2Percent,
            detail.avgDissolvedOxygen,
          ];

          const isOverLimit = data.map((value) => value > 5);

          setChartData({
            labels: labels,
            datasets: [
              {
                label: "측정값",
                data: data,
                backgroundColor: isOverLimit.map((over) =>
                  over ? "rgba(255, 99, 132, 0.5)" : "rgba(75, 192, 192, 0.5)"
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

  if (!maturationDetail) return <div>Loading...</div>;

  return (
    <div className={MaturationCss.container}>
      <h1>숙성 상세 정보</h1>
      <div className={MaturationCss.detailContainer}>
        <div className={MaturationCss.detailItem}>
          <h4>숙성 공정 ID: {maturationDetail.maturationId}</h4>
          <p>작업지시 ID: {maturationDetail.lotNo}</p>
          <p>숙성 시간: {maturationDetail.maturationTime} 일</p>
          <p>숙성 시작 온도: {maturationDetail.startTemperature}°C</p>
          <p>평균 온도 (전체): {maturationDetail.avgTemperature?.toFixed(2)}°C</p>
          <p>평균 압력 (전체): {maturationDetail.avgPressure?.toFixed(2)} bar</p>
          <p>평균 CO2 농도 (전체): {maturationDetail.avgCo2Percent?.toFixed(2)}%</p>
          <p>평균 용존 산소량 (전체): {maturationDetail.avgDissolvedOxygen?.toFixed(2)} ppm</p>
          <p>메모: {maturationDetail.notes || "없음"}</p>
          <p>시작 시간: {maturationDetail.startTime}</p>
          <p>종료 시간: {maturationDetail.endTime}</p>

          {/* ✅ 차트 렌더링 조건 추가 */}
          {chartData?.datasets?.length > 0 ? (
            <div style={{ marginTop: "40px" }}>
              <Line data={chartData} options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "숙성 공정 평균 데이터" },
                },
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: "측정값" } },
                  x: { title: { display: true, text: "측정 항목" } },
                },
              }} />
            </div>
          ) : (
            <p>차트 데이터를 불러오는 중...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default MaturationDetail;
