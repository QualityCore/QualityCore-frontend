import workOrders from "./workCreate.module.css"
function WorkOrder() {

    return (
        <>
            <div className={workOrders.searchbar}>
                <label>작업지시번호&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input type="text" />
                <label>생산공정&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <select name="" id="">
                    <option value="당화">당화</option>
                    <option value="여과">여과</option>
                    <option value="끓임">끓임</option>
                    <option value="냉각">냉각</option>
                    <option value="발효">발효</option>
                    <option value="숙성">숙성</option>
                    <option value="여과 및 탄산조정">여과 및 탄산조정</option>
                    <option value="패키징 및 출하">패키징 및 출하</option>
                </select>
                <label>지시수량&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input type="text" />
                <br />
                <label>작업조&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <select name="" id="">
                    <option value="A">A조</option>
                    <option value="B">B조</option>
                    <option value="C">C조</option>
                </select>
                <label>생산시작일자&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input type="date" />
                <label>생산종료일자&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input type="date" />
                <br />
                <label>생산라인&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <select name="" id="">
                    <option value="1">1라인</option>
                    <option value="2">2라인</option>
                    <option value="3">3라인</option>
                    <option value="4">4라인</option>
                    <option value="5">5라인</option>
                </select>
                <label>제품명&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <input type="text" />
                <label>작업지시상태&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
                <select name="" id="">
                    <option value="">생산대기중</option>
                    <option value="">생산중</option>
                    <option value="">생산중단</option>
                    <option value="">생산종료</option>
                </select>
                <button className={workOrders.searchButton}>🔎검색</button>
            </div>
            <div className={workOrders.mainbar}>
                <table>
                    <thead>
                        <tr>
                            <th>작업번호</th>
                            <th>작업조</th>
                            <th>제품명</th>
                            <th>생산시작일</th>
                            <th>생산종료일</th>
                            <th>수량</th>
                            <th>생산공정</th>
                            <th>생산라인</th>
                            <th>작업지시상태</th>
                            <th>진행률(%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>1</td>
                            <td>A조</td>
                            <td>카리나맥주</td>
                            <td>2025-02-03</td>
                            <td>2025-02-18</td>
                            <td>1000개</td>
                            <td>당화</td>
                            <td>1LINE</td>
                            <td>생산중</td>
                            <td>
                                <div className={workOrders.progress_container}>
                                    <div className={workOrders.progress_bar}>100%</div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}

export default WorkOrder;