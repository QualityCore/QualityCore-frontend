import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../lottie/caution.json"; 
import "../../../styles/standard-information/common/modal.css";

const ErrorModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null; // 모달이 닫혀있으면 렌더링하지 않음

  return (
    <div className="modal">
      <div className="modal-content">
        <Lottie animationData={animationData} loop={true} className="warning-animation" />
        <p>{message}</p>
        <button onClick={onClose} className="m-confirm-btn">
          확인
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
