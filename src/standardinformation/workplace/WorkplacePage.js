import WorkplaceForm from "./WorkplaceForm";
import WorkplaceTable  from "./WorkplaceTable";
import WorkplaceFilter from "./WorkplaceFilter";
import "../../styles/workplace-form.css";
import "../../styles/workplace-table.css";
import "../../styles/workplace-filter.css";


const WorkplacePage = () => {
  return (
    <div className="workplace-page">
      <h2 className="workplace-title">작업장 정보 등록</h2>
      <WorkplaceFilter/>
      <WorkplaceForm/>
      <WorkplaceTable/>
    </div>
  );
};

export default WorkplacePage;
