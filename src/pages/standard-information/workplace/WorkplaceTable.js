import "../../../styles/workplace-table.css";


const WorkplaceTable = ({workplaces}) => {
  
  return (
    <table className="workplace-table">
      <thead>
        <tr>
          <th>작업장 이름</th>
          <th>작업장 코드</th>
          <th>작업장 위치</th>
          <th>작업장 타입</th>
          <th>작업장 상태</th>
          <th>작업 담당자</th>
          <th>작업장 용량/생산가능량량</th>
        
        </tr>
      </thead>
      <tbody>
        {workplaces.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.code}</td>
            <td>{item.location}</td>
            <td>{item.type}</td>
            <td>{item.status}</td>
            <td>{item.manager}</td>
            <td>{item.capacity}</td>
            <td>
              <button className="workplace-edit-btn">수정</button>
              <button className="workplace-delete-btn">삭제</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WorkplaceTable;
