import { useState } from "react";
import WorkplaceForm from "./WorkplaceForm";
import WorkplaceTable  from "./WorkplaceTable";
import "../../../styles/workplace-form.css";
import "../../../styles/workplace-table.css";


const WorkplacePage = () => {
  const [workplaces, setWorkplaces] = useState([
    { name: "냉각실", code: "Co001", location: "제1동 2층", type: "냉각", status: "가동중", manager: "소연희", capacity: "5000L/day" }
  ]);

  const addWorkplace = (newWorkplace) => {
    setWorkplaces([...workplaces, newWorkplace]);
  };

  return (
    <div className="workplace-page">
      <WorkplaceForm onAddWorkplace={addWorkplace} />
      <WorkplaceTable workplaces={workplaces} />
    </div>
  );
};

export default WorkplacePage;
