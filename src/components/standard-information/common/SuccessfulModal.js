import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../lottie/Success.json";
import "../../../styles/standard-information/common/modal.css";

const SuccessfulModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null; // 모달이 열려있지 않으면 렌더링하지 않음

  return (
    <div className="modal">
      <div className="modal-content">

        <Lottie animationData={animationData} loop={true} className="success-animation"  />
        
        <p>{message}</p>
        <button onClick={onClose} className="m-confirm-btn">
          확인
        </button>
      </div>
    </div>
  );
};

export default SuccessfulModal;
