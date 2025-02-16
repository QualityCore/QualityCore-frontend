import React, { useState } from "react";
import "../../styles/common/modal.css"; 

const Modal = ({ isOpen, onClose, onConfirm, message, isFinal }) => {
  if (!isOpen) return null; // 모달이 열려있지 않으면 렌더링하지 않음

  return (
    <div className="modal">
      <div className="modal-content">
        <p>{message}</p>
        <button onClick={onConfirm} className="confirm-btn">
          확인
        </button>
        {!isFinal && (
          <button onClick={onClose} className="cancel-btn">
            취소
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
