import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchBeerRanking } from "../../apis/workOrderApi/beerKingApi";
import "./Chart.css";

// Chart.js 등록
ChartJS.register(ArcElement, Tooltip, Legend);

const BeerPodiumDoughnut = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [topBeers, setTopBeers] = useState([]);

  useEffect(() => {
    fetchBeerRanking().then(data => {
      if (data) {
        const sortedData = data.sort((a, b) => b.totalProduction - a.totalProduction);
        
        setTopBeers(sortedData.slice(0, 3)); // Top 3 맥주 저장
        
        // 지정된 색상 적용
        const beerColors = {
          "카리나 맥주": "#C2CCFF",
          "아이유 맥주": "#F5B169",
          "장원영 맥주": "#F58B78"
        };
        
        setChartData({
          labels: sortedData.map(beer => beer.productName),
          datasets: [
            {
              label: "맥주 생산량 (L)",
              data: sortedData.map(beer => beer.totalProduction),
              backgroundColor: sortedData.map(beer => {
                const beerName = beer.productName.replace(/\s/g, ""); // 공백 제거 후 비교
                const matchedColor = Object.keys(beerColors).find(
                  key => key.replace(/\s/g, "") === beerName
                );
                return matchedColor ? beerColors[matchedColor] : "#AAAAAA"; // 색상 적용
              }),
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        });
      }
    });
  }, []);

  // 생산량을 포맷팅하는 유틸리티 함수 (천 단위 콤마)
  const formatVolume = (volume) => {
    return volume.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="chart-container">
      <div className="chart-wrapper">
        <Doughnut
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: "0%", // 🔥 도넛 → 원형 차트 변경
            plugins: {
              legend: {
                position: "top",
                labels: { font: { size: 12 } },
              },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${ctx.label}: ${formatVolume(ctx.raw)}L`,
                },
              },
            },
          }}
        />
      </div>
      
      {/* 개선된 정보 패널 (맥주 순위) */}
      <div className="info-panel">
        <h3>🏆 맥주 생산량 Top 3</h3>
        <ul>
          {topBeers.map((beer, index) => (
            <li key={beer.productName}>
              <div className={`rank-badge rank-badge-${index + 1}`}>
                {index + 1}
              </div>
              <div className="beer-info">
                <span className="beer-name">
                  <span className="beer-icon">🍺</span>{beer.productName}
                </span>
                <span className="beer-volume">
                  생산량: {formatVolume(beer.totalProduction)}L
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BeerPodiumDoughnut;