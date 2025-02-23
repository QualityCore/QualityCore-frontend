import axios from "axios";
import { useState } from "react";
import SuccessfulModal from "./common/SuccessfulModal";
import ConfirmModal from "./common/Modal";
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
  const[errorMessage,setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value});
  };
    
  const handleSubmit = (e) =>{
    e.preventDefault();
    
    // 빈칸 검증
  if(!formData.workplaceName.trim()||
     !formData.workplaceCode.trim()||
     !formData.workplaceLocation.trim()||
     !formData.managerName.trim()||
     !formData.workplaceCapacity.trim()){
        setErrorMessage("입력이 누락되었습니다. 다시작성 후 저장바랍니다.");
        setShowErrorModal(true);
        return;
       }

       setShowConfirmModal(true);
  };


  const confirmRegistration  = async () => {
    setShowConfirmModal(false); // 확인모달 닫기 
    try{
        const { workplaceId, ...formDataWithoutId } = formData; 
        const response = await axios.post(`${apiUrl}/workplaces/regist`, {
            ...formDataWithoutId, lineInformation: { lineId: formData.lineId },
        });

      if(response.status === 201){
        setShowSuccessModal(true); //등록 성공 모달열기
        setFormData({
          workplaceName: "",
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
      setErrorMessage(error.response?.data?.message||"등록하는데 문제가 발생했어 확인해봐요");
      setShowErrorModal(true); // 오류 모달 열기
    }
  };

    const handleSuccessModalClose = () => {
      setShowSuccessModal(false);
      window.location.reload();
    };  // 성공 모달 닫기기


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
        <select className="workplace-select" name="lineId" onChange={handleChange}>
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

          <label>생산가능용량</label>
          <input className="workplace-input" name="workplaceCapacity" value={formData.workplaceCapacity}
                   placeholder="생산가능 용량" onChange={handleChange} />


          <select className="workplace-select" id="CapacityUnit" name="workplaceCapacityUnit" value={formData.workplaceCapacityUnit} onChange={handleChange}>
            <option value="L">L</option>
            <option value="kg">kg </option>
          </select>
        </div>

        <button className="workplace-button" type="submit">등록하기</button>
      </form>

      {/* 확인 모달 */}
      <ConfirmModal
      isOpen={showConfirmModal}
      onClose={()=>setShowConfirmModal(false)}
      onConfirm={confirmRegistration}
      message="데이터를 등록 하시겠습니까?" 
      />


      {/* 등록 완료 모달 */}
      <SuccessfulModal
      isOpen={showSuccessModal}
      onClose={handleSuccessModalClose}
      message="등록이 완료되었습니다"
      />

      {/* 오류 모달 */}
      <SuccessfulModal
      isOpen={showErrorModal}
      onClose={()=> setShowErrorModal(false)}
      message={`등록 실패: ${errorMessage}`}
      />

    </div>

  );
};

export default WorkplaceForm;
