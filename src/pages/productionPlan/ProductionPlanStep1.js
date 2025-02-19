import React, { useState, useEffect } from "react";
import "../../styles/productionPlan/ProductionPlanStep1.css";
import { productionPlanStep1Api, fetchProductBOM, fetchProducts } from "../../apis/productionPlanApi/ProductionPlanStep1Api";
import { 
    Beer, 
    Ruler,          
    Thermometer, 
    Clock, 
    FlaskConical, 
    Percent,
    Plus,
    Trash2
} from 'lucide-react';
import _ from 'lodash';

const ProductionPlanStep1 = ({ formData, setFormData, goToStep, currentStep = 1 }) => {
    const [products, setProducts] = useState([]); // 전체 제품 목록
    const [productBOMList, setProductBOMList] = useState({}); // 각 제품의 BOM 정보

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productList = await fetchProducts();
                console.log("불러온 제품 목록:", productList);
                setProducts(productList);
            } catch (error) {
                console.error("제품 목록 로드 실패:", error);
            }
        };
        loadProducts();
    }, []);

    // 새로운 제품 행 추가
    const handleAddProduct = () => {
        setFormData({
            ...formData,
            products: [
                ...formData.products,
                { productId: '', productName: '', planQty: '' }
            ]
        });
    };

    // 제품 행 삭제
    const handleRemoveProduct = (index) => {
        const updatedProducts = formData.products.filter((_, i) => i !== index);
        const removedProduct = formData.products[index];
        if (removedProduct.productId) {
            setProductBOMList(prev => {
                const newBOMList = { ...prev };
                delete newBOMList[removedProduct.productId];
                return newBOMList;
            });
        }
        
        setFormData({
            ...formData,
            products: updatedProducts
        });
    };

    // 제품 정보 업데이트
    const handleProductChange = async (index, field, value) => {
        const updatedProducts = [...formData.products];
        
        if (field === 'productId') {
            const selectedProduct = products.find(p => p.productId === value);
            updatedProducts[index] = {
                ...updatedProducts[index],
                productId: value,
                productName: selectedProduct ? selectedProduct.productName : ''
            };
            loadProductBOM(value, index);
        } else {
            updatedProducts[index] = {
                ...updatedProducts[index],
                [field]: value
            };
        }

        setFormData({
            ...formData,
            products: updatedProducts
        });
    };

    // BOM 정보 로드
    const loadProductBOM = async (productId) => {
        try {
            if (!productId) return;
            const bomData = await fetchProductBOM(productId);
            setProductBOMList(prev => ({
                ...prev,
                [productId]: bomData
            }));
        } catch (error) {
            console.error("BOM 정보 불러오기 실패:", error);
        }
    };

    // Step2로 이동 시 라인 배정 데이터 생성
    const handleNextStep = () => {
        const linesPerBatch = 5; // 한 회차당 라인 수
        const qtyPerLine = 6000; // 라인당 생산 가능 수량
    
        // 모든 제품의 수량을 처리하기 위한 배열
        let allProductsQueue = formData.products.map(product => ({
            ...product,
            remainingQty: parseInt(product.planQty)
        }));
    
        const allocatedLines = [];
        let currentBatch = 1;
        let currentLine = 1;
    
        // 모든 제품의 수량이 할당될 때까지 반복
        while (allProductsQueue.some(p => p.remainingQty > 0)) {
            // 현재 회차에서 사용 가능한 라인 수 확인
            const remainingLinesInBatch = linesPerBatch - (currentLine - 1);
    
            if (remainingLinesInBatch > 0) {
                // 아직 현재 회차에서 라인 할당 가능
                for (let product of allProductsQueue) {
                    if (product.remainingQty > 0 && currentLine <= linesPerBatch) {
                        const allocatedQty = Math.min(qtyPerLine, product.remainingQty);
                        
                        allocatedLines.push({
                            productId: product.productId,
                            productName: product.productName,
                            lineNo: currentLine,
                            planBatchNo: currentBatch,
                            allocatedQty,
                            startDate: '',
                            endDate: ''
                        });
    
                        product.remainingQty -= allocatedQty;
                        currentLine++;
                    }
                }
            }
    
            // 현재 회차의 모든 라인을 사용했거나, 더 이상 할당할 제품이 없으면 다음 회차로
            if (currentLine > linesPerBatch) {
                currentBatch++;
                currentLine = 1;
            }
        }
        // 회차별로 그룹화
        const groupedByBatch = _.groupBy(allocatedLines, 'planBatchNo');
        
        setFormData(prev => ({
            ...prev,
            allocatedLines: groupedByBatch
        }));

        goToStep(2);
    };


    return (
        <div className="production-plan-container">
            <div className="steps-container">
                <div className={`step ${currentStep === 1 ? "active" : ""}`}>
                    <div className="step-number">1</div>
                    <span>기본정보</span>
                </div>
                <div className={`step ${currentStep === 2 ? "active" : ""}`}>
                    <div className="step-number">2</div>
                    <span>공정정보</span>
                </div>
                <div className={`step ${currentStep === 3 ? "active" : ""}`}>
                    <div className="step-number">3</div>
                    <span>자재정보</span>
                </div>
            </div>
    
            <h2 className="title">생산 계획 생성</h2>
    
            <div className="content-layout">
                <form className="form-container">
                    <div className="form-group">
                        <label>계획 날짜 (YYYY-MM-DD)</label>
                        <input
                            type="date"
                            name="planYm"
                            value={formData.planYm}
                            onChange={(e) => setFormData({...formData, planYm: e.target.value})}
                            required
                        />
                    </div>
    
                    {/* 제품 리스트 */}
                    {formData.products.map((product, index) => (
                        <div key={index} className="product-row">
                            <div className="form-group">
                                <label>제품 선택</label>
                                <select
                                    value={product.productId}
                                    onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                                    required
                                >
                                    <option value="">제품을 선택하세요</option>
                                    {products.map((p) => (
                                        <option key={p.productId} value={p.productId}>
                                            {p.productName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>계획 수량</label>
                                <input
                                    type="number"
                                    value={product.planQty}
                                    onChange={(e) => handleProductChange(index, 'planQty', e.target.value)}
                                    placeholder="수량을 입력하세요"
                                    required
                                />
                            </div>
                            <button 
                                type="button" 
                                className="remove-button"
                                onClick={() => handleRemoveProduct(index)}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
    
                    <button 
                        type="button" 
                        className="add-button"
                        onClick={handleAddProduct}
                    >
                        <Plus size={18} /> 제품 추가
                    </button>
    
                    <div className="button-group">
                        <button type="button" onClick={handleNextStep}>
                            다음 단계 <span>→</span>
                        </button>
                    </div>
                </form>
    
                {/* BOM 정보 표시 */}
                {Object.entries(productBOMList).map(([productId, bomData]) => (
                    <div key={productId} className="bom-section">
                        <h3>🍺 {formData.products.find(p => p.productId === productId)?.productName} 상세 정보</h3>
                        <div className="bom-grid">
                            <div className="bom-item beer">
                                <div className="bom-icon">
                                    <Beer size={24} />
                                </div>
                                <div className="bom-content">
                                    <span className="bom-label">맥주 종류</span>
                                    <span className="bom-value">{bomData.beerType}</span>
                                </div>
                            </div>
                            <div className="bom-item size">
                                <div className="bom-icon">
                                    <Ruler size={24} />
                                </div>
                                <div className="bom-content">
                                    <span className="bom-label">규격</span>
                                    <span className="bom-value">{bomData.sizeSpec}</span>
                                </div>
                            </div>
                            <div className="bom-item temperature">
                                <div className="bom-icon">
                                    <Thermometer size={24} />
                                </div>
                                <div className="bom-content">
                                    <span className="bom-label">실내 온도</span>
                                    <span className="bom-value">{bomData.roomTemperature}°C</span>
                                </div>
                            </div>
                            <div className="bom-item process-time">
                                <div className="bom-icon">
                                    <Clock size={24} />
                                </div>
                                <div className="bom-content">
                                    <span className="bom-label">표준 공정 시간</span>
                                    <span className="bom-value">{bomData.stdProcessTime}일</span>
                                </div>
                            </div>
                            <div className="bom-item ferment-time">
                                <div className="bom-icon">
                                    <FlaskConical size={24} />
                                </div>
                                <div className="bom-content">
                                    <span className="bom-label">발효 시간</span>
                                    <span className="bom-value">{bomData.fermentTime}일</span>
                                </div>
                            </div>
                            <div className="bom-item alcohol">
                                <div className="bom-icon">
                                    <Percent size={24} />
                                </div>
                                <div className="bom-content">
                                    <span className="bom-label">알코올 도수</span>
                                    <span className="bom-value">{bomData.alcPercent}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
    
};
    export default ProductionPlanStep1;