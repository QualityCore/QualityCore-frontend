import React, { useState, useEffect } from "react";
import "./workCreate.css";
import { getBeerRecipes, getPlanInfo, createWorkOrder } from "../../apis/workOrderApi/workOrdersApi";
import { FcSearch } from "react-icons/fc";

function WorkCreate() {
    const [beerRecipes, setBeerRecipes] = useState({});  // 맥주 레시피 데이터
    const [workOrders, setWorkOrders] = useState([]);    // 작업지시서 목록
    const [selectedWorkOrder, setSelectedWorkOrder] = useState(null); // 선택된 작업지시서

    // 생산계획 가져오기
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

    // 맥주레시피 가져오기
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

    const handleCreateWorkOrder = async () => {
        console.log("선택된 작업지시서:", selectedWorkOrder);  // 선택된 작업지시서 로그 찍기
        if (!selectedWorkOrder) {
            alert("생산 계획을 선택하세요.");
            console.log("선택된 생산 계획:", selectedWorkOrder);
            return;
        }

        // 필수 데이터 존재 여부 체크
        if (!selectedWorkOrder.planId || !selectedWorkOrder.planLineId || !selectedWorkOrder.planProductId) {
            alert("선택된 작업에 필요한 정보가 부족합니다.");
            console.log("작업지시서 정보:", selectedWorkOrder);  // 정보 확인
            return;
        }


        const workOrderData = {
            workProgress: "0%",  // 기본값
            workEtc: document.querySelector(".etc").value, // 특이사항 입력값
            empId: "EMP001", // 하드코딩된 직원 ID
            status: "생산지시완료",
            planId: selectedWorkOrder.planId, // 선택된 생산 계획 ID
            planLineId: selectedWorkOrder.planLineId,  // 안전하게 가져온 생산라인 ID
            planProductId: selectedWorkOrder.planProductId, // planProduct의 ID만 사용
            trackingId: "PT00001", // 하드코딩된 추적 ID
            lineMaterials: mergedRecipe.map((material) => ({
                materialName: material.materialName,
                materialType: material.materialType,
                unit: material.unit,
                requiredQtyPerUnit: material.quantity, // 개당 투입량
                processStep: material.processStep,
                totalQty: Math.round(material.quantity * selectedWorkOrder.planQty) // 총 투입량
            }))
        };

        try {
            const response = await createWorkOrder(workOrderData);
            if (response && response.success) {
                alert("작업 지시서가 성공적으로 생성되었습니다.");
            } else {
                alert("작업 지시서 생성에 실패했습니다.");
            }
        } catch (error) {
            console.error("❌ 작업 지시서 생성 중 오류 발생:", error);
            alert("작업 지시서 생성 중 오류가 발생했습니다.");
        }
    };



    // 생산계획 핸들러
    const handleWorkOrderSelect = (e) => {
        const selectedValue = e.target.value;
        if (selectedValue) {
            const [selectedPlanId, selectedProductName] = selectedValue.split("|");
            const selectedOrder = workOrders.find((order) =>
                order.planId === selectedPlanId && order.productName === selectedProductName
            );
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

    const processOrder = ["분쇄", "끓임", "발효", "포장 및 패키징출하"];

    // 맥주레시피와 생산계획 이름 매칭
    const mergeRecipeData = (processSteps) => {
        if (!processSteps || typeof processSteps !== 'object') return [];

        let merged = [];
        Object.keys(processSteps).forEach((processStep) => {
            const steps = processSteps[processStep];
            if (Array.isArray(steps)) {
                steps.forEach((step) => {
                    merged.push(step);
                });
            } else {
                console.error(`❌ ${processStep}은 유효한 배열이 아닙니다. 데이터 확인 필요.`);
            }
        });

        // 공정 순서에 따라 정렬
        merged.sort((a, b) => {
            return processOrder.indexOf(a.processStep) - processOrder.indexOf(b.processStep);
        });

        return merged;
    };

    const mergedRecipe = matchedRecipe ? mergeRecipeData(matchedRecipe) : [];


    return (
        <div className="mainBar">
            <div className="planInfoName">
                <h3 className="planH3">생산계획&nbsp; : &nbsp;</h3>
                <select onChange={handleWorkOrderSelect} className="planSelect" value={selectedWorkOrder ? `${selectedWorkOrder.planId}|${selectedWorkOrder.productName}` : ""}>
                    <option value="">생산 계획 선택</option>
                    {workOrders.map((order, index) => (
                        <option key={`${order.planId}-${order.productName}`} value={`${order.planId}|${order.productName}`}>
                            ({index + 1}회차) 시작일 : {order.startDate}
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
                                <th>자재 종류</th>
                                <th>자재명</th>
                                <th>맥주 1개당 투입 수량</th>
                                <th>생산총 투입 수량</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mergedRecipe.map((material, index) => (
                                <tr key={`${material.materialName}-${index}`}>
                                    <td>{material.processStep}</td>
                                    <td>{material.materialType}</td>
                                    <td>{material.materialName}</td>
                                    <td>{material.quantity}{material.unit}</td>
                                    <td>{selectedWorkOrder ? Math.round(material.quantity * selectedWorkOrder.planQty) : 0}{material.unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : null}
            <h3 className="footName">특이사항</h3>
            <textarea name="" id="" className="etc">

            </textarea>
            <button className="createButton" onClick={handleCreateWorkOrder}>
                작업지시서 생성하기
            </button>
        </div>
    );
}

export default WorkCreate;
