import "../styles/workplace-filter.css";

const WorkplaceFilter = () => {
  return (
    <div className="workplace-filter">
      <input className="workplace-filter-input" placeholder="작업장 이름" />

      <input className="workplace-filter-input" placeholder="작업장 코드" />

      <input className="workplace-filter-input" placeholder="작업장 위치" />
      
      <select className="workplace-filter-select">
        <option>가동</option>
        <option>정지</option>
      </select>
      
      <button className="workplace-filter-btn">검색</button>
    </div>
  );
};

export default WorkplaceFilter;
