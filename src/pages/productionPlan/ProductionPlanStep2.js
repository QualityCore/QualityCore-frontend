import React, { useState, useEffect} from "react";
import styles from "../../styles/productionPlan/ProductionPlanStep2.module.css"
import { fetchProductionLines, postProductionLines } from "../../apis/productionPlanApi/ProductionPlanStep2Api";

const MAX_LINE_CAPACITY = 6000; //한 라인당 최대 생산갯수
const MAX_LINE =5; // 최대 라인수

const ProductionPlanStep2 = ({ formData, setFormData, goToStep }) => {
    const [allocatedRounds, setAllocatedRounds] = useState([]);

    useEffect(() => {
        autoAssignLines(formData.products);
    },[formData.products]);

 // 🔹 제품별 생산 라인 자동 배정 (회차 고려)
 const autoAssignLines = (products) => {
    let newAllocatedRounds = [];
    let round = 1; // 1회차부터 시작

    let remainingProducts = [...products];

    while (remainingProducts.length > 0)
 }


}