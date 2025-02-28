import { useEffect, useState } from "react";
import { findAllWorkOrders } from "../../apis/workOrderApi/workOrdersApi";
import workOrder from "./workOrders.module.css";
import Pagination from "../../Pagination/Pagination";

function WorkOrder() {
    const [workOrders, setWorkOrders] = useState([]); // 상태관리
    const [pageInfo, setPageInfo] = useState({
        page: 0, totalPages: 1, first: true, last: true
    }) // 1. 페이지네이션(페이지 기본값설정)

    const fetchData = async (page = 0) => {
        try {
            const data = await findAllWorkOrders(page);
            console.log("✅ API 응답 데이터:", data);

            if (data && Array.isArray(data.content)) {
                setWorkOrders(data.content);  // ✅ 작업지시서 리스트 저장
                setPageInfo({
                    page: data.number,
                    totalPages: data.totalPages,
                    first: data.first,
                    last: data.last
                });
            } else {
                console.error("❌ API 응답이 예상한 형식이 아닙니다:", data);
                setWorkOrders([]);  // 데이터가 없을 경우 초기화
            }
        } catch (error) {
            console.error("❌ 작업지시서 데이터를 불러오는 중 오류 발생:", error);
            setWorkOrders([]);  // 에러 발생 시 데이터 초기화
        }
    };




    useEffect(() => {
        console.log("🚀 useEffect 실행됨");
        fetchData(pageInfo.page);
    }, [pageInfo.page]);


    return (
        <>
            <input type="text" className={workOrder.searchInput} placeholder="작업지시서번호를 입력하세요..." /> <button className={workOrder.searchButton}>검색🔎</button>
            <div className={workOrder.mainbar}>
                <p>결과내 재검색을 하는 경우, 첫번째 결과에 따른 후속 검색 목록을 보여주고,
                    후속 검색 목록에서 검색하는 경우에는 첫번째 결과값이 이미 레파지토리에 있으므로
                    이번 검색은 레파지토리에서 함으로써 DB사용량을 줄이고(비용감소) 성능을 확보한다.
                    또한 후속 검색목록에 있는 검색방법들은 첫번째 검색 목록에 있는 모듈을 재사용한다.
                </p>
                <table className={workOrder.workOrderTable}>
                    <thead>
                        <tr>
                            <th>작업번호</th>
                            <th>작업조</th>
                            <th>제품명</th>
                            <th>생산시작일</th>
                            <th>생산종료일</th>
                            <th>수량</th>
                            <th>생산라인</th>
                            <th>작업지시상태</th>
                            <th>진행률(%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workOrders.map((work) => (
                            <tr key={work.lotNo}>
                                <td>{work.lotNo}</td>
                                <td>{work.workTeam}</td>
                                <td>{work.productName}</td>
                                <td>{work.startDate}</td>
                                <td>{work.endDate}</td>
                                <td>{work.planQty}</td>
                                <td>{work.lineNo} LINE</td>
                                <td>{work.processStatus}</td>
                                <td>{work.workProgress}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination
                    page={pageInfo.page}
                    totalPages={pageInfo.totalPages}
                    first={pageInfo.first}
                    last={pageInfo.last}
                    onPageChange={(newPage) => setPageInfo((prev) => ({ ...prev, page: newPage }))}
                />
            </div>
        </>
    );
}

export default WorkOrder;
