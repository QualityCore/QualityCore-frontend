import React, { useState, useEffect } from "react";
import "./workCreate.css";
import { getBeerRecipes, getPlanInfo } from "../../apis/workOrderApi/workOrdersApi";

function WorkCreate() {
    const [beerRecipes, setBeerRecipes] = useState({});  // 맥주 레시피 데이터
    const [workOrders, setWorkOrders] = useState([]);    // 작업지시서 목록
    const [selectedWorkOrder, setSelectedWorkOrder] = useState(null); // 선택된 작업지시서

    const fetchWorkOrders = async () => {
        try {
            const workOrdersData = await getPlanInfo();
            if (Array.isArray(workOrdersData) && workOrdersData.length > 0) {
                setWorkOrders(workOrdersData);
            } else {
                console.error("❌ 작업 지시서 데이터 형식이 잘못되었거나, planInfo가 없음", workOrdersData);
            }
        } catch (error) {
            console.error("❌ 작업지시서 데이터를 불러오는 데 실패했습니다:", error.message);
        }
    };

    const fetchBeerRecipes = async () => {
        try {
            console.log("맥주 레시피 데이터 요청 시작");
            const recipesResponse = await getBeerRecipes();

            if (!recipesResponse) {
                console.error("❌ 레시피 응답이 없습니다.");
                return;
            }

            if (typeof recipesResponse !== 'object') {
                console.error("❌ 응답 형식이 올바르지 않습니다:", recipesResponse);
                return;
            }

            const beerRecipe = recipesResponse; // 결과는 바로 beerRecipe 객체임

            if (!beerRecipe || Object.keys(beerRecipe).length === 0) {
                console.error("❌ 레시피 데이터가 비어 있거나 존재하지 않습니다.");
            } else {
                setBeerRecipes(beerRecipe);
            }
        } catch (error) {
            console.error("❌ 레시피 데이터를 불러오는 데 실패했습니다:", error.message);
        }
    };

    const handleWorkOrderSelect = (e) => {
        const selectedPlanId = e.target.value;
        if (selectedPlanId) {
            const selectedOrder = workOrders.find((order) => order.planId === selectedPlanId);
            setSelectedWorkOrder(selectedOrder || null);
        } else {
            setSelectedWorkOrder(null);
        }
    };

    useEffect(() => {
        fetchWorkOrders(); // 작업지시서 데이터 가져오기
        fetchBeerRecipes(); // 맥주 레시피 데이터 가져오기
    }, []);

    // 자동으로 생산계획과 일치하는 레시피 매칭
    const matchRecipeWithWorkOrder = (workOrder, beerRecipes) => {
        // 생산계획의 제품명과 레시피 이름이 일치하면 자동으로 해당 레시피 데이터 보여주기
        if (workOrder && beerRecipes[workOrder.productName]) {
            return beerRecipes[workOrder.productName];
        }
        return null; // 일치하지 않으면 null 반환
    };

    const matchedRecipe = selectedWorkOrder ? matchRecipeWithWorkOrder(selectedWorkOrder, beerRecipes) : null;

    const mergeRecipeData = (processSteps) => {
        if (!processSteps || typeof processSteps !== 'object') return [];

        let merged = [];
        Object.keys(processSteps).forEach((processStep) => {
            const steps = processSteps[processStep];
            if (Array.isArray(steps)) {
                steps.forEach((step) => {
                    merged.push(step); // 예시로 각 step을 배열로 추가
                });
            } else {
                console.error(`❌ ${processStep}은 유효한 배열이 아닙니다. 데이터 확인 필요.`);
            }
        });

        return merged;
    };

    const mergedRecipe = matchedRecipe ? mergeRecipeData(matchedRecipe) : [];

    return (
        <div className="mainBar">
            <div className="planInfoName">
                <h3 className="planH3">생산계획 선택&nbsp; : &nbsp;</h3>
                <select onChange={handleWorkOrderSelect} className="planSelect" value={selectedWorkOrder?.planId || ""}>
                    <option value="">생산 계획 선택</option>
                    {workOrders.map((order) => (
                        <option key={`${order.planId}-${order.productName}`} value={order.planId}>
                            {order.planId} 시작일 : {order.startDate}
                        </option>
                    ))}
                </select>
            </div>
            <table className="workTable">
                <tbody>
                    <tr>
                        <th>생산라인</th>
                        <td>{selectedWorkOrder ? `${selectedWorkOrder.lineNo} LINE` : "등록된 생산라인이 없습니다."}</td>
                        <th>제품명</th>
                        <td>{selectedWorkOrder ? selectedWorkOrder.productName : "등록된 제품명이 없습니다."}</td>
                    </tr>
                    <tr>
                        <th>생산예정일</th>
                        <td>{selectedWorkOrder ? selectedWorkOrder.startDate : "등록된 생산예정일이 없습니다."}</td>
                        <th>생산종료일</th>
                        <td>{selectedWorkOrder ? selectedWorkOrder.endDate : "등록된 생산종료일이 없습니다."}</td>
                    </tr>
                    <tr>
                        <th>지시수량</th>
                        <td>{selectedWorkOrder ? selectedWorkOrder.planQty : "등록된 지시수량이 없습니다."}</td>
                        <th>작업조</th>
                        <td>{selectedWorkOrder ? selectedWorkOrder.workTeam : "등록된 작업조가 없습니다."}</td>
                    </tr>
                </tbody>
            </table>

            {/* 자재 테이블 */}
            {mergedRecipe.length > 0 ? (
                <>
                    <table className="bomTable">
                        <thead>
                            <tr>
                                <th>공정 단계</th>
                                <th>종류</th>
                                <th>품목명</th>
                                <th>맥주 1개당 투입 수량</th>
                                <th>총 투입 수량</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mergedRecipe.map((material, index) => (
                                <tr key={`${material.materialName}-${index}`}>
                                    <td>{material.processStep}</td>
                                    <td>{material.materialType}</td>
                                    <td>{material.materialName}</td>
                                    <td>{material.quantity}</td>
                                    <td></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : null}
        </div>
    );
}

export default WorkCreate;
