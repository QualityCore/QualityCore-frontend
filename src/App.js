import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProductionPlan from "./pages/ProductionPlan";
import Attendance from "./pages/Attendance";
import WorkplacePage from "./standardinformation/workplace/WorkplacePage";


import './App.css';  
import WorkOrder from "./pages/work/WorkOrder"

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
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/workorders" element={<WorkOrder />} />
              <Route path="/workplace" element={<WorkplacePage />} />
         

            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;