import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import ProductionPlan from "./pages/ProductionPlan";
import Attendance from "./pages/Attendance";
import './App.css';  

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* 사이드바 */}
        <Sidebar />
        
        {/* 메인 컨텐츠 */}
        <div className="main-content">
          <Header />
          <div className="content-area">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/production" element={<ProductionPlan />} />
              <Route path="/attendance" element={<Attendance />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;