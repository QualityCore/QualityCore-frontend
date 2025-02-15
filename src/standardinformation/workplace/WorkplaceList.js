

const WorkplaceList = () => {
  const data = [
    { name: "냉각실", code: "Co001", location: "제1동 2층", type: "냉각", status: "가동중", manager: "소연희", capacity: "5000L/day" }
  ];

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
          <th>작업장 용량</th>
          <th>수정</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.code}</td>
            <td>{item.location}</td>
            <td>{item.type}</td>
            <td>{item.status}</td>
            <td>{item.manager}</td>
            <td>{item.capacity}</td>
            <td>
              <button className="edit-btn">수정</button>
              <button className="delete-btn">삭제</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WorkplaceList;
