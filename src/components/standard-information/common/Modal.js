import React from "react";
import "../../../styles/standard-information/common/modal.css"; 

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null; // 모달이 열려있지 않으면 렌더링하지 않음

  return (
    <div className="modal"  >
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onConfirm} className="m-confirm-btn">
          확인
        </button>
        <button onClick={onClose} className="m-cancel-btn">
          취소
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
