import axios from "axios";
import { useState } from "react";
import Modal from "../../components/common/Modal"; // 공통 모달 컴포넌트 가져오기기
import "../../styles/standard-information/workplace-form.css";



const WorkplaceForm = ({  apiUrl }) => {
  const [formData, setFormData] = useState({
    workplaceName: "제",
    workplaceCode: "W0",
    workplaceLocation: "서울",
    workplaceType: "분쇄",
    workplaceStatus: "가동",
    lineId : "LINE001",
    managerName: "",
    workplaceCapacity: "",
    workplaceCapacityUnit: "L",
  });

  const[showConfirmModal,setShowConfirmModal] = useState(false);
  const[showSuccessModal, setShowSuccessModal] = useState(false);
  const[showErrorModal,setShowErrorModal] = useState(false);
  const[errorMessge,setErrorMessge] = useState("");



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) =>{
    e.preventDefault();
    setShowConfirmModal(true)// 등록 모달 확인하기
  };

  const confirmRegistration  = async () => {
    setShowConfirmModal(false); // 확인모달 닫기기 

    console.log("🚀 실제 formData 요청 데이터:", formData); 

    console.log("🚀 실제 Workplace API 요청 URL:", `${apiUrl}/workplaces/regist`);

    try{
        const { workplaceId, ...formDataWithoutId } = formData; // ✅ workplaceId 제거
        const response = await axios.post(`${apiUrl}/workplaces/regist`, {
            ...formDataWithoutId, lineInformation: { lineId: formData.lineId }
        });

        console.log("✅ 등록 성공:", response.data);

      if(response.status === 200){
        setShowSuccessModal(true); //등록 성공 모달열기
        setFormData({
          workplaceName: "제",
          workplaceCode: "W0",
          workplaceLocation: "서울",
          workplaceType: "분쇄",
          workplaceStatus: "가동",
          lineId : "LINE001",
          managerName: "",
          workplaceCapacity: "",
          workplaceCapacityUnit: "L",
        });
      }
    }catch(error){
      console.log("등록 실패 :" , error.response?.data || error.message);
      setErrorMessge(error.response?.data?.message||"등록하는데 문제가 발생했어 확인해봐요");
      setShowErrorModal(true); // 오류 모달 열기
    }
  };


  return (
    <div className="workplace-form-container">
      <h2 className="workplace-title">작업장 정보 등록</h2>
      <form className="workplace-form" onSubmit={handleSubmit}>
        <div className="workplace-input-group">
          
          <label>작업장 이름</label>
          <input className="workplace-input" name="workplaceName" value={formData.workplaceName}
                 placeholder="작업장 이름" onChange={handleChange} />
          
          <label>작업장 타입</label>
            <select className="workplace-select" name="workplaceType" onChange={handleChange}>
              <option value="분쇄">분쇄</option>
              <option value="당화">당화</option>
              <option value="여과">여과</option>
              <option value="끓임">끓임</option>
              <option value="냉각">냉각</option>
              <option value="발효">발효</option>
              <option value="숙성">숙성</option>
              <option value="숙성후여과">숙성 후 여과</option>
              <option value="탄산조정">탄산조정</option>
              <option value="패키징 및 출하">패키징 및 출하</option>
            </select>         
        </div>


        <div className="workplace-input-group">
        
        <label>작업장 코드</label>
        <input className="workplace-input" name="workplaceCode" value={formData.workplaceCode}
                 placeholder="ex) W001 " onChange={handleChange} />

        <label>작업장 상태</label>
          <select className="workplace-select" name="workplaceStatus" onChange={handleChange}>
            <option value="가동">가동</option>
            <option value="정지">정지</option>
            <option value="고장">고장</option>
            <option value="수리">수리</option>
          </select>

        <label className="line-info">LINE 정보</label>
        <select className="workplace-select-line-info" name="lineId" onChange={handleChange}>
            <option value="LINE001">LINE001</option>
            <option value="LINE002">LINE002</option>
            <option value="LINE003">LINE003</option>
            <option value="LINE004">LINE004</option>
            <option value="LINE005">LINE005</option>
        </select>

        </div>


        <div className="workplace-input-group">
          <label>작업장 위치</label>
          <input className="workplace-input" name="workplaceLocation" 
                  value={formData.workplaceLocation} placeholder="ex) 서울공장1층 " onChange={handleChange} />

          <label>작업 담당자</label>
          <input className="workplace-input" name="managerName" 
                  value={formData.managerName} placeholder="작업 담당자" onChange={handleChange} />

          <label>작업장 용량/생산 가능량</label>
          <input className="workplace-input" name="workplaceCapacity" value={formData.workplaceCapacity}
                   placeholder="작업장 용량/ 생산 가능량" onChange={handleChange} />
      
          <select name="workplaceCapacityUnit" value={formData.workplaceCapacityUnit} onChange={handleChange}>
            <option value="L">L / day </option>
            <option value="kg">kg / day </option>
          </select>
        </div>

        <button className="workplace-button" type="submit">등록하기</button>
      </form>

      {/* 확인 모달 */}
      <Modal
      isOpen={showConfirmModal}
      onClose={()=>setShowConfirmModal(false)}
      onConfirm={confirmRegistration}
      message="데이터를 등록 하시겠습니까?" 
      isFinal={false} // 첫 번째 모달에서는 확인 & 취소 버튼 표시시
      />


      {/* 등록 완료 모달 */}
      <Modal
      isOpen={showSuccessModal}
      onClose={()=>setShowSuccessModal(false)}
      onConfirm={()=>setShowSuccessModal(false)}
      message="등록이 완료되었습니다"
      isFinal={true} // 두 번째 모달에서는 확인 버튼만 표시
      />

      {/* 오류 모달 */}
      <Modal
      isOpen={showErrorModal}
      onClose={()=> setShowErrorModal(false)}
      onConfirm={()=>setShowErrorModal(false)}
      message={`등록 실패: ${errorMessge}`}
      isFinal={true}
      />

    </div>

  );
};

export default WorkplaceForm;
