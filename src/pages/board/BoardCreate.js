import React, { useState } from "react";
import BoardsCreate from "../../styles/board/boardCreate.module.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { createBoard } from "../../apis/boardApi/BoardApi";
import { useNavigate } from "react-router-dom";

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
            alert("게시글이 등록되었습니다!");
            
            // 게시판 목록 페이지로 이동 ✅
            navigate("/board"); 

        } catch (error) {
            setError(error.message);
            console.error("등록 실패:", error);
        } finally {
            setLoading(false);
        }
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
        </div>
    );
}

export default BoardCreate;
