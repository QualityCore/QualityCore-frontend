import { useState } from "react";
import Lottie from "lottie-react";
import animationData from "../../../lottie/caution.json";
import "../../../styles/standard-information/common/modal.css"; 

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  const [deleteInput, setDeleteInput] = useState("");

  const confirmText = `${itemName} 삭제`.trim(); // 삭제 확인 문구 및 공백제거거


  // 입력 필드 업데이트
  const handleInputChange = (e) => { 
    setDeleteInput(e.target.value.trim());
  };

  // 엔터키 입력 시 확인 버튼 클릭
  const handleKeyDown = (e) =>{
    if(e.key === "Enter" && deleteInput === confirmText){
      onConfirm();
    }
  } 


  return (
    <div className={`modal ${isOpen ? "show" :""}`}>
      <div className="modal-content">
        
        {/*애니메이션 추가 */}
        <Lottie animationData={animationData} loop={true} className="caution-animation"  />

        <p className="modal-f-message">*삭제를 원하시면 해당 문구를 동일하게 입력 하세요.</p>

        <p className="modal-s-message">{confirmText}</p>
 
        {/* 삭제 문구 입력 필드 */}
        <input className="deleteMdal"
               type="text" value={deleteInput} 
               onChange={handleInputChange} 
               onKeyDown={handleKeyDown}
               placeholder={confirmText}/>

        <div className="modal-buttons">

          
          <button onClick={onConfirm}
                  disabled={deleteInput !== confirmText}
                  className="m-confirm-btn">
                  확인
          </button>

          <button onClick={() => {
                  onClose();}} 
                  className="m-cancel-btn">
                  취소
          </button>

        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
