import { useState } from "react";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  const [deleteInput, setDeleteInput] = useState("");
  const confirmText = `${itemName} 데이터를 삭제 합니다.`; // 🔥 삭제 확인 문구

  // 입력 필드 업데이트
  const handleInputChange = (e) => {
    setDeleteInput(e.target.value);
  };

  return (
    <div className={`modal ${isOpen ? "show" : ""}`}>
      <div className="modal-content">
        <p style={{ color: "red", fontWeight: "bold" }}>
          *삭제를 원하면 해당 문구를 동일하게 입력 하시길 바랍니다.
        </p>
        <p style={{ color: "orange", fontWeight: "bold" }}>{confirmText}</p>
        
        {/* 삭제 문구 입력 필드 */}
        <input
          type="text"
          value={deleteInput}
          onChange={handleInputChange}
          placeholder={confirmText}
          style={{
            width: "100%",
            padding: "8px",
            textAlign: "center",
            borderRadius: "5px",
            border: "1px solid #ccc",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        />

        <div className="modal-buttons">
          {/* 입력값이 올바르면 삭제 버튼 활성화 */}
          <button
            onClick={onConfirm}
            disabled={deleteInput !== confirmText}
            style={{
              backgroundColor: deleteInput === confirmText ? "blue" : "gray",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: deleteInput === confirmText ? "pointer" : "not-allowed",
            }}
          >
            확인
          </button>
          <button onClick={() => {
                console.log("❌ [취소 버튼 클릭됨] 모달 닫기 실행");
                onClose();
                }} style={{ padding: "10px 20px" }}>
                취소
          </button>

        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
