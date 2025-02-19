import { useState } from "react";
import ProductionPlanStep1 from "./ProductionPlanStep1";
// import ProductionPlanStep2 from "./ProductionPlanStep2";
// import ProductionPlanStep3 from "./ProductionPlanStep3";
import { productionPlanStep1Api } from "../../apis/productionPlanApi/ProductionPlanStep1Api";



const ProductionPlanSteps = () => {
    const [step,setStep] = useState(1);
    const [formData, setFormData] = useState({
        planYm: "",
        products: [{ productId: '', productName: '', planQty: '' }],
        materials: [], // step3에서 자재 추가할곳
    });

    

    const goToStep = (stepNumber) => {
        setStep(stepNumber);
    };

    const handleSave = async () => {
        try{
            await productionPlanStep1Api(formData);
            alert("생산 계획이 최종 저장되었습니다!");
        } catch(error) {
            alert("저장 실패하셨습니다.")
        }
    };
    return (
        <div>
          {step === 1 && <ProductionPlanStep1 formData={formData} setFormData={setFormData} goToStep={goToStep} />}
          {/* {step === 2 && <ProductionPlanStep2 formData={formData} setFormData={setFormData} goToStep={goToStep} />}
          {step === 3 && <ProductionPlanStep3 formData={formData} setFormData={setFormData} goToStep={goToStep} onSave={handleSave} />} */}
        </div>
      );

}

export default ProductionPlanSteps;  