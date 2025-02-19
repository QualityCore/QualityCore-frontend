import { useState } from "react";
import "../../styles/common/modal.css"; 

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  const [deleteInput, setDeleteInput] = useState("");

  const confirmText = `${itemName} 데이터를 삭제 합니다.`; // 🔥 삭제 확인 문구

  // 입력 필드 업데이트
  const handleInputChange = (e) => {
    setDeleteInput(e.target.value);
  };

  return (
    <div className={`modal ${isOpen ? "show" :""}`}>
      <div className="modal-content">
        
        <p className="modal-f-message">*삭제를 원하면 해당 문구를 동일하게 입력 하시길 바랍니다.</p>

        <p className="modal-s-message">{confirmText}</p>

        
        {/* 삭제 문구 입력 필드 */}
        <input type="text" value={deleteInput} onChange={handleInputChange} placeholder={confirmText}/>

        <div className="modal-buttons">
          {/* 입력값이 올바르면 삭제 버튼 활성화 */}
          <button onClick={onConfirm} disabled={deleteInput !== confirmText} className="m-confirm-btn">
            확인
          </button>
          <button onClick={() => {onClose();}} className="m-cancel-btn">
            취소
          </button>

        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
