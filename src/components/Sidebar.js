import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiSettings4Line, RiDatabase2Line } from "react-icons/ri";
import { MdOutlineProductionQuantityLimits, MdOutlineWork } from "react-icons/md";

import { TbRoute } from "react-icons/tb";
import { AiOutlineSchedule } from "react-icons/ai";
import { HiOutlineUserGroup } from "react-icons/hi";
import { GiFactory } from "react-icons/gi";
import "../styles/Sidebar.css";

const Sidebar = () => {

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Castoro+Titling&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const [openCategory, setOpenCategory] = useState(null);

  const toggleCategory = (category) => {
    setOpenCategory(openCategory === category ? null : category);
  };




  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src="/images/lastLogo.png" alt="BräuHaus Logo" className="logo" />
        <h2 className="castoro-titling-regular">BräuHaus</h2>
      </div>
      <ul>
        {/* 시스템 관리 */}
        <li>
          <button onClick={() => toggleCategory("시스템관리")}>
            <RiSettings4Line className="mr-2" />
            시스템 관리
          </button>
          {openCategory === "시스템관리" && (
            <ul className="submenu">
              <li><Link to="/login">로그인/로그아웃</Link></li>
              <li><Link to="/permissions">권한 관리</Link></li>
              <li><Link to="/users">사용자 관리</Link></li>
              <li><Link to="/menu">메뉴 관리</Link></li>
            </ul>
          )}
        </li>

        {/* 기준정보 관리 */}
        <li>
          <button onClick={() => toggleCategory("기준정보관리")}>
            <RiDatabase2Line className="mr-2" />
            기준정보 관리
          </button>
          {openCategory === "기준정보관리" && (
            <ul className="submenu">
              <li><Link to="/workplace">작업장 등록</Link></li>
              <li><Link to="/process-stage">공정 정보 등록</Link></li>
              <li><Link to="/label-routing">공정 순서 관리</Link></li>
              <li><Link to="/equipment-info">설비 정보 등록</Link></li>
              <li><Link to="/label-info">LABEL 정보 등록</Link></li>
              <li><Link to="/downtime-cause">비가동 원인 코드 관리</Link></li>
            </ul>
          )}
        </li>

        {/* 생산계획 */}
        <li>
          <button onClick={() => toggleCategory("생산계획")}>
            <AiOutlineSchedule className="mr-2" />
            생산계획
          </button>
          {openCategory === "생산계획" && (
            <ul className="submenu">
              <li><Link to="/plan-overview">생산계획 조회</Link></li>
              <li><Link to="/plan-generate">생산계획 생성</Link></li>
              <li><Link to="/material">자재 관리</Link></li>
            </ul>
          )}
        </li>

        {/* 작업지시 */}
        <li>
          <button onClick={() => toggleCategory("작업지시")}>
            <MdOutlineWork className="mr-2" />
            작업지시
          </button>
          {openCategory === "작업지시" && (
            <ul className="submenu">
              <li><Link to="/work/orders">작업지시서 관리</Link></li>
              <li><Link to="/work/create">작업지시서 등록</Link></li>
            </ul>
          )}
        </li>

        {/* 생산공정 관리 */}
        <li>
          <button onClick={() => toggleCategory("생산공정")}>
            <GiFactory className="mr-2" />
            생산공정 관리
          </button>
          {openCategory === "생산공정" && (
            <ul className="submenu">
              <li><Link to="/material-grinding">분쇄공정</Link></li>
              <li><Link to="/mashing-process">당화공정</Link></li>
              <li><Link to="/filtration-process">여과공정</Link></li>
              <li><Link to="/boiling-process">끓임공정</Link></li>
              <li><Link to="/cooling-process">냉각공정</Link></li>
              <li><Link to="/fermentation_details ">발효상세공정</Link></li>
              <li><Link to="/maturation-details">숙성상세공정</Link></li>
              <li><Link to="/post-maturation-filtration">숙성 후 여과공정</Link></li>
              <li><Link to="/carbonation-process">탄산조정공정</Link></li>
              <li><Link to="/packaging_and-shipment">패키징 및 출하 공정</Link></li>
            </ul>
          )}
        </li>

        {/* Routing 관리 */}
        <li>
          <button onClick={() => toggleCategory("Routing")}>
            <TbRoute className="mr-2" />
            Routing 관리
          </button>
          {openCategory === "Routing" && (
            <ul className="submenu">
              <li><Link to="/wort">끓임 공정 워트 품질 모니터링</Link></li>
              <li><Link to="/processTracking">공정 진행 현황</Link></li>
            </ul>
          )}
        </li>

        {/* 생산실적 관리 */}
        <li>
          <button onClick={() => toggleCategory("생산실적")}>
            <MdOutlineProductionQuantityLimits className="mr-2" />
            생산실적 관리
          </button>
          {openCategory === "생산실적" && (
            <ul className="submenu">
              <li><Link to="/performance-summary">기간별 생산실적</Link></li>
              <li><Link to="/efficiency">작업효율 분석</Link></li>
              <li><Link to="/rework">재작업 관리</Link></li>
            </ul>
          )}
        </li>

        {/* 근태관리 */}
        <li>
          <Link to="/attendance">
            <HiOutlineUserGroup className="mr-4" />
            스케줄관리
          </Link>
        </li>
      </ul>


      <div className="sidebar-profile">
        <div className="profile-content">
          <div className="profile-image">
            <img src="/images/iublack.jpg" alt="Profile" />
          </div>
          <div className="profile-details">
            <div className="profile-name">아이유</div>
            <div className="profile-role">작업자</div>
            <div className="profile-actions">
              <button className="profile-btn">로그아웃</button>
              <button className="profile-btn">근태 관리</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};




export default Sidebar;