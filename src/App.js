import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./components/login/Login";
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
import EquipmentInfo from "./components/standard-information/EquipmentInfo";
import LabelInfo from "./components/standard-information/LabelInfo";
import Board from "./pages/board/Board";
import BoardCreate from "./pages/board/BoardCreate"
import WortVolumePage from "./pages/routing/WortVolumePage";
import BoardDetail from "./pages/board/BoardDetail";
import { WebsocketProvider } from './common/WebSocket/WebsocketContext';

// 레이아웃 컴포넌트 - 사이드바와 헤더를 포함
const Layout = ({ children }) => {
  return ( 
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Header />
        <div className="main-content">
          {children}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <WebsocketProvider>
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
              <Route path="/wort" element={<WortVolumePage />} />
              <Route path="/material" element={<MaterialManagementPage />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/work/orders" element={<WorkOrder />} />
              <Route path="/work/create" element={<WorkCreate />} />
              <Route path="/workplace" element={<WorkplacePage />} />
              <Route path="/material-grinding" element={<MaterialGrindingPage />} />
              <Route path="/mashing-process" element={<MashingProcessPage />} />
              <Route path="/process-stage" element={<ProcessStage />} />
              <Route path="/equipment-info" element={<EquipmentInfo />} />
              <Route path="/label-info" element={<LabelInfo />} />
              <Route path="/board" element={<Board/>} />
              <Route path="/board-create" element={<BoardCreate />} />
              <Route path="/board/:boardId" element={<BoardDetail/>}/>
            </Routes>
          </div>
        </div>
      </div>
      <Routes>
        {/* 로그인 페이지 - 레이아웃 없이 전체 화면 */}
        <Route path="/login" element={<Login />} />
        
        {/* 루트 경로 접근 시 로그인 페이지로 리다이렉트 */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* 이하 모든 페이지는 레이아웃 적용 */}
        <Route path="/home" element={
          <Layout>
            <Home />
          </Layout>
        } />
        
        <Route path="/plan-overview" element={
          <Layout>
            <ProductionPlan />
          </Layout>
        } />
        
        <Route path="/detail/:planId" element={
          <Layout>
            <ProductionPlanDetailPage />
          </Layout>
        } />

      </Routes>
    </Router>
    </WebsocketProvider>
  );
};

export default App;