import React from "react";
import "../../styles/common/modal.css"; 

const AlertModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null; // 모달이 열려있지 않으면 렌더링하지 않음

  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onClose} className="m-confirm-btn">
          확인
        </button>
      </div>
    </div>
  );
};

export default AlertModal;
