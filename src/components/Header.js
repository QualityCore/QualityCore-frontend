import { FaSearch, FaBell, FaMoon, FaQuestionCircle } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import "../styles/Header.css";

const Header = () => {
  const location = useLocation();

  const getPageTitle = (pathname) => {
    const pageCategories = {
      // 시스템 관리
      '/login': { main: '시스템 관리', sub: '로그인/로그아웃' },
      '/permissions': { main: '시스템 관리', sub: '권한 관리' },
      '/users': { main: '시스템 관리', sub: '사용자 관리' },
      '/menu': { main: '시스템 관리', sub: '메뉴 관리' },

      // 기준정보 관리
      '/workplace': { main: '기준정보 관리', sub: '작업장 등록' },
      '/process-stage': { main: '기준정보 관리', sub: '공정 정보 등록' },
      '/label-routing': { main: '기준정보 관리', sub: '공정 순서 관리' },
      '/equipment-info': { main: '기준정보 관리', sub: '설비 정보 등록' },
      '/label-info': { main: '기준정보 관리', sub: 'LABEL 정보 등록' },
      '/downtime-cause': { main: '기준정보 관리', sub: '비가동 원인 코드 관리' },


      // 생산계획
      '/plan-overview': { main: '생산계획', sub: '월별 생산계획' },
      '/plan-generate': { main: '생산계획', sub: '생산라인별 계획' },
      '/plan-material': { main: '생산계획', sub: '자재 구매신청' },

      // 작업지시
      '/work/orders': { main: '작업지시', sub: '작업지시서 관리' },
      '/work/create': { main: '작업지시', sub: '작업지시서 등록' },
      '/workpersonnel': { main: '작업지시', sub: '작업지시 대비 인원 관리' },
      '/workprogress': { main: '작업지시', sub: '공정별 작업지시 현황' },


      // 생산공정 관리
      '/raw-material-preparation': { main: '생산공정 관리', sub: '원재료 분쇄공정' },
      '/mashing-process': { main: '생산공정 관리', sub: '당화공정' },
      '/filtration-process': { main: '생산공정 관리', sub: '여과공정' },
      '/boiling-process': { main: '생산공정 관리', sub: '끓임공정' },
      '/cooling-process': { main: '생산공정 관리', sub: '냉각공정' },
      '/fermentation_details': { main: '생산공정 관리', sub: '발효상세공정' },
      '/maturation-details': { main: '생산공정 관리', sub: '숙성상세공정' },
      '/post-maturation-filtration': { main: '생산공정 관리', sub: '숙성 후 여과공정' },
      '/carbonation-process': { main: '생산공정 관리', sub: '탄산조정공정' },
      '/packaging_and-shipment': { main: '생산공정 관리', sub: '패키징 및 출하 공정' },


      // Routing 관리
      '/routing-input': { main: 'Routing 관리', sub: '공정별 생산투입' },
      '/routing-progress': { main: 'Routing 관리', sub: '공정 진행 현황' },

      // 생산실적 관리
      '/performance-summary': { main: '생산실적 관리', sub: '기간별 생산실적' },
      '/efficiency': { main: '생산실적 관리', sub: '작업효율 분석' },
      '/rework': { main: '생산실적 관리', sub: '재작업 관리' },

      // 근태관리
      '/attendance': { main: '근태관리', sub: '근태관리' },

      // 기본 페이지
      '/': { main: '', sub: '메인화면' }
    };

    return pageCategories[pathname] || { main: '', sub: '' };
  };

  const category = getPageTitle(location.pathname);

  return (
    <div className="header">
      {/* 동적 페이지 타이틀 */}
      <div className="page-title-container">
        <span className="main-category">{category.main}</span>
        <h1 className="sub-category">{category.sub}</h1>
      </div>

      {/* 우측 아이콘 */}
      <div className="search-and-icons">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search"
            className="search-input"
          />
        </div>
        <div className="icon-container">
          <FaBell className="icon" />
          <FaMoon className="icon" />
          <FaQuestionCircle className="icon" />
          <div className="profile-icon">
            <img src="/images/iuimage.jpg" alt="profile" className="profile" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;