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

const ProductionPlanStep1 = ({ formData, setFormData, goToStep, currentStep = 1 }) => {
    const [products, setProducts] = useState([]); // 전체 제품 목록
    const [productBOMList, setProductBOMList] = useState({}); // 각 제품의 BOM 정보

    useEffect(() => {
        const loadProducts = async () => {
            try {
                const productList = await fetchProducts();
                console.log(" 불러온 제품 목록:", productList);
                setProducts(productList);
            } catch (error) {
                console.error(" 제품 목록 로드 실패:", error);
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
        // 삭제된 제품의 BOM 정보도 함께 제거
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
    const loadProductBOM = async (productId, index) => {
        try {
            if (!productId) return;
            const bomData = await fetchProductBOM(productId);
            setProductBOMList(prev => ({
                ...prev,
                [productId]: bomData
            }));
        } catch (error) {
            console.error(" BOM 정보 불러오기 실패:", error);
        }
 
    }

    const handleNextStep = async () => {
        try {
            console.log("📌 Step1 데이터 확인 (전송 전):", formData);
    
            // ✅ Step1 API 호출 후 planProductId 받기
            const response = await productionPlanStep1Api(formData);
            console.log("✅ Step1 API 응답 (planProductId):", response);
    
            // ✅ formData에 planProductId 저장
            const updatedProducts = formData.products.map((product, index) => ({
                ...product,
                planProductId: response // 백엔드에서 받은 planProductId 저장
            }));
    
            setFormData({
                ...formData,
                products: updatedProducts,
            });
    
            console.log("📌 Step1 데이터 확인 (planProductId 포함):", updatedProducts);
    
            goToStep(2); // Step2로 이동
        } catch (error) {
            console.error("❌ Step1 API 호출 실패:", error);
        }
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