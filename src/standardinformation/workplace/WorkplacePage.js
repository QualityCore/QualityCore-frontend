import WorkplaceForm from "./WorkplaceForm";
import WorkplaceList from "./WorkplaceList";



const WorkplacePage = () => {
  return (
    <div className="workplace-container">
      <h2>작업장 정보 등록</h2>
      <WorkplaceForm />
      <WorkplaceList />
    </div>
  );
};

export default WorkplacePage;
