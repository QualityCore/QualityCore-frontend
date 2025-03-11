import React, { useState, useEffect } from "react";
import Boards from "../../styles/board/board.module.css";
import { fetchBoards } from "../../apis/boardApi/BoardApi";
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "../../Pagination/Pagination";
import { useAuth } from "../../contexts/AuthContext";

function Board() {
    const { currentUser } = useAuth();
    const [boards, setBoards] = useState([]);
    const [paginationInfo, setPaginationInfo] = useState({ page: 0, totalPages: 0, first: true, last: true });
    const [searchKeyword, setSearchKeyword] = useState("");
    const [searchType, setSearchType] = useState("title");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [refreshData, setRefreshData] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // 게시판 데이터 불러오기 함수
    const loadBoards = async (page = 0) => {
        try {
            setLoading(true);
            const { content, pageInfo } = await fetchBoards(page, 12, searchType, searchKeyword);
            
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
            
            setBoards(sortedContent);
            setPaginationInfo({
                page: pageInfo.currentPage,
                totalPages: pageInfo.totalPages,
                first: pageInfo.first,
                last: pageInfo.last,
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
    }, [location.pathname, refreshData]);

    // 글쓰기 버튼 클릭 시 처리
    const handleWriteClick = () => {
        // 로그인하지 않은 경우 경고
        if (!currentUser) {
            alert("게시글을 작성하려면 로그인이 필요합니다.");
            return;
        }
        navigate("/board-create");
    };

    // 게시글 클릭 시 상세 페이지로 이동
    const handleRowClick = (boardId) => {
        navigate(`/board/${boardId}`);
    };

    // 검색 버튼 클릭 시 호출
    const handleSearch = () => {
        loadBoards(0);
    };

    // 상세 페이지에서 수정 후 돌아올 때 데이터 갱신
    useEffect(() => {
        if (location.state && location.state.isUpdated) {
            setRefreshData(!refreshData);
        }
    }, [location]);


    
    return (
        <div className={Boards.boardContainer}>
            <div className={Boards.mainBar}>
                <h1 className={Boards.pageTitle}>게시판</h1>
                
                {/* 검색 영역 */}
                <div className={Boards.headerBar}>
                    <div className={Boards.searchGroup}>
                        <select
                            name="searchType"
                            className={Boards.searchSelect}
                            value={searchType}
                            onChange={(e) => setSearchType(e.target.value)}
                        >
                            <option value="title">제목</option>
                            <option value="author">작성자</option>
                            <option value="content">내용</option>
                        </select>
                        <input
                            type="text"
                            className={Boards.searchInput}
                            placeholder="검색어를 입력하세요"
                            value={searchKeyword}
                            onChange={(e) => setSearchKeyword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") handleSearch();
                            }}
                        />
                        <button className={Boards.searchButton} onClick={handleSearch}>검색</button>
                    </div>
                    <div className={Boards.buttonContainer}>
                        <button className={Boards.leftButton} onClick={handleWriteClick}>글쓰기</button>
                    </div>
                </div>

                {/* 게시판 목록 테이블 */}
                <div className={Boards.tableContainer}>
                    {error ? (
                        <p>{error}</p>
                    ) : boards.length === 0 ? (
                        <p className={Boards.noText}>게시글이 없습니다.</p>
                    ) : (
                        <>
                            <table className={Boards.boardTable}>
                                <thead className={Boards.tableHeader}>
                                    <tr>
                                        <th></th>
                                        <th>제목</th>
                                        <th>작성자</th>
                                        <th>작성일</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {boards.map((board) => (
                                        <tr
                                            key={board.boardId}
                                            className={`${Boards.tableRow} 
                                                ${board.boardCategory === "중요" ? Boards.importantRow : ""}
                                                ${board.boardCategory === "공지" ? Boards.noticeRow : ""}`}
                                            onClick={() => handleRowClick(board.boardId)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {/* 카테고리 태그 */}
                                            <td>
                                                <span
                                                    className={`${Boards.categoryTag} 
                                                        ${board.boardCategory === "중요" ? Boards.importantTag :
                                                            board.boardCategory === "공지" ? Boards.noticeTag :
                                                                Boards.normalTag}`}
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
                                    ))}
                                </tbody>
                            </table>

                            {/* 페이지네이션 컴포넌트 */}
                            <div className={Boards.paginationContainer}>
                                <Pagination
                                    page={paginationInfo.page}
                                    totalPages={paginationInfo.totalPages}
                                    first={paginationInfo.first}
                                    last={paginationInfo.last}
                                    onPageChange={(newPage) => loadBoards(newPage)}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Board;