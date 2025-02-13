import "./workCreate.css"

function WorkCreate() {

    return (
        <>
            <div className="mainBar">
                <h2 className="tableName">작업지시서</h2>
                <table className="table">
                    <tr>
                        <th>지시번호</th>
                        <td>16</td>
                        <th>제품명</th>
                        <td>원더맥주</td>
                    </tr>
                    <tr>
                        <th>생산예정일</th>
                        <td>2025-01-27</td>
                        <th>납기일자</th>
                        <td>2025-02-05</td>
                    </tr>
                    <tr>
                        <th>지시수량</th>
                        <td>300</td>
                        <th>용량</th>
                        <td>캔(330mL)</td>
                    </tr>
                </table>
                <h2 className="bomName">원자재</h2>
                <button className="bomCreateButton">🔎품목추가</button>
                <table className="bomTable">
                    <tr>
                        <th>NO</th>
                        <th>품목명</th>
                        <th>수량</th>
                        <th>단위</th>
                        <th>단가</th>
                        <th>금액</th>
                    </tr>
                    <tr>
                        <td>001</td>
                        <td>보리</td>
                        <td>24</td>
                        <td>KG</td>
                        <td>800</td>
                        <td>19,200</td>
                    </tr>
                    <tr>
                        <td colspan="4"><strong>합계</strong></td>
                        <td id="totalQuantity"></td>
                        <td id="totalAmount"></td>
                    </tr>
                </table>
                <h2 className="footName">특이사항</h2>
                <textarea name="" id="" className="etc"></textarea>
                <button className="createButton">🔎등록</button>
            </div>
            <div className="dd">

            </div>
        </>
    );
}

export default WorkCreate;