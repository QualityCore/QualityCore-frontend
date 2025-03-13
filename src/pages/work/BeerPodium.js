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

                // 맥주 이름 확인용 로그
                console.log("맥주 데이터:", sortedData.map(beer => beer.productName));

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
                                    label: (ctx) => `${ctx.label}: ${ctx.raw}L`,
                                },
                            },
                        },
                    }}
                />
            </div>

            {/* 오른쪽 정보 패널 (맥주 순위) */}
            <div className="info-panel">
                <h3>🏆 맥주 생산량 Top 3</h3>
                <ul>
                    {topBeers.map((beer, index) => (
                        <li key={beer.productName}>
                            <b>{index + 1}위:</b> {beer.productName} ({beer.totalProduction}L)
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default BeerPodiumDoughnut;
