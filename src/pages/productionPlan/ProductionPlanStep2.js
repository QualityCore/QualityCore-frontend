import React, { useState, useEffect } from "react";
import styles from "../../styles/productionPlan/ProductionPlanStep2.module.css";
import { fetchProductionLines } from "../../apis/productionPlanApi/ProductionPlanStep2Api";


const ProductionPlanStep2 = ({ formData, setFormData, goToStep }) => {
    const [allocatedRounds, setAllocatedRounds] = useState([]);

    // ✅ Step1에서 입력한 제품 데이터로 자동 배정 데이터 불러오기
    useEffect(() => {
        console.log("📌 Step2에서 받은 데이터:", formData.products);
    
        const loadProductionLines = async () => {
            if (!formData.products.length) {
                console.error("❌ Step2 API 요청 실패: formData.products가 비어 있음");
                return;
            }
    
            // ✅ Step1에서 백엔드에서 받은 `planProductId` 가져오기
            const planProductId = formData.products[0]?.planProductId;
    
            if (!planProductId) {
                console.error("⚠️ planProductId가 없음! API 요청을 하지 않음.");
                return;
            }
    
            console.log("📌 Step2 API 요청 보냄:", planProductId);
    
            try {
                // ✅ planProductId로 API 요청
                const response = await fetchProductionLines(planProductId);
                setAllocatedRounds(response);
                console.log("📌 Step2에서 받은 생산 라인 데이터:", response);
            } catch (error) {
                console.error("❌ 생산 라인 데이터 불러오기 실패:", error);
            }
        };
    
        loadProductionLines();
    }, [formData.products]); // ✅ formData.products 변경될 때 실행
    
    

    // 🔹 생산량 수동 수정 핸들러
    const handleAllocatedQtyChange = (roundIndex, lineIndex, value) => {
        let updatedRounds = [...allocatedRounds];
        updatedRounds[roundIndex][lineIndex].allocatedQty = parseInt(value) || 0;
        setAllocatedRounds(updatedRounds);
    };

    // 🔹 Step3으로 이동 시 배정 데이터 저장
    const handleNextStep = () => {
        setFormData((prevData) => ({
            ...prevData,
            productionLines: allocatedRounds.flat() // Step3에서 사용할 데이터 저장
        }));
        goToStep(3); // Step3으로 이동
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>공정 정보 입력</h2>

            {allocatedRounds.length > 0 ? (
                allocatedRounds.map((round, roundIndex) => (
                    <div key={roundIndex} className={styles.roundSection}>
                        <h3 className={styles.roundTitle}>{roundIndex + 1}회차 생산</h3>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>제품명</th>
                                    <th>라인 번호</th>
                                    <th>배정 수량</th>
                                </tr>
                            </thead>
                            <tbody>
                                {round.map((line, lineIndex) => (
                                    <tr key={lineIndex}>
                                        <td>{line.productName}</td>
                                        <td>{line.lineNo}</td>
                                        <td>
                                            <input
                                                type="number"
                                                value={line.allocatedQty}
                                                onChange={(e) => handleAllocatedQtyChange(roundIndex, lineIndex, e.target.value)}
                                                className={styles.input}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            ) : (
                <p>📌 배정된 생산 라인 데이터가 없습니다.</p>
            )}

            <div className={styles.buttonGroup}>
                <button onClick={() => goToStep(1)} className={styles.prevButton}>← 이전</button>
                <button onClick={handleNextStep} className={styles.nextButton}>다음 단계 →</button>
            </div>
        </div>
    );
};

export default ProductionPlanStep2;
