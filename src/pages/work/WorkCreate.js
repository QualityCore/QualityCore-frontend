import React, { useState, useEffect, useRef } from "react";
import workCreate from "./workCreate.module.css";
import { getBeerRecipes, getPlanInfo, createWorkOrder } from "../../apis/workOrderApi/workOrdersApi";
import SuccessAnimation from "../../lottie/SuccessNotification";
import WarningAnimation from "../../lottie/WarningNotification";
import Modal from "react-modal";
import JSConfetti from "js-confetti"; // 추가

const jsConfetti = new JSConfetti(); // 인스턴스 한 번만 생성

function WorkCreate() {
    const [beerRecipes, setBeerRecipes] = useState({});
    const [workOrders, setWorkOrders] = useState([]);
    const [selectedWorkOrder, setSelectedWorkOrder] = useState(null);
    const [isSuccessModal, setIsSuccessModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isWarningModal, setIsWarningModal] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

    const etcRef = useRef();

    // 생산계획 가져오기
    const fetchWorkOrders = async () => {
        try {
            const workOrdersData = await getPlanInfo();
            if (Array.isArray(workOrdersData) && workOrdersData.length) {
                setWorkOrders(workOrdersData);
            }
        } catch (error) {
            console.error("작업지시서 데이터를 불러오는 데 실패했습니다:", error.message);
        }
    };

    // 맥주레시피 가져오기
    const fetchBeerRecipes = async () => {
        try {
            const recipesResponse = await getBeerRecipes();
            if (recipesResponse && typeof recipesResponse === 'object' && Object.keys(recipesResponse).length > 0) {
                setBeerRecipes(recipesResponse);
            }
        } catch (error) {
            console.error("레시피 데이터를 불러오는 데 실패했습니다:", error.message);
        }
    };

    // 작업 지시서 생성 후 작업지시서 삭제
    const handleCreateWorkOrder = async () => {
        if (!selectedWorkOrder) {
            setWarningMessage("생산 계획을 선택하세요.");
            setIsWarningModal(true);
            return;
        }

        const { planId, planLineId, planProductId } = selectedWorkOrder;
        if (!planId || !planLineId || !planProductId) {
            setWarningMessage("작업에 필요한 정보가 부족합니다.");
            setIsWarningModal(true);
            return;
        }

        const workOrderData = {
            workProgress: "0%",
            workEtc: etcRef.current.value,
            empId: "EMP001",
            planId,
            planLineId,
            planProductId,
            trackingId: selectedWorkOrder.trackingId,
            lineMaterials: mergedRecipe.map((material) => ({
                materialName: material.materialName,
                materialType: material.materialType,
                unit: material.unit,
                requiredQtyPerUnit: material.quantity,
                processStep: material.processStep,
                totalQty: Math.round(material.quantity * selectedWorkOrder.planQty),
            }))
        };

        try {
            const response = await createWorkOrder(workOrderData);
            if (response && response.status === 201) {
                setIsSuccessModal(true);
                setModalMessage("작업 지시서가 성공적으로 생성되었습니다.");
                console.log("🎉 Confetti 실행!");
                jsConfetti.addConfetti({
                    emojis: ["🍺", "🍻", "🥂"],
                    emojiSize: 50,
                    confettiNumber: 7,
                });
                setWorkOrders((prevOrders) => prevOrders.filter(order =>
                    order.planId !== planId || order.planLineId !== planLineId || order.planProductId !== planProductId
                ));
                setSelectedWorkOrder(null);
                await fetchWorkOrders(); // 새로 고침
                // Confetti 실행 후 3초 뒤 비활성화
            } else {
                alert("작업 지시서 생성에 실패했습니다.");
            }
        } catch (error) {
            alert("작업 지시서 생성 중 오류 발생했습니다.");
            console.error("작업지시서 생성 오류:", error);
        }
    };

    // 생산계획 핸들러
    const handleWorkOrderSelect = (e) => {
        const selectedValue = e.target.value;
        const [selectedPlanId, selectedProductName] = selectedValue.split("|");
        const selectedOrder = workOrders.find(order =>
            order.planId === selectedPlanId && order.productName === selectedProductName
        );
        setSelectedWorkOrder(selectedOrder || null);
    };

    useEffect(() => {
        fetchWorkOrders();
        fetchBeerRecipes();
    }, []);

    // 자동으로 생산계획과 일치하는 레시피 매칭
    const matchRecipeWithWorkOrder = (workOrder, beerRecipes) => {
        return beerRecipes[workOrder.productName] || null;
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
                merged.push(...steps);
            }
        });

        merged.sort((a, b) => processOrder.indexOf(a.processStep) - processOrder.indexOf(b.processStep));

        return merged;
    };

    const mergedRecipe = matchedRecipe ? mergeRecipeData(matchedRecipe) : [];

    const closeSuccessModal = () => setIsSuccessModal(false);
    const closeWarningModal = () => setIsWarningModal(false);

    return (
        <div className={workCreate.mainBar}>
            <div className={workCreate.planInfoName}>
                <h3 className={workCreate.planH3}>생산계획&nbsp; : &nbsp;</h3>
                <select onChange={handleWorkOrderSelect} className={workCreate.planSelect} value={selectedWorkOrder ? `${selectedWorkOrder.planId}|${selectedWorkOrder.productName}` : ""}>
                    <option value="">생산 계획 선택</option>
                    {workOrders.map((order) => (
                        <option key={`${order.planId}-${order.productName}`} value={`${order.planId}|${order.productName}`}>
                            ({order.productName}) 시작일 : {order.startDate}
                        </option>
                    ))}
                </select>
            </div>
            <table className={workCreate.workTable}>
                <tbody>
                    <tr>
                        <th>생산라인</th>
                        <td>{selectedWorkOrder ? `${selectedWorkOrder.lineNo} LINE` : "-"}</td>
                        <th>제품명</th>
                        <td>{selectedWorkOrder ? selectedWorkOrder.productName : "-"}</td>
                    </tr>
                    <tr>
                        <th>생산예정일</th>
                        <td>{selectedWorkOrder ? selectedWorkOrder.startDate : "-"}</td>
                        <th>생산종료일</th>
                        <td>{selectedWorkOrder ? selectedWorkOrder.endDate : "-"}</td>
                    </tr>
                    <tr>
                        <th>지시수량</th>
                        <td>{selectedWorkOrder ? selectedWorkOrder.planQty : "-"}</td>
                        <th>작업조</th>
                        <td>{selectedWorkOrder ? selectedWorkOrder.workTeam : "-"}</td>
                    </tr>
                </tbody>
            </table>
            {mergedRecipe.length > 0 && (
                <table className={workCreate.bomTable}>
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
            )}
            {/* 성공모달 */}
            <Modal isOpen={isSuccessModal} onRequestClose={closeSuccessModal} className={workCreate.successModal} overlayClassName="modal-overlay">
                <div className={workCreate.successModalHeader}>
                    <button className={workCreate.successCloseButton} onClick={closeSuccessModal}>X</button>
                </div>
                <div className={workCreate.successModalContent}>
                    <SuccessAnimation />
                    <p className={workCreate.successMessage}>{modalMessage}</p>
                </div>
            </Modal>
            {/* 경고모달 */}
            <Modal isOpen={isWarningModal} onRequestClose={closeWarningModal} className={workCreate.warningModal} overlayClassName={workCreate.warningModalOverlay}>
                <div className={workCreate.warningModalHeader}>
                    <button className={workCreate.warningCloseButton} onClick={closeWarningModal}>X</button>
                </div>
                <div className={workCreate.warningModalContent}>
                    <WarningAnimation />
                    <p className={workCreate.warningMessage}>{warningMessage}</p>
                </div>
            </Modal>
            <h3 className={workCreate.footName}>특이사항</h3>
            <textarea ref={etcRef} className={workCreate.etc}></textarea>
            <button className={workCreate.createButton} onClick={handleCreateWorkOrder}>
                등록🔎
            </button>
        </div>
    );
}

export default WorkCreate;
