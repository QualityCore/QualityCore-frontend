// 게시판 전체조회
export const fetchBoards = async (
    page = 0, 
    size = 11, 
    searchType = '', 
    searchKeyword = ''
  ) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('size', size);
      if (searchType && searchKeyword) {
        params.append('searchType', searchType);
        params.append('searchKeyword', searchKeyword);
      }
  
      const url = `http://localhost:8080/api/v1/board?${params.toString()}`;
      console.log("게시판 API 요청 URL:", url);
  
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`요청 실패: ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log('게시판 조회 data:', data);
  
      if (data?.result?.board?.content && Array.isArray(data.result.board.content)) {
        return {
          content: data.result.board.content, // 게시글 목록
          pageInfo: {
            currentPage: data.result.board.number,
            totalPages: data.result.board.totalPages,
            totalElements: data.result.board.totalElements,
            first: data.result.board.first,
            last: data.result.board.last,
            pageSize: data.result.board.size
          }
        };
      } else {
        console.error("잘못된 데이터 형식:", data);
        return { content: [], pageInfo: {} };
      }
    } catch (error) {
      console.error("게시판 조회 오류:", error);
      return { content: [], pageInfo: {} };
    }
  };
  

// 게시판 상세조회
export const fetchBoardByCode = async (boardId) => {
    try {
        // 'boardId'로 상세 조회 API 호출
        const response = await fetch(`http://localhost:8080/api/v1/board/${boardId}`);
        
        // 응답 데이터를 JSON으로 변환
        const data = await response.json();
        
        console.log('게시판 상세 조회 data', data);

        // 서버에서 반환된 board 데이터 리턴
        return data.result.board;
    } catch (error) {
        console.error("게시판 상세 조회 중 오류 발생:", error);
        throw error;
    }
};

// 게시판 등록
export const createBoard = async (formData) => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/board', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`HTTP 오류! 상태: ${response.status}, 메시지: ${errorMessage}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("게시글 등록 실패:", error);
        throw new Error("게시글 등록 중 오류가 발생했습니다.");
    }
};

// 게시판 수정
export const updateBoard = async (boardData) => {
    try {
        const response = await fetch('http://localhost:8080/api/v1/board', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(boardData),
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`HTTP 오류! 상태: ${response.status}, 메시지: ${errorMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("게시글 수정 실패:", error);
        throw new Error("게시글 수정 중 오류가 발생했습니다.");
    }
};

// 게시판 삭제
export const deleteBoard = async (boardId) => {
    try {
        const response = await fetch(`http://localhost:8080/api/v1/board/${boardId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`HTTP 오류! 상태: ${response.status}, 메시지: ${errorMessage}`);
        }

        return await response.json();
    } catch (error) {
        console.error("게시글 삭제 실패:", error);
        throw new Error("게시글 삭제 중 오류가 발생했습니다.");
    }
};
