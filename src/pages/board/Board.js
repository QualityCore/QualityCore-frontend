import React, { useState, useEffect } from "react";
import Boards from "../../styles/board/board.module.css"; // 스타일을 임포트
import { fetchBoards } from "../../apis/boardApi/BoardApi"; // fetchBoards 함수를 import
import { useNavigate, useLocation } from "react-router-dom";
import Pagination from "../../Pagination/Pagination"; // 페이지네이션 컴포넌트 임포트

function Board() {
    const [boards, setBoards] = useState([]); // 게시판 데이터 상태 관리
    const [paginationInfo, setPaginationInfo] = useState({ page: 0, totalPages: 0, first: true, last: true }); // 페이징 정보 상태 관리
    const [searchKeyword, setSearchKeyword] = useState(""); // 검색 키워드 상태 관리
    const [searchType, setSearchType] = useState("title"); // 검색 타입 (제목 or 작성자 or 내용)
    const [loading, setLoading] = useState(true); // 로딩 상태 관리
    const [error, setError] = useState(""); // 에러 상태 관리
    const [refreshData, setRefreshData] = useState(false); // 데이터 갱신 플래그

    const navigate = useNavigate();
    const location = useLocation();

    // 게시판 데이터 불러오기 함수
    const loadBoards = async (page = 0) => {
        try {
            setLoading(true);
            const { content, pageInfo } = await fetchBoards(page, 12, searchType, searchKeyword); // API 호출
            setBoards(content); // 게시글 목록 저장
            setPaginationInfo({
                page: pageInfo.currentPage,
                totalPages: pageInfo.totalPages,
                first: pageInfo.first,
                last: pageInfo.last,
            }); // 페이징 정보 저장
        } catch (err) {
            setError("게시판 데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 컴포넌트가 마운트될 때 데이터 로드
    useEffect(() => {
        loadBoards();
    }, [location.pathname, refreshData]); // 경로 변경 시 데이터 다시 로드

    // 글쓰기 버튼 클릭 시 /board-create 페이지로 이동
    const handleWriteClick = () => {
        navigate("/board-create"); // /board-create 경로로 이동
    };

    // 게시글 클릭 시 상세 페이지로 이동
    const handleRowClick = (boardId) => {
        navigate(`/board/${boardId}`); // /board/:boardId 경로로 이동
    };

    // 검색 버튼 클릭 시 호출
    const handleSearch = () => {
        loadBoards(0); // 첫 페이지부터 검색 시작
    };

    // 상세 페이지에서 수정 후 돌아올 때 데이터 갱신
    useEffect(() => {
        if (location.state && location.state.isUpdated) {
            setRefreshData(!refreshData); // 데이터 갱신 플래그 설정
        }
    }, [location]);

    // 데이터가 제대로 업데이트되는지 확인
    useEffect(() => {
    }, [boards]);

    return (
        <div className={Boards.boardContainer}>
            {/* 검색 영역 */}
            <div className={Boards.headerBar}>
                <button className={Boards.leftButton} onClick={handleWriteClick}>글쓰기</button>
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
                />
                <button className={Boards.searchButton} onClick={handleSearch}>검색</button>
            </div>

            {/* 게시판 목록 테이블 */}
            <div className={Boards.mainBar}>
                {error ? (
                    <p>{error}</p>
                ) : boards.length === 0 ? ( // 게시글이 없을 경우 메시지 표시
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
                        <div style={{ position: "fixed", bottom: "65px", left: "58%", transform: "translateX(-50%)" }}>
                            <Pagination
                                page={paginationInfo.page}
                                totalPages={paginationInfo.totalPages}
                                first={paginationInfo.first}
                                last={paginationInfo.last}
                                onPageChange={(newPage) => loadBoards(newPage)} // 페이지 변경 시 데이터 로드
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default Board;
