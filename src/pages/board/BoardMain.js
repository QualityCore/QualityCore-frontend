import React, { useState, useEffect } from "react";
import boardMain from "../../styles/board/boardMain.module.css"; // 스타일을 임포트
import { fetchBoardsMain } from "../../apis/boardApi/BoardApi"; // fetchBoardsMain 함수를 import
import { useNavigate } from "react-router-dom"; // useNavigate 임포트
import { FaFastBackward, FaAngleLeft, FaAngleRight, FaFastForward } from 'react-icons/fa'; // 아이콘 import

function BoardMain() {
    const [boards, setBoards] = useState([]); // 게시판 데이터 상태 관리
    const [paginationInfo, setPaginationInfo] = useState({ page: 0, totalPages: 0, first: true, last: true, totalElements: 0 }); // 페이징 정보 상태 관리
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(""); // 에러 상태 관리

    const navigate = useNavigate(); // 네비게이터 생성

    // 게시판 데이터 불러오기 함수
    const loadBoards = async (page = 0) => {
        try {
            setLoading(true);
            const { content, pageInfo } = await fetchBoardsMain(page, 5); // API 호출
            
            // 정렬 순서: 공지 > 중요 > 일반 순으로 정렬
            const sortedContent = [...content].sort((a, b) => {
                const categoryOrder = {
                    "공지": 3,
                    "중요": 2,
                    "일반": 1
                };
                
                // 카테고리 기준 내림차순 정렬 (높은 숫자가 먼저)
                return categoryOrder[b.boardCategory] - categoryOrder[a.boardCategory] ||
                       // 같은 카테고리 내에서는 최신순(boardId가 큰 순)으로 정렬
                       b.boardId.localeCompare(a.boardId);
            });
            
            setBoards(sortedContent); // 정렬된 게시글 목록 저장
            setPaginationInfo({
                page: pageInfo.currentPage,
                totalPages: pageInfo.totalPages,
                first: pageInfo.first,
                last: pageInfo.last,
                totalElements: pageInfo.totalElements,
            });
        } catch (err) {
            setError("게시판 데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트가 마운트될 때 데이터 로드
    useEffect(() => {
        loadBoards();
    }, []);

    // 게시글 클릭 시 상세 페이지로 이동
    const handleRowClick = (boardId) => {
        navigate(`/board/${boardId}`); // 상세 페이지로 이동
    };

    return (
        <div className={boardMain.boardMainContainer}>
            <div className={boardMain.boardTableContainer}>
                {/* 게시판 목록 테이블 */}
                <table className={boardMain.boardTable}>
                    <thead className={boardMain.tableHeader}>
                        <tr>
                            <th></th>
                            <th>제목</th>
                            <th>작성자</th>
                            <th>작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="4">데이터 로딩 중...</td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="4">{error}</td>
                            </tr>
                        ) : boards.length === 0 ? (
                            <tr>
                                <td colSpan="4">게시글이 없습니다.</td>
                            </tr>
                        ) : (
                            boards.map((board) => (
                                <tr
                                    key={board.boardId}
                                    onClick={() => handleRowClick(board.boardId)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {/* 카테고리 태그 */}
                                    <td>
                                        <span
                                            className={`${board.boardCategory === "중요" ? boardMain.importantTag :
                                                board.boardCategory === "공지" ? boardMain.noticeTag :
                                                    boardMain.normalTag}`}
                                        >
                                            {board.boardCategory}
                                        </span>
                                    </td>

                                    {/* 제목 */}
                                    <td>{board.boardTitle}</td>

                                    {/* 글쓴이 */}
                                    <td>{board.empName}</td>

                                    {/* 작성시간 */}
                                    <td>{new Date(board.boardDate).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* 페이징 컴포넌트 */}
            {paginationInfo.totalElements > 0 && (
                <div className={boardMain.pagination}>
                    {paginationInfo.totalPages > 1 && (
                        <button
                            onClick={() => loadBoards(0)}
                            disabled={paginationInfo.first}
                            className={boardMain.button}
                        >
                            <FaFastBackward size={10} /> {/* << 아이콘 */}
                        </button>
                    )}
                    {paginationInfo.totalPages > 1 && (
                        <button
                            onClick={() => loadBoards(paginationInfo.page - 1)}
                            disabled={paginationInfo.first}
                            className={boardMain.button}
                        >
                            <FaAngleLeft size={10} /> {/* < 아이콘 */}
                        </button>
                    )}
                    {paginationInfo.totalPages > 1 && (
                        [...Array(paginationInfo.totalPages)].map((_, index) => (
                            <button
                                key={index}
                                onClick={() => loadBoards(index)}
                                disabled={paginationInfo.page === index}
                                className={`${boardMain.button} ${paginationInfo.page === index ? boardMain.active : ""}`}
                            >
                                {index + 1}
                            </button>
                        ))
                    )}
                    {paginationInfo.totalPages > 1 && (
                        <button
                            onClick={() => loadBoards(paginationInfo.page + 1)}
                            disabled={paginationInfo.last}
                            className={boardMain.button}
                        >
                            <FaAngleRight size={10} /> {/* > 아이콘 */}
                        </button>
                    )}
                    {paginationInfo.totalPages > 1 && (
                        <button
                            onClick={() => loadBoards(paginationInfo.totalPages - 1)}
                            disabled={paginationInfo.last}
                            className={boardMain.button}
                        >
                            <FaFastForward size={10} /> {/* >> 아이콘 */}
                        </button>
                    )}
                    {paginationInfo.totalPages === 1 && (
                        <button
                            key={0}
                            disabled={true}
                            className={`${boardMain.button} ${boardMain.active}`}
                        >
                            1
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default BoardMain;