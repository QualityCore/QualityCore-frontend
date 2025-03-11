import React, { useState } from "react";
import BoardsCreate from "../../styles/board/boardCreate.module.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createBoard } from "../../apis/boardApi/BoardApi";
import { useNavigate } from "react-router-dom";
import SuccessAnimation from "../../lottie/SuccessNotification"; // 성공 애니메이션 컴포넌트 임포트
    import WarningAnimation from "../../lottie/WarningNotification"; // 경고 애니메이션 컴포넌트 임포트
import Modal from 'react-modal';

function BoardCreate() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: "일반",
        title: "",
        author: "",
        content: "",
        file: null
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSuccessModal, setIsSuccessModal] = useState(false); // 성공 모달 상태
    const [modalMessage, setModalMessage] = useState(''); // 성공 메시지 상태
    const [isWarningModal, setIsWarningModal] = useState(false); // 경고 모달 상태
    const [warningMessage, setWarningMessage] = useState(''); // 경고 메시지 상태

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({ ...prev, file: e.target.files[0] }));
    };

    const handleEditorChange = (content) => {
        setFormData(prev => ({ ...prev, content }));
    };

    // 글쓰기
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!formData.title || !formData.content) { // author 검증 제거
                throw new Error("제목과 내용은 필수 입력 항목입니다.");
            }

            const apiFormData = new FormData();
            apiFormData.append("boardData", JSON.stringify({
                boardTitle: encodeURIComponent(formData.title),
                empId: "EMP001", // 작성자는 고정값으로 설정
                boardContents: encodeURIComponent(formData.content),
                boardCategory: encodeURIComponent(formData.category)
            }));

            if (formData.file) {
                apiFormData.append("file", formData.file);
            }

            await createBoard(apiFormData);
            setModalMessage("게시글이 성공적으로 등록되었습니다!"); // 성공 메시지 설정
            setIsSuccessModal(true); // 성공 모달 열기

            // 게시판 목록 페이지로 이동 ✅
            // navigate("/board"); 

        } catch (error) {
            if (error.message === "제목과 내용은 필수 입력 항목입니다.") {
                setWarningMessage("제목과 내용을 입력해 주세요.");
                setIsWarningModal(true); // 경고 모달 열기
            } else {
                setError(error.message);

            }
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsSuccessModal(false);
        navigate("/board"); // 모달 닫으면 목록으로 이동
    };

    const closeWarningModal = () => {
        setIsWarningModal(false);
    };

    return (
        <div className={BoardsCreate.mainBar}>
            <div className={BoardsCreate.formWrapper}>
                {error && <div className={BoardsCreate.error}>{error}</div>}

                <div className={BoardsCreate.inputGroup}>
                    <label>카테고리</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                    >
                        <option value="일반">일반</option>
                        <option value="중요">중요</option>
                        <option value="공지">공지</option>
                    </select>
                </div>
                <div className={BoardsCreate.inputGroup}>
                    <label>제목</label>
                    <input
                        type="text"
                        name="title"
                        placeholder="제목을 입력하세요"
                        value={formData.title}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={BoardsCreate.inputGroup}>
                    <label>첨부파일</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                    />
                </div>
                <div className={BoardsCreate.inputGroup}>
                    <label>내용</label>
                    <ReactQuill
                        value={formData.content}
                        onChange={handleEditorChange}
                        placeholder="내용을 입력하세요..."
                        style={{ height: "400px", marginBottom: "50px" }}
                    />
                </div>

                <div className={BoardsCreate.submitButton}>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? "등록 중..." : "작성하기"}
                    </button>
                </div>
            </div>

            {/* 성공 모달 */}
            {isSuccessModal && (
                <Modal
                    isOpen={isSuccessModal}
                    onRequestClose={closeModal}
                    className={BoardsCreate.successModal}
                    overlayClassName="successModalOverlay"
                >
                    <div className={BoardsCreate.successModalHeader}>
                        <button className={BoardsCreate.successCloseButton} onClick={closeModal}>X</button>
                    </div>
                    <div className={BoardsCreate.successModalContent}>
                        <SuccessAnimation />
                        <p className={BoardsCreate.successMessage}>{modalMessage}</p>
                    </div>
                </Modal>
            )}

            {/* 경고 모달 */}
            {isWarningModal && (
                <Modal
                    isOpen={isWarningModal}
                    onRequestClose={closeWarningModal}
                    className={BoardsCreate.warningModal}
                    overlayClassName="warningModalOverlay"
                >
                    <div className={BoardsCreate.warningModalHeader}>
                        <button className={BoardsCreate.warningCloseButton} onClick={closeWarningModal}>X</button>
                    </div>
                    <div className={BoardsCreate.warningModalContent}>
                        <WarningAnimation />
                        <p className={BoardsCreate.warningMessage}>{warningMessage}</p>
                    </div>
                </Modal>
            )}
        </div>
    );
}

export default BoardCreate;
