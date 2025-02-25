import React from "react";
import Lottie from "lottie-react";
import animationData from "../../../lottie/complete.json"; // 완료 애니메이션 JSON 파일 (없다면 대체 가능)
import "../../../styles/standard-information/common/modal.css";

const CompleteModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <Lottie animationData={animationData} loop={true} className="complete-animation" />
        <p>
        {Array.isArray(message)
        ? message.map((line, index) => (
          <React.Fragment key={index}>
          {line}
          <br />
         </React.Fragment>
        ))
    : message}
</p>
        <button onClick={onClose} className="m-confirm-btn">
          확인
        </button>
      </div>
    </div>
  );
};

export default CompleteModal;
