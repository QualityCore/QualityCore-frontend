import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProductionPlan from "./pages/productionPlan/ProductionPlan";
import WorkplacePage from "./pages/standard-information/WorkplacePage";
import './styles/App.css';
import Attendance from "./pages/attendance/Attendance";
import WorkOrder from "./pages/work/WorkOrder"
import WorkCreate from "./pages/work/WorkCreate";
import ProductionPlanSteps from "./pages/productionPlan/ProductionPlanSteps"
import ProductionPlanDetailPage from "./pages/productionPlan/ProductionPlanDetailPage";
import MaterialGrindingPage from "./pages/production-process/material-grinding/MaterialGrindingPage";
import MashingProcessPage from "./pages/production-process/mashing-process/MashingProcessPage";
import ProcessTrackingPage from "./pages/routing/processTracking";
import MaterialManagementPage from "./pages/productionPlan/Material";
import ProcessStage from "./components/standard-information/ProcessStage";



const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* 사이드바 */}
        <Sidebar />

        <div className="main-wrapper">

          <Header />

          {/* 메인 컨텐츠 */}
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/plan-overview" element={<ProductionPlan />} />
              <Route path="/detail/:planId" element={<ProductionPlanDetailPage />} />
              <Route path="/plan-generate" element={<ProductionPlanSteps />} />
              <Route path="/processTracking" element={<ProcessTrackingPage />} />
              <Route path="/material" element={<MaterialManagementPage />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/work/orders" element={<WorkOrder />} />
              <Route path="/work/create" element={<WorkCreate />} />
              <Route path="/workplace" element={<WorkplacePage />} />
              <Route path="/material-grinding" element={<MaterialGrindingPage />} />
              <Route path="/mashing-process" element={<MashingProcessPage />} />
              <Route path="/process-stage" element={<ProcessStage />} />

            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;