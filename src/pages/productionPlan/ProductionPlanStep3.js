import { useState, useEffect } from "react";
import { ShoppingCart} from 'lucide-react';
import { 
    calculateMaterialRequirements, 
    saveMaterialPlan 
} from '../../apis/productionPlanApi/ProductionPlanStep3Api';
import styles from '../../styles/productionPlan/ProductionPlanStep3.module.css';

const ProductionPlanStep3 = ({
    formData,
    setFormData,
    goToStep,
    currentStep = 3
}) => {
    const [rawMaterials,setRawMaterials] = useState([]); //원자재
    const [packagingMaterials, setPackagingMaterials] = useState([]) // 부자재(포장)
    const [isLoading,setIsLoading] = useState(true);
    const [selectedBeer,setSelectedBeer] = useState(null);

    // 고유한 맥주 목록 추출
    const uniqueBeers = [...new Set(
        rawMaterials
            .filter(m => m.beerName) 
            .map(m => m.beerName)
    )];
    
    console.log('고유 맥주 목록:', uniqueBeers);
    console.log('원자재 데이터:', rawMaterials);

    //선택된 맥주의 원자재 필터링
    const filteredRawMaterials = selectedBeer
        ? rawMaterials.filter(m => m.beerName === selectedBeer)
        : rawMaterials;


    const filteredPackagingMaterials = selectedBeer
        ? packagingMaterials.filter(m => m.beerName === selectedBeer)
        : packagingMaterials;



    // 소수점 자릿수 제한 (4자리리)
const formatNumber = (num, decimalPlaces = 4) => {
    return Number(num.toFixed(decimalPlaces));
};
useEffect(() => {
    let isMounted = true;

    const fetchMaterialRequirements = async () => {
        try {
            // 모든 제품에 대한 자재 요구사항 계산
            const materialRequests = formData.products.map(async (product) => {
                const materialRequestData = {
                    planYm: formData.planYm,
                    productId: product.productId,
                    productName: product.productName,
                    planQty: parseInt(product.planQty),
                    sizeSpec: product.sizeSpec || '', 
                    status: '', 
                    beerType: '' 
                };

                const response = await calculateMaterialRequirements(materialRequestData);
                return response.result;
            });

            // 모든 제품의 자재 요구사항 병합
            const results = await Promise.all(materialRequests);

            let allRawMaterials = [];
            let allPackagingMaterials = [];

            results.forEach(result => {
                allRawMaterials = [
                    ...allRawMaterials,
                    ...(result.rawMaterials || [])
                ];
                allPackagingMaterials = [
                    ...allPackagingMaterials,
                    ...(result.packagingMaterials || [])
                ];
            });

            if (isMounted) {
                setRawMaterials(allRawMaterials);
                setPackagingMaterials(allPackagingMaterials);
                
                setFormData(prev => ({
                    ...prev,
                    materials: [...allRawMaterials, ...allPackagingMaterials]
                }));

                setIsLoading(false);
            }
        } catch (error) {
            if (isMounted) {
                console.error('자재 정보 조회 중 상세 오류:', error.response?.data);
                console.error('전체 에러 정보:', error);
                setIsLoading(false);
            }
        }
    };

    if (formData && formData.products && formData.products.length > 0) {
        fetchMaterialRequirements();
    }

    return () => {
        isMounted = false;
    };
}, []);


    const handleSave = async () => {
        try {
            await saveMaterialPlan(formData);
            alert('생산 계획이 성공적으로 저장되었습니다!');
        } catch (error) {
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    if (isLoading) {
        return <div>자재 정보를 불러오는 중...</div>;
    }

    console.log('원자재 상태:', rawMaterials);
    console.log('부자재(포장재) 상태:', packagingMaterials);
      
    return (
        <div className={styles.container}>
            <div className={styles.stepsContainer}>
                <div className={`step ${currentStep === 1 ? 'active' : ''}`}>
                    <div className="step-number">1</div>
                    <span>기본정보</span>
                </div>
                <div className={`step ${currentStep === 2 ? 'active' : ''}`}>
                    <div className="step-number">2</div>
                    <span>공정정보</span>
                </div>
                <div className={`step ${currentStep === 3 ? 'active' : ''}`}>
                    <div className="step-number">3</div>
                    <span>자재정보</span>
                </div>
            </div>

            <h2 className={styles.title}>자재 정보</h2>

            <div className={styles.alertBanner}>
                <span>❗ 일부 자재의 재고가 부족합니다. 구매신청이 필요합니다.</span>
            </div>

   {/* 맥주 선택 버튼 추가 */}
             <div className={styles.beerButtonGroup}>
                <button 
                    className={selectedBeer === null ? styles.activeButton : ''}
                    onClick={() => setSelectedBeer(null)}
                >
                    전체
                </button>
                {uniqueBeers.map(beer => (
                    <button
                        key={beer}
                        className={selectedBeer === beer ? styles.activeButton : ''}
                        onClick={() => setSelectedBeer(beer)}
                    >
                        {beer}
                    </button>
                ))}
            </div>

{/* 원자재  */}
<div className={styles.materialSection}>
    <h3>원자재</h3>
    <table className={styles.materialTable}>
        <thead>
            <tr>
                <th>자재명</th>
                <th>단위</th>
                <th>기준소요량</th>
                <th>계획소요량</th>
                <th>현재재고</th>
                <th>상태</th>
            </tr>
        </thead>
        <tbody>
            {selectedBeer ? (
                // 개별 맥주 보기 - 현재재고, 상태 컬럼 제거
                filteredRawMaterials.map((material, index) => (
                    <tr key={index}>
                        <td>{material.materialName}</td>
                        <td>{material.unit}</td>
                        <td>{formatNumber(material.stdQty)}</td>
                        <td>{formatNumber(material.planQty)}</td>
                    </tr>
                ))
            ) : (
                // 전체 보기 - 기존 로직 유지
                filteredRawMaterials.map((material, index) => (
                    <tr key={index}>
                        <td>{material.materialName}</td>
                        <td>{material.unit}</td>
                        <td>{formatNumber(material.stdQty)}</td>
                        <td>{formatNumber(material.planQty)}</td>
                        <td>{formatNumber(material.currentStock)}</td>
                        <td>
                            <span className={`${styles.statusBadge} ${material.status === '부족' ? styles.shortage : styles.sufficient}`}>
                                {material.status}
                            </span>
                        </td>
                    </tr>
                ))
            )}
        </tbody>
    </table>
</div>

          {/* 부자재(포장재)*/}
<div className={styles.materialSection}>
    <h3>부자재</h3>
    <table className={styles.materialTable}>
        <thead>
            <tr>
                <th>자재명</th>
                <th>단위</th>
                <th>기준소요량</th>
                <th>계획소요량</th>
                <th>현재재고</th>
                <th>상태</th>
            </tr>
        </thead>
        <tbody>
            {selectedBeer ? (
                // 개별 맥주 보기 - 현재재고, 상태 컬럼 제거
                filteredPackagingMaterials.map((material, index) => (
                    <tr key={index}>
                        <td>{material.materialName}</td>
                        <td>{material.unit}</td>
                        <td>{formatNumber(material.stdQty)}</td>
                        <td>{formatNumber(material.planQty)}</td>
                    </tr>
                ))
            ) : (
                // 전체 보기 - 기존 로직 유지
                filteredPackagingMaterials.map((material, index) => (
                    <tr key={index}>
                        <td>{material.materialName}</td>
                        <td>{material.unit}</td>
                        <td>{formatNumber(material.stdQty)}</td>
                        <td>{formatNumber(material.planQty)}</td>
                        <td>{formatNumber(material.currentStock)}</td>
                        <td>
                            <span className={`${styles.statusBadge} ${material.status === '부족' ? styles.shortage : styles.sufficient}`}>
                                {material.status}
                            </span>
                        </td>
                    </tr>
                ))
            )}
        </tbody>
    </table>
</div>

            {/* 버튼 */}
            <div className={styles.buttonGroup}>
                <button onClick={() => goToStep(2)} className={styles.prevButton}>이전</button>
                <div className={styles.rightButtons}>
                    <button className={styles.purchaseButton}>
                        <ShoppingCart size={18} /> 부족자재 구매신청
                    </button>
                    <button onClick={handleSave} className={styles.nextButton}>저장</button>
                </div>
            </div>
        </div>
    );
};

export default ProductionPlanStep3;